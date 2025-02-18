import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import LoginPage from './pages/Login/Login';
import Info from './pages/Info/index';
import Parent from './pages/Parent/index';

function App() {
    return (
        <Router>
            <AppRoutes />
        </Router>
    );
}

function AppRoutes() {
    const navigate = useNavigate();
    const location = useLocation();

    const isCookieValid = () => {
        // 实际逻辑应该检查cookie中的相关字段，这里简单示例返回true或false
        return document.cookie.includes('authToken');
    };

    useEffect(() => {
        if (!isCookieValid()) {
            // 如果cookie无效，跳转到登录页面，并保留当前的 URL 参数
            navigate(`/login${location.search}`);
        }
    }, [navigate, location.search]);

    return (
        <Routes>
            <Route path="/" element={<LoginPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/info" element={<Info />} />
            <Route path="/parent" element={<Parent />} />
        </Routes>
    );
}

export default App;
