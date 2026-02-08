import { useNavigate } from 'react-router-dom';
import {
    User, Mail, Shield, Award,
    Settings, LogOut, ChevronRight,
    Clock, BookOpen, Star, Sparkles
} from 'lucide-react';
import { useUser } from '../context/UserContext';
import { LearnerNavbar } from '../components/LearnerNavbar';

export const Profile = () => {
    const { profile } = useUser();
    const navigate = useNavigate();

    const stats = [
        { label: "Courses Completed", value: "8", icon: BookOpen, color: "text-blue-500", bg: "bg-blue-50" },
        { label: "Learning Hours", value: "48h", icon: Clock, color: "text-purple-500", bg: "bg-purple-50" },
        { label: "Skill Points", value: "1,250", icon: Award, color: "text-amber-500", bg: "bg-amber-50" },
        { label: "Global Rank", value: "#42", icon: Star, color: "text-emerald-500", bg: "bg-emerald-50" }
    ];

    const handleLogout = () => {
        localStorage.removeItem('botfree_token');
        localStorage.removeItem('botfree_user');
        localStorage.removeItem('botfree_role');
        window.location.href = '/login';
    };

    return (
        <div className="min-h-screen bg-[#fcfcfd]">
            <LearnerNavbar />

            <main className="w-full max-w-5xl mx-auto px-[5%] py-12">
                {/* Profile Hero */}
                <div className="bg-white rounded-[40px] p-10 border border-gray-100 shadow-xl shadow-gray-200/50 mb-10 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-brand-blue/5 blur-[100px] -mr-32 -mt-32"></div>

                    <div className="relative z-10 flex flex-col md:flex-row items-center gap-10">
                        <div className="relative">
                            <div className="w-32 h-32 bg-gray-900 rounded-[40px] flex items-center justify-center text-white ring-8 ring-gray-50 overflow-hidden transform group-hover:rotate-6 transition-transform duration-700">
                                <User className="w-16 h-16" />
                            </div>
                            <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-brand-blue rounded-2xl flex items-center justify-center border-4 border-white text-white shadow-lg">
                                <Sparkles className="w-4 h-4 fill-white" />
                            </div>
                        </div>

                        <div className="flex-1 text-center md:text-left space-y-4">
                            <div className="space-y-1">
                                <h1 className="text-4xl font-black text-gray-900 tracking-tight italic">
                                    {profile?.name || 'Institutional Student'}
                                </h1>
                                <p className="text-gray-400 font-bold uppercase tracking-[0.2em] text-[10px] flex items-center justify-center md:justify-start gap-2">
                                    <Shield className="w-3 h-3" /> Professional Account
                                </p>
                            </div>

                            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
                                <div className="px-4 py-2 bg-gray-50 rounded-2xl border border-gray-100 flex items-center gap-2">
                                    <Mail className="w-3.5 h-3.5 text-gray-400" />
                                    <span className="text-xs font-black text-gray-500">{profile?.email || 'admin@learnsphere.io'}</span>
                                </div>
                                <button
                                    onClick={() => navigate('/settings')}
                                    className="px-4 py-2 bg-brand-blue/10 text-brand-blue rounded-2xl border border-brand-blue/20 text-xs font-black uppercase tracking-widest hover:bg-brand-blue hover:text-white transition-all"
                                >
                                    Edit Profile
                                </button>
                            </div>
                        </div>

                        <div className="flex flex-col gap-3 w-full md:w-auto">
                            <button
                                onClick={handleLogout}
                                className="px-8 py-4 bg-gray-900 text-white rounded-[24px] font-black uppercase tracking-widest text-[10px] flex items-center justify-center gap-3 hover:bg-red-500 transition-all shadow-xl shadow-gray-200"
                            >
                                <LogOut className="w-4 h-4" /> Secure Logout
                            </button>
                        </div>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                    {stats.map((stat, i) => (
                        <div key={i} className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm hover:translate-y-[-5px] transition-all">
                            <div className={`w-12 h-12 ${stat.bg} ${stat.color} rounded-2xl flex items-center justify-center mb-6`}>
                                <stat.icon className="w-6 h-6" />
                            </div>
                            <div className="text-2xl font-black text-gray-900 tracking-tight mb-1">{stat.value}</div>
                            <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{stat.label}</div>
                        </div>
                    ))}
                </div>

                {/* Account Actions */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="bg-white rounded-[32px] border border-gray-100 p-8 space-y-6">
                        <h3 className="text-lg font-black text-gray-900 tracking-tight flex items-center gap-3 italic">
                            <Settings className="w-5 h-5 text-brand-blue" /> Account Settings
                        </h3>
                        <div className="space-y-2">
                            {[
                                "Privacy Preferences",
                                "Notification Logic",
                                "Linked Institutional Accounts",
                                "API Authentication Tokens"
                            ].map((item, i) => (
                                <button key={i} className="w-full p-4 rounded-2xl hover:bg-gray-50 flex items-center justify-between group transition-all">
                                    <span className="text-sm font-bold text-gray-600 italic">{item}</span>
                                    <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-brand-blue transition-colors" />
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="bg-white rounded-[32px] border border-gray-100 p-8 space-y-6">
                        <h3 className="text-lg font-black text-gray-900 tracking-tight flex items-center gap-3 italic">
                            <Shield className="w-5 h-5 text-emerald-500" /> Security Intelligence
                        </h3>
                        <div className="space-y-4">
                            <div className="p-5 bg-emerald-50 rounded-2xl border border-emerald-100">
                                <div className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mb-1 flex items-center gap-2">
                                    <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div> Verified Status
                                </div>
                                <p className="text-xs font-bold text-emerald-800 italic">Your account is secured with Grade-A encryption and biometric verification hooks.</p>
                            </div>
                            <button className="w-full py-4 text-brand-blue font-black text-[10px] uppercase tracking-widest border-2 border-dashed border-brand-blue/20 rounded-2xl hover:bg-brand-blue/5 transition-all">
                                Update Security Protocols
                            </button>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};
