import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import './index.css'; // 引入CSS文件
import axios from 'axios';  // 如果选择使用 axios


function Info() {
    const [remainingBalance, setRemainingBalance] = useState(1000);
    const [expenseAmount, setExpenseAmount] = useState('');
    const [expenseDescription, setExpenseDescription] = useState('');
    const [expenses, setExpenses] = useState([]);
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const user_id = queryParams.get('user_id');
    const username = queryParams.get('username');

    const getBalance = async () => {
        try {
            const requestData = {
                user_id,
            };
            const response = await axios.post('http://121.40.193.202:3000/api/balance', requestData);
            console.log(response);
        } catch (e) {
            alert('get balance fail!');
        }
    }

    useEffect( () => {
        getBalance();
    }, []);
    const handleAddExpense = () => {
        if (!expenseAmount || !expenseDescription) {
            alert('请填写金额和描述');
            return;
        }
        const newExpense = {
            amount: parseFloat(expenseAmount),
            description: expenseDescription,
        };
        setExpenses([...expenses, newExpense]);
        setRemainingBalance(remainingBalance - newExpense.amount);
        setExpenseAmount('');
        setExpenseDescription('');
    };

    const handleDeleteExpense = (index) => {
        const expenseToDelete = expenses[index];
        setExpenses(expenses.filter((_, i) => i !== index));
        setRemainingBalance(remainingBalance + expenseToDelete.amount);
    };

    return (
        <div className="container">
            <div className="header">
                <h1>{username}记账本</h1>
                <div className="balance">
                    <h2>剩余金额: ¥{remainingBalance.toFixed(2)}</h2>
                </div>
            </div>

            <div className="expense-form">
                <input
                    type="number"
                    className="input"
                    placeholder="金额"
                    value={expenseAmount}
                    onChange={(e) => setExpenseAmount(e.target.value)}
                />
                <input
                    type="text"
                    className="input"
                    placeholder="描述"
                    value={expenseDescription}
                    onChange={(e) => setExpenseDescription(e.target.value)}
                />
                <button className="button" onClick={handleAddExpense}>
                    添加开支
                </button>
            </div>

            <div className="expense-list">
                {expenses.length > 0 ? (
                    expenses.map((expense, index) => (
                        <div className="expense-item" key={index}>
                            <span>{expense.description}: ¥{expense.amount.toFixed(2)}</span>
                            <button
                                className="delete-button"
                                onClick={() => handleDeleteExpense(index)}
                            >
                                删除
                            </button>
                        </div>
                    ))
                ) : (
                    <p>没有开支记录</p>
                )}
            </div>
        </div>
    );
}

export default Info;
