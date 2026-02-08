import { DashboardLayout } from '../components/DashboardLayout';
import { ArrowUpRight, ArrowDownLeft, Landmark, History, ChevronRight, DollarSign } from 'lucide-react';

export const InfluencerWallet = () => {
    return (
        <DashboardLayout role="influencer">
            <div className="flex items-end justify-between mb-8">
                <div>
                    <h1 className="text-2xl font-black text-gray-900 tracking-tighter mb-1">My Wallet</h1>
                    <p className="text-xs text-gray-500 font-medium tracking-tight">Track your earnings, manage payouts, and view history.</p>
                </div>
                <div className="flex gap-3">
                    <button className="bg-white border border-gray-100 px-6 py-2.5 rounded-xl font-black text-[9px] uppercase tracking-[0.15em] transition-all shadow-sm hover:shadow-md">
                        Payout Settings
                    </button>
                    <button className="bg-brand-blue hover:bg-brand-blue/90 text-white px-6 py-2.5 rounded-xl font-black text-[9px] uppercase tracking-[0.15em] transition-all shadow-lg shadow-brand-blue/20 active:scale-95">
                        Withdraw Funds
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                {/* Available Balance Card */}
                <div className="lg:col-span-2 bg-gray-900 p-8 rounded-2xl text-white relative overflow-hidden shadow-xl border border-white/5">
                    <div className="relative z-10 flex flex-col h-full">
                        <div className="flex justify-between items-start mb-10">
                            <div>
                                <div className="text-[9px] font-black text-white/40 uppercase tracking-[0.2em] mb-1.5">Available for Payout</div>
                                <div className="text-4xl font-black tracking-tighter">$4,250.80</div>
                            </div>
                            <div className="w-12 h-12 bg-brand-blue/20 rounded-xl flex items-center justify-center backdrop-blur-xl border border-white/10">
                                <DollarSign className="w-6 h-6 text-brand-blue" />
                            </div>
                        </div>
                        <div className="mt-auto flex gap-10">
                            <div>
                                <div className="text-[8px] font-black text-white/40 uppercase tracking-widest mb-0.5">Pending Clearance</div>
                                <div className="text-lg font-bold text-orange-400 flex items-center gap-1.5 leading-none">
                                    $1,120.00
                                </div>
                            </div>
                            <div>
                                <div className="text-[8px] font-black text-white/40 uppercase tracking-widest mb-0.5">Total Lifetime Earnings</div>
                                <div className="text-lg font-bold text-white leading-none">$18,450.00</div>
                            </div>
                        </div>
                    </div>
                    {/* Decorative Background Elements */}
                    <div className="absolute top-0 right-0 w-48 h-48 bg-brand-blue/10 rounded-full blur-[80px]"></div>
                    <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-brand-indigo/10 rounded-full blur-[100px]"></div>
                </div>

                {/* Quick Stats Sidebar */}
                <div className="space-y-4">
                    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                        <div className="flex items-center gap-4 mb-1">
                            <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center text-green-600">
                                <ArrowUpRight className="w-5 h-5" />
                            </div>
                            <div>
                                <div className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-0.5">This Month</div>
                                <div className="text-lg font-black text-gray-900 leading-tight">+$2,140.00</div>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                        <div className="flex items-center gap-4 mb-1">
                            <div className="w-10 h-10 bg-brand-blue/5 rounded-lg flex items-center justify-center text-brand-blue">
                                <ArrowDownLeft className="w-5 h-5" />
                            </div>
                            <div>
                                <div className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-0.5">Last Withdrawal</div>
                                <div className="text-lg font-black text-gray-900 leading-tight">$850.00</div>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between group cursor-pointer hover:border-brand-blue/20 transition-all">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-gray-50 rounded-lg flex items-center justify-center text-gray-400 group-hover:text-brand-blue transition-colors">
                                <Landmark className="w-5 h-5" />
                            </div>
                            <span className="font-black text-[10px] uppercase tracking-widest text-gray-500 group-hover:text-gray-900">Tax Documents</span>
                        </div>
                        <ChevronRight className="w-4 h-4 text-gray-300 group-hover:translate-x-1 transition-transform" />
                    </div>
                </div>
            </div>

            {/* Earnings History */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-gray-50 flex justify-between items-center">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center text-gray-400">
                            <History className="w-5 h-5" />
                        </div>
                        <h3 className="text-xl font-black tracking-tight text-gray-900">Earnings History</h3>
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="bg-gray-50/50">
                                <th className="px-6 py-4 text-left text-[9px] font-black text-gray-400 uppercase tracking-widest">Source</th>
                                <th className="px-6 py-4 text-left text-[9px] font-black text-gray-400 uppercase tracking-widest">Type</th>
                                <th className="px-6 py-4 text-left text-[9px] font-black text-gray-400 uppercase tracking-widest">Date</th>
                                <th className="px-6 py-4 text-left text-[9px] font-black text-gray-400 uppercase tracking-widest">Amount</th>
                                <th className="px-6 py-4 text-right text-[9px] font-black text-gray-400 uppercase tracking-widest">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {[
                                { name: 'Pulse Energy Reel', type: 'Campaign', date: 'Jan 28, 2026', amount: '+$850.00', status: 'Cleared', logo: 'P' },
                                { name: 'Sky High Vlog', type: 'Campaign', date: 'Jan 25, 2026', amount: '+$1,200.00', status: 'Pending', logo: 'S' },
                                { name: 'Withdrawal to Bank', type: 'Payout', date: 'Jan 20, 2026', amount: '-$850.00', status: 'Cleared', logo: 'W' },
                                { name: 'Nitro Gaming Post', type: 'Campaign', date: 'Jan 15, 2026', amount: '+$450.00', status: 'Cleared', logo: 'N' }
                            ].map((tx, i) => (
                                <tr key={i} className="group hover:bg-gray-50/50 transition-colors text-[13px]">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-9 h-9 bg-gray-50 rounded-lg flex items-center justify-center font-black text-gray-400 group-hover:bg-brand-blue group-hover:text-white transition-all text-xs">{tx.logo}</div>
                                            <span className="font-bold text-gray-900">{tx.name}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">{tx.type}</span>
                                    </td>
                                    <td className="px-6 py-4 font-medium text-gray-500">{tx.date}</td>
                                    <td className="px-6 py-4">
                                        <span className={`font-black ${tx.amount.startsWith('+') ? 'text-green-500' : 'text-gray-900'}`}>{tx.amount}</span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <span className={`px-3 py-1 rounded-md text-[8px] font-black uppercase tracking-widest ${tx.status === 'Cleared' ? 'bg-green-100 text-green-600' : 'bg-orange-100 text-orange-600'
                                            }`}>{tx.status}</span>
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
