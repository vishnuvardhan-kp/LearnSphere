import React from 'react';
import { Bot, ChevronLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export const AuthLayout = ({ children, title, subtitle }: { children: React.ReactNode, title: string, subtitle: string }) => {
    return (
        <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2">
            {/* Left Side: Illustration & Branding */}
            <div className="hidden lg:flex flex-col justify-between bg-black p-12 text-white relative overflow-hidden">
                <div className="absolute inset-0 bg-grid opacity-20"></div>
                <div className="absolute top-0 left-1/2 w-px h-full bg-gradient-to-b from-transparent via-brand-blue/20 to-transparent"></div>

                <Link to="/" className="flex items-center gap-2 relative z-10 hover:opacity-80 transition-opacity w-fit">
                    <Bot className="w-8 h-8 text-brand-blue" />
                    <span className="text-2xl font-bold">Vyral AI</span>
                </Link>

                <div className="relative z-10">
                    <h2 className="text-5xl font-extrabold mb-6 leading-tight tracking-tighter">
                        <span className="drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]">Protect Your Marketing</span> <br />
                        <span className="text-brand-blue drop-shadow-[0_0_20px_rgba(14,165,233,0.4)]">With Confidence</span>
                    </h2>
                    <p className="text-xl text-gray-400 max-w-md leading-relaxed font-medium">
                        Join thousands of marketers who have eliminated bot fraud and maximized their authentic reach with our AI platform.
                    </p>
                </div>

                <div className="relative z-10 flex items-center gap-8 text-sm text-gray-500 font-medium">
                    <div>© 2026 Vyral AI</div>
                    <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
                    <a href="#" className="hover:text-white transition-colors">Terms</a>
                </div>
            </div>

            {/* Right Side: Auth Form */}
            <div className="flex flex-col justify-center px-8 sm:px-12 lg:px-20 py-12 bg-white relative">
                <div className="lg:hidden absolute top-8 left-8">
                    <Link to="/" className="flex items-center gap-2">
                        <Bot className="w-8 h-8 text-brand-blue" />
                        <span className="text-xl font-bold">Vyral AI</span>
                    </Link>
                </div>

                <div className="max-w-md w-full mx-auto">
                    <Link to="/" className="inline-flex items-center gap-2 text-gray-500 hover:text-brand-blue mb-10 font-medium transition-colors group">
                        <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                        Back to Home
                    </Link>

                    <div className="mb-10">
                        <h1 className="text-4xl font-extrabold text-gray-900 mb-2 tracking-tight">{title}</h1>
                        <p className="text-gray-500 text-lg font-medium">{subtitle}</p>
                    </div>

                    {children}
                </div>
            </div>
        </div>
    );
};
