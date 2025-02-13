import React, { useState, useEffect } from 'react';
import axios from 'axios';  // 如果选择使用 axios
import { useNavigate } from 'react-router-dom';
import './index.css';

function LoginPage() {
    // State to manage form input values
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate(); // 用来进行页面跳转

    useEffect(() => {
        if (getCookie('authToken')) {
            console.log('get authToken');
            navigate('/info');
        }
    },[]);

    // Handle form submission
    const handleSubmit = async (event) => {
        event.preventDefault();

        // 发送请求前，简单验证输入
        if (!email || !password) {
            setErrorMessage("Email and password are required.");
            return;
        }

        // 封装请求数据
        const requestData = {
            email,
            password
        };

        try {
            // 发送 POST 请求到后端验证用户
            const response = await axios.post('/login', requestData);

            console.log(response);
            if (response?.status === 200) {
                // alert('Login successful!');
                const data = response?.data?.user;
                // const url = `/info?user_id=${data?.user_id}&username=${data?.username}`;

                navigate('/info');
                // 可以进行页面跳转，或保存 token 到本地
            } else {
                setErrorMessage(response.data.message);
            }
        } catch (error) {
            alert('Login fail!');
            console.error('Login failed:', error);
            setErrorMessage('An error occurred during login. Please try again.');
        }
    };


    return (
        <div className="App">
            <h2>Login Page</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="email">Email:</label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your email"
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="password">Password:</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter your password"
                        required
                    />
                </div>
                <button type="submit">Login</button>
            </form>
        </div>
    );
}

export default LoginPage;
