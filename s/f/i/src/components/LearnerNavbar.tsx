import { Link, useLocation } from 'react-router-dom';
import { GraduationCap, Trophy, User, Bell, Search } from 'lucide-react';
import { useUser } from '../context/UserContext';

export const LearnerNavbar = () => {
    const { profile } = useUser();
    const location = useLocation();

    const isDashboard = location.pathname === '/company-dashboard';
    const isCourses = location.pathname === '/company/courses';

    return (
        <nav className="h-16 bg-white/70 backdrop-blur-2xl border-b border-gray-100 flex items-center justify-between px-[5%] sticky top-0 z-50">
            <div className="flex items-center gap-8">
                <Link to="/company-dashboard" className="flex items-center gap-2 group">
                    <div className="w-9 h-9 bg-black rounded-xl flex items-center justify-center group-hover:rotate-12 transition-all duration-500">
                        <GraduationCap className="w-5 h-5 text-brand-blue" />
                    </div>
                    <span className="text-xl font-black tracking-tighter text-gray-900 leading-none">
                        Learn<span className="text-brand-blue">Sphere</span>
                    </span>
                </Link>

                <div className="hidden lg:flex items-center p-1 bg-gray-50 rounded-xl border border-gray-100">
                    <Link
                        to="/company-dashboard"
                        className={`px-6 py-1.5 rounded-lg text-[11px] font-black uppercase tracking-widest transition-all ${isDashboard
                            ? 'bg-white text-brand-blue shadow-sm'
                            : 'text-gray-400 hover:text-gray-900'
                            }`}
                    >
                        Overview
                    </Link>
                    <Link
                        to="/company/courses"
                        className={`px-6 py-1.5 rounded-lg text-[11px] font-black uppercase tracking-widest transition-all ${isCourses
                            ? 'bg-white text-brand-blue shadow-sm'
                            : 'text-gray-400 hover:text-gray-900'
                            }`}
                    >
                        Catalog
                    </Link>
                </div>
            </div>

            <div className="flex items-center gap-4">
                <div className="hidden md:flex items-center gap-2 pr-4 border-r border-gray-100">
                    <button className="w-9 h-9 rounded-xl flex items-center justify-center text-gray-400 hover:text-brand-blue transition-all">
                        <Search className="w-4 h-4" />
                    </button>
                    <button className="w-9 h-9 rounded-xl flex items-center justify-center text-gray-400 hover:text-brand-blue transition-all relative">
                        <Bell className="w-4 h-4" />
                        <span className="absolute top-2.5 right-2.5 w-1.5 h-1.5 bg-brand-blue rounded-full border border-white"></span>
                    </button>
                </div>

                <div className="flex items-center gap-3">
                    <div className="text-right hidden sm:block">
                        <div className="text-xs font-black text-gray-900 tracking-tight leading-none mb-0.5">
                            {profile?.name?.split(' ')[0] || 'Student'}
                        </div>
                        <div className="flex items-center justify-end gap-1 text-[8px] font-black text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded uppercase tracking-wider">
                            <Trophy className="w-2.5 h-2.5 fill-amber-500" />
                            45 XP
                        </div>
                    </div>
                    <Link to="/profile" className="w-9 h-9 bg-gray-900 rounded-xl flex items-center justify-center text-white font-black cursor-pointer hover:scale-105 active:scale-95 transition-all overflow-hidden relative">
                        <User className="w-5 h-5 relative z-10" />
                    </Link>
                </div>
            </div>
        </nav>
    );
};
