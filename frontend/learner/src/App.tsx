import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { MainLayout } from './layouts/MainLayout';
import { LearnerDashboard } from './pages/LearnerDashboard';
import { CourseDetail } from './pages/CourseDetail';
import { LessonPlayer } from './pages/LessonPlayer';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<LearnerDashboard />} />
          <Route path="browse" element={<LearnerDashboard />} />
          <Route path="course/:courseId" element={<CourseDetail />} />
        </Route>
        <Route path="learn/:courseId/lesson/:lessonId" element={<LessonPlayer />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
