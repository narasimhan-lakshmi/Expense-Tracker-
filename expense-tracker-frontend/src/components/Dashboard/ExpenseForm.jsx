import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { useExpenses } from '../../hooks/useExpenses';
import { EXPENSE_CATEGORIES } from '../../utils/constants';

const ExpenseForm = () => {
  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    category: 'Food',
    date: new Date().toISOString().split('T')[0]
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const { addExpense } = useExpenses();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }

    if (!formData.amount || formData.amount <= 0) {
      newErrors.amount = 'Please enter a valid amount';
    }

    if (!formData.date) {
      newErrors.date = 'Date is required';
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    const result = await addExpense({
      ...formData,
      amount: parseFloat(formData.amount)
    });
    
    if (result.success) {
      setFormData({
        description: '',
        amount: '',
        category: 'Food',
        date: new Date().toISOString().split('T')[0]
      });
      setErrors({});
    } else {
      setErrors({ submit: result.message });
    }
    setLoading(false);
  };

  return (
    <div className="expense-form-container">
      <h2>Add New Expense</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="description">Description</label>
            <input
              type="text"
              name="description"
              id="description"
              value={formData.description}
              onChange={handleChange}
              className={`input ${errors.description ? 'error' : ''}`}
              placeholder="What did you spend on?"
            />
            {errors.description && <div className="error-message">{errors.description}</div>}
          </div>

          <div className="form-group">
            <label htmlFor="amount">Amount (₹)</label>
            <input
              type="number"
              name="amount"
              id="amount"
              value={formData.amount}
              onChange={handleChange}
              className={`input ${errors.amount ? 'error' : ''}`}
              placeholder="0.00"
              step="0.01"
              min="0"
            />
            {errors.amount && <div className="error-message">{errors.amount}</div>}
          </div>

          <div className="form-group">
            <label htmlFor="category">Category</label>
            <select
              name="category"
              id="category"
              value={formData.category}
              onChange={handleChange}
              className="select"
            >
              {EXPENSE_CATEGORIES.map(category => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="date">Date</label>
            <input
              type="date"
              name="date"
              id="date"
              value={formData.date}
              onChange={handleChange}
              className={`input ${errors.date ? 'error' : ''}`}
            />
            {errors.date && <div className="error-message">{errors.date}</div>}
          </div>

          <div></div>

          <div className="form-group">
            <label>&nbsp;</label>
            <button 
              type="submit" 
              className="btn btn-primary"
              disabled={loading}
              style={{ marginTop: '0' }}
            >
              {loading ? (
                <>
                  <div className="spinner" style={{ width: '16px', height: '16px' }}></div>
                  Adding...
                </>
              ) : (
                <>
                  <Plus size={18} />
                  Add Expense
                </>
              )}
            </button>
          </div>
        </div>

        {errors.submit && (
          <div className="error-message" style={{ marginTop: '10px', textAlign: 'center' }}>
            {errors.submit}
          </div>
        )}
      </form>
    </div>
  );
};

export default ExpenseForm;