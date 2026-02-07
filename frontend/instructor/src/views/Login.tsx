import React from 'react';
import { AuthLayout } from '../components/AuthLayout';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock } from 'lucide-react';

import { useUser } from '../context/UserContext';
import { API_ENDPOINTS } from '../config/api';

export const Login = () => {
    const [role, setRole] = React.useState<'company' | 'influencer'>('company');
    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState('');
    const navigate = useNavigate();
    const { refreshProfile } = useUser();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = await fetch(API_ENDPOINTS.LOGIN, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password, role })
            });

            const data = await response.json();

            if (response.ok) {
                localStorage.setItem('botfree_token', data.token);
                localStorage.setItem('botfree_role', role);
                localStorage.setItem('botfree_user', JSON.stringify(data.user));
                await refreshProfile();

                if (role === 'influencer') {
                    navigate('/influencer-dashboard');
                } else {
                    // Fallback or demo for learners
                    navigate('/company-dashboard');
                }
            } else {
                throw new Error(data.error || 'Login failed');
            }
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthLayout
            title="Welcome Back"
            subtitle={role === 'influencer' ? 'Log in to your influencer portal to continue your learning journey' : 'Log in to your company portal to continue your learning journey'}
        >
            {/* Role Toggle */}
            <div className="flex p-1 bg-gray-100 rounded-2xl mb-8">
                <button
                    type="button"
                    onClick={() => setRole('influencer')}
                    className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold transition-all ${role === 'influencer' ? 'bg-white text-brand-blue shadow-sm' : 'text-gray-500 hover:text-gray-700'
                        }`}
                >
                    Instructor
                </button>
                <button
                    type="button"
                    onClick={() => setRole('company')}
                    className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold transition-all ${role === 'company' ? 'bg-white text-brand-blue shadow-sm' : 'text-gray-500 hover:text-gray-700'
                        }`}
                >
                    Learner
                </button>
            </div>

            {/* Error Message */}
            {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-2xl text-red-600 text-xs font-bold animate-in fade-in slide-in-from-top-2">
                    {error}
                </div>
            )}

            <form className="space-y-6" onSubmit={handleLogin}>
                <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700">Email Address</label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <Mail className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="block w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-brand-blue focus:border-transparent outline-none transition-all font-medium"
                            placeholder="name@example.com"
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <div className="flex justify-between items-center">
                        <label className="text-sm font-bold text-gray-700">Password</label>
                        <a href="#" className="text-sm font-bold text-brand-blue hover:text-brand-indigo">Forgot Password?</a>
                    </div>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <Lock className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                            type="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="block w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-brand-blue focus:border-transparent outline-none transition-all font-medium"
                            placeholder="••••••••"
                        />
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-brand-blue hover:bg-brand-blue/90 disabled:opacity-50 text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-brand-blue/20 flex items-center justify-center"
                >
                    {loading ? (
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    ) : 'Sign In'}
                </button>

                <p className="text-center text-gray-500 font-medium pt-4">
                    Don't have an account?{' '}
                    <Link to="/register" className="text-brand-blue font-bold hover:text-brand-indigo">
                        Sign Up
                    </Link>
                </p>
            </form>
        </AuthLayout>
    );
};
