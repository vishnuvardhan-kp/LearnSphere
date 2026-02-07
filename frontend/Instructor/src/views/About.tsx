import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { Shield, Target, TrendingUp, Heart } from 'lucide-react';

export const About = () => {
    return (
        <div className="min-h-screen bg-white">
            <Navbar />
            <main className="pt-32">
                {/* Hero Section */}
                <section className="relative px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto mb-20 text-center">
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-brand-blue/5 border border-brand-blue/10 mb-6">
                        <span className="text-[10px] font-black text-brand-blue uppercase tracking-widest">Our Story</span>
                    </div>
                    <h1 className="text-4xl lg:text-6xl font-black text-gray-900 tracking-tighter mb-6 leading-[1.1]">
                        Purity in Data, <br />
                        <span className="text-brand-blue font-extrabold italic">Integrity in Action.</span>
                    </h1>
                    <p className="text-sm lg:text-base text-gray-500 max-w-2xl mx-auto leading-relaxed font-medium tracking-tight">
                        Vyral AI was born from a simple observation: the digital marketing landscape was being poisoned by fraudulent traffic. We set out to build the "Antibody" for specialized growth loops.
                    </p>
                </section>

                {/* Values Grid */}
                <section className="bg-gray-50/50 py-20 mb-20">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {[
                                {
                                    icon: <Shield className="w-5 h-5" />,
                                    title: "Trust First",
                                    desc: "We verify every impression, every click, and every conversion. No vanity metrics allowed."
                                },
                                {
                                    icon: <Target className="w-5 h-5" />,
                                    title: "Precision Engineering",
                                    desc: "Our AI doesn't just block bots; it identifies the patterns of human authenticity."
                                },
                                {
                                    icon: <Heart className="w-5 h-5" />,
                                    title: "Aligned Growth",
                                    desc: "We believe the best marketing creates value for the Brand, the Creator, and the Consumer."
                                }
                            ].map((value, i) => (
                                <div key={i} className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all group">
                                    <div className="w-10 h-10 bg-brand-blue/10 rounded-xl flex items-center justify-center text-brand-blue mb-6 group-hover:bg-brand-blue group-hover:text-white transition-all">
                                        {value.icon}
                                    </div>
                                    <h3 className="text-lg font-black text-gray-900 mb-2 tracking-tight">{value.title}</h3>
                                    <p className="text-xs text-gray-500 font-medium leading-relaxed tracking-tight">{value.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* The Narrative Section */}
                <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                        <div className="relative">
                            <div className="absolute inset-0 bg-brand-blue/5 rounded-[2rem] -rotate-3"></div>
                            <div className="relative bg-white border border-gray-100 p-8 rounded-[2rem] shadow-xl overflow-hidden">
                                <div className="absolute top-0 right-0 p-8">
                                    <TrendingUp className="w-24 h-24 text-brand-blue/5" />
                                </div>
                                <h3 className="text-3xl font-black text-gray-900 tracking-tighter mb-6 leading-tight">
                                    Why Vyral AI?
                                </h3>
                                <div className="space-y-4">
                                    <p className="text-sm text-gray-600 font-medium leading-relaxed">
                                        In 2024, fraud reached a breaking point. Brands were losing billions to sophisticated bot farms. Investors were funding "ghost growth".
                                    </p>
                                    <p className="text-sm text-gray-600 font-medium leading-relaxed">
                                        We realized that existing solutions were purely defensive. They didn't solve the core problem: transparency.
                                    </p>
                                    <div className="pt-4 border-t border-gray-100">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 bg-gray-900 rounded-full flex items-center justify-center text-white font-black text-xl italic">B</div>
                                            <div>
                                                <p className="text-sm font-black text-gray-900 leading-none mb-1 tracking-tight">V.T</p>
                                                <p className="text-[10px] text-brand-blue font-black uppercase tracking-widest">Founder & Visionary</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="space-y-8">
                            <div>
                                <h2 className="text-3xl lg:text-4xl font-black text-gray-900 tracking-tighter mb-4">Building the Future of Trusted Commerce</h2>
                                <p className="text-sm text-gray-500 font-medium leading-relaxed tracking-tight">
                                    We aren't just building a tool; we are building a standard. Our vision is a digital economy where capital follows truth, not just algorithms.
                                </p>
                            </div>
                            <div className="grid grid-cols-2 gap-6">
                                <div>
                                    <div className="text-2xl font-black text-brand-blue mb-1 tracking-tighter">10B+</div>
                                    <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Bot Rejections</div>
                                </div>
                                <div>
                                    <div className="text-2xl font-black text-brand-blue mb-1 tracking-tighter">5,000+</div>
                                    <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Trusted Partners</div>
                                </div>
                                <div>
                                    <div className="text-2xl font-black text-brand-blue mb-1 tracking-tighter">150M+</div>
                                    <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Capital Secured</div>
                                </div>
                                <div>
                                    <div className="text-2xl font-black text-brand-blue mb-1 tracking-tighter">100%</div>
                                    <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Audit Accuracy</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Values List */}
                <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-40 text-center">
                    <h2 className="text-2xl font-black text-gray-900 tracking-tighter mb-12">Driven by Purpose</h2>
                    <div className="flex flex-wrap justify-center gap-4">
                        {['Transparency', 'Speed', 'Agility', 'Human Centric', 'Scalability', 'Ethical AI'].map((tag) => (
                            <span key={tag} className="px-5 py-2.5 bg-white border border-gray-100 rounded-xl text-xs font-black text-gray-600 shadow-sm uppercase tracking-widest hover:border-brand-blue hover:text-brand-blue transition-all cursor-default">
                                {tag}
                            </span>
                        ))}
                    </div>
                </section>
            </main>
            <Footer />
        </div>
    );
};
