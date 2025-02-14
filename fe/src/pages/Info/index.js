import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import './index.css'; // 引入CSS文件
import axios from 'axios';
import { useNavigate } from 'react-router-dom';


function Info() {
    const [remainingBalance, setRemainingBalance] = useState(0);
    const [star, setStar] = useState(0);
    const [expenseAmount, setExpenseAmount] = useState('');
    const [expenseDescription, setExpenseDescription] = useState('');
    const [expenses, setExpenses] = useState([]);
    const [userId, setUserId] = useState();
    const [username, setUsername] = useState();
    const navigate = useNavigate();
    const [showParents, setShowParents] = useState(1);
    const [childList, setChildList] = useState([]);
    const [child, setChild] = useState(0);

    const fetchUserInfo = async () => {
        try {
            const response = await axios.post('/api/user/info');
            if (response.status === 200) {
                const userData = response.data.user;
                setUserId(userData.user_id);
                setUsername(userData.username);
                console.log(userData);
                if (userData.child === 0) {
                    console.log(1);
                    navigate('/parent');
                }
            } else {
                clearAuthToken();
            }
        } catch (error) {
            console.error('获取用户信息失败:', error);
            clearAuthToken();
        }
    };


    const fetchBalance = async () => {
        try {
            const response = await axios.post('/api/user/balance');
            setRemainingBalance(response.data.total_balance);
            setStar(response.data.star);
        } catch (error) {
            alert('获取余额失败!');
        }
    };

    const fetchTransactions = async () => {
        try {
            const response = await axios.post('/api/transactions', { user_id: userId });
            const formattedTransactions = response.data.data.map(transaction => ({
                ...transaction,
                date: new Date(transaction.transaction_date).toLocaleString('zh-CN', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit',
                }),
                amount: transaction.payment_type === 'money' ? `¥${transaction.amount}` : `⭐️${transaction.amount}`,
            }));
            setExpenses(formattedTransactions.reverse());
        } catch (error) {
            alert('获取交易记录失败!');
        }
    };

    const clearAuthToken = () => {
        document.cookie = 'authToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    };

    useEffect(() => {
        fetchUserInfo();
        fetchBalance();
        fetchTransactions();
    }, []);

    const handleAddExpense = async (type) => {
        if (!expenseAmount || !expenseDescription) {
            alert('请填写金额和描述');
            return;
        }
        try {
            await axios.post('/api/transactions/decrease', {
                amount: expenseAmount,
                description: expenseDescription,
                payment_type: type,
            });
            window.location.reload();
        } catch (error) {
            alert('添加支出失败!');
        }
    };

    const handleAddIncome = async (type) => {
        if (!expenseAmount || !expenseDescription) {
            alert('请填写金额和描述');
            return;
        }
        try {
            await axios.post('/api/transactions/increase', {
                amount: expenseAmount,
                description: expenseDescription,
                payment_type: type,
            });
            window.location.reload();
        } catch (error) {
            alert('添加收入失败!');
        }
    };

    return (
        <div className="container">
            <div className="header">
                <h1>{username}的存钱罐</h1>
                <div className="balance">
                    <h2>金额: ¥{remainingBalance} 星星：{star}颗</h2>
                </div>
            </div>

            <div className="expense-form">
                <input
                    type="number"
                    className="amount"
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
                <button className="button" onClick={() => handleAddExpense('money')}>
                    扣钱
                </button>
                <button className="button" onClick={() => handleAddExpense('star')}>
                    扣星星
                </button>
            </div>

            {showParents === 0 && (
                <div className="expense-form">
                    <input
                        type="number"
                        className="amount"
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
                    <button className="button" onClick={() => handleAddIncome('money')}>
                        加钱
                    </button>
                    <button className="button" onClick={() => handleAddIncome('star')}>
                        加星星
                    </button>
                </div>
            )}

            <div className="expense-list">
                {expenses.length > 0 ? (
                    expenses.map((expense, index) => (
                        <div className="expense-item" key={index} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span>
                                {expense.date} {expense.description}
                            </span>
                            <span>{expense.amount}</span>
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
