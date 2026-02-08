import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { DashboardLayout } from '../components/DashboardLayout';
import {
    ArrowLeft, ArrowRight, DollarSign, Target, Search, UserCheck,
    Youtube, Instagram, Twitter, Loader2, Check
} from 'lucide-react';

export const CreateCampaign = () => {
    const navigate = useNavigate();
    const [step, setStep] = useState(1);

    // Form State
    const [formData, setFormData] = useState({
        name: '',
        type: 'Product Launch',
        budget: '',
        targetReach: '',
        description: ''
    });

    // Influencer Selection State
    const [influencers, setInfluencers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedInfluencers, setSelectedInfluencers] = useState<string[]>([]);
    const [searchTerm, setSearchTerm] = useState('');

    // Fetch Influencers
    useEffect(() => {
        const fetchInfluencers = async () => {
            try {
                const token = localStorage.getItem('botfree_token');
                const res = await fetch('http://localhost:5000/api/onboarding/influencers/all', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (res.ok) {
                    const data = await res.json();

                    // Use all influencer data
                    const validData = data;

                    const formatted = validData.map((user: any) => {
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
                            platforms: activePlatforms,
                            followers: displayFollowers,
                            engagement: displayEngagement,
                            niche: user.onboardingData?.industry || 'General',
                            status: 'Active',
                            avatar: displayAvatar,
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

    const toggleInfluencer = (id: string) => {
        if (selectedInfluencers.includes(id)) {
            setSelectedInfluencers(selectedInfluencers.filter(i => i !== id));
        } else {
            setSelectedInfluencers([...selectedInfluencers, id]);
        }
    };

    const handleCreate = () => {
        const newCampaign = {
            id: Date.now(),
            name: formData.name,
            status: 'Pending',
            type: formData.type,
            influencers: selectedInfluencers.length,
            budget: formData.budget,
            reach: formData.targetReach || '0',
            image: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&q=80&w=400',
            color: 'text-gray-500',
            bg: 'bg-gray-50'
        };

        const existing = JSON.parse(localStorage.getItem('company_campaigns') || '[]');
        localStorage.setItem('company_campaigns', JSON.stringify([newCampaign, ...existing]));

        alert(`Campaign "${formData.name}" created with ${selectedInfluencers.length} influencers!`);
        navigate('/company/campaigns');
    };

    const getPlatformIcon = (platform: string) => {
        if (!platform) return <UserCheck className="w-3.5 h-3.5 text-gray-500" />;
        switch (platform.toLowerCase()) {
            case 'youtube': return <Youtube className="w-3.5 h-3.5 text-red-500" />;
            case 'instagram': return <Instagram className="w-3.5 h-3.5 text-pink-500" />;
            case 'twitter': return <Twitter className="w-3.5 h-3.5 text-blue-400" />;
            default: return <UserCheck className="w-3.5 h-3.5 text-gray-500" />;
        }
    };

    const filteredInfluencers = influencers.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.handle.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <DashboardLayout role="company">
            <div className="max-w-5xl mx-auto">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <button onClick={() => navigate('/company/campaigns')} className="flex items-center gap-2 text-gray-400 hover:text-gray-900 transition-colors mb-2 group">
                            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                            <span className="text-xs font-bold uppercase tracking-widest">Back to Campaigns</span>
                        </button>
                        <h1 className="text-3xl font-black text-gray-900 tracking-tighter">Create Campaign</h1>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-full ${step >= 1 ? 'bg-brand-blue' : 'bg-gray-200'} transition-colors`} />
                        <div className={`w-12 h-1 rounded-full ${step >= 2 ? 'bg-brand-blue' : 'bg-gray-100'} transition-colors`} />
                        <div className={`w-3 h-3 rounded-full ${step >= 2 ? 'bg-brand-blue' : 'bg-gray-200'} transition-colors`} />
                    </div>
                </div>

                <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden p-8 min-h-[500px]">

                    {/* Step 1: Campaign Details */}
                    {step === 1 && (
                        <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                            <h2 className="text-xl font-black text-gray-900 tracking-tight mb-1">Campaign Details</h2>
                            <p className="text-xs text-gray-500 font-medium mb-8">Define the goals and parameters of your new campaign.</p>

                            <div className="space-y-6 max-w-2xl">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Campaign Name</label>
                                    <input
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        placeholder="e.g. Summer Collection Launch"
                                        className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-xl outline-none font-bold text-gray-900 text-sm focus:ring-2 focus:ring-brand-blue/10 focus:border-brand-blue transition-all"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Campaign Type</label>
                                        <div className="relative">
                                            <Target className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                            <select
                                                value={formData.type}
                                                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                                                className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-xl outline-none font-bold text-gray-900 text-sm focus:ring-2 focus:ring-brand-blue/10 focus:border-brand-blue transition-all appearance-none"
                                            >
                                                <option>Product Launch</option>
                                                <option>Brand Awareness</option>
                                                <option>Event Promotion</option>
                                                <option>Seasonal Sales</option>
                                                <option>UGC Content</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Total Budget</label>
                                        <div className="relative">
                                            <DollarSign className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                            <input
                                                type="text"
                                                value={formData.budget}
                                                onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                                                placeholder="5000"
                                                className="w-full pl-12 px-5 py-4 bg-gray-50 border border-gray-100 rounded-xl outline-none font-bold text-gray-900 text-sm focus:ring-2 focus:ring-brand-blue/10 focus:border-brand-blue transition-all"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Target Reach Goal</label>
                                    <input
                                        type="text"
                                        value={formData.targetReach}
                                        onChange={(e) => setFormData({ ...formData, targetReach: e.target.value })}
                                        placeholder="e.g. 1M+"
                                        className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-xl outline-none font-bold text-gray-900 text-sm focus:ring-2 focus:ring-brand-blue/10 focus:border-brand-blue transition-all"
                                    />
                                </div>

                                <div className="pt-4">
                                    <button
                                        onClick={() => setStep(2)}
                                        disabled={!formData.name}
                                        className="bg-brand-blue hover:bg-brand-blue/90 text-white px-8 py-4 rounded-xl font-black text-xs uppercase tracking-widest shadow-lg shadow-brand-blue/20 transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        Next Step
                                        <ArrowRight className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Step 2: Select Influencers */}
                    {step === 2 && (
                        <div className="animate-in fade-in slide-in-from-right-4 duration-300 h-full flex flex-col">
                            <div className="flex items-center justify-between mb-6">
                                <div>
                                    <h2 className="text-xl font-black text-gray-900 tracking-tight mb-1">Select Creators</h2>
                                    <p className="text-xs text-gray-500 font-medium">Choose influencers to invite to this campaign.</p>
                                </div>
                                <div className="relative group">
                                    <input
                                        type="text"
                                        placeholder="Search creators..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="bg-gray-50 border border-gray-100 pl-10 pr-4 py-2.5 rounded-xl text-xs font-bold outline-none focus:border-brand-blue/30 w-64 transition-all"
                                    />
                                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                </div>
                            </div>

                            {/* List */}
                            <div className="flex-1 overflow-y-auto min-h-[400px] border border-gray-100 rounded-2xl">
                                {loading ? (
                                    <div className="h-full flex items-center justify-center p-20">
                                        <Loader2 className="w-8 h-8 text-brand-blue animate-spin" />
                                    </div>
                                ) : (
                                    <table className="w-full">
                                        <thead className="sticky top-0 bg-white z-10 shadow-sm">
                                            <tr className="bg-gray-50/50">
                                                <th className="px-6 py-4 text-left w-10">
                                                    <div className="w-4 h-4 border-2 border-gray-200 rounded flex items-center justify-center"></div>
                                                </th>
                                                <th className="px-6 py-4 text-left text-[9px] font-black text-gray-400 uppercase tracking-widest">Influencer</th>
                                                <th className="px-6 py-4 text-left text-[9px] font-black text-gray-400 uppercase tracking-widest">Platform</th>
                                                <th className="px-6 py-4 text-left text-[9px] font-black text-gray-400 uppercase tracking-widest">Followers</th>
                                                <th className="px-6 py-4 text-left text-[9px] font-black text-gray-400 uppercase tracking-widest">Niche</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-50">
                                            {filteredInfluencers.map((person) => {
                                                const isSelected = selectedInfluencers.includes(person.id);
                                                return (
                                                    <tr
                                                        key={person.id}
                                                        onClick={() => toggleInfluencer(person.id)}
                                                        className={`transition-colors cursor-pointer group ${isSelected ? 'bg-brand-blue/5' : 'hover:bg-gray-50'}`}
                                                    >
                                                        <td className="px-6 py-4">
                                                            <div className={`w-5 h-5 border-2 rounded-md flex items-center justify-center transition-all ${isSelected ? 'bg-brand-blue border-brand-blue' : 'border-gray-200 bg-white'}`}>
                                                                {isSelected && <Check className="w-3.5 h-3.5 text-white" />}
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4">
                                                            <div className="flex items-center gap-3">
                                                                <img src={person.avatar} alt={person.name} className="w-10 h-10 rounded-xl object-cover ring-2 ring-white shadow-sm" />
                                                                <div>
                                                                    <div className="font-bold text-gray-900 text-sm">{person.name}</div>
                                                                    <div className="text-xs text-gray-400 font-medium">{person.handle}</div>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4">
                                                            <div className="flex items-center gap-2">
                                                                {person.platforms.map((p: string) => (
                                                                    <div key={p} className="flex items-center gap-1 bg-white px-2 py-1 rounded-md border border-gray-100 shadow-sm">
                                                                        {getPlatformIcon(p)}
                                                                        <span className="text-[10px] font-black text-gray-600 capitalize">{p}</span>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4">
                                                            <div className="font-bold text-gray-900 text-sm">{person.followers}</div>
                                                        </td>
                                                        <td className="px-6 py-4">
                                                            <span className="px-2.5 py-1 rounded-md bg-white border border-gray-100 text-gray-600 text-[10px] font-bold uppercase tracking-wide">
                                                                {person.niche}
                                                            </span>
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                )}
                            </div>

                            <div className="flex items-center justify-between pt-6 mt-4 border-t border-gray-50">
                                <div className="text-xs font-bold text-gray-500">
                                    {selectedInfluencers.length} creators selected
                                </div>
                                <div className="flex gap-3">
                                    <button
                                        onClick={() => setStep(1)}
                                        className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-3 rounded-xl font-black text-xs uppercase tracking-widest transition-all"
                                    >
                                        Back
                                    </button>
                                    <button
                                        onClick={handleCreate}
                                        className={`bg-black hover:bg-gray-800 text-white px-8 py-3 rounded-xl font-black text-xs uppercase tracking-widest shadow-lg transition-all flex items-center gap-2 ${selectedInfluencers.length === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
                                        disabled={selectedInfluencers.length === 0}
                                    >
                                        Create Campaign
                                        <ArrowRight className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                </div>
            </div>
        </DashboardLayout>
    );
};
