import React from 'react';
import { Target, Zap, Shield, Plus, Mic, ChevronLeft, MoreHorizontal, Menu } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { API_ENDPOINTS } from '../config/api';

export const AIAgent = () => {
    const [activeTab, setActiveTab] = React.useState('strategy');
    const [isTyping, setIsTyping] = React.useState(false);
    const [sidebarOpen, setSidebarOpen] = React.useState(true);
    const [inputValue, setInputValue] = React.useState('');
    const navigate = useNavigate();
    const chatEndRef = React.useRef<HTMLDivElement>(null);

    const agents = [
        {
            id: 'strategy',
            name: 'Strategic Planner',
            icon: StrategyIcon,
            color: 'text-brand-blue',
            bg: 'bg-brand-blue/10',
            status: 'Active',
            description: 'AI-driven campaign scaling and market fit analysis.',
            suggestions: ['Scale Summer Drop', 'Analyze', 'Fashion Trends 2026'],
            initialMessage: "Strategic Planner online. I can analyze influencers for you. Try mentioning an influencer by their handle."
        },
        {
            id: 'vetting',
            name: 'Influencer Vetting',
            icon: Shield,
            color: 'text-brand-indigo',
            bg: 'bg-brand-indigo/10',
            status: 'Processing',
            description: 'Deep-dive authenticity audits and audience vetting.',
            suggestions: ['Audit @fashion_fix', 'Paris Niche Report', 'Bot Risk Audit'],
            initialMessage: "Vetting Agent ready. I am currently processing the Paris influencer cohort. Would you like a preliminary authenticity report?"
        },
        {
            id: 'detection',
            name: 'Fraud Detection',
            icon: Target,
            color: 'text-red-500',
            bg: 'bg-red-50',
            status: 'Monitoring',
            description: 'Real-time bot-farm blocking and traffic scrubbing.',
            suggestions: ['Check IP Spikes', 'View Blocked Logs', 'Region 7 Audit'],
            initialMessage: "Fraud Sentry active. I've flagged suspicious behavior from 1,422 unique IP addresses."
        },
    ];

    const activeAgent = agents.find(a => a.id === activeTab) || agents[0];

    const [messages, setMessages] = React.useState<{ role: string, content: string, context?: any }[]>([
        { role: 'ai', content: activeAgent.initialMessage }
    ]);

    // Update initial message when tab changes
    React.useEffect(() => {
        setMessages([{ role: 'ai', content: activeAgent.initialMessage }]);
    }, [activeAgent.id]);

    React.useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isTyping]);

    const handleSend = async () => {
        if (!inputValue.trim()) return;

        const userMsg = inputValue;
        setInputValue('');
        setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
        setIsTyping(true);

        try {
            const token = localStorage.getItem('botfree_token');
            const res = await fetch(API_ENDPOINTS.AI_CHAT, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ message: userMsg, agentId: activeAgent.id })
            });

            if (res.ok) {
                const data = await res.json();
                setMessages(prev => [...prev, {
                    role: 'ai',
                    content: data.response,
                    context: data.context
                }]);
            } else {
                setMessages(prev => [...prev, { role: 'ai', content: "I'm having trouble connecting to my knowledge base right now." }]);
            }
        } catch (err) {
            console.error(err);
            setMessages(prev => [...prev, { role: 'ai', content: "Network error. Please try again." }]);
        } finally {
            setIsTyping(false);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <div className="h-screen w-full bg-white flex flex-col font-sans overflow-hidden">
            {/* Minimalist Compact Top Bar */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 bg-white/80 backdrop-blur-md z-20 shrink-0">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => navigate('/company-dashboard')}
                        className="p-2 -ml-1 text-gray-400 hover:text-gray-900 hover:bg-gray-50 rounded-full transition-all"
                        title="Back to Dashboard"
                    >
                        <ChevronLeft className="w-5 h-5" />
                    </button>

                    <button
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                        className="p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-50 rounded-full transition-all lg:hidden"
                    >
                        <Menu className="w-5 h-5" />
                    </button>

                    <div className="h-6 w-px bg-gray-200 mx-1 hidden lg:block"></div>

                    <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 ${activeAgent.bg} rounded-lg flex items-center justify-center`}>
                            <activeAgent.icon className={`w-4 h-4 ${activeAgent.color}`} />
                        </div>
                        <div>
                            <h1 className="text-sm font-black text-gray-900 tracking-tight leading-none">{activeAgent.name}</h1>
                            <div className="flex items-center gap-1.5 mt-0.5">
                                <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                                <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest leading-none">Online</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="hidden md:flex bg-gray-50 p-0.5 rounded-lg border border-gray-100">
                    {agents.map((agent) => (
                        <button
                            key={agent.id}
                            onClick={() => setActiveTab(agent.id)}
                            className={`px-3 py-1.5 rounded-md font-bold text-[9px] uppercase tracking-wider transition-all ${activeTab === agent.id
                                ? 'bg-white text-gray-900 shadow-sm'
                                : 'text-gray-400 hover:text-gray-600'}`}
                        >
                            {agent.name.split(' ')[0]}
                        </button>
                    ))}
                </div>

                <div className="flex items-center gap-4">
                    <button className="text-gray-400 hover:text-gray-900 transition-colors">
                        <MoreHorizontal className="w-5 h-5" />
                    </button>
                </div>
            </div>

            <div className="flex-1 flex overflow-hidden">
                {/* Sidebar - HIDDEN ON MOBILE BY DEFAULT */}
                <div className={`${sidebarOpen ? 'w-64 translate-x-0' : 'w-0 -translate-x-full opacity-0'} bg-gray-50 border-r border-gray-100 transition-all duration-300 flex flex-col shrink-0 overflow-hidden`}>
                    <div className="p-4 space-y-6 overflow-y-auto flex-1">
                        <button className="w-full flex items-center gap-2 px-3 py-2.5 bg-white border border-gray-200 rounded-xl shadow-sm hover:border-brand-blue/30 hover:shadow-md transition-all group">
                            <Plus className="w-4 h-4 text-brand-blue" />
                            <span className="text-xs font-bold text-gray-700 group-hover:text-brand-blue">New Chat</span>
                        </button>
                        {/* Placeholder History */}
                        <div className="space-y-2">
                            <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Recent</div>
                            <button className="w-full text-left px-3 py-2 rounded-lg hover:bg-white text-xs font-bold text-gray-600">
                                Analysis:
                            </button>
                        </div>
                    </div>
                </div>

                {/* Main Chat Area */}
                <div className="flex-1 flex flex-col relative bg-white">
                    <div className="flex-1 overflow-y-auto scrollbar-hide px-6 py-8 pb-32">
                        <div className="w-full max-w-4xl mx-auto space-y-8">

                            {messages.map((msg, idx) => (
                                <div key={idx} className={`flex gap-4 group animate-in fade-in slide-in-from-bottom-2 duration-500 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 shadow-sm border border-gray-100 mt-1 ${msg.role === 'ai' ? activeAgent.bg : 'bg-black'}`}>
                                        {msg.role === 'ai' ? <activeAgent.icon className={`w-4 h-4 ${activeAgent.color}`} /> : <span className="text-[8px] font-black text-white">ME</span>}
                                    </div>

                                    <div className={`max-w-2xl ${msg.role === 'user' ? 'bg-brand-blue text-white shadow-lg shadow-brand-blue/20' : 'bg-gray-50 border border-gray-100 text-gray-700 shadow-sm'} p-4 rounded-2xl ${msg.role === 'user' ? 'rounded-tr-none' : 'rounded-tl-none'} text-sm font-medium leading-relaxed whitespace-pre-wrap`}>
                                        {msg.content}

                                        {/* RAG Context Card - Multi-Platform */}
                                        {msg.context && (
                                            <div className="mt-4 space-y-3">
                                                {/* Influencer Header */}
                                                <div className="bg-white rounded-xl p-3 border border-gray-200 shadow-sm">
                                                    <div className="flex items-center justify-between">
                                                        <div>
                                                            <div className="text-sm font-bold text-gray-900">{msg.context.name}</div>
                                                            <div className="text-[10px] text-gray-400 font-bold uppercase">{msg.context.niche}</div>
                                                        </div>
                                                        <div className="px-2 py-1 bg-brand-blue/10 rounded-md">
                                                            <div className="text-[9px] font-black text-brand-blue uppercase">
                                                                {msg.context.primaryPlatform}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Instagram Card */}
                                                {msg.context.instagram?.hasData && (
                                                    <div className="bg-gradient-to-br from-pink-50 to-purple-50 rounded-xl p-3 border border-pink-100 shadow-sm">
                                                        <div className="flex items-center gap-2 mb-2">
                                                            <div className="w-7 h-7 bg-gradient-to-br from-pink-500 to-purple-500 rounded-lg flex items-center justify-center">
                                                                <div className="text-[10px] font-black text-white">IG</div>
                                                            </div>
                                                            <div className="text-xs font-bold text-gray-900">Instagram</div>
                                                            {msg.context.instagram.verified && (
                                                                <div className="ml-auto">
                                                                    <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                                                                        <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                                                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                                        </svg>
                                                                    </div>
                                                                </div>
                                                            )}
                                                        </div>
                                                        <div className="grid grid-cols-2 gap-2">
                                                            <div className="bg-white/60 backdrop-blur-sm p-2 rounded-lg text-center">
                                                                <div className="text-[9px] text-gray-500 font-bold uppercase">Followers</div>
                                                                <div className="text-sm font-black text-gray-900">
                                                                    {msg.context.instagram.followers.toLocaleString()}
                                                                </div>
                                                            </div>
                                                            <div className="bg-white/60 backdrop-blur-sm p-2 rounded-lg text-center">
                                                                <div className="text-[9px] text-gray-500 font-bold uppercase">Posts</div>
                                                                <div className="text-sm font-black text-gray-900">
                                                                    {msg.context.instagram.posts.toLocaleString()}
                                                                </div>
                                                            </div>
                                                            {msg.context.instagram.avgLikes > 0 && (
                                                                <div className="bg-white/60 backdrop-blur-sm p-2 rounded-lg text-center">
                                                                    <div className="text-[9px] text-gray-500 font-bold uppercase">Avg Likes</div>
                                                                    <div className="text-sm font-black text-gray-900">
                                                                        {msg.context.instagram.avgLikes.toLocaleString()}
                                                                    </div>
                                                                </div>
                                                            )}
                                                            {msg.context.instagram.engagementRate > 0 && (
                                                                <div className="bg-white/60 backdrop-blur-sm p-2 rounded-lg text-center">
                                                                    <div className="text-[9px] text-gray-500 font-bold uppercase">Engagement</div>
                                                                    <div className="text-sm font-black text-pink-600">
                                                                        {msg.context.instagram.engagementRate}%
                                                                    </div>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                )}

                                                {/* YouTube Card */}
                                                {msg.context.youtube?.hasData && (
                                                    <div className="bg-gradient-to-br from-red-50 to-orange-50 rounded-xl p-3 border border-red-100 shadow-sm">
                                                        <div className="flex items-center gap-2 mb-2">
                                                            <div className="w-7 h-7 bg-gradient-to-br from-red-500 to-red-600 rounded-lg flex items-center justify-center">
                                                                <div className="text-[10px] font-black text-white">YT</div>
                                                            </div>
                                                            <div className="text-xs font-bold text-gray-900">YouTube</div>
                                                        </div>
                                                        <div className="grid grid-cols-2 gap-2">
                                                            <div className="bg-white/60 backdrop-blur-sm p-2 rounded-lg text-center">
                                                                <div className="text-[9px] text-gray-500 font-bold uppercase">Subscribers</div>
                                                                <div className="text-sm font-black text-gray-900">
                                                                    {msg.context.youtube.subscribers.toLocaleString()}
                                                                </div>
                                                            </div>
                                                            <div className="bg-white/60 backdrop-blur-sm p-2 rounded-lg text-center">
                                                                <div className="text-[9px] text-gray-500 font-bold uppercase">Videos</div>
                                                                <div className="text-sm font-black text-gray-900">
                                                                    {msg.context.youtube.videoCount.toLocaleString()}
                                                                </div>
                                                            </div>
                                                            {msg.context.youtube.totalViews > 0 && (
                                                                <div className="bg-white/60 backdrop-blur-sm p-2 rounded-lg text-center">
                                                                    <div className="text-[9px] text-gray-500 font-bold uppercase">Total Views</div>
                                                                    <div className="text-sm font-black text-gray-900">
                                                                        {msg.context.youtube.totalViews.toLocaleString()}
                                                                    </div>
                                                                </div>
                                                            )}
                                                            {msg.context.youtube.avgViewsPerVideo > 0 && (
                                                                <div className="bg-white/60 backdrop-blur-sm p-2 rounded-lg text-center">
                                                                    <div className="text-[9px] text-gray-500 font-bold uppercase">Avg Views</div>
                                                                    <div className="text-sm font-black text-red-600">
                                                                        {msg.context.youtube.avgViewsPerVideo.toLocaleString()}
                                                                    </div>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}

                            {isTyping && (
                                <div className="flex gap-4 animate-in fade-in duration-300">
                                    <div className={`w-8 h-8 ${activeAgent.bg} rounded-full flex items-center justify-center shrink-0 border border-gray-100`}>
                                        <activeAgent.icon className={`w-4 h-4 ${activeAgent.color}`} />
                                    </div>
                                    <div className="flex items-center gap-1 px-3 py-2 bg-gray-50 rounded-2xl rounded-tl-none border border-gray-100 h-10 w-16 justify-center">
                                        <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"></div>
                                        <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:200ms]"></div>
                                        <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:400ms]"></div>
                                    </div>
                                </div>
                            )}
                            <div ref={chatEndRef} />
                        </div>
                    </div>

                    {/* Floating Input Bar */}
                    <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-white via-white to-transparent pt-10">
                        <div className="max-w-3xl mx-auto relative">
                            <div className="relative z-10 bg-white border border-gray-200 rounded-full shadow-2xl shadow-gray-200/50 flex items-center p-1.5 pl-6 focus-within:ring-2 focus-within:ring-brand-blue/10 focus-within:border-brand-blue/30 transition-all duration-300">
                                <input
                                    type="text"
                                    autoFocus
                                    value={inputValue}
                                    onChange={(e) => setInputValue(e.target.value)}
                                    onKeyDown={handleKeyDown}
                                    placeholder={`Ask ${activeAgent.name.split(' ')[1] || 'AI'} anything... (e.g. "Analyze @username")`}
                                    className="flex-1 py-3 bg-transparent border-none outline-none font-medium text-gray-800 placeholder:text-gray-400 text-[15px]"
                                />
                                <div className="flex items-center gap-1 pr-1">
                                    <button className="p-2.5 text-gray-400 hover:text-brand-blue hover:bg-gray-50 rounded-full transition-all">
                                        <Mic className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={handleSend}
                                        className="p-3 bg-black text-white rounded-full hover:bg-brand-blue transition-all shadow-lg active:scale-95 group/btn">
                                        <Zap className="w-4 h-4 fill-current group-hover/btn:scale-110 transition-transform" />
                                    </button>
                                </div>
                            </div>
                            <div className="text-center mt-4">
                                <p className="text-[9px] font-bold text-gray-300 uppercase tracking-widest">
                                    AI-Generated • Encrypted • Private
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const StrategyIcon = () => (
    <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2v8" />
        <path d="m4.93 10.93 1.41 1.41" />
        <path d="M2 18h2" />
        <path d="M20 18h2" />
        <path d="m19.07 10.93-1.41 1.41" />
        <path d="M22 22H2" />
        <path d="m8 22 4-10 4 10" />
    </svg>
);
