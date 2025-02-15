import React, { useState, useEffect } from 'react';
import './index.css';
import axios from 'axios';

const Parent = () => {
    const [children, setChildren] = useState([]);

    const [selectedChild, setSelectedChild] = useState();
    const [amount, setAmount] = useState('');
    const [reason, setReason] = useState('');
    const [expenses, setExpenses] = useState([]);
    const [expenseAmount, setExpenseAmount] = useState('');
    const [expenseDescription, setExpenseDescription] = useState('');
    const [expenseAmount2, setExpenseAmount2] = useState('');
    const [expenseDescription2, setExpenseDescription2] = useState('');
    const [remainingBalance, setRemainingBalance] = useState(0);
    const [star, setStar] = useState(0);


    const fetchBalance = async () => {
        try {
            const response = await axios.post('/api/user/balance', {child_id: selectedChild?.user_id});
            setRemainingBalance(response.data.total_balance);
            setStar(response.data.star);
        } catch (error) {
            console.log('获取余额失败!');
        }
    };

    const handleAddIncome = async (type, reason) => {
        if (!expenseAmount || !expenseDescription) {
            alert('请填写金额和描述');
            return;
        }
        try {
            await axios.post('/api/transactions/increase', {
                amount: expenseAmount,
                description: reason ?? expenseDescription,
                payment_type: type,
                child_id: selectedChild?.user_id,
            });
            window.location.reload();
        } catch (error) {
            console.log('添加收入失败!');
        }
    };

    const handleAddExpense = async (type) => {
        if (!expenseAmount2 || !expenseDescription2) {
            alert('请填写金额和描述');
            return;
        }
        try {
            await axios.post('/api/transactions/decrease', {
                amount: expenseAmount2,
                description: expenseDescription2,
                payment_type: type,
                child_id: selectedChild?.user_id,
            });
            window.location.reload();
        } catch (error) {
            alert('添加支出失败!');
        }
    };

    const handleAddIncomeDetails = async (type, reason, expenseAmount) => {
        try {
            await axios.post('/api/transactions/increase', {
                amount: expenseAmount,
                description: reason,
                payment_type: type,
                child_id: selectedChild?.user_id,
            });
            window.location.reload();
        } catch (error) {
            console.log('添加收入失败!');
        }
    };

    const fetchTransactions = async (child_id) => {
        try {
            const response = await axios.post('/api/transactions', { child_id: child_id });
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
            console.log('获取交易记录失败!');
        }
    };

    useEffect( () => {
        // 从服务器获取孩子信息
        async function fetchData()  {
            try {
                const response = await axios.post('/api/user/getChildren');
                setChildren(response.data);
                setSelectedChild(response.data[0]);
            } catch (e) {
                console.error(e);
            }
        }
        fetchData();

    }, []);

    useEffect(() => {
        fetchTransactions(selectedChild?.user_id);
        fetchBalance();
    }, [selectedChild])

    const handleAddAllowance = () => {
        if (amount && reason) {
            const newAllowance = {
                amount: parseFloat(amount),
                reason,
                date: new Date().toLocaleString(),
            };
            setSelectedChild(prev => {
                const updatedChild = { ...prev, allowance: [...prev.allowance, newAllowance] };
                setChildren(prevChildren => prevChildren.map(child => child.id === updatedChild.id ? updatedChild : child));
                return updatedChild;
            });
            setAmount('');
            setReason('');
        } else {
            alert('请填写零花钱数量和理由');
        }
    };

    return (
        <div className="container">
            <h1>{selectedChild?.username}零花钱管理后台</h1>
            <div className="select-child">
                <label>选择孩子: </label>
                <select
                    value={selectedChild?.user_id}
                    onChange={(e) => setSelectedChild(children?.find(child => child.user_id === parseInt(e.target.value)))}
                >
                    {children?.map(child => (
                        <option key={child.user_id} value={child.user_id}>{child.username}</option>
                    ))}
                </select>
            </div>
            <div className="balance">
                <h2>金额: ¥{remainingBalance} 星星：{star}颗</h2>
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
                <button className="button" onClick={() => handleAddIncome('money')}>
                    加钱
                </button>
                <button className="button" onClick={() => handleAddIncome('star')}>
                    加星星
                </button>
            </div>
            <div>
                <input
                    type="number"
                    className="amount"
                    placeholder="金额"
                    value={expenseAmount2}
                    onChange={(e) => setExpenseAmount2(e.target.value)}
                />
                <input
                    type="text"
                    className="input"
                    placeholder="描述"
                    value={expenseDescription2}
                    onChange={(e) => setExpenseDescription2(e.target.value)}
                />
                <button className="button" onClick={() => handleAddExpense('money')}>
                    扣钱
                </button>
                <button className="button" onClick={() => handleAddExpense('star')}>
                    扣星星
                </button>
            </div>
                <button className="button" onClick={() => handleAddIncomeDetails('star', '读英语', 1)}>
                 读英语
                </button>
            <div>

            </div>

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
};

export default Parent;
