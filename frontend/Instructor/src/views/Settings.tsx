import React from 'react';
import { DashboardLayout } from '../components/DashboardLayout';
import { User, Shield, Bell, CreditCard, Mail, Lock, Camera } from 'lucide-react';

import { useUser } from '../context/UserContext';
import { useState, useEffect } from 'react';

export const Settings = () => {
    const [activeTab, setActiveTab] = React.useState('profile');
    const { profile, refreshProfile } = useUser();

    // Form State
    const [formData, setFormData] = useState({
        name: '',
        industry: '',
        email: '',
        bio: ''
    });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    // Load initial data
    useEffect(() => {
        if (profile) {
            setFormData({
                name: profile.name || '',
                industry: profile.onboardingData?.industry || '',
                email: profile.email || '',
                bio: profile.onboardingData?.bio || ''
            });
        }
    }, [profile]);

    const handleUpdateProfile = async () => {
        setLoading(true);
        setMessage({ type: '', text: '' });

        try {
            const token = localStorage.getItem('botfree_token');
            const response = await fetch('http://localhost:5000/api/onboarding/update', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(formData)
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.message || 'Failed to update profile');
            }

            await refreshProfile();
            setMessage({ type: 'success', text: 'Profile updated successfully!' });
        } catch (err: any) {
            setMessage({ type: 'error', text: err.message });
        } finally {
            setLoading(false);
        }
    };

    const tabs = [
        { id: 'profile', label: 'Profile', icon: User },
        { id: 'account', label: 'Account Security', icon: Shield },
        { id: 'notifications', label: 'Notifications', icon: Bell },
        { id: 'billing', label: 'Billing & Plans', icon: CreditCard },
    ];

    return (
        <DashboardLayout role="company">
            <div className="mb-8">
                <h1 className="text-2xl font-black text-gray-900 tracking-tighter mb-1">Settings</h1>
                <p className="text-xs text-gray-500 font-medium tracking-tight">Manage profile, security, and preferences.</p>
            </div>

            <div className="flex flex-col lg:flex-row gap-8">
                {/* Fixed Tabs Sidebar */}
                <div className="lg:w-60 shrink-0">
                    <div className="bg-white rounded-2xl border border-gray-100 p-3 shadow-sm space-y-1">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all duration-200 group ${activeTab === tab.id
                                    ? 'bg-brand-blue/5 text-brand-blue'
                                    : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
                                    }`}
                            >
                                <tab.icon className={`w-4 h-4 ${activeTab === tab.id ? 'text-brand-blue' : 'text-gray-400 group-hover:text-gray-900'}`} />
                                <span className="font-bold text-xs">{tab.label}</span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Content Area */}
                <div className="flex-1 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden p-8">
                    {activeTab === 'profile' && (
                        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <div>
                                <h3 className="text-xl font-black tracking-tight mb-6">Profile Information</h3>
                                {message.text && (
                                    <div className={`mb-6 p-4 rounded-xl text-xs font-bold ${message.type === 'success' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                                        {message.text}
                                    </div>
                                )}
                                <div className="flex items-center gap-8">
                                    <div className="relative group cursor-pointer">
                                        <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center border-2 border-dashed border-gray-200 group-hover:border-brand-blue transition-colors">
                                            <div className="text-2xl font-black text-gray-400 group-hover:text-brand-blue">
                                                {(profile?.name?.[0] || 'C').toUpperCase()}
                                            </div>
                                        </div>
                                        <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-black rounded-lg flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform">
                                            <Camera className="w-3 h-3" />
                                        </div>
                                    </div>
                                    <div>
                                        <div className="text-sm font-black text-gray-900 mb-0.5">Company Avatar</div>
                                        <div className="text-[9px] text-gray-400 font-bold uppercase tracking-widest leading-relaxed">JPG or PNG. Max size 2MB.</div>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-3">
                                    <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest px-1">Company Name</label>
                                    <input
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        placeholder="TechCorp Brand"
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl outline-none font-bold text-gray-900 text-xs focus:ring-2 focus:ring-brand-blue/10 focus:border-brand-blue transition-all"
                                    />
                                </div>
                                <div className="space-y-3">
                                    <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest px-1">Primary Industry</label>
                                    <select
                                        value={formData.industry}
                                        onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl outline-none font-bold text-gray-900 text-xs focus:ring-2 focus:ring-brand-blue/10 focus:border-brand-blue transition-all cursor-pointer"
                                    >
                                        <option value="">Select Industry</option>
                                        <option value="SaaS & Tech">SaaS & Tech</option>
                                        <option value="E-commerce">E-commerce</option>
                                        <option value="Fintech">Fintech</option>
                                        <option value="Agency">Agency</option>
                                        <option value="Gaming">Gaming</option>
                                        <option value="Health">Health</option>
                                        <option value="Crypto">Crypto</option>
                                        <option value="Automotive">Automotive</option>
                                        <option value="Media">Media</option>
                                        <option value="Other">Other</option>
                                    </select>
                                </div>
                                <div className="space-y-3 md:col-span-2">
                                    <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest px-1">Company Email</label>
                                    <div className="relative">
                                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
                                        <input
                                            type="email"
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                            placeholder="hello@techcorp.com"
                                            className="w-full pl-12 px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl outline-none font-bold text-gray-900 text-xs focus:ring-2 focus:ring-brand-blue/10 focus:border-brand-blue transition-all"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-3 md:col-span-2">
                                    <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest px-1">Company Bio</label>
                                    <textarea
                                        value={formData.bio}
                                        onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                                        placeholder="Tell us about your brand vision..."
                                        className="w-full p-4 bg-gray-50 border border-gray-100 rounded-xl outline-none font-bold text-gray-900 text-xs focus:ring-2 focus:ring-brand-blue/10 focus:border-brand-blue transition-all h-24 resize-none"
                                    ></textarea>
                                </div>
                            </div>

                            <div className="pt-6 border-t border-gray-50 flex justify-end">
                                <button
                                    onClick={handleUpdateProfile}
                                    disabled={loading}
                                    className="bg-black hover:bg-gray-800 disabled:opacity-50 text-white px-6 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-[0.2em] transition-all shadow-lg active:scale-95 flex items-center gap-2"
                                >
                                    {loading ? (
                                        <>
                                            <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                            Saving...
                                        </>
                                    ) : 'Save Changes'}
                                </button>
                            </div>
                        </div>
                    )}

                    {activeTab === 'account' && (
                        <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <div>
                                <h3 className="text-2xl font-black tracking-tight mb-8">Password & Security</h3>
                                <p className="text-gray-500 font-medium mb-10">Ensure your account is using a long, random password to stay secure.</p>

                                <div className="space-y-8 max-w-xl">
                                    <div className="space-y-4">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-2">Current Password</label>
                                        <div className="relative">
                                            <Lock className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300" />
                                            <input type="password" placeholder="••••••••" className="w-full pl-16 p-5 bg-gray-50 border border-gray-100 rounded-[1.25rem] outline-none font-bold text-gray-900 focus:ring-2 focus:ring-brand-blue/10 focus:border-brand-blue transition-all" />
                                        </div>
                                    </div>
                                    <div className="space-y-4">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-2">New Password</label>
                                        <div className="relative">
                                            <Lock className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300" />
                                            <input type="password" placeholder="••••••••" className="w-full pl-16 p-5 bg-gray-50 border border-gray-100 rounded-[1.25rem] outline-none font-bold text-gray-900 focus:ring-2 focus:ring-brand-blue/10 focus:border-brand-blue transition-all" />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="pt-8 border-t border-gray-50 flex justify-end">
                                <button className="bg-black hover:bg-gray-800 text-white px-10 py-5 rounded-[1.5rem] font-black text-xs uppercase tracking-[0.2em] transition-all shadow-xl shadow-gray-200">
                                    Update Security
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </DashboardLayout>
    );
};
