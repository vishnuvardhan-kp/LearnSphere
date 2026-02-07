import React from 'react';
import { GraduationCap, Menu, X, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Navbar = () => {
    const [isOpen, setIsOpen] = React.useState(false);
    const [scrolled, setScrolled] = React.useState(false);

    React.useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <nav className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? 'py-4' : 'py-6'
            }`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className={`glass rounded-3xl px-6 lg:px-10 transition-all duration-500 shadow-premium border-white/40 ${scrolled ? 'bg-white/80' : 'bg-white/40'
                    }`}>
                    <div className="flex justify-between h-16 lg:h-20 items-center">
                        <Link to="/" className="flex items-center gap-2 group">
                            <div className="w-10 h-10 bg-black rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                                <GraduationCap className="w-6 h-6 text-brand-blue" />
                            </div>
                            <span className="text-2xl font-black tracking-tighter text-gray-900">
                                Learn<span className="text-brand-blue">Sphere</span>
                            </span>
                        </Link>

                        <div className="hidden md:flex items-center gap-10">
                            <Link to="/" className="text-sm font-bold text-gray-500 hover:text-black transition-colors uppercase tracking-widest">Home</Link>
                            {['Features', 'How it works', 'Pricing', 'Testimonials'].map((item) => (
                                <a
                                    key={item}
                                    href={`#${item.toLowerCase().replace(/\s+/g, '-')}`}
                                    className="text-sm font-bold text-gray-500 hover:text-black transition-colors uppercase tracking-widest"
                                >
                                    {item}
                                </a>
                            ))}
                        </div>

                        <div className="hidden md:flex items-center gap-6">
                            <Link to="/login" className="text-sm font-bold text-gray-900 hover:text-brand-blue transition-colors uppercase tracking-widest">
                                Login
                            </Link>
                            <Link to="/register" className="bg-black hover:bg-gray-800 text-white px-8 py-3.5 rounded-xl font-bold text-sm transition-all shadow-xl shadow-gray-200 flex items-center gap-2 group uppercase tracking-widest">
                                Get Started
                                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </Link>
                        </div>

                        <div className="md:hidden">
                            <button onClick={() => setIsOpen(!isOpen)} className="w-10 h-10 flex items-center justify-center rounded-xl bg-gray-50 text-gray-900">
                                {isOpen ? <X /> : <Menu />}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {isOpen && (
                <div className="md:hidden px-4 mt-2">
                    <div className="glass rounded-3xl p-6 space-y-4 animate-in fade-in slide-in-from-top-4">
                        <a href="#features" className="block text-lg font-bold text-gray-900">Features</a>
                        <a href="#how-it-works" className="block text-lg font-bold text-gray-900">How It Works</a>
                        <a href="#pricing" className="block text-lg font-bold text-gray-900">Pricing</a>
                        <a href="#testimonials" className="block text-lg font-bold text-gray-900">Testimonials</a>
                        <hr className="border-gray-100" />
                        <Link to="/login" className="block text-lg font-bold text-gray-900 py-2">Login</Link>
                        <Link to="/register" className="block w-full bg-black text-white px-6 py-4 rounded-xl font-bold text-center">
                            Get Started
                        </Link>
                    </div>
                </div>
            )}
        </nav>
    );
};
