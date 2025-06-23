import React from 'react';
import { LogOut, User } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

const Header = () => {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="header">
      <h1>Expense Tracker</h1>
      <div className="user-info">
        <User size={20} />
        <span className="user-name">Welcome, {user?.name}</span>
        <button 
          onClick={handleLogout}
          className="btn btn-secondary"
          style={{ width: 'auto', margin: 0, padding: '8px 16px' }}
        >
          <LogOut size={16} />
          Logout
        </button>
      </div>
    </div>
  );
};

export default Header;