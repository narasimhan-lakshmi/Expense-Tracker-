import React, { createContext, useState, useEffect } from 'react';
import { expenseAPI } from '../services/api';
import { useAuth } from '../hooks/useAuth';

const ExpenseContext = createContext();

export const ExpenseProvider = ({ children }) => {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      loadExpenses();
    }
  }, [user]);

  const loadExpenses = async () => {
    setLoading(true);
    try {
      const data = await expenseAPI.getExpenses();
      setExpenses(data);
    } catch (error) {
      console.error('Failed to load expenses:', error);
    } finally {
      setLoading(false);
    }
  };

  const addExpense = async (expenseData) => {
    try {
      const newExpense = await expenseAPI.addExpense(expenseData);
      setExpenses(prev => [newExpense, ...prev]);
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Failed to add expense' 
      };
    }
  };

  const deleteExpense = async (expenseId) => {
    try {
      await expenseAPI.deleteExpense(expenseId);
      setExpenses(prev => prev.filter(expense => expense._id !== expenseId));
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Failed to delete expense' 
      };
    }
  };

  const updateExpense = async (expenseId, expenseData) => {
    try {
      const updatedExpense = await expenseAPI.updateExpense(expenseId, expenseData);
      setExpenses(prev => 
        prev.map(expense => 
          expense._id === expenseId ? updatedExpense : expense
        )
      );
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Failed to update expense' 
      };
    }
  };

  const getStats = () => {
    const total = expenses.reduce((sum, expense) => sum + expense.amount, 0);
    
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    
    const monthlyTotal = expenses
      .filter(expense => {
        const expenseDate = new Date(expense.date);
        return expenseDate.getMonth() === currentMonth && 
               expenseDate.getFullYear() === currentYear;
      })
      .reduce((sum, expense) => sum + expense.amount, 0);

    return {
      total,
      monthly: monthlyTotal,
      count: expenses.length
    };
  };

  const value = {
    expenses,
    loading,
    addExpense,
    deleteExpense,
    updateExpense,
    loadExpenses,
    getStats
  };

  return (
    <ExpenseContext.Provider value={value}>
      {children}
    </ExpenseContext.Provider>
  );
};

export { ExpenseContext };