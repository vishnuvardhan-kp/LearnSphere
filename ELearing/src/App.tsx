import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
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
import Layout from './components/Layout';
import Login from './pages/Login';
import './index.css';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/courses" element={<Courses />} />
          <Route path="/courses/new" element={<AddCourse />} />
          <Route path="/courses/:id" element={<CourseDetails />} />
          <Route path="/courses/:id/content" element={<CourseContent />} />
          <Route path="/courses/:courseId/content/:contentId/edit" element={<EditContent />} />
          <Route path="/students" element={<Navigate to="/learners" replace />} />
          <Route path="/learners" element={<Students />} />
          <Route path="/instructor" element={<Instructors />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/settings" element={<Settings />} />
          {/* Add more routes as needed */}
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
