import React from 'react';
import { useTransactions } from '../../context/TransactionContext';
import './index.css';

const History = () => {
  const { state } = useTransactions();

  const groupedTransactions = state.transactions.reduce((groups, transaction) => {
    const date = new Date(transaction.transaction_date).toLocaleDateString();
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(transaction);
    return groups;
  }, {});

  return (
    <div className="history">
      <h2>账目历史</h2>
      {Object.entries(groupedTransactions)
        .sort((a, b) => new Date(b[0]) - new Date(a[0]))
        .map(([date, transactions]) => (
          <div key={date} className="date-group">
            <div className="date-header">{date}</div>
            {transactions.map(transaction => (
              <div key={transaction.transaction_id} className={`history-item ${transaction.transaction_type}`}>
                <div className="transaction-info">
                  <div className="transaction-title">{transaction.description}</div>
                  <div className="transaction-amount">
                    {transaction.transaction_type === 'expense' ? '-' : '+'}
                    ￥{transaction.amount}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ))}
    </div>
  );
};

export default History;
