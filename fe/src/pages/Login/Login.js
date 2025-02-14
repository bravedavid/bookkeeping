import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import './index.css';

// 获取指定cookie的函数
const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    return parts.length === 2 ? parts.pop().split(';').shift() : null;
};

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        setEmail(queryParams.get('email') || '');
        setPassword(queryParams.get('password') || '');
    }, [location.search]);

    // 自动登录检查
    useEffect(() => {
        const checkAutoLogin = async () => {
            const authToken = getCookie('authToken');
            if (authToken) {
                navigate('/info');
            }
        };
        checkAutoLogin();
    }, [navigate]);

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!email || !password) {
            setErrorMessage("Email and password are required.");
            return;
        }
        try {
            const response = await axios.post('/api/auth/login', { email, password });
            if (response.status === 200) {
                navigate('/info');
            } else {
                setErrorMessage(response.data.message || 'Login failed');
            }
        } catch (error) {
            setErrorMessage('An error occurred during login. Please try again.');
            console.error('Login failed:', error);
        }
    };

    return (
        <div className="App">
            <h2>Login Page</h2>
            {errorMessage && <div className="error-message">{errorMessage}</div>}
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="email">Email:</label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
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
                        required
                    />
                </div>
                <button type="submit">Login</button>
            </form>
        </div>
    );
};

export default LoginPage;
