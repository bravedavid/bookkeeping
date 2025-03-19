import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { FaUser, FaLock, FaPiggyBank } from 'react-icons/fa';
import './index.css';


const Login = () => {
  const { login } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');


  useEffect(() => {
    const url = new URL(window.location.href);
    setUsername(url.searchParams.get('email') || '');
    setPassword(url.searchParams.get('password') || '');
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!username || !password) {
      setError('请输入用户名和密码');
      return;
    }

    login(username, password)
        .then(success => {
          console.log(success);
          if (!success) {
            setError('密码错误');
          }
        })
        .catch(error => {
          console.error('登录失败:', error); // 更详细的错误处理
          setError('登录失败，请稍后再试'); // 更友好的用户提示
        });
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <div className="logo">
            <FaPiggyBank />
          </div>
          <h1>小小理财家</h1>
          <p>培养孩子的理财意识</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <div className="input-icon">
              <FaUser />
            </div>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="请输入邮箱"
              maxLength={50}
            />
          </div>

          <div className="form-group">
            <div className="input-icon">
              <FaLock />
            </div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="请输入密码"
              maxLength={20}
            />
          </div>

          {error && <div className="error-message">{error}</div>}

          <button type="submit" className="login-button">
            登录
          </button>

          {/*<div className="login-hint">*/}
          {/*  默认密码：123456*/}
          {/*</div>*/}
        </form>
      </div>
    </div>
  );
};

export default Login;
