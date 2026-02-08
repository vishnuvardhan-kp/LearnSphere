import { DashboardLayout } from '../components/DashboardLayout';
import { UserCheck, Search, Filter, MessageSquare, ExternalLink, Youtube, Instagram, Twitter, Loader2, Users, Target, Globe } from 'lucide-react';
import { useState, useEffect } from 'react';

export const CompanyInfluencers = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [influencers, setInfluencers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchInfluencers = async () => {
            try {
                const token = localStorage.getItem('botfree_token');
                const res = await fetch('http://127.0.0.1:5000/api/onboarding/influencers/all', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (res.ok) {
                    const data = await res.json();

                    const formatted = data.map((user: any) => {
                        const ytStats = user.youtubeStats?.overall_stats || {};
                        const igStats = user.instagramStats || {};

                        const hasYt = !!ytStats.subscribers;
                        const hasIg = !!igStats.follower_count;

                        const activePlatforms = [];
                        if (hasYt) activePlatforms.push('youtube');
                        if (hasIg) activePlatforms.push('instagram');
                        if (activePlatforms.length === 0 && user.onboardingData?.platforms) {
                            activePlatforms.push(...user.onboardingData.platforms);
                        }

                        let displayHandle = user.email;
                        let displayFollowers = '-';
                        let displayEngagement = '0%';
                        let displayAvatar = 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150&h=150';

                        // Logic for "main" stats display (prioritize YT, then IG)
                        if (hasYt) {
                            displayHandle = user.onboardingData?.socialHandles?.youtube || displayHandle;
                            displayAvatar = ytStats.profile_pic_url || displayAvatar;
                            displayFollowers = ytStats.subscribers > 1000000
                                ? (ytStats.subscribers / 1000000).toFixed(1) + 'M'
                                : (ytStats.subscribers / 1000).toFixed(1) + 'K';

                            if (ytStats.total_views > 0 && ytStats.total_videos_count > 0) {
                                const avgViews = ytStats.total_views / ytStats.total_videos_count;
                                displayEngagement = ((avgViews / ytStats.subscribers) * 100).toFixed(1) + '%';
                            }
                        } else if (hasIg) {
                            displayHandle = user.onboardingData?.socialHandles?.instagram ? '@' + user.onboardingData.socialHandles.instagram.replace('@', '') : displayHandle;
                            displayAvatar = igStats.profile_pic_url || displayAvatar;
                            displayFollowers = igStats.follower_count > 1000000
                                ? (igStats.follower_count / 1000000).toFixed(1) + 'M'
                                : (igStats.follower_count / 1000).toFixed(1) + 'K';

                            const posts = igStats.posts || [];
                            const totalLikes = posts.reduce((acc: number, p: any) => acc + (p.likes || 0), 0);
                            const avgLikes = posts.length > 0 ? totalLikes / posts.length : 0;
                            if (igStats.follower_count > 0) {
                                displayEngagement = ((avgLikes / igStats.follower_count) * 100).toFixed(1) + '%';
                            }
                        }

                        return {
                            id: user._id,
                            name: user.name || 'Unnamed Creator',
                            handle: displayHandle,
                            platforms: activePlatforms, // Array of strings
                            followers: displayFollowers,
                            engagement: displayEngagement,
                            niche: user.onboardingData?.industry || 'General',
                            status: 'Active',
                            avatar: displayAvatar,
                            lastCampaign: '-'
                        };
                    });
                    setInfluencers(formatted);
                }
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchInfluencers();
    }, []);

    const getPlatformIcon = (platform: string) => {
        if (!platform) return <UserCheck className="w-3.5 h-3.5 text-gray-500" />;
        switch (platform.toLowerCase()) {
            case 'youtube': return <Youtube className="w-3.5 h-3.5 text-red-500" />;
            case 'instagram': return <Instagram className="w-3.5 h-3.5 text-pink-500" />;
            case 'twitter': return <Twitter className="w-3.5 h-3.5 text-blue-400" />;
            default: return <UserCheck className="w-3.5 h-3.5 text-gray-500" />;
        }
    };

    return (
        <DashboardLayout role="company">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
                <div>
                    <h1 className="text-3xl font-black text-gray-900 tracking-tight mb-2">
                        Creator <span className="text-gradient">Network</span>
                    </h1>
                    <p className="text-sm text-gray-500 font-medium max-w-md">Discover and manage high-performing instructors for your customized learning portals.</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="relative group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-brand-blue duration-200" />
                        <input
                            type="text"
                            placeholder="Search creators..."
                            className="bg-white border-2 border-gray-100 pl-11 pr-4 py-2.5 rounded-2xl text-xs font-bold outline-none focus:border-brand-blue focus:ring-4 focus:ring-brand-blue/10 w-full md:w-64 transition-all shadow-sm"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <button className="p-3 bg-white border-2 border-gray-100 rounded-2xl text-gray-400 hover:text-brand-blue hover:border-brand-blue/30 transition-all active:scale-95 shadow-sm">
                        <Filter className="w-5 h-5" />
                    </button>
                    <button className="btn-primary flex items-center gap-2 whitespace-nowrap">
                        Discover New
                    </button>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
                {[
                    { label: 'Total Creators', value: influencers.length, icon: Users, color: 'text-brand-blue', bg: 'bg-brand-blue/10' },
                    { label: 'Aggregated Reach', value: '45.2M', icon: Globe, color: 'text-purple-600', bg: 'bg-purple-50' },
                    { label: 'Active Tasks', value: '12', icon: Target, color: 'text-emerald-600', bg: 'bg-emerald-50' },
                    { label: 'Avg ROI', value: '4.8x', icon: Target, color: 'text-amber-500', bg: 'bg-amber-50' }
                ].map((stat, i) => (
                    <div key={i} className="card-compact group">
                        <div className={`w-10 h-10 ${stat.bg} ${stat.color} rounded-xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110`}>
                            <stat.icon className="w-5 h-5" />
                        </div>
                        <div className="text-2xl font-black text-gray-900 tracking-tight leading-none mb-1">{stat.value}</div>
                        <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none">{stat.label}</div>
                    </div>
                ))}
            </div>

            {/* Influencers List Area */}
            <div className="card !p-0 overflow-hidden shadow-premium">
                {loading ? (
                    <div className="h-64 flex items-center justify-center">
                        <Loader2 className="w-10 h-10 text-brand-blue animate-spin" />
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-gray-50/50 border-b border-gray-100">
                                    <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Creator Profile</th>
                                    <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Presence</th>
                                    <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Metrics</th>
                                    <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Niche</th>
                                    <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {influencers.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="px-8 py-20 text-center">
                                            <div className="flex flex-col items-center gap-4">
                                                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center">
                                                    <Users className="w-8 h-8 text-gray-200" />
                                                </div>
                                                <p className="text-sm font-bold text-gray-400">No creators found in your network.</p>
                                            </div>
                                        </td>
                                    </tr>
                                ) : influencers.map((person) => (
                                    <tr key={person.id} className="hover:bg-blue-50/30 transition-colors group">
                                        <td className="px-8 py-5">
                                            <div className="flex items-center gap-4">
                                                <div className="relative shrink-0">
                                                    <img src={person.avatar} alt={person.name} className="w-12 h-12 rounded-2xl object-cover shadow-sm group-hover:scale-105 transition-transform duration-300" />
                                                    <div className="absolute -bottom-1 -right-1 bg-white rounded-lg p-1 shadow-md border border-gray-100">
                                                        {getPlatformIcon(person.platforms[0])}
                                                    </div>
                                                </div>
                                                <div>
                                                    <div className="font-black text-gray-900 text-sm tracking-tight">{person.name}</div>
                                                    <div className="text-xs text-brand-blue font-bold opacity-70">{person.handle}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-5">
                                            <div className="flex items-center gap-2">
                                                {person.platforms.map((p: string) => (
                                                    <div key={p} className="p-1.5 bg-gray-50 rounded-lg border border-gray-100 hover:border-brand-blue/20 transition-colors">
                                                        {getPlatformIcon(p)}
                                                    </div>
                                                ))}
                                            </div>
                                        </td>
                                        <td className="px-8 py-5">
                                            <div className="font-black text-gray-900 text-sm">{person.followers}</div>
                                            <div className="badge badge-success !px-2 !py-0 !text-[8px] mt-1">{person.engagement} Eng Rate</div>
                                        </td>
                                        <td className="px-8 py-5">
                                            <span className="badge badge-info">{person.niche}</span>
                                        </td>
                                        <td className="px-8 py-5 text-right">
                                            <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-2 group-hover:translate-x-0">
                                                <button className="p-2.5 hover:bg-brand-blue/10 text-brand-blue rounded-xl transition-colors border border-transparent hover:border-brand-blue/20" title="Message">
                                                    <MessageSquare className="w-4.5 h-4.5" />
                                                </button>
                                                <button className="p-2.5 hover:bg-gray-100 text-gray-500 rounded-xl transition-colors border border-transparent hover:border-gray-200" title="View Profile">
                                                    <ExternalLink className="w-4.5 h-4.5" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            <div className="mt-8 flex justify-center">
                <button className="text-[10px] font-black text-gray-400 uppercase tracking-widest hover:text-brand-blue transition-colors flex items-center gap-2 group">
                    View Network Insights <div className="w-4 h-4 rounded-full bg-gray-100 flex items-center justify-center group-hover:bg-brand-blue group-hover:text-white transition-colors">→</div>
                </button>
            </div>
        </DashboardLayout>
    );
};
