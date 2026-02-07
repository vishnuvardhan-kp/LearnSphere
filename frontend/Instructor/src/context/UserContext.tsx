import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

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
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    const fetchProfile = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('botfree_token');
            if (!token) {
                setLoading(false);
                return;
            }

            if (token === 'demo_token') {
                setProfile({
                    _id: 'demo-user-123',
                    email: 'demo@gamil.com',
                    role: 'influencer',
                    name: 'Demo Influencer',
                    handle: '@demouser',
                    isOnboarded: true,
                    youtubeStats: { subscribers: 1000, views: 50000 },
                    instagramStats: { followers: 2000, engagement: '5.2%' }
                });
                setLoading(false);
                return;
            }

            const response = await fetch('http://localhost:5000/api/onboarding/profile', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                const data = await response.json();
                setProfile(data);
            } else if (response.status === 401) {
                localStorage.removeItem('botfree_token');
                localStorage.removeItem('botfree_role');
                navigate('/login');
            } else {
                setError('Failed to fetch profile');
            }
        } catch (err) {
            console.error('Failed to fetch profile:', err);
            setError('An error occurred while fetching profile');
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
