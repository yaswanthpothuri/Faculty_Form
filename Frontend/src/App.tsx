// App.js
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './components/home';
import FacultyAdminDashboard from './components/dashboard';
import VignanLogoAnimation from './landing';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/admindashboard" element={<FacultyAdminDashboard />} />
      <Route path="/landing" element={<VignanLogoAnimation />} />
    </Routes>
  );
}

export default App;
