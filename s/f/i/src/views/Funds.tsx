import { DashboardLayout } from '../components/DashboardLayout';
import { Wallet, TrendingUp, ArrowUpRight, ArrowDownLeft, Landmark, History, ChevronRight, Plus, FileText } from 'lucide-react';

export const Funds = () => {
    return (
        <DashboardLayout role="company">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
                <div>
                    <h1 className="text-3xl font-black text-gray-900 tracking-tight mb-2">
                        Financial <span className="text-gradient">Operations</span>
                    </h1>
                    <p className="text-sm text-gray-500 font-medium max-w-md">Manage your marketing capital, track creator payouts, and review financial term sheets.</p>
                </div>
                <div className="flex items-center gap-3">
                    <button className="flex items-center gap-2 px-5 py-2.5 bg-white border-2 border-gray-100 rounded-2xl text-xs font-black uppercase tracking-widest text-gray-500 hover:text-brand-blue hover:border-brand-blue/30 transition-all shadow-sm">
                        <FileText className="w-4 h-4" />
                        Term Sheets
                    </button>
                    <button className="btn-primary flex items-center gap-2 whitespace-nowrap">
                        <Plus className="w-5 h-5" />
                        Add Funds
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
                {/* Total Balance Card */}
                <div className="lg:col-span-2 bg-gray-900 p-10 rounded-[2.5rem] text-white relative overflow-hidden shadow-2xl">
                    <div className="relative z-10 flex flex-col h-full">
                        <div className="flex justify-between items-start mb-12">
                            <div>
                                <div className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em] mb-3">Available Balance</div>
                                <div className="text-5xl font-black tracking-tight">$245,800.00</div>
                            </div>
                            <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center backdrop-blur-xl border border-white/10 shadow-inner">
                                <Wallet className="w-7 h-7 text-brand-blue" />
                            </div>
                        </div>
                        <div className="mt-auto flex flex-wrap gap-12">
                            <div>
                                <div className="text-[9px] font-black text-white/30 uppercase tracking-widest mb-1.5">Monthly Growth</div>
                                <div className="text-xl font-black text-green-400 flex items-center gap-2 leading-none">
                                    <TrendingUp className="w-5 h-5" />
                                    +24.5%
                                </div>
                            </div>
                            <div>
                                <div className="text-[9px] font-black text-white/30 uppercase tracking-widest mb-1.5">Active Allocations</div>
                                <div className="text-xl font-black text-white leading-none">12 Campaigns</div>
                            </div>
                        </div>
                    </div>
                    {/* Decorative Background Elements */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-brand-blue/20 rounded-full blur-[100px] animate-pulse"></div>
                    <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-brand-indigo/10 rounded-full blur-[120px]"></div>
                </div>

                {/* Quick Stats Sidebar */}
                <div className="space-y-6">
                    <div className="card-compact group">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-green-50 rounded-2xl flex items-center justify-center text-green-600 transition-transform group-hover:scale-110 shadow-sm">
                                <ArrowUpRight className="w-6 h-6" />
                            </div>
                            <div>
                                <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1.5">Monthly Inflow</div>
                                <div className="text-2xl font-black text-gray-900 tracking-tight leading-none">$12,400.00</div>
                            </div>
                        </div>
                    </div>
                    <div className="card-compact group">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-red-50 rounded-2xl flex items-center justify-center text-red-600 transition-transform group-hover:scale-110 shadow-sm">
                                <ArrowDownLeft className="w-6 h-6" />
                            </div>
                            <div>
                                <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1.5">Monthly Outflow</div>
                                <div className="text-2xl font-black text-gray-900 tracking-tight leading-none">$4,850.00</div>
                            </div>
                        </div>
                    </div>
                    <button className="w-full bg-brand-blue p-6 rounded-[2rem] text-white shadow-xl shadow-brand-blue/20 flex items-center justify-between group transition-all hover:bg-brand-indigo active:scale-95">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center">
                                <Landmark className="w-6 h-6" />
                            </div>
                            <span className="font-black text-xs uppercase tracking-widest">Bank Connection</span>
                        </div>
                        <ChevronRight className="w-5 h-5 group-hover:translate-x-2 transition-transform duration-300" />
                    </button>
                </div>
            </div>

            {/* Transactions Area */}
            <div className="card !p-0 overflow-hidden shadow-premium">
                <div className="p-8 border-b border-gray-100 flex justify-between items-center bg-gray-50/30">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-gray-400 shadow-sm border border-gray-100">
                            <History className="w-6 h-6" />
                        </div>
                        <div>
                            <h3 className="text-xl font-black tracking-tight text-gray-900">Transaction History</h3>
                            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-0.5">Automated creator payouts & deposits</p>
                        </div>
                    </div>
                    <button className="text-[10px] font-black text-brand-blue uppercase tracking-widest hover:text-brand-indigo transition-colors flex items-center gap-2 group">
                        Full Audit Trail <ArrowUpRight className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                    </button>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-gray-50/50">
                                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Description</th>
                                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Category</th>
                                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Date</th>
                                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Amount</th>
                                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {[
                                { name: 'Vesper AI Funding', cat: 'Campaign Allocation', date: 'Jan 24, 2026', amount: '-$50,000.00', status: 'Completed', logo: 'V' },
                                { name: 'Growth Loop A', cat: 'Platform Marketing', date: 'Jan 22, 2026', amount: '-$12,500.00', status: 'Pending', logo: 'G' },
                                { name: 'Direct Deposit', cat: 'Capital Injection', date: 'Jan 20, 2026', amount: '+$100,000.00', status: 'Completed', logo: 'D' },
                                { name: 'Creator Payout #392', cat: 'Service Fee', date: 'Jan 18, 2026', amount: '-$5,000.00', status: 'Completed', logo: 'C' }
                            ].map((tx, i) => (
                                <tr key={i} className="group hover:bg-gray-50/50 transition-colors">
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center font-black text-gray-400 group-hover:bg-brand-blue group-hover:text-white transition-all text-xs border border-gray-100">{tx.logo}</div>
                                            <span className="font-black text-gray-900 tracking-tight">{tx.name}</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <span className="badge badge-info">{tx.cat}</span>
                                    </td>
                                    <td className="px-8 py-6 text-sm font-bold text-gray-500">{tx.date}</td>
                                    <td className="px-8 py-6">
                                        <span className={`text-sm font-black tracking-tight ${tx.amount.startsWith('+') ? 'text-green-500' : 'text-gray-900'}`}>{tx.amount}</span>
                                    </td>
                                    <td className="px-8 py-6 text-right">
                                        <span className={`badge ${tx.status === 'Completed' ? 'badge-success' : 'badge-warning'}`}>{tx.status}</span>
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
