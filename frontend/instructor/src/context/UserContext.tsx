import React, { createContext, useContext, useState, useEffect } from 'react';

// Simplified profile interface compatible with your User object
interface UserProfile {
    id: string;
    email: string;
    role: string;
    name: string;
    [key: string]: any;
}

interface UserContextType {
    profile: UserProfile | null;
    loading: boolean;
    error: string | null;
    refreshProfile: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const loadProfile = () => {
        try {
            setLoading(true);
            const userStr = localStorage.getItem('user');
            
            if (userStr) {
                try {
                    const user = JSON.parse(userStr);
                    setProfile(user);
                } catch (parseError) {
                    console.error('Invalid user data in localStorage', parseError);
                    localStorage.removeItem('user');
                    localStorage.removeItem('token');
                    setProfile(null);
                }
            } else {
                setProfile(null);
            }
        } catch (err) {
            console.error('Failed to load profile:', err);
            setError('Failed to load profile');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadProfile();
    }, []);

    return (
        <UserContext.Provider value={{ profile, loading, error, refreshProfile: loadProfile }}>
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
