import React from 'react';
import { CourseEditor } from '../components/CourseEditor';
import { useNavigate } from 'react-router-dom';

export const CreateCourse = () => {
    const navigate = useNavigate();

    // Initial empty course state
    const newCourse = {
        id: Date.now(),
        title: 'Untitled Course',
        tags: [],
        views: 0,
        totalLessons: 0,
        duration: '0m',
        status: 'draft',
        description: ''
    };

    return (
        <CourseEditor
            course={newCourse}
            onClose={() => navigate('/influencer-dashboard')}
            onSave={(savedCourse) => {
                console.log('Saved course:', savedCourse);
                navigate('/influencer-dashboard');
            }}
        />
    );
};
