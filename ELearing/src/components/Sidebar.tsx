import { LayoutDashboard, BookOpen, Users, Settings, LogOut, ChevronLeft, ChevronRight, GraduationCap, BarChart3 } from 'lucide-react';
import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const Sidebar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [collapsed, setCollapsed] = useState(false);

    const menuItems = [
        { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
        { icon: BookOpen, label: 'Courses', path: '/courses' },
        { icon: GraduationCap, label: 'Instructors', path: '/instructor' },
        { icon: Users, label: 'Learners', path: '/learners' },
        { icon: BarChart3, label: 'Analytics', path: '/analytics' },
        { icon: Settings, label: 'Settings', path: '/settings' },
    ];

    const isActive = (path: string) => location.pathname === path;

    return (
        <div
            className={`h-screen bg-white border-r border-gray-200 flex flex-col transition-all duration-300 ${collapsed ? 'w-20' : 'w-64'
                } sticky top-0 left-0 z-50`}
        >
            <div className={`p-6 flex items-center ${collapsed ? 'flex-col gap-4 justify-center' : 'justify-between'}`}>
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#0ea5e9] to-[#6366f1] flex items-center justify-center text-white font-black text-lg shadow-lg shadow-blue-500/20 shrink-0">
                        L
                    </div>
                    {!collapsed && <span className="font-bold text-xl tracking-tight text-gray-900 whitespace-nowrap">LearnSphere</span>}
                </div>

                <button
                    onClick={() => setCollapsed(!collapsed)}
                    className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500 transition-colors"
                >
                    {collapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
                </button>
            </div>

            <div className="flex-1 px-3 py-4 space-y-1">
                {menuItems.map((item) => (
                    <button
                        key={item.path}
                        onClick={() => navigate(item.path)}
                        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group relative ${isActive(item.path)
                            ? 'bg-[#0ea5e9]/10 text-[#0ea5e9] font-semibold'
                            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                            }`}
                        title={collapsed ? item.label : ''}
                    >
                        <item.icon className={`w-5 h-5 transition-transform duration-200 ${isActive(item.path) ? 'scale-110' : 'group-hover:scale-110'}`} />

                        {!collapsed && (
                            <span className="text-sm tracking-wide">{item.label}</span>
                        )}

                        {collapsed && isActive(item.path) && (
                            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-[#0ea5e9] rounded-r-full" />
                        )}
                    </button>
                ))}
            </div>

            <div className="p-4 border-t border-gray-100">
                <button
                    onClick={() => navigate('/login')}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-red-500 hover:bg-red-50 transition-colors ${collapsed ? 'justify-center' : ''}`}
                >
                    <LogOut className="w-5 h-5" />
                    {!collapsed && <span className="text-sm font-semibold">Sign Out</span>}
                </button>
            </div>
        </div>
    );
};

export default Sidebar;
