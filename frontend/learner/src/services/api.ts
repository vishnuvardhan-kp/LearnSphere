import { API_ENDPOINTS, getAuthHeaders } from '../config/api';
import type { Course, User, Lesson } from '../data/mockData';

// Check if user is authenticated
export const isAuthenticated = (): boolean => {
    return !!localStorage.getItem('learner_token');
};

// Get current user from local storage
export const getCurrentUser = (): User | null => {
    const userStr = localStorage.getItem('learner_user');
    if (!userStr) return null;
    try {
        return JSON.parse(userStr);
    } catch {
        return null;
    }
};

// Login
export const login = async (email: string, password: string): Promise<{ token: string; user: User }> => {
    const response = await fetch(API_ENDPOINTS.LOGIN, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Login failed');
    }

    const data = await response.json();
    localStorage.setItem('learner_token', data.token);
    localStorage.setItem('learner_user', JSON.stringify(data.user));
    return data;
};

// Logout
export const logout = () => {
    localStorage.removeItem('learner_token');
    localStorage.removeItem('learner_user');
};

// Fetch user profile
export const fetchProfile = async (): Promise<User> => {
    const response = await fetch(API_ENDPOINTS.PROFILE, {
        headers: getAuthHeaders()
    });

    if (!response.ok) {
        throw new Error('Failed to fetch profile');
    }

    return response.json();
};

// Fetch user stats
export const fetchStats = async (): Promise<{ points: number; badges: string[]; enrolledCourses: number }> => {
    const response = await fetch(API_ENDPOINTS.STATS, {
        headers: getAuthHeaders()
    });

    if (!response.ok) {
        throw new Error('Failed to fetch stats');
    }

    return response.json();
};

// Fetch all courses
export const fetchCourses = async (): Promise<Course[]> => {
    const response = await fetch(API_ENDPOINTS.COURSES, {
        headers: getAuthHeaders()
    });

    if (!response.ok) {
        throw new Error('Failed to fetch courses');
    }

    const data = await response.json();

    // Transform API response to match frontend Course type
    return data.map((c: any) => ({
        id: c.id.toString(),
        title: c.title,
        description: c.description || '',
        image: c.image || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3',
        tags: c.tags || [],
        totalPoints: c.totalPoints || 100,
        lessons: [], // Will be fetched separately
        reviews: []
    }));
};

// Fetch course detail
export const fetchCourseDetail = async (courseId: string): Promise<Course & { isEnrolled: boolean }> => {
    const response = await fetch(API_ENDPOINTS.COURSE(courseId), {
        headers: getAuthHeaders()
    });

    if (!response.ok) {
        throw new Error('Failed to fetch course');
    }

    const data = await response.json();

    return {
        id: data.id.toString(),
        title: data.title,
        description: data.description || '',
        image: data.image || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3',
        tags: data.tags || [],
        totalPoints: data.totalPoints || 100,
        lessons: (data.lessons || []).map((l: any) => ({
            id: l.id.toString(),
            title: l.title,
            type: l.type || 'video',
            duration: l.duration,
            url: l.url,
            isCompleted: l.isCompleted || false,
            quizConfig: l.quizConfig
        })),
        reviews: (data.reviews || []).map((r: any) => ({
            id: r.id.toString(),
            userName: r.userName,
            avatar: r.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(r.userName)}`,
            rating: r.rating,
            comment: r.comment,
            date: r.date
        })),
        isEnrolled: data.isEnrolled || false
    };
};

// Enroll in course
export const enrollInCourse = async (courseId: string): Promise<void> => {
    const response = await fetch(API_ENDPOINTS.ENROLL(courseId), {
        method: 'POST',
        headers: getAuthHeaders()
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to enroll');
    }
};

// Fetch enrolled courses
export const fetchEnrolledCourses = async (): Promise<string[]> => {
    const response = await fetch(API_ENDPOINTS.ENROLLED, {
        headers: getAuthHeaders()
    });

    if (!response.ok) {
        throw new Error('Failed to fetch enrolled courses');
    }

    const data = await response.json();
    return data.map((c: any) => c.id.toString());
};

// Mark lesson as complete
export const markLessonComplete = async (courseId: string, lessonId: string, timeSpent?: number): Promise<void> => {
    const response = await fetch(API_ENDPOINTS.COMPLETE_LESSON(courseId, lessonId), {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ timeSpent: timeSpent || 0 })
    });

    if (!response.ok) {
        throw new Error('Failed to mark lesson complete');
    }
};

// Submit quiz
export const submitQuiz = async (
    courseId: string,
    lessonId: string,
    answers: { questionId: string; optionId: number; isCorrect: boolean }[],
    score: number
): Promise<{ pointsEarned: number; attemptNumber: number }> => {
    const response = await fetch(API_ENDPOINTS.SUBMIT_QUIZ(courseId, lessonId), {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ answers, score })
    });

    if (!response.ok) {
        throw new Error('Failed to submit quiz');
    }

    return response.json();
};

// Submit review
export const submitReview = async (courseId: string, rating: number, comment: string): Promise<void> => {
    const response = await fetch(API_ENDPOINTS.SUBMIT_REVIEW(courseId), {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ rating, comment })
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to submit review');
    }
};
