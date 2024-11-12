// src/App.js
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import UserSignup from './pages/UserSignup';
import UserLogin from './pages/UserLogin';
import AdminLogin from './pages/AdminLogin';
import Dashboard from './pages/UserDashboard';
import AdminDashboard from './pages/AdminDashboard';
import Home from './pages/Home';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/user/signup" element={<UserSignup />} />
        <Route path="/user/login" element={<UserLogin />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/user/dashboard" element={<Dashboard />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/home" element={<Home />} />

        {/* Add other routes here */}
      </Routes>
    </Router>
  );
}

export default App;
