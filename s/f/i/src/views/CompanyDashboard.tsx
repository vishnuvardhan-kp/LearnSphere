import { DashboardLayout } from '../components/DashboardLayout';
import { ShieldCheck, UserX, TrendingUp, Plus, ArrowUpRight, Activity, Zap, Shield, BarChart3 } from 'lucide-react';
import { useUser } from '../context/UserContext';
import { useNavigate } from 'react-router-dom';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { LearnerDashboard } from '../components/LearnerDashboard';

const scanData = [
    { name: '08:00', scans: 45, threats: 2 },
    { name: '10:00', scans: 82, threats: 5 },
    { name: '12:00', scans: 124, threats: 12 },
    { name: '14:00', scans: 95, threats: 8 },
    { name: '16:00', scans: 156, threats: 4 },
    { name: '18:00', scans: 110, threats: 15 },
    { name: '20:00', scans: 60, threats: 1 },
];

export const CompanyDashboard = () => {
    const { profile } = useUser();
    const navigate = useNavigate();

    // Check if the user is a learner based on the token
    const isLearner = localStorage.getItem('botfree_token')?.startsWith('learner_token_');

    if (isLearner) {
        return <LearnerDashboard />;
    }

    return (
        <DashboardLayout role="company">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
                <div>
                    <h1 className="text-3xl font-black text-gray-900 tracking-tight mb-2">
                        Welcome, <span className="text-gradient">{profile?.name || 'Brand Central'}</span>
                    </h1>
                    <p className="text-sm text-gray-500 font-medium max-w-md">Your marketing ecosystem is currently <span className="text-brand-blue font-bold">fully protected</span> by AI-driven scrubbing.</p>
                </div>
                <div className="flex items-center gap-3">
                    <button className="p-3 bg-white border-2 border-gray-100 rounded-2xl text-gray-400 hover:text-brand-blue hover:border-brand-blue/30 transition-all shadow-sm">
                        <BarChart3 className="w-5 h-5" />
                    </button>
                    <button
                        onClick={() => navigate('/create-campaign')}
                        className="btn-primary group flex items-center gap-2 whitespace-nowrap"
                    >
                        <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
                        New Campaign
                    </button>
                </div>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                {[
                    { label: 'Scans Run', value: '1,248', icon: ShieldCheck, color: 'text-brand-blue', bg: 'bg-brand-blue/10', change: '+12.5%', trend: 'up' },
                    { label: 'Bots Blocked', value: '84', icon: UserX, color: 'text-red-500', bg: 'bg-red-50', change: '+5.2%', trend: 'up' },
                    { label: 'Saved Budget', value: '$2,450', icon: TrendingUp, color: 'text-green-600', bg: 'bg-green-50', change: '+$420', trend: 'up' },
                    { label: 'System Health', value: '100%', icon: Zap, color: 'text-orange-500', bg: 'bg-orange-50', change: 'Stable', trend: 'stable' }
                ].map((stat, idx) => (
                    <div key={idx} className="card-compact group">
                        <div className="flex justify-between items-start mb-6">
                            <div className={`w-12 h-12 ${stat.bg} ${stat.color} rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110 duration-300 shadow-sm`}>
                                <stat.icon className="w-6 h-6" />
                            </div>
                            <div className={`badge ${stat.trend === 'up' ? 'badge-success' :
                                stat.trend === 'down' ? 'badge-danger' : 'badge-info'
                                }`}>
                                {stat.change}
                            </div>
                        </div>
                        <div className="space-y-1">
                            <h4 className="text-3xl font-black text-gray-900 tracking-tight leading-none">{stat.value}</h4>
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest leading-none">{stat.label}</p>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
                {/* Analytics Chart */}
                <div className="lg:col-span-2 space-y-8">
                    <div className="card h-full min-h-[400px]">
                        <div className="flex justify-between items-center mb-10">
                            <div>
                                <h3 className="text-xl font-black tracking-tight mb-1">Protection Activity</h3>
                                <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">Real-time scan frequency (Last 24h)</p>
                            </div>
                            <div className="flex gap-2">
                                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 rounded-lg border border-gray-100">
                                    <div className="w-2 h-2 rounded-full bg-brand-blue"></div>
                                    <span className="text-[10px] font-black text-gray-500 uppercase tracking-tighter">Total Scans</span>
                                </div>
                            </div>
                        </div>

                        <div className="h-[280px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={scanData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                                    <defs>
                                        <linearGradient id="colorScans" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.1} />
                                            <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="#f3f4f6" />
                                    <XAxis
                                        dataKey="name"
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fontSize: 10, fill: '#9ca3af', fontWeight: 900 }}
                                        dy={10}
                                    />
                                    <YAxis
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fontSize: 10, fill: '#9ca3af', fontWeight: 900 }}
                                    />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: 'white', border: 'none', borderRadius: '16px', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)', padding: '12px' }}
                                        labelStyle={{ fontWeight: 900, fontSize: '12px', color: '#111827', marginBottom: '4px' }}
                                    />
                                    <Area
                                        type="monotone"
                                        dataKey="scans"
                                        stroke="#0ea5e9"
                                        strokeWidth={3}
                                        fillOpacity={1}
                                        fill="url(#colorScans)"
                                        animationDuration={2000}
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>

                {/* Live Logs Sidebar */}
                <div className="space-y-8">
                    <div className="card h-full flex flex-col">
                        <div className="flex justify-between items-center mb-8">
                            <h3 className="text-xl font-black tracking-tight">Security Logs</h3>
                            <div className="flex items-center gap-2 px-3 py-1 bg-green-50 rounded-full border border-green-100">
                                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                                <span className="text-[10px] font-black uppercase tracking-widest text-green-700">Live</span>
                            </div>
                        </div>

                        <div className="space-y-4 flex-1 overflow-y-auto pr-2 custom-scrollbar">
                            {[
                                { type: 'BLOCK', msg: 'Bot IP 192.168.1.1 blocked from "Fall Collection"', time: '2m ago', color: 'text-red-500', bg: 'bg-red-50' },
                                { type: 'VERIFY', msg: 'Verified reach for "Tech Review" - 4.2k nodes', time: '12m ago', color: 'text-blue-500', bg: 'bg-blue-50' },
                                { type: 'SCRUB', msg: 'Removed 14 suspicious profiles from audience', time: '24m ago', color: 'text-orange-500', bg: 'bg-orange-50' },
                                { type: 'AUTH', msg: 'New influencer validated for "Brand Refresh"', time: '45m ago', color: 'text-green-600', bg: 'bg-green-50' },
                            ].map((log, i) => (
                                <div key={i} className="flex gap-4 p-4 rounded-2xl hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-100 group">
                                    <div className={`w-10 h-10 ${log.bg} rounded-xl shrink-0 flex items-center justify-center transition-transform group-hover:scale-110`}>
                                        <Shield className={`w-5 h-5 ${log.color}`} />
                                    </div>
                                    <div className="min-w-0">
                                        <div className="flex items-center gap-2 mb-0.5">
                                            <span className={`text-[8px] font-black px-1.5 py-0.5 rounded ${log.bg} ${log.color}`}>{log.type}</span>
                                            <span className="text-[9px] text-gray-400 font-bold uppercase tracking-tight">{log.time}</span>
                                        </div>
                                        <p className="text-[11px] font-bold text-gray-700 leading-snug line-clamp-2">{log.msg}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="mt-8 pt-8 border-t border-gray-100">
                            <button className="w-full py-3 bg-gray-50 hover:bg-gray-100 rounded-xl text-[10px] text-gray-400 font-black uppercase tracking-widest transition-all">
                                View Full Security Audit
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Campaign Grid Area */}
            <div className="card">
                <div className="flex justify-between items-center mb-8">
                    <div className="flex items-center gap-3">
                        <Activity className="w-6 h-6 text-brand-blue" />
                        <h3 className="text-xl font-black tracking-tight">Featured Campaigns</h3>
                    </div>
                </div>

                <div className="flex flex-col items-center justify-center py-20 text-center border-2 border-dashed border-gray-100 rounded-3xl group hover:border-brand-blue/20 transition-all">
                    <div className="w-20 h-20 bg-gray-50 group-hover:bg-brand-blue/5 rounded-full flex items-center justify-center mb-6 transition-colors duration-500">
                        <Zap className="w-10 h-10 text-gray-200 group-hover:text-brand-blue group-hover:animate-pulse transition-colors" />
                    </div>
                    <h4 className="text-lg font-black text-gray-900 mb-2 tracking-tight">Ready to launch?</h4>
                    <p className="text-sm text-gray-500 font-medium px-12 max-w-sm mb-8">
                        Connect with creators from your network and start your first AI-protected campaign to begin monitoring reach.
                    </p>
                    <button
                        onClick={() => navigate('/create-campaign')}
                        className="flex items-center gap-2 text-brand-blue font-black text-xs uppercase tracking-widest hover:gap-3 transition-all"
                    >
                        Create Your First Campaign <ArrowUpRight className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </DashboardLayout>
    );
};
