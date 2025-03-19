import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

// 获取指定cookie的函数
const getCookie = (name) => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  return parts.length === 2 ? parts.pop().split(';').shift() : null;
};

const deleteCookie = (name) => {
  document.cookie = name + '=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
};

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return getCookie('authToken') !== null;
  });

  useEffect(() => {
    localStorage.setItem('isAuthenticated', isAuthenticated);
  }, [isAuthenticated]);

  const login = async (email, password) => {
    try {
      const response = await axios.post('/api/auth/login', { email, password });
      if (response.status === 200) {
        setIsAuthenticated(true);
        return true;
      } else {
        return false;
      }
    } catch (error) {
      console.error('An error occurred during login. Please try again.');
      return false;
    }
  };

  const logout = () => {
    setIsAuthenticated(false);
    deleteCookie('authToken');
  };

  const changePassword = (oldPassword, newPassword) => {
    // if (oldPassword === password) {
    //   setPassword(newPassword);
    //   localStorage.setItem('password', newPassword);
    //   return true;
    // }
    return false;
  };

  return (
      <AuthContext.Provider value={{ isAuthenticated, login, logout, changePassword }}>
        {children}
      </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
