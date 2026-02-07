import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import React from 'react';

const ProtectedRoute = ({ children }: { children: React.ReactElement }) => {
    const { isAuthenticated, loading } = useAuth();
    const location = useLocation();

    if (loading) {
        return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    return children;
};

export default ProtectedRoute;
