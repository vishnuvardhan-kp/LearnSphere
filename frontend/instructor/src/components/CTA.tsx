import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export const CTA = () => {
    return (
        <section className="py-24">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="bg-brand-blue rounded-3xl p-12 lg:p-24 relative overflow-hidden text-center text-white">
                    {/* Decorative shapes */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-brand-indigo/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>

                    <div className="relative z-10 max-w-3xl mx-auto">
                        <h2 className="text-4xl lg:text-6xl font-extrabold mb-8">Ready to Eliminate Bot Fraud?</h2>
                        <p className="text-xl text-brand-blue-100 mb-12 opacity-90">
                            Join thousands of marketers protecting their campaigns with AI-powered bot detection and maximize your authentic engagement today.
                        </p>
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                            <Link to="/register" className="w-full sm:w-auto bg-white text-brand-blue hover:bg-brand-blue-50 px-10 py-5 rounded-2xl font-bold text-lg transition-all shadow-xl flex items-center justify-center gap-2 group">
                                Get Started
                                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </Link>
                            <button className="w-full sm:w-auto bg-brand-blue-600/30 hover:bg-brand-blue-600/40 border border-white/20 text-white px-10 py-5 rounded-2xl font-bold text-lg transition-all">
                                Contact Sales
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};
