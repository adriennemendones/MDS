import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Home from './pages/Home'; 
import About from './pages/About'; 
import Login from './pages/Login'; 
import Dashboard from './pages/Dashboard';
import ResolvedIncidents from './pages/ResolvedIncidents';
import Profile from './pages/Profile';
import Settings from './pages/Settings';

function App() {
  return (
    <Router>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} /> 
        <Route path="/profile" element={<Profile />}/>
        <Route path="/settings" element={<Settings />}/>
        <Route path="/resolved-incidents" element={<ResolvedIncidents />} />
      </Routes>
    </Router>
  );
}

export default App;
