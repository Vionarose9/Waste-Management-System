// src/App.js
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import UserSignup from './pages/UserSignup';
import UserLogin from './pages/UserLogin';
import AdminLogin from './pages/AdminLogin';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/user/signup" element={<UserSignup />} />
        <Route path="/user/login" element={<UserLogin />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        {/* Add other routes here */}
      </Routes>
    </Router>
  );
}

export default App;
