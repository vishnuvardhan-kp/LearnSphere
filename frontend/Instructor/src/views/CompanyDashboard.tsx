import { DashboardLayout } from '../components/DashboardLayout';
import { ShieldCheck, UserX, TrendingUp, AlertCircle, MoreVertical } from 'lucide-react';
import { useUser } from '../context/UserContext';

export const CompanyDashboard = () => {
    const { profile } = useUser();
    return (
        <DashboardLayout role="company">
            <div className="flex items-end justify-between mb-8">
                <div>
                    <h1 className="text-2xl font-black text-gray-900 tracking-tighter mb-1">{profile?.name || 'Brand Central'}</h1>
                    <p className="text-xs text-gray-500 font-medium">Protecting your marketing ecosystem in real-time.</p>
                </div>
                <button className="bg-black hover:bg-gray-800 text-white px-6 py-2.5 rounded-xl font-black text-[9px] uppercase tracking-[0.15em] transition-all shadow-lg active:scale-95">
                    Create Campaign
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {[
                    { label: 'Scans Run', value: '0', icon: ShieldCheck, color: 'text-brand-blue', bg: 'bg-brand-blue/10', change: '0%' },
                    { label: 'Bots Blocked', value: '0', icon: UserX, color: 'text-red-500', bg: 'bg-red-50', change: '0%' },
                    { label: 'Saved Budget', value: '$0', icon: TrendingUp, color: 'text-green-600', bg: 'bg-green-50', change: '0%' },
                    { label: 'High Risk', value: '0', icon: AlertCircle, color: 'text-orange-500', bg: 'bg-orange-50', change: '0' }
                ].map((stat, idx) => (
                    <div key={idx} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm group hover:shadow-premium transition-all duration-300">
                        <div className="flex justify-between items-start mb-4">
                            <div className={`w-11 h-11 ${stat.bg} ${stat.color} rounded-xl flex items-center justify-center transition-transform group-hover:scale-110`}>
                                <stat.icon className="w-5.5 h-5.5" />
                            </div>
                            <div className={`text-[9px] font-black px-1.5 py-0.5 rounded-md ${stat.change.startsWith('+') ? 'bg-green-100 text-green-600' : stat.change === '0%' ? 'bg-gray-100 text-gray-400' : 'bg-red-100 text-red-600'}`}>
                                {stat.change}
                            </div>
                        </div>
                        <div className="text-2xl font-black text-gray-900 tracking-tight mb-0.5">{stat.value}</div>
                        <div className="text-[9px] font-black text-gray-400 uppercase tracking-[0.15em]">{stat.label}</div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-lg font-black tracking-tight">Active Campaigns</h3>
                        <button className="text-gray-400 hover:text-gray-900 transition-colors"><MoreVertical className="w-4.5 h-4.5" /></button>
                    </div>
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                        <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                            <ShieldCheck className="w-8 h-8 text-gray-200" />
                        </div>
                        <h4 className="text-sm font-black text-gray-900 mb-1">No Active Campaigns</h4>
                        <p className="text-[10px] text-gray-400 font-medium px-8">Start your first AI-protected campaign to see results here.</p>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-lg font-black tracking-tight">Real-time Logs</h3>
                        <div className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 bg-gray-200 rounded-full"></span>
                            <span className="text-[9px] font-black uppercase tracking-widest text-gray-400">Waiting for Data</span>
                        </div>
                    </div>
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                        <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                            <AlertCircle className="w-8 h-8 text-gray-200" />
                        </div>
                        <h4 className="text-sm font-black text-gray-900 mb-1">No Activity Yet</h4>
                        <p className="text-[10px] text-gray-400 font-medium px-8">Real-time scan logs will appear once your campaign is live.</p>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};
