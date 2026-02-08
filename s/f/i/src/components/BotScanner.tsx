import React from 'react';
import { Search, PlayCircle, Loader2, Award, BookOpen, Users, Globe, FileText } from 'lucide-react';

export const BotScanner = () => {
    const [topic, setTopic] = React.useState('');
    const [isScanning, setIsScanning] = React.useState(false);
    const [showResults, setShowResults] = React.useState(false);

    const handlePreview = (e: React.FormEvent) => {
        e.preventDefault();
        if (!topic) return;
        setIsScanning(true);
        setShowResults(false);
        setTimeout(() => {
            setIsScanning(false);
            setShowResults(true);
        }, 2000);
    };

    return (
        <section className="py-32 bg-gray-50 relative overflow-hidden">
            <div className="absolute inset-0 bg-grid opacity-30"></div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="text-center mb-16">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-blue/10 text-brand-blue text-xs font-bold uppercase tracking-widest mb-4">
                        Interactive Demo
                    </div>
                    <h2 className="text-4xl lg:text-5xl font-extrabold text-gray-900 mb-4 tracking-tight">Try Our Course Previewer</h2>
                    <p className="text-xl text-gray-500 max-w-2xl mx-auto font-medium">
                        Experience the LearnSphere interface. See how our full-screen player and interactive quizzes engage learners.
                    </p>
                </div>

                <div className="max-w-3xl mx-auto">
                    <div className="glass p-2 rounded-3xl shadow-premium mb-12">
                        <form onSubmit={handlePreview} className="flex flex-col sm:flex-row gap-2">
                            <div className="flex-1 relative">
                                <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <input
                                    type="text"
                                    value={topic}
                                    onChange={(e) => setTopic(e.target.value)}
                                    placeholder="Enter a topic (e.g. UX Design) to preview..."
                                    className="w-full pl-14 pr-6 py-5 bg-white rounded-2xl border-none focus:ring-2 focus:ring-brand-blue outline-none text-gray-900 font-medium text-lg shadow-sm"
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={isScanning}
                                className="px-10 py-5 bg-brand-blue hover:bg-brand-blue/90 text-white rounded-2xl font-bold text-lg transition-all shadow-lg shadow-brand-blue/20 flex items-center justify-center min-w-[180px] disabled:opacity-50"
                            >
                                {isScanning ? (
                                    <>
                                        <Loader2 className="w-6 h-6 animate-spin mr-2" />
                                        Loading Preview...
                                    </>
                                ) : 'Preview Course'}
                            </button>
                        </form>
                    </div>

                    {showResults && (
                        <div className="animate-in zoom-in-95 fade-in duration-500">
                            <div className="glass rounded-3xl overflow-hidden shadow-premium">
                                {/* Preview Header */}
                                <div className="bg-black p-8 text-white flex justify-between items-center">
                                    <div className="flex items-center gap-4">
                                        <div className="w-14 h-14 rounded-2xl bg-brand-blue/20 flex items-center justify-center">
                                            <PlayCircle className="w-8 h-8 text-brand-blue" />
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-bold">{topic} Masterclass</h3>
                                            <p className="text-gray-400 text-sm font-medium">Sample Module: Introduction to {topic}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-3xl font-black text-brand-blue">PRO</div>
                                        <div className="text-gray-400 text-xs font-bold uppercase tracking-widest">Course Tier</div>
                                    </div>
                                </div>

                                {/* Preview Content */}
                                <div className="p-10 bg-white grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-6">
                                        <div className="relative aspect-video bg-gray-900 rounded-2xl overflow-hidden group cursor-pointer shadow-lg">
                                            <img src={`https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=800`} className="w-full h-full object-cover opacity-60" alt="Course Preview" />
                                            <div className="absolute inset-0 flex items-center justify-center">
                                                <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                                                    <PlayCircle className="w-10 h-10 text-white fill-white/20" />
                                                </div>
                                            </div>
                                            <div className="absolute bottom-4 left-4 right-4">
                                                <div className="h-1 w-full bg-white/20 rounded-full overflow-hidden">
                                                    <div className="h-full w-1/3 bg-brand-blue"></div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between p-4 bg-brand-blue/5 rounded-2xl border border-brand-blue/10">
                                            <div className="flex items-center gap-3">
                                                <FileText className="text-brand-blue w-5 h-5" />
                                                <span className="text-sm font-bold text-gray-900">Interactive Quiz Available</span>
                                            </div>
                                            <span className="text-xs font-black text-brand-blue uppercase tracking-widest">Try Now</span>
                                        </div>
                                    </div>

                                    <div className="bg-gray-50 rounded-[2rem] p-8 flex flex-col">
                                        <div className="flex items-center gap-2 mb-6">
                                            <Award className="text-orange-500 w-5 h-5" />
                                            <h4 className="font-bold text-gray-900 text-sm uppercase tracking-widest">Knowledge Check</h4>
                                        </div>
                                        <p className="text-gray-900 font-black text-lg mb-6 tracking-tight leading-snug">
                                            What is the primary benefit of the LearnSphere ecosystem?
                                        </p>
                                        <div className="space-y-3">
                                            {['Gamified user rewards', 'Bot detection logic', 'Integrated instructor tools', 'All of the above'].map((opt, i) => (
                                                <button key={i} className={`w-full text-left p-4 rounded-xl border text-sm font-bold transition-all ${i === 3 ? 'border-brand-blue bg-white text-brand-blue shadow-sm' : 'border-gray-200 bg-white text-gray-500 hover:border-gray-300'}`}>
                                                    {opt}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {/* Footer Stats */}
                                <div className="px-10 py-6 bg-gray-50/50 border-t border-gray-100 flex flex-wrap gap-8 text-gray-400 font-bold text-[10px] uppercase tracking-widest">
                                    <div className="flex items-center gap-2">
                                        <BookOpen className="w-4 h-4" />
                                        <span>12 Lessons</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Users className="w-4 h-4" />
                                        <span>2.4k Students</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Globe className="w-4 h-4" />
                                        <span>English, Spanish</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
};
