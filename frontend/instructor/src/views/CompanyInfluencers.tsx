import { DashboardLayout } from '../components/DashboardLayout';
import { UserCheck, Search, Filter, MessageSquare, ExternalLink, Youtube, Instagram, Twitter, Loader2 } from 'lucide-react';
import { useState, useEffect } from 'react';

export const CompanyInfluencers = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [influencers, setInfluencers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchInfluencers = async () => {
            try {
                const token = localStorage.getItem('botfree_token');
                const res = await fetch('http://localhost:5000/api/onboarding/influencers/all', {
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
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
                <div>
                    <h1 className="text-2xl font-black text-gray-900 tracking-tighter mb-1">Influencer Network</h1>
                    <p className="text-xs text-gray-500 font-medium">Manage your relationships with creators.</p>
                </div>
                <div className="flex gap-3">
                    <div className="relative group">
                        <input
                            type="text"
                            placeholder="Search creators..."
                            className="bg-white border border-gray-100 pl-10 pr-4 py-2.5 rounded-xl text-xs font-bold outline-none focus:border-brand-blue/30 w-full md:w-64 transition-all shadow-sm group-hover:shadow-md"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    </div>
                    <button className="bg-black hover:bg-gray-800 text-white px-5 py-2.5 rounded-xl font-black text-[9px] uppercase tracking-[0.15em] transition-all shadow-lg active:scale-95 flex items-center gap-2">
                        <Filter className="w-3 h-3" />
                        Filter
                    </button>
                    <button className="bg-brand-blue hover:bg-brand-indigo text-white px-5 py-2.5 rounded-xl font-black text-[9px] uppercase tracking-[0.15em] transition-all shadow-brand-glow active:scale-95">
                        Discover New
                    </button>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                {[
                    { label: 'Network Size', value: influencers.length, sub: 'Creators', color: 'text-brand-blue', bg: 'bg-brand-blue/5' },
                    { label: 'Total Reach', value: '45.2M', sub: 'Aggregated', color: 'text-purple-600', bg: 'bg-purple-50' },
                    { label: 'Active Campaigns', value: '12', sub: 'Running', color: 'text-emerald-600', bg: 'bg-emerald-50' },
                    { label: 'Avg Engagement', value: '4.8%', sub: 'Healthy', color: 'text-amber-500', bg: 'bg-amber-50' }
                ].map((stat, i) => (
                    <div key={i} className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:border-brand-blue/20 transition-all">
                        <div className={`w-8 h-8 ${stat.bg} rounded-lg flex items-center justify-center mb-3`}>
                            <UserCheck className={`w-4 h-4 ${stat.color}`} />
                        </div>
                        <div className="text-2xl font-black text-gray-900 tracking-tight">{stat.value}</div>
                        <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{stat.label}</div>
                    </div>
                ))}
            </div>

            {/* Influencers List Table */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden min-h-[300px]">
                {loading ? (
                    <div className="h-full flex items-center justify-center p-20">
                        <Loader2 className="w-8 h-8 text-brand-blue animate-spin" />
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="bg-gray-50/50 border-b border-gray-100">
                                    <th className="px-6 py-4 text-left text-[9px] font-black text-gray-400 uppercase tracking-widest">Influencer</th>
                                    <th className="px-6 py-4 text-left text-[9px] font-black text-gray-400 uppercase tracking-widest">Platform</th>
                                    <th className="px-6 py-4 text-left text-[9px] font-black text-gray-400 uppercase tracking-widest">Reach</th>
                                    <th className="px-6 py-4 text-left text-[9px] font-black text-gray-400 uppercase tracking-widest">Category</th>
                                    <th className="px-6 py-4 text-left text-[9px] font-black text-gray-400 uppercase tracking-widest">Status</th>
                                    <th className="px-6 py-4 text-right text-[9px] font-black text-gray-400 uppercase tracking-widest">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {influencers.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="px-6 py-10 text-center text-gray-400 text-xs font-medium">
                                            No influencers found in the network.
                                        </td>
                                    </tr>
                                ) : influencers.map((person) => (
                                    <tr key={person.id} className="hover:bg-gray-50/50 transition-colors group">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="relative">
                                                    <img src={person.avatar} alt={person.name} className="w-10 h-10 rounded-xl object-cover ring-2 ring-white shadow-sm" />
                                                    <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-0.5 shadow-sm">
                                                        {/* Show primary icon in avatar badge */}
                                                        {getPlatformIcon(person.platforms[0])}
                                                    </div>
                                                </div>
                                                <div>
                                                    <div className="font-bold text-gray-900 text-sm">{person.name}</div>
                                                    <div className="text-xs text-gray-400 font-medium">{person.handle}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                {/* Map through all active platforms */}
                                                {person.platforms.map((p: string) => (
                                                    <div key={p} className="flex items-center gap-1 bg-gray-50 px-2 py-1 rounded-md border border-gray-100">
                                                        {getPlatformIcon(p)}
                                                        <span className="text-[10px] font-black text-gray-600 capitalize">{p}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="font-bold text-gray-900 text-sm">{person.followers}</div>
                                            <div className="text-[10px] text-green-500 font-bold">+{person.engagement} Eng.</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="px-2.5 py-1 rounded-md bg-gray-100 text-gray-600 text-[10px] font-bold uppercase tracking-wide">
                                                {person.niche}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wide ${person.status === 'Active' ? 'bg-green-50 text-green-600 border border-green-100' :
                                                person.status === 'Pending' ? 'bg-amber-50 text-amber-600 border border-amber-100' :
                                                    'bg-gray-50 text-gray-400 border border-gray-100'
                                                }`}>
                                                {person.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button className="p-2 hover:bg-brand-blue/10 text-brand-blue rounded-lg transition-colors" title="Message">
                                                    <MessageSquare className="w-4 h-4" />
                                                </button>
                                                <button className="p-2 hover:bg-gray-100 text-gray-500 rounded-lg transition-colors" title="View Profile">
                                                    <ExternalLink className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
                <div className="p-4 border-t border-gray-50 flex justify-center">
                    <button className="text-[10px] font-black text-gray-400 uppercase tracking-widest hover:text-brand-blue transition-colors">
                        View All Connections
                    </button>
                </div>
            </div>
        </DashboardLayout>
    );
};
