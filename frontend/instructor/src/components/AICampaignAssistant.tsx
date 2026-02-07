import React from 'react';
import { Bot, Send, X, Minimize2, Sparkles } from 'lucide-react';

export const AICampaignAssistant = () => {
    const [isOpen, setIsOpen] = React.useState(false);
    const [messages, setMessages] = React.useState([
        { role: 'assistant', content: 'Hello! I am your AI Campaign Strategist. How can I help you optimize your influencer marketing today?' }
    ]);
    const [input, setInput] = React.useState('');

    const handleSend = () => {
        if (!input.trim()) return;

        const newMessages = [...messages, { role: 'user', content: input }];
        setMessages(newMessages);
        setInput('');

        // Simulate AI response
        setTimeout(() => {
            setMessages(prev => [...prev, {
                role: 'assistant',
                content: "I've analyzed your request. Based on current market trends, I recommend increasing spend on 'Summer Zenith 2026' by 15% and vetting 3 more creators in the 'Lifestyle' niche to maximize ROI. Would you like me to find them for you?"
            }]);
        }, 1000);
    };

    return (
        <div className="fixed bottom-8 right-8 z-[100] flex flex-col items-end">
            {/* Chat Window */}
            {isOpen && (
                <div className="mb-4 w-[400px] h-[600px] bg-white rounded-3xl shadow-premium border border-gray-100 flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-8 duration-500">
                    {/* Header */}
                    <div className="p-6 bg-black text-white flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-brand-blue rounded-xl flex items-center justify-center">
                                <Bot className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <div className="text-sm font-black tracking-tight">Campaign Agent</div>
                                <div className="flex items-center gap-1.5">
                                    <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></div>
                                    <span className="text-[10px] font-bold text-white/50 uppercase tracking-widest">AI Online</span>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <button className="p-2 hover:bg-white/10 rounded-lg transition-colors text-white/40"><Minimize2 className="w-4 h-4" /></button>
                            <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-white/10 rounded-lg transition-colors"><X className="w-4 h-4" /></button>
                        </div>
                    </div>

                    {/* Chat Messages */}
                    <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-hide">
                        {messages.map((msg, i) => (
                            <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[80%] p-5 rounded-2xl text-sm font-medium leading-relaxed ${msg.role === 'user'
                                    ? 'bg-brand-blue text-white rounded-tr-none shadow-lg shadow-brand-blue/20'
                                    : 'bg-gray-50 text-gray-700 rounded-tl-none border border-gray-100'
                                    }`}>
                                    {msg.content}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Suggestions */}
                    <div className="px-6 py-4 flex gap-2 overflow-x-auto no-scrollbar border-t border-gray-50">
                        {['Optimize ROI', 'Find Influencers', 'Bot Report', 'Budget Forecast'].map((s) => (
                            <button key={s} className="whitespace-nowrap px-4 py-2 bg-gray-50 border border-gray-100 rounded-xl text-[10px] font-black uppercase tracking-widest text-gray-400 hover:border-brand-blue/30 hover:text-brand-blue transition-all">
                                {s}
                            </button>
                        ))}
                    </div>

                    {/* Input */}
                    <div className="p-6 pt-0">
                        <div className="relative flex items-center gap-3 bg-gray-50 border border-gray-100 rounded-2xl p-2 pl-4 focus-within:ring-2 focus-within:ring-brand-blue/10 focus-within:border-brand-blue transition-all">
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                                placeholder="Ask about your campaigns..."
                                className="bg-transparent border-none outline-none text-sm w-full font-medium text-gray-900"
                            />
                            <button
                                onClick={handleSend}
                                className="w-10 h-10 bg-black text-white rounded-xl flex items-center justify-center hover:bg-gray-800 transition-all shadow-lg active:scale-95"
                            >
                                <Send className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Toggle Button */}
            {!isOpen && (
                <button
                    onClick={() => setIsOpen(true)}
                    className="group relative w-16 h-16 bg-black rounded-2xl flex items-center justify-center shadow-2xl shadow-black/20 hover:scale-110 active:scale-95 transition-all duration-300"
                >
                    <div className="absolute inset-0 bg-brand-blue rounded-2xl blur-xl opacity-0 group-hover:opacity-40 transition-opacity"></div>
                    <Bot className="w-8 h-8 text-brand-blue relative z-10" />
                    <div className="absolute -top-1 -right-1 w-5 h-5 bg-brand-blue rounded-lg flex items-center justify-center border-2 border-white animate-bounce">
                        <Sparkles className="w-2.5 h-2.5 text-white" />
                    </div>
                </button>
            )}
        </div>
    );
};
