import { useState, useEffect } from 'react';
import './Dashboard.css';

interface DashboardProps {
  onLogout: () => void;
}

const Dashboard = ({ onLogout }: DashboardProps) => {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  return (
    <div className="dashboard-container">
      <nav className="dashboard-nav">
        <div className="nav-brand">
          <h1>LearnSphere</h1>
          <span className="nav-subtitle">Instructor Portal</span>
        </div>
        <div className="nav-user">
          <span className="user-name">👤 {user?.name || 'Instructor'}</span>
          <button onClick={onLogout} className="logout-button">
            Logout
          </button>
        </div>
      </nav>

      <div className="dashboard-content">
        <div className="welcome-section">
          <h2>Welcome back, {user?.name}! 👋</h2>
          <p>Manage your courses and track student progress</p>
        </div>

        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon">📚</div>
            <div className="stat-info">
              <h3>My Courses</h3>
              <p className="stat-number">0</p>
              <p className="stat-label">Active courses</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">👥</div>
            <div className="stat-info">
              <h3>Students</h3>
              <p className="stat-number">0</p>
              <p className="stat-label">Total enrolled</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">⭐</div>
            <div className="stat-info">
              <h3>Rating</h3>
              <p className="stat-number">0.0</p>
              <p className="stat-label">Average rating</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">📊</div>
            <div className="stat-info">
              <h3>Completion</h3>
              <p className="stat-number">0%</p>
              <p className="stat-label">Avg. completion</p>
            </div>
          </div>
        </div>

        <div className="coming-soon">
          <div className="coming-soon-content">
            <h3>🚀 Coming Soon</h3>
            <p>Full course management features are being developed!</p>
            <ul>
              <li>✅ Create and manage courses</li>
              <li>✅ Upload video and document lessons</li>
              <li>✅ Create quizzes and assignments</li>
              <li>✅ Track student progress</li>
              <li>✅ View analytics and reports</li>
            </ul>
          </div>
        </div>

        <div className="info-box">
          <h4>📧 Your Account Information</h4>
          <p><strong>Email:</strong> {user?.email}</p>
          <p><strong>Role:</strong> {user?.role}</p>
          <p><strong>Status:</strong> <span className="status-active">Active</span></p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
