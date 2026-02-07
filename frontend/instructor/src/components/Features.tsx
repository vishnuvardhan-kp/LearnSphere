import { Rocket, Briefcase, User } from 'lucide-react';

const portals = [
    {
        category: 'For Instructors',
        title: "Instructor's Command Center",
        description: 'Empowering educators with a powerful backoffice to build and manage digital knowledge with surgical precision.',
        items: [
            'Intelligent Course Builder (Video/PDF/Quizzes)',
            'Granular Visibility Controls (Public/Private/Invite)',
            'Advanced Quiz Logic & Point Reductions',
            'Actionable Reporting & Time-on-Lesson Stats'
        ],
        icon: Briefcase,
        color: 'text-brand-blue',
        bg: 'bg-brand-blue/5',
        border: 'border-brand-blue/10'
    },
    {
        category: 'For Learners',
        title: "Learner's Interactive Journey",
        description: 'Master new skills through a frictionless, immersive environment designed for maximum retention.',
        items: [
            'Focused Full-Screen Learning Player',
            'One-Question-at-a-Time Quizzing Interface',
            'Resource Vault for Attachments',
            'Community Validation & Performance Badges'
        ],
        icon: Rocket,
        color: 'text-brand-indigo',
        bg: 'bg-brand-indigo/5',
        border: 'border-brand-indigo/10'
    },
    {
        category: 'For Organizations',
        title: 'Enterprise Management',
        description: 'Control visibility and access to ensure the right content reaches the right audience at scale.',
        items: [
            'Tiered Access (Everyone / Signed In)',
            'On-Invitation Private Training',
            'Integrated Monetization Layer',
            'Full White-label Ecosystem'
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
                    <h2 className="text-brand-blue font-black tracking-[0.2em] uppercase text-xs mb-4">The Ecosystem</h2>
                    <p className="text-5xl font-black text-gray-900 mb-6 tracking-tighter">Knowledge Growth for Everyone</p>
                    <p className="text-xl text-gray-500 max-w-3xl mx-auto font-medium leading-relaxed">
                        A three-sided platform designed to bridge the gap between teaching expertise and learning mastery.
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
