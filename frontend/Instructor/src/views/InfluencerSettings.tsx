import React, { useState } from 'react';
import { DashboardLayout } from '../components/DashboardLayout';
import { User, Shield, Bell, Instagram, Youtube, Lock, X } from 'lucide-react';
import { useUser } from '../context/UserContext';

export const InfluencerSettings = () => {
    const [activeTab, setActiveTab] = React.useState('profile');
    const { profile, refreshProfile } = useUser();

    // Connect Modal State
    const [connectModal, setConnectModal] = useState({ open: false, platform: '' });
    const [handleInput, setHandleInput] = useState('');
    const [connecting, setConnecting] = useState(false);
    const [verificationData, setVerificationData] = useState<any>(null);
    // Disconnect Modal State
    const [disconnectModal, setDisconnectModal] = useState({ open: false, platform: '' });

    const tabs = [
        { id: 'profile', label: 'Profile', icon: User },
        { id: 'socials', label: 'Social Connect', icon: Instagram },
        { id: 'security', label: 'Security', icon: Shield },
        { id: 'notifications', label: 'Notifications', icon: Bell },
    ];

    const niches = ['Fitness', 'Tech', 'Lifestyle', 'Gaming', 'Travel', 'Fashion', 'SaaS', 'Finance'];

    const handleConnectClick = (platform: string) => {
        setConnectModal({ open: true, platform });
        setHandleInput('');
        setVerificationData(null);
    };

    const handleDisconnectClick = (platform: string) => {
        setDisconnectModal({ open: true, platform });
    };

    const submitConnect = async () => {
        if (!handleInput) return;
        setConnecting(true);
        try {
            const token = localStorage.getItem('botfree_token');
            const response = await fetch('http://localhost:5000/api/onboarding/social/connect', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    platform: connectModal.platform,
                    handle: handleInput
                })
            });

            const data = await response.json();
            if (response.ok) {
                await refreshProfile();

                if (data.stats) {
                    setVerificationData(data.stats);
                } else {
                    alert('Connected successfully! ' + (data.warning || ''));
                    setConnectModal({ open: false, platform: '' });
                }
            } else {
                alert('Failed to connect: ' + data.message);
            }
        } catch (err) {
            console.error(err);
            alert('Error connecting account');
        } finally {
            setConnecting(false);
        }
    };

    const confirmDisconnect = async () => {
        const platform = disconnectModal.platform;
        try {
            const token = localStorage.getItem('botfree_token');
            const response = await fetch('http://localhost:5000/api/onboarding/social/disconnect', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ platform })
            });

            if (response.ok) {
                await refreshProfile();
                setDisconnectModal({ open: false, platform: '' });
            } else {
                alert('Failed to disconnect');
            }
        } catch (err) {
            console.error(err);
            alert('Error disconnecting account');
        }
    };

    // Helper to check if platform is connected
    const isConnected = (platformName: string) => {
        if (!profile?.onboardingData?.platforms) return false;
        return profile.onboardingData.platforms.some((p: string) => p.toLowerCase() === platformName.toLowerCase());
    };

    return (
        <DashboardLayout role="influencer">
            <div className="mb-8">
                <h1 className="text-2xl font-black text-gray-900 tracking-tighter mb-1">Creator Settings</h1>
                <p className="text-xs text-gray-500 font-medium tracking-tight">Configure your public profile and account security.</p>
            </div>

            <div className="flex flex-col lg:flex-row gap-8">
                {/* Sidebar Tabs */}
                <div className="lg:w-60 shrink-0">
                    <div className="bg-white rounded-2xl border border-gray-100 p-2 shadow-sm space-y-1">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all duration-200 group ${activeTab === tab.id
                                    ? 'bg-brand-blue/5 text-brand-blue'
                                    : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
                                    }`}
                            >
                                <tab.icon className={`w-4 h-4 ${activeTab === tab.id ? 'text-brand-blue' : 'text-gray-400 group-hover:text-gray-900'}`} />
                                <span className="font-bold text-xs">{tab.label}</span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Content Area */}
                <div className="flex-1 bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
                    {activeTab === 'profile' && (
                        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <div>
                                <h3 className="text-xl font-black tracking-tight mb-6">Identity</h3>
                                <div className="flex items-center gap-6">
                                    <div className="relative group cursor-pointer">
                                        <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center border-2 border-dashed border-gray-200 group-hover:border-brand-blue transition-colors">
                                            <User className="w-8 h-8 text-gray-300 group-hover:text-brand-blue transition-colors" />
                                        </div>
                                    </div>
                                    <div>
                                        <div className="text-sm font-black text-gray-900 mb-0.5 tracking-tight">Profile Header</div>
                                        <div className="text-[9px] text-gray-400 font-bold uppercase tracking-widest leading-relaxed">Recommended 800x800px.</div>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2.5">
                                    <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest px-1">Display Name</label>
                                    <input type="text" defaultValue={profile?.name || ''} placeholder="Alex Influencer" className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl outline-none font-bold text-gray-900 text-xs focus:ring-2 focus:ring-brand-blue/10 focus:border-brand-blue transition-all" />
                                </div>
                                <div className="space-y-2.5">
                                    <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest px-1">Contact Email</label>
                                    <input type="email" defaultValue={profile?.email || ''} placeholder="alex@creator.com" disabled className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl outline-none font-bold text-gray-900 text-xs focus:ring-2 focus:ring-brand-blue/10 focus:border-brand-blue transition-all opacity-60" />
                                </div>

                                <div className="space-y-3 md:col-span-2">
                                    <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest px-1">Your Niches</label>
                                    <div className="flex flex-wrap gap-2">
                                        {niches.map(niche => (
                                            <button key={niche} className={`px-4 py-2 border rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${niche === 'Tech' || niche === 'SaaS' ? 'bg-brand-blue border-brand-blue text-white shadow-lg shadow-brand-blue/20' : 'bg-white border-gray-100 text-gray-400 hover:border-brand-blue/20 hover:text-gray-600'}`}>
                                                {niche}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'socials' && (
                        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <div>
                                <h3 className="text-xl font-black tracking-tight mb-2">Connected Accounts</h3>
                                <p className="text-[10px] text-gray-400 font-medium">Verify your engagement metrics across platforms.</p>
                            </div>

                            <div className="space-y-4">
                                {[
                                    { id: 'instagram', name: 'Instagram', icon: Instagram, color: 'text-pink-500', bg: 'bg-pink-50' },
                                    { id: 'youtube', name: 'YouTube', icon: Youtube, color: 'text-red-500', bg: 'bg-red-50' }
                                ].map((social) => {
                                    const connected = isConnected(social.id);
                                    // Fetch distinct handle if available, otherwise fallback (legacy)
                                    const displayHandle = profile?.onboardingData?.socialHandles?.[social.id] || (connected ? profile?.handle : 'Not connected');

                                    // Get platform specific stats (currently only implemented for YouTube)
                                    let platformStats: any = {};
                                    let profilePic = null;
                                    let subCount = null;
                                    let subLabel = 'subscribers';

                                    if (social.id === 'youtube' && connected && profile?.youtubeStats?.overall_stats) {
                                        platformStats = profile.youtubeStats.overall_stats;
                                        profilePic = platformStats.profile_pic_url;
                                        subCount = platformStats.subscribers;
                                        subLabel = 'subscribers';
                                    } else if (social.id === 'instagram' && connected && profile?.instagramStats) {
                                        platformStats = profile.instagramStats;
                                        profilePic = platformStats.profile_pic_url;
                                        subCount = platformStats.follower_count;
                                        subLabel = 'followers';
                                    }

                                    return (
                                        <div key={social.name} className="flex items-center justify-between p-5 bg-gray-50 rounded-2xl border border-gray-100 group hover:border-brand-blue/20 transition-all">
                                            <div className="flex items-center gap-4">
                                                {/* Icon or Profile Pic */}
                                                <div className={`w-10 h-10 ${social.bg} ${social.color} rounded-xl flex items-center justify-center overflow-hidden shrink-0`}>
                                                    {profilePic ? (
                                                        <img src={profilePic} alt={social.name} className="w-full h-full object-cover" />
                                                    ) : (
                                                        <social.icon className="w-5 h-5" />
                                                    )}
                                                </div>

                                                {/* Text Info */}
                                                <div>
                                                    <div className="text-sm font-black text-gray-900 tracking-tight">{social.name}</div>
                                                    <div className={`text-[10px] font-medium ${connected ? 'text-green-600' : 'text-gray-400'}`}>
                                                        {connected ? displayHandle : 'Not connected'}
                                                    </div>
                                                    {/* Show subscriber/follower count if available */}
                                                    {subCount && (
                                                        <div className="text-[9px] font-bold text-gray-500 mt-0.5">
                                                            {(subCount / 1000).toFixed(1)}k {subLabel}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => connected ? handleDisconnectClick(social.id) : handleConnectClick(social.name)}
                                                className={`px-5 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${connected ? 'bg-white text-red-500 border border-red-100 hover:bg-red-50' : 'bg-brand-blue text-white shadow-lg shadow-brand-blue/20 hover:scale-105'}`}
                                            >
                                                {connected ? 'Disconnect' : 'Connect'}
                                            </button>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {activeTab === 'security' && (
                        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <div>
                                <h3 className="text-xl font-black tracking-tight mb-8">Security Controls</h3>
                                <div className="space-y-6 max-w-lg">
                                    <div className="space-y-2.5">
                                        <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest px-1">Current Password</label>
                                        <div className="relative">
                                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
                                            <input type="password" placeholder="••••••••" className="w-full pl-12 px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl outline-none font-bold text-gray-900 text-xs focus:ring-2 focus:ring-brand-blue/10 focus:border-brand-blue transition-all" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Connect Modal */}
            {connectModal.open && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-6 backdrop-blur-sm">
                    <div className="bg-white rounded-3xl w-full max-w-md p-8 shadow-2xl relative animate-in zoom-in-95 duration-200">
                        <button
                            onClick={() => setConnectModal({ open: false, platform: '' })}
                            className="absolute top-6 right-6 text-gray-400 hover:text-gray-900"
                        >
                            <X className="w-5 h-5" />
                        </button>

                        {!verificationData ? (
                            <>
                                <div className="text-center mb-6">
                                    <div className="w-16 h-16 bg-brand-blue/5 text-brand-blue rounded-2xl flex items-center justify-center mx-auto mb-4">
                                        {connectModal.platform === 'Instagram' ? <Instagram className="w-8 h-8 text-pink-500" /> : <Youtube className="w-8 h-8" />}
                                    </div>
                                    <h3 className="text-2xl font-black tracking-tight mb-2">Connect {connectModal.platform}</h3>
                                    <p className="text-xs text-gray-500 font-medium">Enter your handle or channel URL to verify stats.</p>
                                </div>

                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Channel Handle / URL</label>
                                        <input
                                            type="text"
                                            value={handleInput}
                                            onChange={(e) => setHandleInput(e.target.value)}
                                            placeholder="@channel_handle"
                                            className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl outline-none font-bold text-gray-900 text-xs focus:ring-2 focus:ring-brand-blue/10 focus:border-brand-blue transition-all"
                                        />
                                    </div>

                                    <button
                                        onClick={submitConnect}
                                        disabled={connecting}
                                        className="w-full bg-brand-blue hover:bg-brand-blue/90 text-white py-4 rounded-xl font-black text-xs uppercase tracking-widest transition-all shadow-lg shadow-brand-blue/20 disabled:opacity-50"
                                    >
                                        {connecting ? 'Verifying...' : 'Connect Account'}
                                    </button>
                                </div>
                            </>
                        ) : (
                            <div className="text-center py-4">
                                <div className="w-24 h-24 bg-gray-100 rounded-full mx-auto mb-4 border-4 border-white shadow-xl overflow-hidden">
                                    {/* Handle both YT and IG profile pics */}
                                    {(verificationData.overall_stats?.profile_pic_url || verificationData.profile_pic_url) ? (
                                        <img src={verificationData.overall_stats?.profile_pic_url || verificationData.profile_pic_url} alt="Profile" className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center bg-brand-blue text-white"><Shield className="w-10 h-10" /></div>
                                    )}
                                </div>

                                {/* Handle Name: YT (channel_info.name) vs IG (full_name or username) */}
                                <h3 className="text-2xl font-black text-gray-900 mb-1">
                                    {verificationData.channel_info?.name || verificationData.full_name || verificationData.username || 'Account Verified'}
                                </h3>

                                <div className="text-brand-blue font-bold text-sm mb-6 bg-brand-blue/10 inline-block px-4 py-1 rounded-full">
                                    {/* Handle Subs: YT (subscribers) vs IG (follower_count) */}
                                    {verificationData.overall_stats?.subscribers
                                        ? `${(verificationData.overall_stats.subscribers / 1000).toFixed(1)}k Subscribers`
                                        : verificationData.follower_count
                                            ? `${(verificationData.follower_count / 1000).toFixed(1)}k Followers`
                                            : 'Connected Successfully'}
                                </div>
                                <button
                                    onClick={() => setConnectModal({ open: false, platform: '' })}
                                    className="w-full bg-green-500 hover:bg-green-600 text-white py-4 rounded-xl font-black text-xs uppercase tracking-widest transition-all shadow-lg shadow-green-500/20"
                                >
                                    Confirm & Close
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Disconnect Warning Modal */}
            {disconnectModal.open && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-6 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white rounded-3xl w-full max-w-sm p-8 shadow-2xl relative animate-in zoom-in-95 duration-200 text-center">
                        <div className="w-16 h-16 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                            <Shield className="w-8 h-8" />
                        </div>
                        <h3 className="text-xl font-black text-gray-900 mb-2">Disconnect Account?</h3>
                        <p className="text-xs text-gray-500 font-medium mb-6 leading-relaxed">
                            Are you sure you want to disconnect <span className="text-gray-900 font-bold capitalize">{disconnectModal.platform}</span>? This will remove all analytics data associated with this account.
                        </p>
                        <div className="flex gap-3">
                            <button
                                onClick={() => setDisconnectModal({ open: false, platform: '' })}
                                className="flex-1 bg-gray-50 hover:bg-gray-100 text-gray-700 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={confirmDisconnect}
                                className="flex-1 bg-red-500 hover:bg-red-600 text-white py-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all shadow-lg shadow-red-500/20"
                            >
                                Disconnect
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </DashboardLayout>
    );
};
