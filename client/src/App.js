import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CssBaseline } from '@mui/material';

// Layout Components
import Layout from './components/layout/Layout';

// Page Components
import Home from './pages/Home';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Dashboard from './pages/Dashboard';
import MassAuditPage from './modules/mass/pages/MassAuditPage';
import ProtectedRoute from './components/routing/ProtectedRoute';

// Services
import { 
  login as loginService, 
  register as registerService, 
  logout as logoutService,
  getCurrentUser,
  setAuthToken,
  isAuthenticated as checkAuth
} from './services/authService';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check for token in localStorage
    const token = localStorage.getItem('token');
    if (token) {
      setAuthToken(token);
    }

    const loadUser = async () => {
      try {
        if (checkAuth()) {
          const userData = await getCurrentUser();
          setUser(userData);
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error('Error loading user:', error);
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  // Auth functions
  const login = async (userData) => {
    const response = await loginService(userData);
    setUser(await getCurrentUser());
    setIsAuthenticated(true);
    return response;
  };

  const register = async (userData) => {
    const response = await registerService(userData);
    setUser(await getCurrentUser());
    setIsAuthenticated(true);
    return response;
  };

  const logout = () => {
    logoutService();
    setUser(null);
    setIsAuthenticated(false);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Router>
      <CssBaseline />
      <Layout isAuthenticated={isAuthenticated} logout={logout}>
        <Routes>
          <Route path="/" element={<Home isAuthenticated={isAuthenticated} />} />
          <Route path="/login" element={<Login login={login} />} />
          <Route path="/register" element={<Register register={register} />} />
          
          {/* Protected Routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<Dashboard user={user} />} />
            <Route path="/mass-audits" element={<MassAuditPage />} />
            <Route path="/mass-management" element={<MassAuditPage />} />
            {/* Add more protected routes here */}
          </Route>
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
