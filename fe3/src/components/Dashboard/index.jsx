import React from 'react';
import { useTransactions } from '../../context/TransactionContext';
import PiggyBank from './PiggyBank';
import './index.css';

const Dashboard = () => {
  const { state } = useTransactions();

  console.log(state);
  const income = state.transactions
    .filter(t => t.transaction_type === 'income')
    .reduce((acc, curr) => acc + parseFloat(curr.amount), 0);

  const expense = state.transactions
    .filter(t => t.transaction_type === 'expense')
    .reduce((acc, curr) => acc + parseFloat(curr.amount), 0);

  return (
    <div className="dashboard">
      <PiggyBank balance={state.balance} />
      <div className="summary-cards">
        <div className="summary-card income">
          <h3>本月收入</h3>
          <div className="amount">￥{income?.toFixed(2)}</div>
        </div>
        <div className="summary-card expense">
          <h3>本月支出</h3>
          <div className="amount">￥{expense?.toFixed(2)}</div>
        </div>
      </div>

      <div className="recent-transactions">
        <h3>最近5条记录</h3>
        {state.transactions.slice(0, 5).map(transaction => (
          <div key={transaction.id} className={`transaction-item ${transaction.transaction_type}`}>
            <div className="transaction-info">
              <div className="transaction-title">{transaction.description}</div>
              <div className="transaction-date">
                {new Date(transaction.transaction_date).toLocaleDateString()}
              </div>
            </div>
            <div className="transaction-amount">
              {transaction.transaction_type === 'expense' ? '-' : '+'}￥{transaction.amount}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
