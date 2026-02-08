import { useState, useEffect } from 'react';
import { GraduationCap, Menu, X, ArrowRight, ChevronDown, Sparkles, Zap, ShieldCheck, BarChart3 } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navLinks = [
        {
            label: 'Platform',
            hasDropdown: true,
            items: [
                { title: 'AI Scraping', desc: 'Advanced bot detection', icon: Sparkles },
                { title: 'Analytics', desc: 'Real-time brand insights', icon: BarChart3 },
                { title: 'Protection', desc: 'Automated ecosystem guard', icon: ShieldCheck }
            ]
        },
        { label: 'Solutions', hasDropdown: false },
        { label: 'Pricing', hasDropdown: false },
        { label: 'Company', hasDropdown: false }
    ];

    return (
        <nav className={`fixed w-full z-50 transition-all duration-500 ${scrolled ? 'py-4 translate-y-0' : 'py-8'
            }`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className={`relative transition-all duration-500 border border-white/40 ${scrolled
                        ? 'bg-white/70 backdrop-blur-2xl rounded-[32px] shadow-[0_20px_50px_rgba(0,0,0,0.05)] px-6'
                        : 'bg-transparent px-2'
                    }`}>
                    <div className="flex justify-between h-20 items-center">
                        {/* Logo */}
                        <Link to="/" className="flex items-center gap-2 group relative z-10 transition-transform hover:scale-105">
                            <div className="w-12 h-12 bg-black rounded-2xl flex items-center justify-center shadow-xl shadow-black/10 group-hover:rotate-12 transition-all duration-500">
                                <GraduationCap className="w-7 h-7 text-brand-blue" />
                            </div>
                            <span className="text-2xl font-black tracking-tighter text-gray-900 flex items-center">
                                Learn<span className="text-brand-blue">Sphere</span>
                                <span className="ml-2 px-2 py-0.5 bg-brand-blue/10 text-brand-blue text-[10px] rounded-full font-bold uppercase tracking-widest border border-brand-blue/20">AI</span>
                            </span>
                        </Link>

                        {/* Desktop Navigation */}
                        <div className="hidden lg:flex items-center gap-1">
                            {navLinks.map((link) => (
                                <div
                                    key={link.label}
                                    className="relative"
                                    onMouseEnter={() => setActiveDropdown(link.label)}
                                    onMouseLeave={() => setActiveDropdown(null)}
                                >
                                    <button className="px-5 py-3 text-sm font-bold text-gray-500 hover:text-black transition-all flex items-center gap-1.5 group rounded-xl hover:bg-gray-50/50">
                                        {link.label}
                                        {link.hasDropdown && (
                                            <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${activeDropdown === link.label ? 'rotate-180' : ''}`} />
                                        )}
                                        <div className="absolute bottom-2 left-5 right-5 h-0.5 bg-brand-blue scale-x-0 group-hover:scale-x-100 transition-transform origin-left rounded-full" />
                                    </button>

                                    {/* Premium Dropdown */}
                                    {link.hasDropdown && activeDropdown === link.label && (
                                        <div className="absolute top-full left-0 mt-2 w-80 bg-white border border-gray-100 rounded-3xl shadow-[0_30px_60px_rgba(0,0,0,0.1)] p-6 animate-in fade-in zoom-in-95 duration-200">
                                            <div className="space-y-4">
                                                {link.items?.map((item) => (
                                                    <a key={item.title} href="#" className="flex items-start gap-4 p-3 rounded-2xl hover:bg-gray-50 transition-colors group/item">
                                                        <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center group-hover/item:bg-white group-hover/item:shadow-md transition-all">
                                                            <item.icon className="w-5 h-5 text-gray-400 group-hover/item:text-brand-blue transition-colors" />
                                                        </div>
                                                        <div>
                                                            <div className="text-sm font-black tracking-tight text-gray-900 mb-0.5">{item.title}</div>
                                                            <div className="text-[11px] font-bold text-gray-400">{item.desc}</div>
                                                        </div>
                                                    </a>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>

                        {/* Actions */}
                        <div className="hidden md:flex items-center gap-6 relative z-10">
                            <Link to="/login" className="text-sm font-bold text-gray-900 hover:text-brand-blue transition-all px-4 py-2 rounded-xl hover:bg-brand-blue/5">
                                Client Portal
                            </Link>
                            <Link to="/register" className="relative group overflow-hidden bg-black text-white px-8 py-4 rounded-2xl font-black text-[13px] transition-all shadow-2xl shadow-gray-300 hover:shadow-black/20 hover:-translate-y-1 active:scale-95 flex items-center gap-3 uppercase tracking-widest">
                                <span className="relative z-10">Get Started</span>
                                <ArrowRight className="w-4 h-4 relative z-10 group-hover:translate-x-1 transition-transform" />
                                <div className="absolute inset-0 bg-gradient-to-r from-brand-blue to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                            </Link>
                        </div>

                        {/* Mobile Toggle */}
                        <div className="lg:hidden relative z-10">
                            <button
                                onClick={() => setIsOpen(!isOpen)}
                                className="w-12 h-12 flex items-center justify-center rounded-2xl bg-gray-50 text-gray-900 border border-gray-100 active:scale-90 transition-transform"
                            >
                                {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {isOpen && (
                <div className="lg:hidden fixed inset-0 top-[100px] z-[49] px-4 pb-4 animate-in fade-in slide-in-from-top-4 duration-300">
                    <div className="bg-white/90 backdrop-blur-2xl rounded-[40px] border border-gray-100 p-8 shadow-2xl space-y-8 h-full overflow-y-auto">
                        <div className="grid gap-6">
                            {['Features', 'How it works', 'Pricing', 'Testimonials'].map((item) => (
                                <a key={item} href={`#${item.toLowerCase().replace(/\s+/g, '-')}`} className="text-2xl font-black tracking-tighter text-gray-900 hover:text-brand-blue transition-colors">
                                    {item}
                                </a>
                            ))}
                        </div>
                        <div className="h-px bg-gray-100" />
                        <div className="flex flex-col gap-4">
                            <Link to="/login" className="text-lg font-bold text-gray-900 py-2">Sign in to Dashboard</Link>
                            <Link to="/register" className="w-full bg-black text-white px-8 py-6 rounded-[28px] font-black text-center text-lg shadow-xl shadow-black/10 flex items-center justify-center gap-3">
                                Join now <Zap className="w-5 h-5 fill-white" />
                            </Link>
                        </div>
                    </div>
                </div>
            )}
        </nav>
    );
};
