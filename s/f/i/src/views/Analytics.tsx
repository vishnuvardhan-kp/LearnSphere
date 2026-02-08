import { DashboardLayout } from '../components/DashboardLayout';
import { Users, Zap, MousePointer2 } from 'lucide-react';

export const Analytics = () => {
    return (
        <DashboardLayout role="company">
            <div className="flex items-end justify-between mb-8">
                <div>
                    <h1 className="text-2xl font-black text-gray-900 tracking-tighter mb-1">Advanced Analytics</h1>
                    <p className="text-xs text-gray-500 font-medium">Deep-dive into performance and bot detection metrics.</p>
                </div>
                <div className="flex gap-3">
                    <select className="bg-white border border-gray-100 px-4 py-2 rounded-xl font-bold text-xs outline-none cursor-pointer hover:border-brand-blue/20 transition-all">
                        <option>Last 7 Days</option>
                        <option>Last 30 Days</option>
                        <option>Last Quarter</option>
                    </select>
                    <button className="bg-black hover:bg-gray-800 text-white px-6 py-2.5 rounded-xl font-black text-[9px] uppercase tracking-[0.15em] transition-all shadow-lg active:scale-95">
                        Export Report
                    </button>
                </div>
            </div>

            {/* Performance Overview */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-8">
                {[
                    { label: 'Total Reach', value: '2.4M', change: '+14.2%', icon: Users, color: 'text-brand-blue', bg: 'bg-brand-blue/10' },
                    { label: 'Avg. Engagement', value: '18.5%', change: '+2.1%', icon: MousePointer2, color: 'text-brand-indigo', bg: 'bg-brand-indigo/10' },
                    { label: 'Authenticity Score', value: '94.2%', change: '+0.8%', icon: ShieldCheck, color: 'text-green-600', bg: 'bg-green-50' },
                    { label: 'Bot Frequency', value: '2.1%', change: '-0.4%', icon: Zap, color: 'text-red-500', bg: 'bg-red-50' }
                ].map((stat, i) => (
                    <div key={i} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                        <div className="flex justify-between items-start mb-4">
                            <div className={`w-11 h-11 ${stat.bg} ${stat.color} rounded-xl flex items-center justify-center`}>
                                <stat.icon className="w-5.5 h-5.5" />
                            </div>
                            <div className={`text-[9px] font-black px-1.5 py-0.5 rounded-md ${stat.change.startsWith('+') ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                                {stat.change}
                            </div>
                        </div>
                        <div className="text-2xl font-black text-gray-900 mb-0.5 tracking-tight">{stat.value}</div>
                        <div className="text-[9px] font-black text-gray-400 uppercase tracking-widest">{stat.label}</div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                {/* Traffic Attribution Simulation */}
                <div className="lg:col-span-2 bg-white p-8 rounded-2xl border border-gray-100 shadow-sm relative overflow-hidden">
                    <div className="flex justify-between items-center mb-8 relative z-10">
                        <h3 className="text-xl font-black tracking-tight">Traffic Growth</h3>
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2">
                                <div className="w-2.5 h-2.5 bg-brand-blue rounded-full"></div>
                                <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Organic</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-2.5 h-2.5 bg-brand-indigo rounded-full"></div>
                                <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Influencer</span>
                            </div>
                        </div>
                    </div>

                    {/* Simulated Chart Area */}
                    <div className="h-[240px] flex items-end gap-3 relative z-10">
                        {Array.from({ length: 12 }).map((_, i) => (
                            <div key={i} className="flex-1 flex flex-col gap-1 items-center group cursor-pointer">
                                <div className="w-full flex flex-col-reverse gap-1 h-full">
                                    <div
                                        className="w-full bg-brand-indigo/10 group-hover:bg-brand-indigo/30 transition-all rounded-t-md"
                                        style={{ height: `${Math.random() * 40 + 20}%` }}
                                    ></div>
                                    <div
                                        className="w-full bg-brand-blue rounded-t-md group-hover:scale-y-105 transition-transform origin-bottom"
                                        style={{ height: `${Math.random() * 30 + 10}%` }}
                                    ></div>
                                </div>
                                <span className="text-[7px] font-black text-gray-300 mt-3 uppercase">M{i + 1}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Geographical reach */}
                <div className="bg-gray-900 p-8 rounded-2xl text-white relative overflow-hidden">
                    <div className="relative z-10">
                        <h3 className="text-xl font-black tracking-tight mb-6">Global Impact</h3>
                        <div className="space-y-4">
                            {[
                                { country: 'United States', reach: '42%', color: 'bg-brand-blue' },
                                { country: 'United Kingdom', reach: '28%', color: 'bg-brand-indigo' },
                                { country: 'Germany', reach: '15%', color: 'bg-white' },
                                { country: 'Japan', reach: '10%', color: 'bg-emerald-400' },
                                { country: 'Australia', reach: '5%', color: 'bg-orange-400' }
                            ].map((item, i) => (
                                <div key={i} className="space-y-1.5">
                                    <div className="flex justify-between items-center text-[9px] font-black uppercase tracking-widest">
                                        <span className="text-white/60">{item.country}</span>
                                        <span>{item.reach}</span>
                                    </div>
                                    <div className="h-1 w-full bg-white/10 rounded-full overflow-hidden">
                                        <div className={`h-full ${item.color}`} style={{ width: item.reach }}></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-brand-blue/10 rounded-full blur-[50px]"></div>
                </div>
            </div>

            {/* Influencer ROI Table */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-gray-50">
                    <h3 className="text-xl font-black tracking-tight">Partner Authenticity Deep-Dive</h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="bg-gray-50/50">
                                <th className="px-6 py-4 text-left text-[9px] font-black text-gray-400 uppercase tracking-widest">Influencer</th>
                                <th className="px-6 py-4 text-left text-[9px] font-black text-gray-400 uppercase tracking-widest">Vetted Reach</th>
                                <th className="px-6 py-4 text-left text-[9px] font-black text-gray-400 uppercase tracking-widest">Engagement</th>
                                <th className="px-6 py-4 text-left text-[9px] font-black text-gray-400 uppercase tracking-widest">Bot Risk</th>
                                <th className="px-6 py-4 text-right text-[9px] font-black text-gray-400 uppercase tracking-widest">ROI Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {[
                                { name: '@style_maven', reach: '1.2M', eng: '4.8%', risk: 'None', status: 'High Performance', score: '98/100' },
                                { name: '@tech_guru', reach: '850k', eng: '12.2%', risk: 'Low', status: 'Solid', score: '82/100' },
                                { name: '@fitness_king', reach: '420k', eng: '3.1%', risk: 'Medium', status: 'Under Review', score: '44/100' },
                                { name: '@urban_vibes', reach: '2.1M', eng: '0.5%', risk: 'High', status: 'Flagged', score: '12/100' }
                            ].map((row, i) => (
                                <tr key={i} className="hover:bg-gray-50/50 transition-colors">
                                    <td className="px-6 py-4 font-bold text-gray-900 text-sm">{row.name}</td>
                                    <td className="px-6 py-4 text-[13px] font-medium text-gray-500">{row.reach}</td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <div className="w-10 h-1 bg-gray-100 rounded-full overflow-hidden">
                                                <div className="h-full bg-brand-indigo" style={{ width: parseFloat(row.eng) * 5 + '%' }}></div>
                                            </div>
                                            <span className="text-[11px] font-bold text-gray-700">{row.eng}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-0.5 rounded-md text-[8px] font-black uppercase tracking-widest ${row.risk === 'None' ? 'bg-green-100 text-green-600' :
                                            row.risk === 'Low' ? 'bg-blue-100 text-blue-600' :
                                                row.risk === 'Medium' ? 'bg-orange-100 text-orange-600' : 'bg-red-100 text-red-600'
                                            }`}>{row.risk}</span>
                                    </td>
                                    <td className="px-6 py-4 text-right font-black text-[9px] uppercase tracking-widest text-gray-400">
                                        <span className={row.status === 'Flagged' ? 'text-red-500' : 'text-gray-900'}>{row.status}</span>
                                        <div className="text-[8px] text-gray-300 mt-0.5">Score: {row.score}</div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </DashboardLayout>
    );
};

// Internal icon for authenticity score
const ShieldCheck = ({ className }: { className?: string }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path><path d="m9 12 2 2 4-4"></path></svg>
);
