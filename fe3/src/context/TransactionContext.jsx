import React, {createContext, useContext, useReducer, useEffect} from 'react';
import {useKids} from "./KidsContext";
import {v4 as uuidv4} from 'uuid';
import axios from 'axios';
import Toastify from 'toastify-js';
import "toastify-js/src/toastify.css"; // 引入 CSS

const TransactionContext = createContext();

const initialState = {
    transactions: [],
    balance: 0
};

const toastifyInfo = (info) => {
// 显示提示
    Toastify({
        text: info,
        duration: 3000, // 持续时间 (毫秒)
        gravity: "top", // 位置 (top, bottom, center)
        position: 'center', // 位置 (left, center, right)
        close: true, // 是否显示关闭按钮
        backgroundColor: "linear-gradient(to right, #00b09b, #96c93d)", // 背景颜色
        stopOnFocus: true, // 鼠标悬停时停止计时
    }).showToast();
};

const transactionReducer = (state, action) => {
    switch (action.type) {
        case 'ADD_TRANSACTION':
            const newTransactions = [...state.transactions, {...action.payload, id: uuidv4()}];
            console.log('newTransactions', newTransactions);
            const currentKid = JSON.parse(localStorage.getItem('currentKid'));
            const kids = JSON.parse(localStorage.getItem('kids')) || [];
            const updatedKids = kids.map(kid => {
                if (kid.id === currentKid) {
                    return {...kid, transactions: newTransactions};
                }
                return kid;
            });
            localStorage.setItem('kids', JSON.stringify(updatedKids));
            return {
                ...state,
                transactions: newTransactions
            };
        case 'ADD_INCOME' :
            try {
                axios.post('/api/transactions/increase', {
                    amount: action.payload.amount,
                    description: action.payload.title,
                    payment_type: "money",
                    child_id: action.payload.kid,
                }).then( (response) =>{
                    toastifyInfo('添加收入成功!');
                    window.location.href = '/';
                });
            } catch (error) {
                console.log('添加收入失败!');
            }
            break;
        case 'ADD_EXPENSE' :
            try {
                  axios.post('/api/transactions/decrease', {
                      amount: action.payload.amount,
                      description: action.payload.title,
                      payment_type: "money",
                      child_id: action.payload.kid,
                  }).then(() => {
                      toastifyInfo('添加支出成功!');
                      window.location.href = '/';
                  });
            } catch (error) {
                alert('添加支出失败!');
            }
            break;
        case 'SET_TRANSACTIONS':
            return {
                ...state,
                transactions: action.payload || []
            };
        case 'SET_BALANCE':
            return {
                ...state,
                balance: action.payload
            };
        default:
            return state;
    }
};

export const TransactionProvider = ({children}) => {
    const [state, dispatch] = useReducer(transactionReducer, initialState);
    const {state: kidsState} = useKids(); // 将 state 重命名为 kidsState

    const fetchData = async () => {
        const currentKid = kidsState.currentKid;
        try {
            if (!currentKid) return;
            // 获取当前日期
            const today = new Date();
            const year = today.getFullYear();
            const month = today.getMonth() + 1; // 月份是从 0 开始的，所以要加 1
            const day = today.getDate();

            // 构建本月开始日期 (YYYY-MM-DD 格式)
            const startDate = `${year}-${String(month).padStart(2, '0')}-01`;

            // 构建当前日期 (YYYY-MM-DD 格式)
            const endDate = `${year}-${String(month).padStart(2, '0')}-${String(day + 1).padStart(2, '0')}`;

            let response = await axios.post('/api/transactions', {
                child_id: currentKid, // 如果 child_id 是可选的，可以根据需要传递
                start_date: startDate,
                end_date: endDate,
            });

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
                // amount: transaction.payment_type === 'money' ? `¥${transaction.amount}` : `⭐️${transaction.amount}`,
            }));
            dispatch({type: 'SET_TRANSACTIONS', payload: formattedTransactions || []});
            response = await axios.post('/api/user/balance', {child_id: currentKid});
            dispatch({type: 'SET_BALANCE', payload: response.data.total_balance});
        } catch (error) {
            console.log('获取交易记录失败!', error);
        }
    }


    useEffect(() => {
        fetchData();
    }, [kidsState.currentKid]);

    // useEffect(() => {
    //   const balance = state.transactions.reduce((acc, curr) => {
    //     return curr.type === 'income' ? acc + curr.amount : acc - curr.amount;
    //   }, 0);
    //   state.balance = balance;
    // }, [state.transactions]);

    return (
        <TransactionContext.Provider value={{state, dispatch}}>
            {children}
        </TransactionContext.Provider>
    );
};

export const useTransactions = () => {
    const context = useContext(TransactionContext);
    if (!context) {
        throw new Error('useTransactions must be used within a TransactionProvider');
    }
    return context;
};
