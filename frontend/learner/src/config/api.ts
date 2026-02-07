// API Configuration for Learner Frontend
export const API_BASE_URL = 'http://localhost:5000/api/learner';

// Helper function to get auth headers
export const getAuthHeaders = () => {
    const token = localStorage.getItem('learner_token');
    return {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
    };
};

// API endpoints
export const API_ENDPOINTS = {
    // Auth
    LOGIN: `${API_BASE_URL}/login`,
    PROFILE: `${API_BASE_URL}/profile`,
    STATS: `${API_BASE_URL}/stats`,

    // Courses
    COURSES: `${API_BASE_URL}/courses`,
    COURSE: (id: string | number) => `${API_BASE_URL}/courses/${id}`,
    ENROLL: (courseId: string | number) => `${API_BASE_URL}/courses/${courseId}/enroll`,
    ENROLLED: `${API_BASE_URL}/enrolled`,

    // Lessons
    LESSON: (courseId: string | number, lessonId: string | number) =>
        `${API_BASE_URL}/courses/${courseId}/lessons/${lessonId}`,
    COMPLETE_LESSON: (courseId: string | number, lessonId: string | number) =>
        `${API_BASE_URL}/courses/${courseId}/lessons/${lessonId}/complete`,
    SUBMIT_QUIZ: (courseId: string | number, lessonId: string | number) =>
        `${API_BASE_URL}/courses/${courseId}/lessons/${lessonId}/quiz`,

    // Reviews
    SUBMIT_REVIEW: (courseId: string | number) => `${API_BASE_URL}/courses/${courseId}/review`,
};
