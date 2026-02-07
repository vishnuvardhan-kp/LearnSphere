import React from 'react';
import { AuthLayout } from '../components/AuthLayout';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Building2, UserCircle2, User, Link as LinkIcon } from 'lucide-react';

import { useUser } from '../context/UserContext';

export const Register = () => {
    const [role, setRole] = React.useState<'company' | 'influencer'>('company');
    const [name, setName] = React.useState('');
    const [handle, setHandle] = React.useState('');
    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState('');
    const navigate = useNavigate();
    const { refreshProfile } = useUser();

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 800));

        try {
            // Mock success for any registration
            localStorage.setItem('botfree_token', 'demo_token');
            localStorage.setItem('botfree_role', role);

            await refreshProfile();

            // Redirect to onboarding (or dashboard if we consider them "done")
            if (role === 'company') {
                navigate('/company-onboarding');
            } else {
                navigate('/onboarding');
            }
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthLayout
            title="Create Account"
            subtitle="Secure your marketing budget with AI protection"
        >
            {/* Role Toggle */}
            <div className="flex p-1 bg-gray-100 rounded-2xl mb-8">
                <button
                    type="button"
                    onClick={() => setRole('company')}
                    className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold transition-all ${role === 'company' ? 'bg-white text-brand-blue shadow-sm' : 'text-gray-500 hover:text-gray-700'
                        }`}
                >
                    <Building2 className="w-4 h-4" />
                    Brand / Company
                </button>
                <button
                    type="button"
                    onClick={() => setRole('influencer')}
                    className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold transition-all ${role === 'influencer' ? 'bg-white text-brand-blue shadow-sm' : 'text-gray-500 hover:text-gray-700'
                        }`}
                >
                    <UserCircle2 className="w-4 h-4" />
                    Influencer
                </button>
            </div>

            {/* Error Message */}
            {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-2xl text-red-600 text-xs font-bold animate-in fade-in slide-in-from-top-2">
                    {error}
                </div>
            )}

            <form className="space-y-5" onSubmit={handleRegister}>
                <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700">
                        {role === 'company' ? 'Company Name' : 'Full Name'}
                    </label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            {role === 'company' ? <Building2 className="h-5 w-5 text-gray-400" /> : <User className="h-5 w-5 text-gray-400" />}
                        </div>
                        <input
                            type="text"
                            required
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="block w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-brand-blue focus:border-transparent outline-none transition-all font-medium"
                            placeholder={role === 'company' ? "TechCorp Industries" : "Jane Doe"}
                        />
                    </div>
                </div>

                {role === 'influencer' && (
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-700">Instagram / TikTok Username</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <LinkIcon className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                                type="text"
                                required
                                value={handle}
                                onChange={(e) => setHandle(e.target.value)}
                                className="block w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-brand-blue focus:border-transparent outline-none transition-all font-medium"
                                placeholder="@username"
                            />
                        </div>
                    </div>
                )}

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
                    <label className="text-sm font-bold text-gray-700">Password</label>
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
                            placeholder="Create a strong password"
                        />
                    </div>
                </div>

                <div className="flex items-center gap-3 py-2">
                    <input type="checkbox" required className="w-5 h-5 rounded border-gray-300 text-brand-blue focus:ring-brand-blue" />
                    <span className="text-sm text-gray-500 font-medium">
                        I agree to the <a href="#" className="font-bold text-brand-blue">Terms</a> and <a href="#" className="font-bold text-brand-blue">Privacy Policy</a>
                    </span>
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-brand-blue hover:bg-brand-blue/90 disabled:opacity-50 text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-brand-blue/20 flex items-center justify-center"
                >
                    {loading ? (
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    ) : 'Create Account'}
                </button>

                <p className="text-center text-gray-500 font-medium pt-4">
                    Already have an account?{' '}
                    <Link to="/login" className="text-brand-blue font-bold hover:text-brand-indigo">
                        Sign In
                    </Link>
                </p>
            </form>
        </AuthLayout>
    );
};
