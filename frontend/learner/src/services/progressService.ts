import { COURSES, CURRENT_USER } from '../data/mockData';

// Keys for localStorage
const PROGRESS_KEY = 'learnsphere_progress';
const POINTS_KEY = 'learnsphere_points';

interface ProgressData {
  [courseId: string]: string[]; // List of completed lesson IDs per course
}

// Initialize persistence (load from local or seed with mock)
const loadProgress = (): ProgressData => {
  const stored = localStorage.getItem(PROGRESS_KEY);
  if (stored) {
    return JSON.parse(stored);
  }
  
  // Seed with mock data initial state if empty
  const initialProgress: ProgressData = {};
  COURSES.forEach(course => {
    initialProgress[course.id] = course.lessons
        .filter(l => l.isCompleted)
        .map(l => l.id);
  });
  return initialProgress;
};

// Accessors
export const getCompletedLessons = (courseId: string): string[] => {
  const data = loadProgress();
  return data[courseId] || [];
};

export const isLessonCompleted = (courseId: string, lessonId: string): boolean => {
  const completed = getCompletedLessons(courseId);
  return completed.includes(lessonId);
};

// Mutators
export const markLessonAsComplete = (courseId: string, lessonId: string) => {
  const data = loadProgress();
  if (!data[courseId]) data[courseId] = [];
  
  if (!data[courseId].includes(lessonId)) {
    data[courseId].push(lessonId);
    localStorage.setItem(PROGRESS_KEY, JSON.stringify(data));
    return true; // marked new
  }
  return false; // already done
};

export const getUserPoints = (): number => {
    const stored = localStorage.getItem(POINTS_KEY);
    return stored ? parseInt(stored, 10) : CURRENT_USER.points;
};

export const addPoints = (amount: number) => {
    const current = getUserPoints();
    const newTotal = current + amount;
    localStorage.setItem(POINTS_KEY, newTotal.toString());
    return newTotal;
};

export const clearProgress = () => {
    localStorage.removeItem(PROGRESS_KEY);
    localStorage.removeItem(POINTS_KEY);
    window.location.reload();
};
