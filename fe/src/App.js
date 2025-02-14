import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/Login/Login';
import Info from './pages/Info/index'
import Parent from './pages/Parent/index';

function App() {
  return (
      <Router>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/info" element={<Info />} />
          <Route path="/parent" element={<Parent />} />
        </Routes>
      </Router>
  );
}

export default App;
