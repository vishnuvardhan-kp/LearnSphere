import { Scale, Lock, CheckCircle2 } from 'lucide-react';

export const IntegritySection = () => {
    const rules = [
        {
            title: 'Attempt-Based Scoring',
            description: 'Points are awarded dynamically—first-try success earns maximum rewards, with decreasing points for subsequent attempts to encourage mastery.',
            icon: Scale,
            color: 'text-amber-500',
            bg: 'bg-amber-50'
        },
        {
            title: 'Smart Access Rules',
            description: 'Control your intellectual property. Set courses to Open for free learning, On Invitation for private cohorts, or On Payment for monetization.',
            icon: Lock,
            color: 'text-brand-blue',
            bg: 'bg-brand-blue/5'
        },
        {
            title: 'Completion Verification',
            description: 'Learners must complete all lessons and pass validation checks before unlocking the final certification milestone.',
            icon: CheckCircle2,
            color: 'text-emerald-500',
            bg: 'bg-emerald-50'
        }
    ];

    return (
        <section className="py-32 bg-gray-900 border-y border-white/5 relative overflow-hidden text-white">
            <div className="absolute inset-0 bg-grid-white opacity-5"></div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="flex flex-col lg:flex-row items-center gap-16">
                    <div className="lg:w-1/2">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-blue/10 text-brand-blue text-[10px] font-black uppercase tracking-[0.2em] mb-6">
                            Security & Integrity
                        </div>
                        <h2 className="text-4xl lg:text-6xl font-black mb-8 tracking-tighter leading-tight">
                            Designed for <span className="text-brand-blue">Platform Integrity</span>
                        </h2>
                        <p className="text-xl text-gray-400 font-medium leading-relaxed mb-10">
                            We've built LearnSphere with a core focus on maintaining high educational standards and protecting instructor content.
                        </p>
                        <div className="flex items-center gap-6">
                            <div className="flex -space-x-3">
                                {[1, 2, 3, 4].map(i => (
                                    <div key={i} className="w-12 h-12 rounded-full border-2 border-gray-900 bg-gray-800 flex items-center justify-center overflow-hidden">
                                        <div className="w-full h-full bg-brand-blue/20 animate-pulse"></div>
                                    </div>
                                ))}
                            </div>
                            <div className="text-sm">
                                <span className="block font-black text-white">Trusted by 12k+</span>
                                <span className="text-gray-500 font-medium tracking-tight">Organizations & Instructors</span>
                            </div>
                        </div>
                    </div>

                    <div className="lg:w-1/2 space-y-6">
                        {rules.map((rule, idx) => (
                            <div key={idx} className="group p-8 rounded-3xl bg-white/5 border border-white/10 hover:bg-white/[0.08] hover:border-brand-blue/30 transition-all duration-500">
                                <div className="flex items-start gap-6">
                                    <div className={`w-14 h-14 rounded-2xl ${rule.bg} ${rule.color} flex items-center justify-center mt-1 shrink-0 group-hover:scale-110 transition-transform`}>
                                        <rule.icon className="w-7 h-7" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-black text-white mb-2 tracking-tight">{rule.title}</h3>
                                        <p className="text-gray-400 font-medium leading-relaxed text-sm">
                                            {rule.description}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};
