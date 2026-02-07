import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_ENDPOINTS } from '../config/api';

interface UserProfile {
    _id: string;
    email: string;
    role: 'company' | 'influencer';
    name?: string;
    handle?: string;
    onboardingData?: any;
    isOnboarded: boolean;
    youtubeStats?: any;
    instagramStats?: any;
}

interface UserContextType {
    profile: UserProfile | null;
    loading: boolean;
    error: string | null;
    refreshProfile: () => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const [error] = useState<string | null>(null);
    const navigate = useNavigate();

    const fetchProfile = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('botfree_token');
            const storedUser = localStorage.getItem('botfree_user');

            if (!token) {
                setLoading(false);
                return;
            }

            // Removed demo_token bypass - all tokens must be validated by backend

            // Try to load from localStorage first for speed
            if (storedUser) {
                const user = JSON.parse(storedUser);
                setProfile({
                    _id: user.id || user._id,
                    email: user.email,
                    role: user.role,
                    name: user.name,
                    isOnboarded: true
                });
            }

            const response = await fetch(API_ENDPOINTS.PROFILE, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                const data = await response.json();
                setProfile(data);
            } else if (response.status === 401) {
                // Token is invalid, clear it and redirect to login
                localStorage.removeItem('botfree_token');
                localStorage.removeItem('botfree_role');
                localStorage.removeItem('botfree_user');
                setProfile(null);
                navigate('/login');
            }
        } catch (err) {
            console.error('Failed to fetch profile:', err);
            // Don't set error if we already have local data
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProfile();
    }, []);

    return (
        <UserContext.Provider value={{ profile, loading, error, refreshProfile: fetchProfile }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => {
    const context = useContext(UserContext);
    if (context === undefined) {
        throw new Error('useUser must be used within a UserProvider');
    }
    return context;
};
