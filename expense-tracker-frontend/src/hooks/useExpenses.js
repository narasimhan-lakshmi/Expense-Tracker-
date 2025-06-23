import { useContext, useCallback } from 'react';
import { ExpenseContext } from '../context/ExpenseContext';
import * as expenseService from '../services/expenseService';

export const useExpenses = () => {
  const context = useContext(ExpenseContext);
  
  if (!context) {
    throw new Error('useExpenses must be used within an ExpenseProvider');
  }

  const { expenses, setExpenses, loading, setLoading } = context;

  const fetchExpenses = useCallback(async () => {
    setLoading(true);
    try {
      const response = await expenseService.getExpenses();
      setExpenses(response.data);
      return { success: true };
    } catch (error) {
      console.error('Error fetching expenses:', error);
      return { success: false, message: error.message };
    } finally {
      setLoading(false);
    }
  }, [setExpenses, setLoading]);

  const addExpense = async (expenseData) => {
    try {
      const response = await expenseService.createExpense(expenseData);
      setExpenses(prev => [response.data, ...prev]);
      return { success: true };
    } catch (error) {
      console.error('Error adding expense:', error);
      return { success: false, message: error.message };
    }
  };

  const updateExpense = async (id, expenseData) => {
    try {
      const response = await expenseService.updateExpense(id, expenseData);
      setExpenses(prev => 
        prev.map(expense => 
          expense._id === id ? response.data : expense
        )
      );
      return { success: true };
    } catch (error) {
      console.error('Error updating expense:', error);
      return { success: false, message: error.message };
    }
  };

  const deleteExpense = async (id) => {
    try {
      await expenseService.deleteExpense(id);
      setExpenses(prev => prev.filter(expense => expense._id !== id));
      return { success: true };
    } catch (error) {
      console.error('Error deleting expense:', error);
      return { success: false, message: error.message };
    }
  };

  const getStats = () => {
    const total = expenses.reduce((sum, expense) => sum + expense.amount, 0);
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    
    const monthly = expenses
      .filter(expense => {
        const expenseDate = new Date(expense.date);
        return expenseDate.getMonth() === currentMonth && 
               expenseDate.getFullYear() === currentYear;
      })
      .reduce((sum, expense) => sum + expense.amount, 0);

    return {
      total,
      monthly,
      count: expenses.length
    };
  };

  return {
    expenses,
    loading,
    fetchExpenses,
    addExpense,
    updateExpense,
    deleteExpense,
    getStats
  };
};