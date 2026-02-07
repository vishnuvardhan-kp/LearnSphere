import { DashboardLayout } from '../components/DashboardLayout';
import { Wallet, TrendingUp, ArrowUpRight, ArrowDownLeft, Landmark, History, ChevronRight } from 'lucide-react';

export const Funds = () => {
    return (
        <DashboardLayout role="company">
            <div className="flex items-end justify-between mb-8">
                <div>
                    <h1 className="text-2xl font-black text-gray-900 tracking-tighter mb-1">Fund Management</h1>
                    <p className="text-xs text-gray-500 font-medium tracking-tight">Manage capital, track investments, and view term sheets.</p>
                </div>
                <div className="flex gap-3">
                    <button className="bg-white border border-gray-100 px-6 py-2.5 rounded-xl font-black text-[9px] uppercase tracking-[0.15em] transition-all shadow-sm hover:shadow-md">
                        Term Sheets
                    </button>
                    <button className="bg-black hover:bg-gray-800 text-white px-6 py-2.5 rounded-xl font-black text-[9px] uppercase tracking-[0.15em] transition-all shadow-lg active:scale-95">
                        Add Funds
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                {/* Total Balance Card */}
                <div className="lg:col-span-2 bg-gradient-to-br from-gray-900 to-gray-800 p-8 rounded-2xl text-white relative overflow-hidden shadow-xl">
                    <div className="relative z-10 flex flex-col h-full">
                        <div className="flex justify-between items-start mb-10">
                            <div>
                                <div className="text-[9px] font-black text-white/40 uppercase tracking-[0.2em] mb-1.5">Available Balance</div>
                                <div className="text-4xl font-black tracking-tighter">$245,800.00</div>
                            </div>
                            <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center backdrop-blur-xl border border-white/10">
                                <Wallet className="w-6 h-6 text-brand-blue" />
                            </div>
                        </div>
                        <div className="mt-auto flex gap-10">
                            <div>
                                <div className="text-[8px] font-black text-white/40 uppercase tracking-widest mb-0.5">Monthly Growth</div>
                                <div className="text-lg font-bold text-green-400 flex items-center gap-1.5 leading-none">
                                    <TrendingUp className="w-3.5 h-3.5" />
                                    +24.5%
                                </div>
                            </div>
                            <div>
                                <div className="text-[8px] font-black text-white/40 uppercase tracking-widest mb-0.5">Active Investments</div>
                                <div className="text-lg font-bold text-white leading-none">12 Projects</div>
                            </div>
                        </div>
                    </div>
                    {/* Decorative Background Elements */}
                    <div className="absolute top-0 right-0 w-48 h-48 bg-brand-blue/20 rounded-full blur-[80px]"></div>
                    <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-brand-indigo/20 rounded-full blur-[100px]"></div>
                </div>

                {/* Quick Stats */}
                <div className="space-y-4">
                    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                        <div className="flex items-center gap-4 mb-1">
                            <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center text-green-600">
                                <ArrowUpRight className="w-5 h-5" />
                            </div>
                            <div>
                                <div className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-0.5">Inflow</div>
                                <div className="text-lg font-black text-gray-900 leading-tight">$12,400.00</div>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                        <div className="flex items-center gap-4 mb-1">
                            <div className="w-10 h-10 bg-red-50 rounded-lg flex items-center justify-center text-red-600">
                                <ArrowDownLeft className="w-5 h-5" />
                            </div>
                            <div>
                                <div className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-0.5">Outflow</div>
                                <div className="text-lg font-black text-gray-900 leading-tight">$4,850.00</div>
                            </div>
                        </div>
                    </div>
                    <div className="bg-brand-blue p-6 rounded-2xl text-white shadow-xl shadow-brand-blue/20 flex items-center justify-between group cursor-pointer active:scale-[0.98] transition-all">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                                <Landmark className="w-5 h-5" />
                            </div>
                            <span className="font-black text-xs uppercase tracking-widest">Bank Details</span>
                        </div>
                        <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-gray-50 flex justify-between items-center">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center text-gray-400">
                            <History className="w-5 h-5" />
                        </div>
                        <h3 className="text-xl font-black tracking-tight text-gray-900">Recent Transactions</h3>
                    </div>
                    <button className="text-[9px] font-black text-brand-blue uppercase tracking-widest hover:underline px-4">See All History</button>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="bg-gray-50/50">
                                <th className="px-6 py-4 text-left text-[9px] font-black text-gray-400 uppercase tracking-widest">Identity</th>
                                <th className="px-6 py-4 text-left text-[9px] font-black text-gray-400 uppercase tracking-widest">Category</th>
                                <th className="px-6 py-4 text-left text-[9px] font-black text-gray-400 uppercase tracking-widest">Date</th>
                                <th className="px-6 py-4 text-left text-[9px] font-black text-gray-400 uppercase tracking-widest">Amount</th>
                                <th className="px-6 py-4 text-right text-[9px] font-black text-gray-400 uppercase tracking-widest">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {[
                                { name: 'Vesper AI Funding', cat: 'Investment', date: 'Jan 24, 2026', amount: '-$50,000.00', status: 'Completed', logo: 'V' },
                                { name: 'Growth Loop A', cat: 'Marketing', date: 'Jan 22, 2026', amount: '-$12,500.00', status: 'Pending', logo: 'G' },
                                { name: 'Stripe Deposit', cat: 'Deposit', date: 'Jan 20, 2026', amount: '+$100,000.00', status: 'Completed', logo: 'S' },
                                { name: 'Influencer Deal #04', cat: 'Equity', date: 'Jan 18, 2026', amount: '-$5,000.00', status: 'Completed', logo: 'I' }
                            ].map((tx, i) => (
                                <tr key={i} className="group hover:bg-gray-50/50 transition-colors text-[13px]">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-9 h-9 bg-gray-100 rounded-lg flex items-center justify-center font-black text-gray-400 group-hover:bg-brand-blue group-hover:text-white transition-all text-xs">{tx.logo}</div>
                                            <span className="font-bold text-gray-900">{tx.name}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">{tx.cat}</span>
                                    </td>
                                    <td className="px-6 py-4 font-medium text-gray-500">{tx.date}</td>
                                    <td className="px-6 py-4">
                                        <span className={`font-black ${tx.amount.startsWith('+') ? 'text-green-500' : 'text-gray-900'}`}>{tx.amount}</span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <span className={`px-3 py-1 rounded-md text-[8px] font-black uppercase tracking-widest ${tx.status === 'Completed' ? 'bg-green-100 text-green-600' : 'bg-orange-100 text-orange-600'
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
