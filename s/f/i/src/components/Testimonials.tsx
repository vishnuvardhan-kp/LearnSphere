import { Star } from 'lucide-react';

const testimonials = [
    {
        text: "LearnSphere has completely transformed how I deliver my content. The instructor backoffice is so intuitive, and my students love the gamified experience.",
        author: "Dr. Sarah Mitchell",
        role: "Lead Instructor, Tech Academy",
        avatar: "SM"
    },
    {
        text: "I've tried many platforms, but none offer the seamless experience of LearnSphere. The full-screen player and interactive quizzes make learning feel like playing.",
        author: "James Davis",
        role: "Senior UX Learner",
        avatar: "JD"
    },
    {
        text: "As an organization, the granular access rules have been a game changer for our internal training. Managing visibility and invites is now effortless.",
        author: "Emily Lopez",
        role: "Head of Learning & Development",
        avatar: "EL"
    }
];

export const Testimonials = () => {
    return (
        <section id="testimonials" className="py-24 bg-gray-50 overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-brand-blue font-bold tracking-wide uppercase text-sm mb-3">Community Success</h2>
                    <p className="text-4xl font-extrabold text-gray-900 mb-4">Instructor Stories & Student Reviews</p>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                        Join thousands of educators and learners already thriving on LearnSphere.
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
