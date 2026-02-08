import { GraduationCap, Home, BarChart3, Users, User, Settings, LogOut, Bell, Search, ChevronRight, Wallet, BookOpen, Layers } from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useUser } from '../context/UserContext';

export const DashboardLayout = ({ children, role }: { children: React.ReactNode, role: 'company' | 'influencer' }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const { profile, loading } = useUser();

    const navItems = [
        ...(role === 'company' ? [
            { label: 'Overview', icon: Home, path: '/company-dashboard' },
            { label: 'Portal Setup', icon: Layers, path: '/company/ai-agent' },
            { label: 'Funds', icon: Wallet, path: '/company/funds' },
            { label: 'Instructors', icon: Users, path: '/company/influencers' },
            { label: 'Analytics', icon: BarChart3, path: '/company/analytics' },
            { label: 'Campaigns', icon: GraduationCap, path: '/company/campaigns' },
            { label: 'Settings', icon: Settings, path: '/settings' },
        ] : [
            { label: 'Courses', icon: BookOpen, path: '/influencer-dashboard' },
            { label: 'Reporting', icon: BarChart3, path: '/influencer-dashboard?tab=reporting' },
            { label: 'Profile', icon: User, path: '/influencer-dashboard?tab=profile' }
        ]),
    ];

    return (
        <div className="min-h-screen bg-[#F8FAFC] flex">
            {/* Sidebar */}
            <aside className="w-64 bg-white border-r border-gray-100 flex flex-col fixed h-full z-20 shadow-[1px_0_0_0_rgba(0,0,0,0.02)]">
                <div className="p-6">
                    <Link to="/" className="flex items-center gap-3 group">
                        <div className="w-9 h-9 bg-black rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                            <GraduationCap className="w-5 h-5 text-brand-blue" />
                        </div>
                        <span className="text-xl font-black tracking-tighter text-gray-900">
                            Learn<span className="text-brand-blue">Sphere</span>
                        </span>
                    </Link>
                </div>

                <div className="px-4 py-2">
                    <div className="text-[9px] font-black tracking-[0.2em] text-gray-400 uppercase mb-3 px-4">Menu</div>
                    <nav className="space-y-0.5">
                        {navItems.map((item) => (
                            <Link
                                key={item.label}
                                to={item.path}
                                className={`flex items-center justify-between p-3 rounded-xl group transition-all duration-200 ${location.pathname === item.path
                                    ? 'bg-brand-blue/5 text-brand-blue'
                                    : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
                                    }`}
                            >
                                <div className="flex items-center gap-3">
                                    <item.icon className={`w-4.5 h-4.5 ${location.pathname === item.path ? 'text-brand-blue' : 'text-gray-400 group-hover:text-gray-900'}`} />
                                    <span className="font-bold text-xs tracking-tight">{item.label}</span>
                                </div>
                                {location.pathname === item.path && <ChevronRight className="w-3.5 h-3.5" />}
                            </Link>
                        ))}
                    </nav>
                </div>

                <div className="mt-auto p-5 space-y-3">
                    {role !== 'influencer' && (
                        <div className="bg-gradient-to-br from-brand-blue to-brand-indigo p-5 rounded-xl text-white relative overflow-hidden shadow-lg shadow-brand-blue/10">
                            <div className="relative z-10">
                                <div className="text-[9px] font-bold text-white/50 mb-0.5 uppercase tracking-widest">Plan</div>
                                <div className="text-base font-black mb-2 italic border-b border-white/10 pb-2">Pro Account</div>
                                <button className="w-full py-2 bg-white rounded-lg text-brand-blue font-black text-[10px] uppercase tracking-widest transition-transform active:scale-95">Upgrade</button>
                            </div>
                        </div>
                    )}

                    <button
                        onClick={() => navigate('/')}
                        className="flex items-center gap-3 w-full p-3 rounded-xl text-red-500 hover:bg-red-50 font-bold text-xs transition-all"
                    >
                        <LogOut className="w-4.5 h-4.5" />
                        Sign Out
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 ml-64 min-h-screen">
                {/* Header */}
                <header className="h-16 bg-white/80 backdrop-blur-md border-b border-gray-100 flex items-center justify-between px-8 sticky top-0 z-10">
                    <div className="flex items-center gap-3 bg-gray-50 border border-gray-100 px-4 py-2 rounded-xl w-[320px] focus-within:ring-2 focus-within:ring-brand-blue/10 focus-within:border-brand-blue transition-all">
                        <Search className="w-3.5 h-3.5 text-gray-400" />
                        <input type="text" placeholder="Search operations..." className="bg-transparent border-none outline-none text-xs w-full font-medium" />
                    </div>

                    <div className="flex items-center gap-6">
                        <button className="w-9 h-9 flex items-center justify-center rounded-xl bg-gray-50 border border-gray-100 relative text-gray-400 hover:text-gray-600 transition-all">
                            <Bell className="w-4 h-4" />
                            <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
                        </button>
                        <div className="flex items-center gap-3">
                            <div className="text-right">
                                <div className="text-xs font-black text-gray-900 tracking-tight leading-tight">
                                    {loading ? (
                                        <div className="h-3 w-20 bg-gray-100 animate-pulse rounded"></div>
                                    ) : (
                                        profile?.name || (role === 'company' ? 'My Brand' : 'My Profile')
                                    )}
                                </div>
                                <div className="text-[9px] text-gray-400 font-bold lowercase tracking-widest opacity-60">
                                    {profile?.email || `${role} account`}
                                </div>
                            </div>
                            <div className="w-9 h-9 bg-brand-blue/10 border border-brand-blue/20 rounded-lg flex items-center justify-center font-black text-[10px] text-brand-blue">
                                {loading ? '...' : (profile?.name?.[0] || role[0]).toUpperCase()}
                            </div>
                        </div>
                    </div>
                </header>

                {/* Dash Page Content */}
                <div className="p-8">
                    {children}
                </div>
            </main>
        </div>
    );
};
