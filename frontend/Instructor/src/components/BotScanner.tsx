import React from 'react';
import { Search, Bot, AlertTriangle, Loader2, ShieldCheck, TrendingDown, Users, Globe } from 'lucide-react';

export const BotScanner = () => {
    const [username, setUsername] = React.useState('');
    const [isScanning, setIsScanning] = React.useState(false);
    const [showResults, setShowResults] = React.useState(false);

    const handleScan = (e: React.FormEvent) => {
        e.preventDefault();
        if (!username) return;
        setIsScanning(true);
        setShowResults(false);
        setTimeout(() => {
            setIsScanning(false);
            setShowResults(true);
        }, 3000);
    };

    return (
        <section className="py-32 bg-gray-50 relative overflow-hidden">
            <div className="absolute inset-0 bg-grid opacity-30"></div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="text-center mb-16">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-blue/10 text-brand-blue text-xs font-bold uppercase tracking-widest mb-4">
                        Interactive Demo
                    </div>
                    <h2 className="text-4xl lg:text-5xl font-extrabold text-gray-900 mb-4 tracking-tight">Try Our AI Bot Scanner</h2>
                    <p className="text-xl text-gray-500 max-w-2xl mx-auto font-medium">
                        Instantly analyze any Instagram or TikTok profile for bot activity and fake engagement.
                    </p>
                </div>

                <div className="max-w-3xl mx-auto">
                    <div className="glass p-2 rounded-3xl shadow-premium mb-12">
                        <form onSubmit={handleScan} className="flex flex-col sm:flex-row gap-2">
                            <div className="flex-1 relative">
                                <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <input
                                    type="text"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    placeholder="Enter @username to scan..."
                                    className="w-full pl-14 pr-6 py-5 bg-white rounded-2xl border-none focus:ring-2 focus:ring-brand-blue outline-none text-gray-900 font-medium text-lg shadow-sm"
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={isScanning}
                                className="px-10 py-5 bg-brand-blue hover:bg-brand-blue/90 text-white rounded-2xl font-bold text-lg transition-all shadow-lg shadow-brand-blue/20 flex items-center justify-center min-w-[180px] disabled:opacity-50"
                            >
                                {isScanning ? (
                                    <>
                                        <Loader2 className="w-6 h-6 animate-spin mr-2" />
                                        Scanning...
                                    </>
                                ) : 'Run AI Analysis'}
                            </button>
                        </form>
                    </div>

                    {showResults && (
                        <div className="animate-in zoom-in-95 fade-in duration-500">
                            <div className="glass rounded-3xl overflow-hidden shadow-premium">
                                {/* Report Header */}
                                <div className="bg-black p-8 text-white flex justify-between items-center">
                                    <div className="flex items-center gap-4">
                                        <div className="w-14 h-14 rounded-2xl bg-brand-blue/20 flex items-center justify-center">
                                            <Bot className="w-8 h-8 text-brand-blue" />
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-bold">Analysis for @{username}</h3>
                                            <p className="text-gray-400 text-sm font-medium">Scanned 1.2k unique data points</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-3xl font-black text-red-500">High Risk</div>
                                        <div className="text-gray-400 text-xs font-bold uppercase tracking-widest">Risk Score</div>
                                    </div>
                                </div>

                                {/* Report Metrics */}
                                <div className="p-10 bg-white grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-6">
                                        <div className="flex items-center justify-between p-4 bg-red-50 rounded-2xl border border-red-100">
                                            <div className="flex items-center gap-3">
                                                <AlertTriangle className="text-red-500 w-5 h-5" />
                                                <span className="text-sm font-bold text-gray-900">Estimated Bot Audience</span>
                                            </div>
                                            <span className="text-xl font-black text-red-600">32.4%</span>
                                        </div>

                                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100">
                                            <div className="flex items-center gap-3">
                                                <TrendingDown className="text-orange-500 w-5 h-5" />
                                                <span className="text-sm font-bold text-gray-900">Engagement Authenticity</span>
                                            </div>
                                            <span className="text-xl font-black text-gray-900">Low (0.8%)</span>
                                        </div>
                                    </div>

                                    <div className="bg-gray-50 rounded-[2rem] p-6 flex flex-col justify-center">
                                        <div className="flex items-center gap-2 mb-4">
                                            <ShieldCheck className="text-green-500 w-5 h-5" />
                                            <h4 className="font-bold text-gray-900 text-sm uppercase tracking-widest">AI Verdict</h4>
                                        </div>
                                        <p className="text-gray-600 font-medium leading-relaxed">
                                            This account shows pattern matching for automated bot pods. Engagement spikes align with known "click farms". <br />
                                            <span className="text-red-500 font-bold">Not Recommended for Brand Collabs.</span>
                                        </p>
                                    </div>
                                </div>

                                {/* Footer Stats */}
                                <div className="px-10 py-6 bg-gray-50/50 border-t border-gray-100 flex flex-wrap gap-8">
                                    <div className="flex items-center gap-2">
                                        <Users className="w-4 h-4 text-gray-400" />
                                        <span className="text-xs font-bold text-gray-500 tracking-tighter uppercase">58k Followers</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Globe className="w-4 h-4 text-gray-400" />
                                        <span className="text-xs font-bold text-gray-500 tracking-tighter uppercase">Global Reach</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
};
