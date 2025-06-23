import React from 'react';
import Header from '../Layout/Header';
import StatsCards from './StatsCards';
import ExpenseForm from './ExpenseForm';
import ExpenseList from './ExpenseList';

const Dashboard = () => {
  return (
    <div className="dashboard">
      <div className="dashboard-container">
        <Header />
        <StatsCards />
        <ExpenseForm />
        <ExpenseList />
      </div>
    </div>
  );
};

export default Dashboard;