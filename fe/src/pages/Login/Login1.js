import React, { useState, useEffect } from 'react'; // 导入 useEffect
import axios from 'axios';
import {useLocation, useNavigate} from 'react-router-dom';
import './index.css';

// 获取指定cookie的函数
function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
  return null;
}

function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        if (queryParams.get('email')) {
            setEmail(queryParams.get('email'));
        }
        if (queryParams.get('password')) {
            setPassword(queryParams.get('password'));
        }
    }, []);

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
            const response = await axios.post('/login', { email, password });
            if (response?.status === 200) {
                const userData = response.data.user;
                navigate(`/info?user_id=${userData.user_id}&username=${userData.username}`);
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
}

export default LoginPage;

