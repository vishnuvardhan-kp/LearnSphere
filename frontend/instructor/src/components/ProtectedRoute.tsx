import { Navigate, useLocation } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import React from 'react';

interface ProtectedRouteProps {
    children: React.ReactElement;
    allowedRoles?: ('influencer' | 'company')[];
}

const ProtectedRoute = ({ children, allowedRoles }: ProtectedRouteProps) => {
    const { profile, loading } = useUser();
    const location = useLocation();
    const token = localStorage.getItem('botfree_token');

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    // No token means not authenticated
    if (!token) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // If profile loaded but no profile data, token might be invalid
    if (!profile) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // Check role if specified
    if (allowedRoles && !allowedRoles.includes(profile.role)) {
        return (
            <div className="min-h-screen flex items-center justify-center flex-col gap-4">
                <h1 className="text-xl font-bold text-red-600">Access Denied</h1>
                <p className="text-gray-600">You do not have permission to access this area.</p>
                <button
                    onClick={() => {
                        localStorage.removeItem('botfree_token');
                        localStorage.removeItem('botfree_role');
                        localStorage.removeItem('botfree_user');
                        window.location.href = '/login';
                    }}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                >
                    Return to Login
                </button>
            </div>
        );
    }

    return children;
};

export default ProtectedRoute;
