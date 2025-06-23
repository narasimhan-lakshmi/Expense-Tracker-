import React, { useState } from 'react';
import { Search, Filter } from 'lucide-react';
import { useExpenses } from '../../hooks/useExpenses';
import ExpenseItem from './ExpenseItem';
import { EXPENSE_CATEGORIES } from '../../utils/constants';

const ExpenseList = () => {
  const { expenses, loading } = useExpenses();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('All');

  const filteredExpenses = expenses.filter(expense => {
    const matchesSearch = expense.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'All' || expense.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  if (loading) {
    return (
      <div className="expenses-container">
        <div className="loading-screen" style={{ minHeight: '200px' }}>
          <div className="spinner"></div>
          <p>Loading expenses...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="expenses-container">
      <div className="expenses-header">
        <h2>Recent Expenses</h2>
        
        {expenses.length > 0 && (
          <div className="expenses-filters">
            <div className="search-box">
              <Search size={18} />
              <input
                type="text"
                placeholder="Search expenses..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
            </div>
            
            <div className="filter-box">
              <Filter size={18} />
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="filter-select"
              >
                <option value="All">All Categories</option>
                {EXPENSE_CATEGORIES.map(category => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}
      </div>
      
      {expenses.length === 0 ? (
        <div className="empty-state">
          <h3>No expenses yet</h3>
          <p>Start by adding your first expense above!</p>
        </div>
      ) : filteredExpenses.length === 0 ? (
        <div className="empty-state">
          <h3>No expenses found</h3>
          <p>Try adjusting your search or filter criteria.</p>
        </div>
      ) : (
        <div>
          {filteredExpenses.map(expense => (
            <ExpenseItem 
              key={expense._id} 
              expense={expense}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ExpenseList;