import { Award, Star, Zap, Shield, Target, Crown } from 'lucide-react';

export const GamificationRanks = () => {
    const ranks = [
        {
            badge: 'Newbie',
            points: '20 Points',
            status: 'Just starting the journey.',
            icon: Zap,
            color: 'text-blue-500',
            bg: 'bg-blue-50'
        },
        {
            badge: 'Explorer',
            points: '40 Points',
            status: 'Consistently engaging with lessons.',
            icon: Target,
            color: 'text-indigo-500',
            bg: 'bg-indigo-50'
        },
        {
            badge: 'Achiever',
            points: '60 Points',
            status: 'Demonstrated course dedication.',
            icon: Star,
            color: 'text-amber-500',
            bg: 'bg-amber-50'
        },
        {
            badge: 'Specialist',
            points: '80 Points',
            status: 'Mastering complex subjects.',
            icon: Shield,
            color: 'text-emerald-500',
            bg: 'bg-emerald-50'
        },
        {
            badge: 'Expert',
            points: '100 Points',
            status: 'High-level proficiency reached.',
            icon: Award,
            color: 'text-rose-500',
            bg: 'bg-rose-50'
        },
        {
            badge: 'Master',
            points: '120 Points',
            status: 'Top-tier platform authority.',
            icon: Crown,
            color: 'text-brand-blue',
            bg: 'bg-brand-blue/10'
        }
    ];

    return (
        <section className="py-32 bg-white relative overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="text-center mb-20">
                    <h2 className="text-brand-blue font-black tracking-[0.2em] uppercase text-xs mb-4">Mastery Progression</h2>
                    <p className="text-5xl font-black text-gray-900 mb-6 tracking-tighter">Gamification Tiers</p>
                    <p className="text-xl text-gray-500 max-w-2xl mx-auto font-medium leading-relaxed">
                        Earn points through engagement and accuracy to level up your status and unlock exclusive certifications.
                    </p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
                    {ranks.map((rank, idx) => (
                        <div key={idx} className="group relative p-8 rounded-[2.5rem] bg-gray-50 hover:bg-white border border-transparent hover:border-gray-100 hover:shadow-premium transition-all duration-500 text-center flex flex-col items-center">
                            <div className={`w-16 h-16 rounded-2xl ${rank.bg} ${rank.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500 shadow-sm`}>
                                <rank.icon className="w-8 h-8" />
                            </div>
                            <div className="text-xs font-black text-brand-blue uppercase tracking-widest mb-1">{rank.badge}</div>
                            <div className="text-2xl font-black text-gray-900 mb-4 tracking-tight">{rank.points}</div>
                            <p className="text-xs font-bold text-gray-400 leading-relaxed">{rank.status}</p>

                            {/* Decorative line for progression */}
                            {idx < ranks.length - 1 && (
                                <div className="hidden lg:block absolute top-1/2 -right-3 w-6 h-px bg-gray-100 z-0"></div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};
