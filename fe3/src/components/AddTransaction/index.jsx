import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTransactions } from '../../context/TransactionContext';
import { useKids } from "../../context/KidsContext";
import './index.css';

const AddTransaction = () => {
  const navigate = useNavigate();
  const {state: kidsState} = useKids(); // 将 state 重命名为 kidsState
  const { dispatch } = useTransactions();
  const [formData, setFormData] = useState({
    title: '',
    amount: '',
    type: 'expense',
    date: new Date().toISOString().split('T')[0]
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.type === 'expense') {
      dispatch({
        type: 'ADD_EXPENSE',
        payload: {
          ...formData,
          kid: kidsState.currentKid,
        }
      });
    } else if (formData.type === 'income') {
      dispatch({
        type: 'ADD_INCOME',
        payload: {
          ...formData,
          kid: kidsState.currentKid,
        }
      });
    }

    // navigate('/');
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="add-transaction">
      <h2>记一笔</h2>
      <form onSubmit={handleSubmit} className="transaction-form">
        <div className="form-group">
          {/*<label>类型</label>*/}
          <div className="type-selector">
            <button
              type="button"
              className={`type-btn ${formData.type === 'expense' ? 'active' : ''}`}
              onClick={() => setFormData(prev => ({ ...prev, type: 'expense' }))}
            >
              支出
            </button>
            <button
              type="button"
              className={`type-btn ${formData.type === 'income' ? 'active' : ''}`}
              onClick={() => setFormData(prev => ({ ...prev, type: 'income' }))}
            >
              收入
            </button>
          </div>
        </div>

        <div className="form-group">
          <label>标题</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            placeholder="例如：买文具"
          />
        </div>

        <div className="form-group">
          <label>金额</label>
          <input
            type="number"
            name="amount"
            value={formData.amount}
            onChange={handleChange}
            required
            step="0.01"
            min="0"
            placeholder="请输入金额"
          />
        </div>

        {/*<div className="form-group">*/}
        {/*  <label>日期</label>*/}
        {/*  <input*/}
        {/*    type="date"*/}
        {/*    name="date"*/}
        {/*    value={formData.date}*/}
        {/*    onChange={handleChange}*/}
        {/*    required*/}
        {/*  />*/}
        {/*</div>*/}

        <button type="submit" className="submit-btn">
          保存
        </button>
      </form>
    </div>
  );
};

export default AddTransaction;
