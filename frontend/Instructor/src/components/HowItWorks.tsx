import { Globe, TrendingUp, Handshake, Layers } from 'lucide-react';

const steps = [
    {
        number: '01',
        title: 'Connect',
        description: 'Founders list their vision; Investors find their next big win; Influencers find their next big brand.',
        icon: Globe,
        color: 'text-brand-blue',
        bg: 'bg-brand-blue/10'
    },
    {
        number: '02',
        title: 'Collaborate',
        description: 'Use integrated tools to finalize investment rounds and marketing briefs in one unified dashboard.',
        icon: Handshake,
        color: 'text-brand-indigo',
        bg: 'bg-brand-indigo/10'
    },
    {
        number: '03',
        title: 'Capitalize',
        description: "Scale through influencer-driven sales loops, increasing value for everyone in the ecosystem.",
        icon: TrendingUp,
        color: 'text-emerald-500',
        bg: 'bg-emerald-50'
    }
];

export const HowItWorks = () => {
    return (
        <section id="how-it-works" className="py-32 bg-[#F8FAFC] relative overflow-hidden">
            <div className="absolute inset-0 bg-grid opacity-20"></div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="text-center mb-24">
                    <h2 className="text-brand-blue font-black tracking-[0.2em] uppercase text-xs mb-4">Strategic Process</h2>
                    <p className="text-5xl font-black text-gray-900 mb-6 tracking-tighter">The Flywheel Mechanism</p>
                    <p className="text-xl text-gray-500 max-w-2xl mx-auto font-medium leading-relaxed">
                        A seamless three-step flow designed to simplify connection and accelerate growth.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-20">
                    {steps.map((step, idx) => (
                        <div key={idx} className="relative group">
                            <div className="flex flex-col items-center text-center">
                                <div className={`w-24 h-24 rounded-[2rem] ${step.bg} ${step.color} flex items-center justify-center mb-10 transition-all duration-500 group-hover:scale-110 group-hover:-rotate-6 shadow-xl shadow-transparent group-hover:shadow-current/5`}>
                                    <step.icon className="w-10 h-10" />
                                </div>
                                <div className="text-[10px] font-black text-gray-300 uppercase tracking-[0.3em] mb-4">Phase {step.number}</div>
                                <h3 className="text-3xl font-black text-gray-900 mb-6 tracking-tight">{step.title}</h3>
                                <p className="text-lg text-gray-500 leading-relaxed font-medium">{step.description}</p>
                            </div>

                            {idx < steps.length - 1 && (
                                <div className="hidden lg:block absolute top-12 left-full w-full h-px bg-gradient-to-r from-gray-200 to-transparent -translate-x-12 z-0"></div>
                            )}
                        </div>
                    ))}
                </div>

                <div className="mt-24 p-12 glass rounded-3xl border border-gray-100 flex flex-col md:flex-row items-center justify-between gap-10 shadow-premium">
                    <div className="flex items-center gap-6">
                        <div className="w-16 h-16 bg-black rounded-2xl flex items-center justify-center shrink-0">
                            <Layers className="text-brand-blue w-8 h-8" />
                        </div>
                        <div>
                            <div className="text-xl font-black text-gray-900 tracking-tight">Unified Marketplace Layer</div>
                            <div className="text-sm font-medium text-gray-400">Where capital meets influence in one dashboard.</div>
                        </div>
                    </div>
                    <button className="px-10 py-5 bg-black text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-gray-800 transition-all shadow-xl shadow-gray-200">
                        Join the ecosystem
                    </button>
                </div>
            </div>
        </section>
    );
};
