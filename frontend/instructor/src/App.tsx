import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Login from './pages/Login';
import { InfluencerDashboard } from './views/InfluencerDashboard';
import { CreateCourse } from './views/CreateCourse';
import { Settings } from './views/Settings';
import { Analytics } from './views/Analytics';
import { UserProvider } from './context/UserContext';

// Import other views as needed
// import { Campaigns } from './views/Campaigns';
// import { Funds } from './views/Funds';

import './App.css';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    if (token && user) {
      const userData = JSON.parse(user);
      if (userData.role === 'instructor') {
        setIsAuthenticated(true);
      }
    }
  }, []);

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
    if (!isAuthenticated) {
      return <Navigate to="/login" replace />;
    }
    return children;
  };

  return (
    <UserProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route 
            path="/login" 
            element={
              isAuthenticated ? 
              <Navigate to="/influencer-dashboard" /> : 
              <Login onLogin={handleLogin} />
            } 
          />

          {/* Protected Routes - Restoring your original features */}
          <Route 
            path="/influencer-dashboard" 
            element={
              <ProtectedRoute>
                <InfluencerDashboard />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/influencer/create-course" 
            element={
              <ProtectedRoute>
                <CreateCourse />
              </ProtectedRoute>
            } 
          />

          <Route 
            path="/settings" 
            element={
              <ProtectedRoute>
                <Settings />
              </ProtectedRoute>
            } 
          />

          <Route 
            path="/analytics" 
            element={
              <ProtectedRoute>
                <Analytics />
              </ProtectedRoute>
            } 
          />

          {/* Redirects */}
          <Route path="/dashboard" element={<Navigate to="/influencer-dashboard" />} />
          <Route path="/" element={<Navigate to={isAuthenticated ? "/influencer-dashboard" : "/login"} />} />
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </BrowserRouter>
    </UserProvider>
  );
}

export default App;
