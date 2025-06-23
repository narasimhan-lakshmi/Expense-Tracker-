import React, { useState } from 'react';
import { Trash2, Edit2, Check, X } from 'lucide-react';
import { useExpenses } from '../../hooks/useExpenses';
import { formatCurrency, formatDate } from '../../utils/helpers';
import { EXPENSE_CATEGORIES } from '../../utils/constants';

const ExpenseItem = ({ expense }) => {
  const [deleting, setDeleting] = useState(false);
  const [editing, setEditing] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [editData, setEditData] = useState({
    description: expense.description,
    amount: expense.amount.toString(),
    category: expense.category,
    date: new Date(expense.date).toISOString().split('T')[0]
  });
  const [errors, setErrors] = useState({});
  const { deleteExpense, updateExpense } = useExpenses();

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this expense?')) {
      setDeleting(true);
      const result = await deleteExpense(expense._id);
      if (!result.success) {
        alert('Failed to delete expense: ' + result.message);
      }
      setDeleting(false);
    }
  };

  const handleEdit = () => {
    setEditing(true);
    setEditData({
      description: expense.description,
      amount: expense.amount.toString(),
      category: expense.category,
      date: new Date(expense.date).toISOString().split('T')[0]
    });
    setErrors({});
  };

  const handleCancelEdit = () => {
    setEditing(false);
    setEditData({
      description: expense.description,
      amount: expense.amount.toString(),
      category: expense.category,
      date: new Date(expense.date).toISOString().split('T')[0]
    });
    setErrors({});
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditData(prev => ({
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

    if (!editData.description.trim()) {
      newErrors.description = 'Description is required';
    }

    if (!editData.amount || editData.amount <= 0) {
      newErrors.amount = 'Please enter a valid amount';
    }

    if (!editData.date) {
      newErrors.date = 'Date is required';
    }

    return newErrors;
  };

  const handleSave = async () => {
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setUpdating(true);
    const result = await updateExpense(expense._id, {
      ...editData,
      amount: parseFloat(editData.amount)
    });
    
    if (result.success) {
      setEditing(false);
      setErrors({});
    } else {
      setErrors({ submit: result.message });
    }
    setUpdating(false);
  };

  if (editing) {
    return (
      <div className="expense-item editing">
        <div className="edit-form">
          <div className="edit-row">
            <div className="edit-field">
              <input
                type="text"
                name="description"
                value={editData.description}
                onChange={handleChange}
                className={`input-small ${errors.description ? 'error' : ''}`}
                placeholder="Description"
              />
              {errors.description && <div className="error-message-small">{errors.description}</div>}
            </div>
            
            <div className="edit-field">
              <select
                name="category"
                value={editData.category}
                onChange={handleChange}
                className="select-small"
              >
                {EXPENSE_CATEGORIES.map(category => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="edit-field">
              <input
                type="number"
                name="amount"
                value={editData.amount}
                onChange={handleChange}
                className={`input-small ${errors.amount ? 'error' : ''}`}
                placeholder="Amount"
                step="0.01"
                min="0"
              />
              {errors.amount && <div className="error-message-small">{errors.amount}</div>}
            </div>
            
            <div className="edit-field">
              <input
                type="date"
                name="date"
                value={editData.date}
                onChange={handleChange}
                className={`input-small ${errors.date ? 'error' : ''}`}
              />
              {errors.date && <div className="error-message-small">{errors.date}</div>}
            </div>
            
            <div className="edit-actions">
              <button 
                onClick={handleSave}
                className="btn-icon btn-success"
                disabled={updating}
                title="Save changes"
              >
                {updating ? (
                  <div className="spinner-small"></div>
                ) : (
                  <Check size={14} />
                )}
              </button>
              <button 
                onClick={handleCancelEdit}
                className="btn-icon btn-secondary"
                disabled={updating}
                title="Cancel editing"
              >
                <X size={14} />
              </button>
            </div>
          </div>
          
          {errors.submit && (
            <div className="error-message" style={{ textAlign: 'center', marginTop: '10px' }}>
              {errors.submit}
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="expense-item">
      <div className="expense-desc">{expense.description}</div>
      <div className="expense-category">{expense.category}</div>
      <div className="expense-amount">{formatCurrency(expense.amount)}</div>
      <div className="expense-date">{formatDate(expense.date)}</div>
      <div className="expense-actions">
        <button 
          onClick={handleEdit}
          className="btn-icon btn-edit"
          title="Edit expense"
        >
          <Edit2 size={14} />
        </button>
        <button 
          onClick={handleDelete}
          className="btn-icon btn-danger"
          disabled={deleting}
          title="Delete expense"
        >
          {deleting ? (
            <div className="spinner-small"></div>
          ) : (
            <Trash2 size={14} />
          )}
        </button>
      </div>
    </div>
  );
};

export default ExpenseItem;