import { Star } from 'lucide-react';

const testimonials = [
    {
        text: "Vyral AI saved us over $50K in wasted ad spend. The bot detection is incredibly accurate and the dashboard makes it easy to track real engagement.",
        author: "Sarah Mitchell",
        role: "Marketing Director, TechCorp",
        avatar: "SM"
    },
    {
        text: "Finally, a platform that actually works! We've seen a 300% increase in authentic engagement since switching to Vyral AI. Game changer for influencer marketing.",
        author: "James Davis",
        role: "CEO, GrowthLabs",
        avatar: "JD"
    },
    {
        text: "The AI bot detection is phenomenal. We can now confidently invest in influencer partnerships knowing we're reaching real people. ROI has never been better.",
        author: "Emily Lopez",
        role: "Head of Digital, BrandCo",
        avatar: "EL"
    }
];

export const Testimonials = () => {
    return (
        <section id="testimonials" className="py-24 bg-gray-50 overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-brand-blue font-bold tracking-wide uppercase text-sm mb-3">Client Success</h2>
                    <p className="text-4xl font-extrabold text-gray-900 mb-4">What Our Clients Say</p>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                        Trusted by marketing teams at leading companies worldwide.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {testimonials.map((t, idx) => (
                        <div key={idx} className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 flex flex-col justify-between">
                            <div>
                                <div className="flex gap-1 mb-6">
                                    {[...Array(5)].map((_, i) => (
                                        <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                                    ))}
                                </div>
                                <p className="text-gray-700 italic text-lg leading-relaxed mb-8">"{t.text}"</p>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-brand-blue/10 rounded-xl flex items-center justify-center font-bold text-brand-blue">
                                    {t.avatar}
                                </div>
                                <div>
                                    <div className="font-bold text-gray-900">{t.author}</div>
                                    <div className="text-sm text-gray-500">{t.role}</div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};
