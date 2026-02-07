import { useState } from 'react';
import { User, Bell, Shield, Globe, Moon, Save, Camera, Mail, Lock } from 'lucide-react';

const Settings = () => {
    const [activeTab, setActiveTab] = useState('profile');

    // Form States
    const [name, setName] = useState('Admin User');
    const [email, setEmail] = useState('admin@learnsphere.com');
    const [bio, setBio] = useState('Senior Administrator at LearnSphere. Passionate about education technology.');

    const [notifications, setNotifications] = useState({
        email: true,
        push: true,
        weekly: false,
        studentUpdates: true
    });

    return (
        <div className="min-h-screen bg-gray-50/50">
            {/* Header */}
            <header className="bg-white/80 backdrop-blur-xl border-b border-gray-200 sticky top-0 z-40 transition-all duration-200">
                <div className="max-w-7xl mx-auto px-6 py-4">
                    <div>
                        <h1 className="text-xl font-bold text-gray-900 tracking-tight">Settings</h1>
                        <p className="text-xs text-gray-500 font-medium mt-0.5">Manage your account preferences and configurations</p>
                    </div>
                </div>
            </header>

            <div className="max-w-7xl mx-auto px-6 py-8">
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Sidebar Navigation */}
                    <div className="w-full lg:w-64 flex-shrink-0">
                        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden sticky top-24">
                            <div className="p-2 space-y-1">
                                {[
                                    { id: 'profile', icon: User, label: 'Profile Settings' },
                                    { id: 'notifications', icon: Bell, label: 'Notifications' },
                                    { id: 'security', icon: Shield, label: 'Security' },
                                    { id: 'preferences', icon: Globe, label: 'Preferences' },
                                ].map((item) => (
                                    <button
                                        key={item.id}
                                        onClick={() => setActiveTab(item.id)}
                                        className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium rounded-lg transition-all ${activeTab === item.id
                                                ? 'bg-blue-50 text-[#0ea5e9]'
                                                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                            }`}
                                    >
                                        <item.icon className="w-4 h-4" />
                                        {item.label}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Content Area */}
                    <div className="flex-1">
                        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                            {activeTab === 'profile' && (
                                <div className="p-6 md:p-8 animate-in fade-in slide-in-from-bottom-4 duration-300">
                                    <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                                        <User className="w-5 h-5 text-[#0ea5e9]" />
                                        Profile Information
                                    </h2>

                                    <div className="space-y-6">
                                        {/* Avatar Section */}
                                        <div className="flex items-center gap-6 pb-6 border-b border-gray-100">
                                            <div className="relative">
                                                <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-[#0ea5e9] to-[#6366f1] flex items-center justify-center text-white text-2xl font-black shadow-lg shadow-blue-500/20">
                                                    {name.charAt(0)}
                                                </div>
                                                <button className="absolute bottom-0 right-0 p-1.5 bg-white border border-gray-200 rounded-full text-gray-500 hover:text-[#0ea5e9] shadow-sm transition-colors">
                                                    <Camera className="w-3.5 h-3.5" />
                                                </button>
                                            </div>
                                            <div>
                                                <h3 className="text-sm font-bold text-gray-900">Profile Photo</h3>
                                                <p className="text-xs text-gray-500 mt-1 max-w-xs">Upload a new avatar or remove the current one. max size 2MB.</p>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div>
                                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Display Name</label>
                                                <div className="relative">
                                                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                                    <input
                                                        type="text"
                                                        value={name}
                                                        onChange={(e) => setName(e.target.value)}
                                                        className="w-full pl-9 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0ea5e9]/20 focus:border-[#0ea5e9] text-sm text-gray-900 font-medium transition-all"
                                                    />
                                                </div>
                                            </div>
                                            <div>
                                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Email Address</label>
                                                <div className="relative">
                                                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                                    <input
                                                        type="email"
                                                        value={email}
                                                        onChange={(e) => setEmail(e.target.value)}
                                                        className="w-full pl-9 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0ea5e9]/20 focus:border-[#0ea5e9] text-sm text-gray-900 font-medium transition-all"
                                                    />
                                                </div>
                                            </div>
                                            <div className="md:col-span-2">
                                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Bio</label>
                                                <textarea
                                                    value={bio}
                                                    onChange={(e) => setBio(e.target.value)}
                                                    rows={4}
                                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0ea5e9]/20 focus:border-[#0ea5e9] text-sm text-gray-900 font-medium transition-all"
                                                />
                                                <p className="text-[10px] text-gray-400 mt-1.5 text-right">250 characters max</p>
                                            </div>
                                        </div>

                                        <div className="flex justify-end pt-4 border-t border-gray-100">
                                            <button className="flex items-center gap-2 px-5 py-2.5 bg-[#0ea5e9] text-white rounded-lg text-sm font-bold shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30 hover:bg-[#0284c7] transition-all active:scale-95">
                                                <Save className="w-4 h-4" />
                                                Save Changes
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'notifications' && (
                                <div className="p-6 md:p-8 animate-in fade-in slide-in-from-bottom-4 duration-300">
                                    <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                                        <Bell className="w-5 h-5 text-[#0ea5e9]" />
                                        Notification Preferences
                                    </h2>
                                    <div className="space-y-6">
                                        {[
                                            { id: 'email', label: 'Email Notifications', desc: 'Receive daily summaries and important updates via email.' },
                                            { id: 'push', label: 'Push Notifications', desc: 'Get real-time alerts on your desktop.' },
                                            { id: 'weekly', label: 'Weekly Digest', desc: 'A weekly summary of your course performance.' },
                                            { id: 'studentUpdates', label: 'Student Activity', desc: 'Notifications when students complete courses or ask questions.' }
                                        ].map((item) => (
                                            <div key={item.id} className="flex items-start justify-between pb-4 border-b border-gray-50 last:border-0 last:pb-0">
                                                <div>
                                                    <h3 className="text-sm font-bold text-gray-900">{item.label}</h3>
                                                    <p className="text-xs text-gray-500 mt-0.5">{item.desc}</p>
                                                </div>
                                                <button
                                                    onClick={() => setNotifications(prev => ({ ...prev, [item.id]: !prev[item.id as keyof typeof notifications] }))}
                                                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[#0ea5e9] focus:ring-offset-2 ${notifications[item.id as keyof typeof notifications] ? 'bg-[#0ea5e9]' : 'bg-gray-200'
                                                        }`}
                                                >
                                                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${notifications[item.id as keyof typeof notifications] ? 'translate-x-6' : 'translate-x-1'
                                                        }`} />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {activeTab === 'security' && (
                                <div className="p-6 md:p-8 animate-in fade-in slide-in-from-bottom-4 duration-300">
                                    <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                                        <Shield className="w-5 h-5 text-[#0ea5e9]" />
                                        Security Settings
                                    </h2>
                                    <div className="space-y-6">
                                        <div>
                                            <h3 className="text-sm font-bold text-gray-900 mb-4">Change Password</h3>
                                            <div className="grid gap-4 max-w-md">
                                                <div className="relative">
                                                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                                    <input type="password" placeholder="Current Password" className="w-full pl-9 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0ea5e9]/20 focus:border-[#0ea5e9] transition-all" />
                                                </div>
                                                <div className="relative">
                                                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                                    <input type="password" placeholder="New Password" className="w-full pl-9 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0ea5e9]/20 focus:border-[#0ea5e9] transition-all" />
                                                </div>
                                                <div className="relative">
                                                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                                    <input type="password" placeholder="Confirm New Password" className="w-full pl-9 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0ea5e9]/20 focus:border-[#0ea5e9] transition-all" />
                                                </div>
                                                <button className="w-fit mt-2 px-5 py-2.5 bg-gray-900 text-white rounded-lg text-sm font-bold hover:bg-black transition-all">
                                                    Update Password
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'preferences' && (
                                <div className="p-6 md:p-8 animate-in fade-in slide-in-from-bottom-4 duration-300">
                                    <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                                        <Globe className="w-5 h-5 text-[#0ea5e9]" />
                                        Global Preferences
                                    </h2>
                                    <div className="space-y-6">
                                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100">
                                            <div className="flex items-center gap-3">
                                                <div className="p-2 bg-white rounded-lg border border-gray-200 text-gray-700">
                                                    <Moon className="w-5 h-5" />
                                                </div>
                                                <div>
                                                    <h3 className="text-sm font-bold text-gray-900">Dark Mode</h3>
                                                    <p className="text-xs text-gray-500">Enable dark theme for the dashboard</p>
                                                </div>
                                            </div>
                                            {/* Dummy Toggle */}
                                            <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-gray-200 transition-colors">
                                                <span className="inline-block h-4 w-4 transform rounded-full bg-white translate-x-1 transition-transform" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Settings;
