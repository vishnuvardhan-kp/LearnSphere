import { Play, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Hero = () => {
    return (
        <section className="relative pt-32 pb-20 lg:pt-56 lg:pb-40 overflow-hidden bg-mesh">
            {/* Background Grid */}
            <div className="absolute inset-0 bg-grid opacity-40"></div>

            {/* Light Burst Background */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
                <div className="relative w-full h-full flex items-center justify-center">
                    {/* The "Light" glow */}
                    <div className="absolute w-[800px] h-[800px] bg-white rounded-full blur-[120px] opacity-40 glow-burst"></div>

                    {/* Secondary Accent Light */}
                    <div className="absolute w-[400px] h-[400px] bg-brand-blue/10 rounded-full blur-[100px] translate-y-20"></div>
                </div>
            </div>

            {/* Decorative Elements */}
            <div className="absolute top-0 left-1/4 w-px h-full bg-gradient-to-b from-transparent via-brand-blue/5 to-transparent"></div>
            <div className="absolute top-0 right-1/4 w-px h-full bg-gradient-to-b from-transparent via-brand-blue/5 to-transparent"></div>

            {/* Animated Scanning Line */}
            <div className="absolute top-0 left-1/2 w-px h-48 bg-gradient-to-b from-transparent via-brand-blue/30 to-transparent animate-line-move"></div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="text-center max-w-4xl mx-auto">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-brand-blue/5 border border-brand-blue/10 mb-8 animate-in fade-in slide-in-from-bottom-2 duration-700">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-blue opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-blue"></span>
                        </span>
                        <span className="text-sm font-bold text-brand-blue tracking-wide uppercase">Trust The Process</span>
                    </div>

                    <h1 className="text-5xl lg:text-8xl font-black text-gray-900 mb-8 tracking-tighter leading-[0.9]">
                        Vyral <span className="text-brand-blue">AI</span><br />
                        <span className="text-4xl lg:text-6xl text-brand-blue drop-shadow-[0_0_20px_rgba(14,165,233,0.3)] block mt-4">Protect Your Marketing</span>
                        <span className="text-3xl lg:text-5xl text-brand-blue drop-shadow-[0_0_15px_rgba(14,165,233,0.2)] block mt-2">With Confidence</span>
                    </h1>

                    <p className="text-lg lg:text-xl text-gray-500 mb-12 max-w-2xl mx-auto leading-relaxed font-medium tracking-tight">
                        Join thousands of marketers who have eliminated bot fraud and maximized their authentic reach with our AI platform.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20">
                        <Link to="/register" className="w-full sm:w-auto px-10 py-4 bg-black hover:bg-gray-900 text-white rounded-xl font-black text-xs uppercase tracking-[0.2em] transition-all shadow-2xl flex items-center justify-center gap-2 group">
                            Get Started
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </Link>
                        <Link to="/watch-story" className="w-full sm:w-auto px-10 py-4 bg-white border border-gray-100 hover:bg-gray-50 text-gray-900 rounded-xl font-black text-xs uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2 shadow-sm">
                            <Play className="w-4 h-4 fill-current" />
                            Watch Story
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
};
