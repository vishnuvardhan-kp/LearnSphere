import { Rocket, Briefcase, User } from 'lucide-react';

const portals = [
    {
        category: 'For Investors',
        title: 'Trust & ROI Data',
        description: 'Access a curated pipeline of startups pre-vetted for market fit and growth potential.',
        items: [
            'Vetted high-growth deal flow',
            'Integrated influencer marketing data',
            'Simplified investment tracking'
        ],
        icon: Briefcase,
        color: 'text-brand-blue',
        bg: 'bg-brand-blue/5',
        border: 'border-brand-blue/10'
    },
    {
        category: 'For Founders',
        title: 'Funding & Growth',
        description: 'Bridge the gap between raising capital and scaling sales through influencer-driven loops.',
        items: [
            'Create fundable pitch profiles',
            'Browse influencer databases',
            'Immediate sales-capital loops'
        ],
        icon: Rocket,
        color: 'text-brand-indigo',
        bg: 'bg-brand-indigo/5',
        border: 'border-brand-indigo/10'
    },
    {
        category: 'For Creators',
        title: 'Monetization & Equity',
        description: 'Become more than just an ad. Partner with companies for equity and long-term deals.',
        items: [
            'Equity stakes (Sweat Equity)',
            'Performance-based commissions',
            'Brand ambassadorships'
        ],
        icon: User,
        color: 'text-emerald-500',
        bg: 'bg-emerald-50',
        border: 'border-emerald-100'
    }
];

export const Features = () => {
    return (
        <section id="features" className="py-32 bg-white relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-gray-100 to-transparent"></div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="text-center mb-24">
                    <h2 className="text-brand-blue font-black tracking-[0.2em] uppercase text-xs mb-4">Marketplace Portals</h2>
                    <p className="text-5xl font-black text-gray-900 mb-6 tracking-tighter">Solving Problems for Every Side</p>
                    <p className="text-xl text-gray-500 max-w-3xl mx-auto font-medium leading-relaxed">
                        We've built a three-sided ecosystem that aligns incentives across the board. Innovation meets Capital meets Influence.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {portals.map((portal, idx) => (
                        <div key={idx} className={`group p-10 rounded-3xl border ${portal.border} bg-white hover:shadow-premium transition-all duration-500 flex flex-col`}>
                            <div className="flex items-center justify-between mb-8">
                                <div className={`w-16 h-16 rounded-2xl ${portal.bg} ${portal.color} flex items-center justify-center transition-transform group-hover:scale-110`}>
                                    <portal.icon className="w-8 h-8" />
                                </div>
                                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{portal.category}</span>
                            </div>

                            <h3 className="text-2xl font-black text-gray-900 mb-4 tracking-tight">{portal.title}</h3>
                            <p className="text-gray-500 leading-relaxed font-medium mb-8 flex-1">{portal.description}</p>

                            <div className="space-y-4 pt-8 border-t border-gray-50">
                                {portal.items.map((item, i) => (
                                    <div key={i} className="flex items-center gap-3">
                                        <div className={`w-1.5 h-1.5 rounded-full ${portal.color}`}></div>
                                        <span className="text-sm font-bold text-gray-700">{item}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};
