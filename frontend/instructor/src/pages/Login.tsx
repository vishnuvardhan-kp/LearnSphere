import { useState } from 'react';
import axios from 'axios';
import { useUser } from '../context/UserContext';
import './Login.css';

interface LoginProps {
  onLogin: () => void;
}

const Login = ({ onLogin }: LoginProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { refreshProfile } = useUser();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await axios.post('http://localhost:5001/api/auth/login', {
        email,
        password
      });

      const { token, user } = response.data;

      // Check if user is an instructor
      if (user.role !== 'instructor') {
        setError('Access denied. This portal is for instructors only.');
        setLoading(false);
        return;
      }

      // Save to localStorage
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));

      // Refresh user context and call onLogin callback
      refreshProfile();
      onLogin();

    } catch (err: any) {
      if (err.response?.data?.error) {
        setError(err.response.data.error);
      } else {
        setError('Login failed. Please try again.');
      }
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <div className="login-header">
          <h1>LearnSphere</h1>
          <h2>Instructor Portal</h2>
          <p>Sign in to manage your courses</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="instructor@example.com"
              required
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
              disabled={loading}
            />
          </div>

          <button 
            type="submit" 
            className="login-button"
            disabled={loading}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div className="login-footer">
          <p className="info-text">
            ℹ️ Instructors are created by administrators. 
            If you don't have an account, please contact your admin.
          </p>
          <p className="test-credentials">
            <strong>Test Account:</strong><br />
            Email: instructor1@example.com<br />
            Password: password123
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
