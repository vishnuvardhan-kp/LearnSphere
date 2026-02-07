import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Courses from './pages/Courses';
import Students from './pages/Students';
import Instructors from './pages/Instructors';
import Settings from './pages/Settings';
import CourseDetails from './pages/CourseDetails';
import CourseContent from './pages/CourseContent';
import EditContent from './pages/EditContent';
import AddCourse from './pages/AddCourse';
import Analytics from './pages/Analytics';
import './index.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Navigate to="/dashboard" replace />} />

          <Route path="/*" element={
            <ProtectedRoute>
              <Layout>
                <Routes>
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/courses" element={<Courses />} />
                  <Route path="/courses/add" element={<AddCourse />} />
                  <Route path="/courses/:id" element={<CourseDetails />} />
                  <Route path="/courses/:id/content" element={<CourseContent />} />
                  <Route path="/courses/:courseId/content/:contentId/edit" element={<EditContent />} />
                  <Route path="/learners" element={<Students />} />
                  <Route path="/instructors" element={<Instructors />} />
                  <Route path="/analytics" element={<Analytics />} />
                  <Route path="/settings" element={<Settings />} />
                  <Route path="*" element={<Navigate to="/dashboard" replace />} />
                </Routes>
              </Layout>
            </ProtectedRoute>
          } />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
