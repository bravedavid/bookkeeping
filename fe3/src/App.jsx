import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import AddTransaction from './components/AddTransaction';
import History from './components/History';
import Login from './components/Login';
import { AuthProvider } from './context/AuthContext';
import { KidsProvider } from './context/KidsContext';
import { TransactionProvider } from './context/TransactionContext';
import { useAuth } from './context/AuthContext';

const PrivateRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/login" />;
};

const PublicRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return !isAuthenticated ? children : <Navigate to="/" />;
};

const AppContent = () => {
  return (
    <KidsProvider>
      <TransactionProvider>
        <Routes>
          <Route path="/login" element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          } />
          <Route path="/" element={
            <PrivateRoute>
              <Layout>
                <Dashboard />
              </Layout>
            </PrivateRoute>
          } />
          <Route path="/add" element={
            <PrivateRoute>
              <Layout>
                <AddTransaction />
              </Layout>
            </PrivateRoute>
          } />
          <Route path="/history" element={
            <PrivateRoute>
              <Layout>
                <History />
              </Layout>
            </PrivateRoute>
          } />
        </Routes>
      </TransactionProvider>
    </KidsProvider>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

export default App;
