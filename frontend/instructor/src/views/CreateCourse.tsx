import React from 'react';
import { CourseEditor } from '../components/CourseEditor';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { API_ENDPOINTS, getAuthHeaders } from '../config/api';

export const CreateCourse = () => {
    const navigate = useNavigate();
    const { profile } = useUser();

    // Initial empty course state
    const newCourse = {
        id: 0, // Will be assigned by backend
        title: 'Untitled Course',
        tags: [],
        views: 0,
        totalLessons: 0,
        duration: '0m',
        status: 'draft',
        description: ''
    };

    const handleSave = async (savedCourse: any) => {
        try {
            const courseData = {
                title: savedCourse.title,
                description: savedCourse.description || '',
                author: profile?.name || 'Instructor',
                tags: JSON.stringify(savedCourse.tags || []),
                modules: JSON.stringify(savedCourse.lessons || []),
                image: savedCourse.image || ''
            };

            const response = await fetch(API_ENDPOINTS.COURSES, {
                method: 'POST',
                headers: getAuthHeaders(),
                body: JSON.stringify(courseData)
            });

            if (response.ok) {
                navigate('/influencer-dashboard');
            } else {
                const errorData = await response.json();
                alert(errorData.error || 'Failed to create course');
            }
        } catch (error) {
            console.error('Error creating course:', error);
            alert('Failed to create course. Please try again.');
        }
    };

    return (
        <CourseEditor
            course={newCourse}
            onClose={() => navigate('/influencer-dashboard')}
            onSave={handleSave}
        />
    );
};
