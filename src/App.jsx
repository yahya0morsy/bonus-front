import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from '../src/LoginPage.jsx';
import BalancePage from '../src/BalancePage.jsx';
import MasterPage from '../src/master.jsx'; // Import the MasterPage component
import RegisterPage from '../src/Reg.jsx'; // Adjust the path as needed
import AboutPage from '../src/about.jsx'; // Adjust the path to your AboutPage component
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/balance" element={<BalancePage />} />
        <Route path="*" element={<Navigate to="/login" />} />
        {/* Master Page */}
        <Route path="/master" element={<MasterPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/about" element={<AboutPage />} />

      </Routes>
    </Router>
  );
}

export default App;