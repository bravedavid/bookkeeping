import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import './index.css'; // 引入CSS文件
import axios from 'axios';  // 如果选择使用 axios
import { useNavigate } from 'react-router-dom';


function Info() {
    const [remainingBalance, setRemainingBalance] = useState(0);
    const [star, setStar] = useState(0);
    const [expenseAmount, setExpenseAmount] = useState('');
    const [expenseDescription, setExpenseDescription] = useState('');
    const [expenses, setExpenses] = useState([]);
    const location = useLocation();
    const [user_id, setUserId] = useState();
    const [username, setUsername] = useState();
    const navigate = useNavigate(); // 用来进行页面跳转
    const [income, setIncome] = useState('');
    const [incomeDescription, setIncomeDescription] = useState('');
    const [showParents, setShowParents] = useState(1);
    const [childlist, setchildlist] = useState([]);
    const [child, setchild] = useState(0);

    const getBalance = async () => {
        try {
            const requestData = {
                user_id,
            };
            const response = await axios.post('/api/balance', requestData);
            setRemainingBalance(response?.data?.total_balance);
            setStar(response?.data?.star);
        } catch (e) {
            alert('get balance fail!');
            navigate('');
        }
    }

    const getInfo = async () => {
        try {
            // 调用后端接口验证token并获取用户信息
            const response = await axios.post('/api/getUserinfo');
            console.log("post");
            if (response.status === 200) {
                const userData = response.data.user; // 根据实际响应结构调整
                setUserId(userData.user_id);
                setUsername(userData.username);
                setShowParents(userData.child);
                if (userData.child === 0) {
                    const response = await axios.post('/api/getChildrens');
                    if (response.status === 200) {
                        console.log(response);
                        setchildlist(response.data.children);
                        // TODO 只处理一个小孩子的情况
                        if (response.data.children.length === 1) {
                            setchild(response.data.children[0]);
                        }
                    }

                }
            } else {
                // token无效时清除cookie
                document.cookie = 'authToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
            }
        } catch (error) {
            console.error('自动登录失败:', error);
            document.cookie = 'authToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
        }
    }

    const getTransactions = async () => {
        const requestData = {
            user_id,
        };
        try {
            const response = await axios.post('/api/getTransactions', requestData);
            // 定义一个函数来格式化日期
            const formatDate = (isoDate) => {
                const date = new Date(isoDate);
                const options = {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit',
                };
                return date.toLocaleString('zh-CN', options);
            };
            const formattedTransactions = response?.data?.data?.map(transaction => {
                let amount = '';
                if (transaction.payment_type === 'money') {
                    amount = "¥" + transaction.amount;
                } else if (transaction.payment_type === 'star') {
                    amount = "⭐️" + transaction.amount;
                } else {
                    amount = "¥" + transaction.amount;
                }
                return {
                    ...transaction, // 保留原有属性
                    date: formatDate(transaction.transaction_date),// 添加新的 data 属性
                    amount: amount,
                };
            });
            setExpenses(formattedTransactions?.reverse());
        } catch (e) {
            alert(e);
        }
    }

    useEffect( () => {
        getInfo();
        getBalance();
        getTransactions();
    }, []);
    const handleAddExpense = async (type) => {
        if (!expenseAmount || !expenseDescription) {
            alert('请填写金额和描述');
            return;
        }
        const requestData = {
            amount:expenseAmount,
            description: expenseDescription,
            payment_type: type,
        };
        await axios.post('/api/accounts/decrease', requestData);
        // 刷新当前页面
        window.location.reload();
    };

    const handleAddIncome = async (type) => {
        if (!expenseAmount || !expenseDescription) {
            alert('请填写金额和描述');
            return;
        }
        const requestData = {
            amount:expenseAmount,
            description: expenseDescription,
            payment_type: type,
        };
        await axios.post('//api/accounts/increase', requestData);
        // 刷新当前页面
        window.location.reload();
    };

    return (
        <div className="container">
            <div className="header">
                { showParents === 0 ? (
                    <h1>父母版</h1>
                    ) : (
                        <>
                        <h1>{username}的存钱罐</h1>
                        <div className="balance">
                            <h2>剩余金额: ¥{remainingBalance} 剩余星星：{star}颗</h2>
                        </div>
                        </>
                    )
                }
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
                <button className="button" onClick={() =>handleAddExpense('money')}>
                    扣钱
                </button>
                <button className="button" onClick={()=>handleAddExpense('star')}>
                    扣星星
                </button>
            </div>
            {showParents === 0 ? (
                <div className="expense-form">
                    <input
                        type="number"
                        className="amount"
                        placeholder="金额"
                        value={income}
                        onChange={(e) => setExpenseAmount(e.target.value)}
                    />
                    <input
                        type="text"
                        className="input"
                        placeholder="描述"
                        value={incomeDescription}
                        onChange={(e) => setExpenseDescription(e.target.value)}
                    />
                    <button className="button" onClick={() =>handleAddExpense('money')}>
                        加钱
                    </button>
                    <button className="button" onClick={()=>handleAddExpense('star')}>
                        加星星
                    </button>
                </div>
            ) : null }



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
