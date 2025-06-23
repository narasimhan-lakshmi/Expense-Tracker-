import React from 'react';
import { DollarSign, Calendar, Receipt } from 'lucide-react';
import { useExpenses } from '../../hooks/useExpenses';
import { formatCurrency } from '../../utils/helpers';

const StatsCards = () => {
  const { getStats } = useExpenses();
  const stats = getStats();

  const cards = [
    {
      title: 'Total Expenses',
      value: formatCurrency(stats.total),
      icon: DollarSign,
      gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    },
    {
      title: 'This Month',
      value: formatCurrency(stats.monthly),
      icon: Calendar,
      gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'
    },
    {
      title: 'Total Records',
      value: stats.count,
      icon: Receipt,
      gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)'
    }
  ];

  return (
    <div className="stats-grid">
      {cards.map((card, index) => {
        const Icon = card.icon;
        return (
          <div 
            key={index} 
            className="stat-card"
            style={{ background: card.gradient }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '15px' }}>
              <Icon size={24} />
            </div>
            <h3>{card.title}</h3>
            <div className="value">{card.value}</div>
          </div>
        );
      })}
    </div>
  );
};

export default StatsCards;