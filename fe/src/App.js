import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/Login/Login1';
import Info from './pages/Info/index'

function App() {
  return (
      <Router>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/info" element={<Info />} />
        </Routes>
      </Router>
  );
}

export default App;
