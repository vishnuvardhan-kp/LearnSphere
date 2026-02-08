import { DashboardLayout } from '../components/DashboardLayout';
import { UserCheck, TrendingUp, BarChart3, Star, Target, RefreshCw } from 'lucide-react';
import { useUser } from '../context/UserContext';
import { useMemo, useState } from 'react';

export const InfluencerAnalytics = () => {
    const { profile, refreshProfile } = useUser();
    const [activePlatform, setActivePlatform] = useState<'youtube' | 'instagram'>('youtube');

    // Get stats based on active platform
    const stats = activePlatform === 'youtube' ? profile?.youtubeStats : profile?.instagramStats;

    const [refreshing, setRefreshing] = useState(false);

    const handleRefresh = async () => {
        setRefreshing(true);
        try {
            const token = localStorage.getItem('botfree_token');
            const res = await fetch('http://localhost:5000/api/onboarding/social/refresh', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ platform: activePlatform })
            });
            if (res.ok) {
                await refreshProfile();
            } else {
                console.error("Failed to refresh");
            }
        } catch (e) {
            console.error(e);
        } finally {
            setRefreshing(false);
        }
    };

    const metrics = useMemo(() => {
        if (!stats) return null;

        let subscriberCount = 0;
        let finalTotalViews = 0;
        let engagementRate = '0.0%';
        let chartData: number[] = [];
        let labelSubscribers = 'Subscribers';

        if (activePlatform === 'youtube') {
            // ... Existing YouTube Logic ...
            const overall = stats.overall_stats || {};
            subscriberCount = overall.subscribers || stats.subscribers || 0;
            const totalViewsChannel = overall.total_views || stats.totalViews || 0;
            const videos = overall.recent_videos || stats.content?.videos || stats.videos || [];

            const computedTotalViews = videos.reduce((acc: number, v: any) => acc + (v.views || 0), 0);
            finalTotalViews = totalViewsChannel || computedTotalViews;

            const chartVideos = [...(videos.slice(0, 12))].reverse();
            const maxViews = Math.max(...chartVideos.map((v: any) => v.views || 0), 1);
            chartData = chartVideos.map((v: any) => Math.round(((v.views || 0) / maxViews) * 100));

            const avgViews = videos.length > 0 ? computedTotalViews / videos.length : 0;
            engagementRate = subscriberCount > 0 ? ((avgViews / subscriberCount) * 100).toFixed(1) + '%' : '0.0%';

        } else {
            // ... Instagram Logic ...
            subscriberCount = stats.follower_count || 0;
            labelSubscribers = 'Followers';

            // IG doesn't give total views, so sum up from posts
            const posts = stats.posts || [];
            // Filter only valid numeric views/plays
            finalTotalViews = posts.reduce((acc: number, p: any) => acc + (p.views || 0), 0);

            // Chart recent post views
            const chartPosts = [...(posts.slice(0, 12))].reverse();
            const maxViews = Math.max(...chartPosts.map((p: any) => p.views || 0), 1);
            chartData = chartPosts.map((p: any) => Math.round(((p.views || 0) / maxViews) * 100));

            // Engagement: (Avg Likes + Avg Views) / Followers? Or just Avg Likes? 
            // Usually (Likes + Comments) / Followers. We only have Likes/Views.
            // Let's use avg likes for engagement calculation approximation
            const totalLikes = posts.reduce((acc: number, p: any) => acc + (p.likes || 0), 0);
            const avgLikes = posts.length > 0 ? totalLikes / posts.length : 0;
            engagementRate = subscriberCount > 0 ? ((avgLikes / subscriberCount) * 100).toFixed(1) + '%' : '0.0%';
        }

        return {
            subscribers: subscriberCount,
            totalViews: finalTotalViews,
            engagementRate,
            chartData,
            labelSubscribers
        };
    }, [stats, activePlatform]);

    return (
        <DashboardLayout role="influencer">
            <div className="flex items-end justify-between mb-8">
                <div>
                    <h1 className="text-2xl font-black text-gray-900 tracking-tighter mb-1">Creator Performance</h1>
                    <p className="text-xs text-gray-500 font-medium">Analyze your audience health and branding power.</p>
                </div>
                <div className="flex gap-3">
                    {/* Platform Toggle */}
                    <div className="flex bg-gray-50 p-1 rounded-xl border border-gray-100">
                        <button
                            onClick={() => setActivePlatform('youtube')}
                            className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${activePlatform === 'youtube' ? 'bg-white shadow-sm text-red-500' : 'text-gray-400 hover:text-gray-600'}`}
                        >
                            YouTube
                        </button>
                        <button
                            onClick={() => setActivePlatform('instagram')}
                            className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${activePlatform === 'instagram' ? 'bg-white shadow-sm text-pink-500' : 'text-gray-400 hover:text-gray-600'}`}
                        >
                            Instagram
                        </button>
                    </div>

                    <select className="bg-white border border-gray-100 px-4 py-2 rounded-xl font-bold text-xs outline-none cursor-pointer hover:border-brand-blue/20 transition-all font-medium">
                        <option>Last 30 Days</option>
                        <option>Last 90 Days</option>
                        <option>Current Year</option>
                    </select>
                    <button
                        onClick={handleRefresh}
                        className="bg-white hover:bg-gray-50 text-gray-700 px-4 py-2.5 rounded-xl border border-gray-100 font-bold text-[9px] uppercase tracking-widest transition-all shadow-sm active:scale-95 flex items-center gap-2"
                        disabled={refreshing}
                    >
                        <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin' : ''}`} />
                        {refreshing ? 'Refreshing...' : 'Refresh Data'}
                    </button>
                </div>
            </div>

            {/* Top Metrics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {[
                    { label: metrics ? metrics.labelSubscribers : 'Total Subscribers', value: metrics ? (metrics.subscribers > 1000 ? (metrics.subscribers / 1000).toFixed(1) + 'k' : metrics.subscribers) : '-', change: '+0.4%', icon: UserCheck, color: 'text-green-600', bg: 'bg-green-50' },
                    { label: 'Avg Engagement', value: metrics ? metrics.engagementRate : '-', change: '+1.2%', icon: BarChart3, color: 'text-brand-blue', bg: 'bg-brand-blue/10' },
                    { label: 'Total Views', value: metrics ? (metrics.totalViews > 1000000 ? (metrics.totalViews / 1000000).toFixed(1) + 'M' : (metrics.totalViews / 1000).toFixed(1) + 'k') : '-', change: '+$140', icon: Star, color: 'text-amber-500', bg: 'bg-amber-50' },
                    { label: 'Growth Velocity', value: 'Premium', change: 'Steady', icon: TrendingUp, color: 'text-brand-indigo', bg: 'bg-brand-indigo/10' }
                ].map((stat, i) => (
                    <div key={i} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm group hover:border-brand-blue/20 transition-all">
                        <div className="flex justify-between items-start mb-4">
                            <div className={`w-11 h-11 ${stat.bg} ${stat.color} rounded-xl flex items-center justify-center transition-transform group-hover:-rotate-6`}>
                                <stat.icon className="w-5.5 h-5.5" />
                            </div>
                            <div className={`text-[9px] font-black px-1.5 py-0.5 rounded-md ${stat.change.startsWith('+') ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'}`}>
                                {stat.change}
                            </div>
                        </div>
                        <div className="text-2xl font-black text-gray-900 mb-0.5 tracking-tight">{stat.value}</div>
                        <div className="text-[9px] font-black text-gray-400 uppercase tracking-widest leading-none">{stat.label}</div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                {/* Engagement Breakdown Chart */}
                <div className="lg:col-span-2 bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">
                    <div className="flex justify-between items-center mb-10">
                        <div>
                            <h3 className="text-xl font-black tracking-tight">Recent Performance</h3>
                            <p className="text-[10px] text-gray-400 font-medium">Relative performance of your last 12 videos.</p>
                        </div>
                        <div className="flex gap-4">
                            <div className="flex items-center gap-2">
                                <div className="w-2.5 h-2.5 bg-brand-blue rounded-full"></div>
                                <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Views</span>
                            </div>
                        </div>
                    </div>

                    <div className="h-[200px] flex items-end gap-2.5">
                        {(metrics?.chartData || [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]).map((p: number, i: number) => (
                            <div key={i} className="flex-1 flex flex-col-reverse group relative">
                                <div className="w-full bg-gray-50 rounded-t-md h-full absolute bottom-0"></div>
                                <div
                                    className="w-full bg-brand-blue rounded-t-md relative z-10 transition-all duration-700 group-hover:bg-brand-indigo"
                                    style={{ height: `${p}%` }}
                                ></div>
                                <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-[8px] font-black text-brand-blue opacity-0 group-hover:opacity-100 transition-opacity">
                                    {p}%
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="grid grid-cols-12 gap-2.5 mt-4">
                        {Array.from({ length: 12 }).map((_, i) => (
                            <div key={i} className="text-center text-[7px] font-black text-gray-300 uppercase">V{i + 1}</div>
                        ))}
                    </div>
                </div>

                {/* Content Health Pill */}
                <div className="bg-brand-dark p-8 rounded-2xl text-white relative overflow-hidden shadow-2xl">
                    <div className="relative z-10">
                        <h3 className="text-xl font-black tracking-tight mb-6 flex items-center gap-2">
                            <Target className="w-5 h-5 text-brand-blue" />
                            Content Quality
                        </h3>
                        <div className="space-y-6">
                            {[
                                { type: 'Reels', score: 94, color: 'bg-brand-blue' },
                                { type: 'Carousel', score: 82, color: 'bg-brand-indigo' },
                                { type: 'Static Posts', score: 91, color: 'bg-emerald-400' },
                                { type: 'Stories', score: 97, color: 'bg-amber-400' }
                            ].map((item, i) => (
                                <div key={i} className="space-y-2">
                                    <div className="flex justify-between items-center text-[9px] font-black uppercase tracking-widest">
                                        <span className="text-white/60">{item.type}</span>
                                        <span className="text-white">{item.score}%</span>
                                    </div>
                                    <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                                        <div className={`h-full ${item.color} shadow-[0_0_10px_rgba(14,165,233,0.3)]`} style={{ width: `${item.score}%` }}></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    {/* Decorative glow */}
                    <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-brand-blue/20 rounded-full blur-[60px]"></div>
                </div>
            </div>

            {/* Top Partnerships Table */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-gray-50 flex justify-between items-center">
                    <h3 className="text-xl font-black tracking-tight">Active Partnerships Authenticity</h3>
                    <div className="px-3 py-1 bg-green-50 rounded-lg text-green-600 text-[9px] font-black uppercase tracking-widest border border-green-100">All Systems Clear</div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="bg-gray-50/50">
                                <th className="px-6 py-4 text-left text-[9px] font-black text-gray-400 uppercase tracking-widest">Brand Campaign</th>
                                <th className="px-6 py-4 text-left text-[9px] font-black text-gray-400 uppercase tracking-widest">Campaign Duration</th>
                                <th className="px-6 py-4 text-left text-[9px] font-black text-gray-400 uppercase tracking-widest">Audience Vetted</th>
                                <th className="px-6 py-4 text-left text-[9px] font-black text-gray-400 uppercase tracking-widest">Bot Score</th>
                                <th className="px-6 py-4 text-right text-[9px] font-black text-gray-400 uppercase tracking-widest">True Views</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {[
                                { brand: 'Pulse Energy', duration: '14 Days', audience: '820k', bot: '0.2%', views: '240k', status: 'Optimal' },
                                { brand: 'Nitro Gaming', duration: '7 Days', audience: '450k', bot: '1.2%', views: '110k', status: 'Vetted' },
                                { brand: 'Sky High Travel', duration: '28 Days', audience: '1.4M', bot: '0.5%', views: '650k', status: 'Optimal' },
                                { brand: 'Eco Mode', duration: '10 Days', audience: '320k', bot: '0.1%', views: '85k', status: 'Elite' }
                            ].map((row, i) => (
                                <tr key={i} className="hover:bg-gray-50/50 transition-colors group">
                                    <td className="px-6 py-4">
                                        <div className="font-bold text-gray-900 text-sm">{row.brand}</div>
                                        <div className="text-[9px] font-black text-brand-blue uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">View Details</div>
                                    </td>
                                    <td className="px-6 py-4 text-xs font-semibold text-gray-500">{row.duration}</td>
                                    <td className="px-6 py-4 text-xs font-black text-gray-900">{row.audience}</td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400"></div>
                                            <span className="text-[11px] font-bold text-gray-700">{row.bot}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="text-sm font-black text-gray-900 tracking-tight">{row.views}</div>
                                        <div className="text-[8px] font-black text-emerald-500 uppercase tracking-widest">{row.status}</div>
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
