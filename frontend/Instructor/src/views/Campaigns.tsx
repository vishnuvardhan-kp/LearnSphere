import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { DashboardLayout } from '../components/DashboardLayout';
import {
    Plus, Search, Filter, LayoutGrid, List,
    Calendar, ExternalLink, Play, CheckCircle2, Clock, Trash2
} from 'lucide-react';
import { AICampaignAssistant } from '../components/AICampaignAssistant';

export const Campaigns = () => {
    const navigate = useNavigate();
    const [view, setView] = useState<'grid' | 'list'>('grid');
    const [campaigns, setCampaigns] = useState<any[]>([]);

    useEffect(() => {
        const stored = localStorage.getItem('company_campaigns');
        if (stored) {
            setCampaigns(JSON.parse(stored));
        }
    }, []);

    const handleDelete = (id: number) => {
        if (window.confirm('Are you sure you want to delete this campaign?')) {
            const updated = campaigns.filter(c => c.id !== id);
            setCampaigns(updated);
            localStorage.setItem('company_campaigns', JSON.stringify(updated));
        }
    };

    return (
        <DashboardLayout role="company">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
                <div>
                    <h1 className="text-2xl font-black text-gray-900 tracking-tighter mb-1">Campaign Manager</h1>
                    <p className="text-xs text-gray-500 font-medium tracking-tight">Create, track, and optimize your marketing efforts.</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="flex bg-white p-1 rounded-xl border border-gray-100 shadow-sm">
                        <button
                            onClick={() => setView('grid')}
                            className={`p-2 rounded-lg transition-all ${view === 'grid' ? 'bg-gray-100 text-gray-900 shadow-inner' : 'text-gray-400 hover:text-gray-600'}`}
                        >
                            <LayoutGrid className="w-4 h-4" />
                        </button>
                        <button
                            onClick={() => setView('list')}
                            className={`p-2 rounded-lg transition-all ${view === 'list' ? 'bg-gray-100 text-gray-900 shadow-inner' : 'text-gray-400 hover:text-gray-600'}`}
                        >
                            <List className="w-4 h-4" />
                        </button>
                    </div>
                    <button
                        onClick={() => navigate('/company/campaigns/new')}
                        className="bg-black hover:bg-gray-800 text-white px-5 py-2 rounded-xl font-black text-[9px] uppercase tracking-[0.15em] transition-all shadow-lg active:scale-95 flex items-center gap-2 group"
                    >
                        <Plus className="w-3.5 h-3.5 group-hover:rotate-90 transition-transform" />
                        New Campaign
                    </button>
                </div>
            </div>

            <div className="flex flex-col md:flex-row items-center gap-3 mb-8">
                <div className="flex-1 flex items-center gap-3 bg-white border border-gray-100 px-4 py-2.5 rounded-xl w-full md:w-auto shadow-sm focus-within:ring-2 focus-within:ring-brand-blue/10 focus-within:border-brand-blue transition-all">
                    <Search className="w-3.5 h-3.5 text-gray-400" />
                    <input type="text" placeholder="Search by name, type, or influencer..." className="bg-transparent border-none outline-none text-xs w-full font-medium" />
                </div>
                <div className="flex items-center gap-2 w-full md:w-auto">
                    <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-100 rounded-xl text-[11px] font-bold text-gray-600 hover:bg-gray-50 transition-all shadow-sm">
                        <Filter className="w-3.5 h-3.5" />
                        Filter
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-100 rounded-xl text-[11px] font-bold text-gray-600 hover:bg-gray-50 transition-all shadow-sm">
                        <Calendar className="w-3.5 h-3.5" />
                        Date
                    </button>
                </div>
            </div>

            {campaigns.length === 0 ? (
                <div className="bg-white rounded-3xl border border-gray-100 p-12 text-center shadow-sm">
                    <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                        <LayoutGrid className="w-8 h-8 text-gray-300" />
                    </div>
                    <h3 className="text-lg font-black text-gray-900 mb-2">No Campaigns Yet</h3>
                    <p className="text-gray-500 text-sm font-medium mb-8 max-w-sm mx-auto">Get started by creating your first influencer marketing campaign.</p>
                    <button
                        onClick={() => navigate('/company/campaigns/new')}
                        className="bg-brand-blue hover:bg-brand-blue/90 text-white px-8 py-3 rounded-xl font-black text-xs uppercase tracking-widest shadow-lg shadow-brand-blue/20 transition-all"
                    >
                        Create Campaign
                    </button>
                </div>
            ) : view === 'grid' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-6">
                    {campaigns.map((camp) => (
                        <div key={camp.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden group hover:shadow-premium transition-all duration-500">
                            <div className="relative h-40 overflow-hidden">
                                <img src={camp.image} alt={camp.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                                <div className="absolute top-4 left-4">
                                    <div className={`px-2.5 py-1 rounded-full text-[8px] font-black uppercase tracking-widest flex items-center gap-1.5 backdrop-blur-md border border-white/20 bg-white/10 text-white`}>
                                        <div className={`w-1.5 h-1.5 rounded-full ${camp.status === 'Active' ? 'bg-green-400 animate-pulse' : camp.status === 'Pending' ? 'bg-orange-400' : 'bg-gray-400'}`}></div>
                                        {camp.status}
                                    </div>
                                </div>
                                <button
                                    onClick={(e) => { e.stopPropagation(); handleDelete(camp.id); }}
                                    className="absolute top-4 right-4 w-8 h-8 rounded-lg bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-red-500/80 hover:border-red-500/50 transition-all"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                            <div className="p-5">
                                <div className="text-[8px] font-black text-brand-blue uppercase tracking-widest mb-1.5">{camp.type}</div>
                                <h3 className="text-base font-black text-gray-900 tracking-tight mb-4 group-hover:text-brand-blue transition-colors leading-tight">{camp.name}</h3>

                                <div className="grid grid-cols-2 gap-3 pt-4 border-t border-gray-50">
                                    <div>
                                        <div className="text-[8px] font-black text-gray-400 uppercase tracking-widest mb-0.5">Budget</div>
                                        <div className="text-[13px] font-black text-gray-900">{camp.budget}</div>
                                    </div>
                                    <div>
                                        <div className="text-[8px] font-black text-gray-400 uppercase tracking-widest mb-0.5">Reach</div>
                                        <div className="text-[13px] font-black text-gray-900">{camp.reach}</div>
                                    </div>
                                </div>

                                <div className="mt-6 flex items-center justify-between">
                                    <div className="flex -space-x-2">
                                        <div className="w-6.5 h-6.5 rounded-full border-2 border-white bg-gray-100 flex items-center justify-center font-black text-[7px] text-gray-400 overflow-hidden shadow-sm">
                                            <span>0</span>
                                        </div>
                                    </div>
                                    <button className="flex items-center gap-1.5 text-[9px] font-black text-gray-400 uppercase tracking-widest hover:text-brand-blue transition-colors group/link">
                                        Details
                                        <ExternalLink className="w-2.5 h-2.5 group-hover/link:translate-x-0.5 transition-transform" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                    <table className="w-full">
                        <thead>
                            <tr className="bg-gray-50/50">
                                <th className="px-6 py-4 text-left text-[9px] font-black text-gray-400 uppercase tracking-widest">Campaign</th>
                                <th className="px-6 py-4 text-left text-[9px] font-black text-gray-400 uppercase tracking-widest">Stage</th>
                                <th className="px-6 py-4 text-left text-[9px] font-black text-gray-400 uppercase tracking-widest">Creators</th>
                                <th className="px-6 py-4 text-left text-[9px] font-black text-gray-400 uppercase tracking-widest">Budget Track</th>
                                <th className="px-6 py-4 text-right text-[9px] font-black text-gray-400 uppercase tracking-widest">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {campaigns.map((camp) => (
                                <tr key={camp.id} className="hover:bg-gray-50/50 transition-colors group text-[13px]">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-lg overflow-hidden shadow-sm">
                                                <img src={camp.image} alt="" className="w-full h-full object-cover" />
                                            </div>
                                            <div>
                                                <div className="font-black text-gray-900 tracking-tight leading-none mb-1">{camp.name}</div>
                                                <div className="text-[8px] font-black text-brand-blue uppercase tracking-widest">{camp.type}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-1.5">
                                            {camp.status === 'Active' ? <Play className="w-3.5 h-3.5 text-green-500" /> :
                                                camp.status === 'Completed' ? <CheckCircle2 className="w-3.5 h-3.5 text-brand-blue" /> :
                                                    <Clock className="w-3.5 h-3.5 text-orange-400" />}
                                            <span className="font-bold text-gray-700">{camp.status}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="font-black text-gray-900">{camp.influencers} <span className="text-gray-400 font-medium ml-1 text-[11px]">Vetted</span></div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="font-black text-gray-900">{camp.budget}</div>
                                        <div className="text-[8px] font-black text-gray-400 uppercase tracking-widest">{camp.reach} Reach</div>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <button
                                                onClick={() => handleDelete(camp.id)}
                                                className="p-2.5 rounded-lg bg-gray-50 text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all"
                                            >
                                                <Trash2 className="w-3.5 h-3.5" />
                                            </button>
                                            <button className="p-2.5 rounded-lg bg-gray-50 text-gray-400 hover:text-brand-blue hover:bg-brand-blue/5 transition-all">
                                                <ExternalLink className="w-3.5 h-3.5" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
            <AICampaignAssistant />



        </DashboardLayout>
    );
};
