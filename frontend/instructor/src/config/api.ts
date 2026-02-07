// API Configuration
export const API_BASE_URL = 'http://localhost:5000/api';

// Helper function to get auth headers
export const getAuthHeaders = () => {
    const token = localStorage.getItem('botfree_token');
    return {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
    };
};

// API endpoints
export const API_ENDPOINTS = {
    // Auth
    LOGIN: `${API_BASE_URL}/login`,
    PROFILE: `${API_BASE_URL}/onboarding/profile`,

    // Courses
    COURSES: `${API_BASE_URL}/courses`,
    COURSE: (id: number | string) => `${API_BASE_URL}/courses/${id}`,

    // Participants
    PARTICIPANTS: `${API_BASE_URL}/participants`,

    // Onboarding
    ONBOARDING_DETAILS: `${API_BASE_URL}/onboarding/details`,
    ONBOARDING_UPDATE: `${API_BASE_URL}/onboarding/update`,
    ONBOARDING_INFLUENCERS: `${API_BASE_URL}/onboarding/influencers/all`,
    ONBOARDING_COMPANIES: `${API_BASE_URL}/onboarding/companies/all`,

    // Social
    SOCIAL_CONNECT: `${API_BASE_URL}/onboarding/social/connect`,
    SOCIAL_DISCONNECT: `${API_BASE_URL}/onboarding/social/disconnect`,
    SOCIAL_REFRESH: `${API_BASE_URL}/onboarding/social/refresh`,

    // AI
    AI_CHAT: `${API_BASE_URL}/ai/chat`,
};
