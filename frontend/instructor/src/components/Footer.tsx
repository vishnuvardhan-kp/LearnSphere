import { Bot, Twitter, Instagram, Linkedin, Github } from 'lucide-react';

export const Footer = () => {
    return (
        <footer className="bg-black text-white pt-20 pb-10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
                    <div className="space-y-6">
                        <div className="flex items-center gap-2">
                            <Bot className="w-8 h-8 text-brand-blue" />
                            <span className="text-xl font-bold text-white">Vyral AI</span>
                        </div>
                        <p className="text-gray-400 leading-relaxed">
                            Eliminate fake engagement and connect with authentic influencers using our advanced AI-powered bot detection platform.
                        </p>
                        <div className="flex items-center gap-4">
                            <Twitter className="w-5 h-5 text-gray-400 hover:text-brand-blue cursor-pointer transition-colors" />
                            <Instagram className="w-5 h-5 text-gray-400 hover:text-brand-blue cursor-pointer transition-colors" />
                            <Linkedin className="w-5 h-5 text-gray-400 hover:text-brand-blue cursor-pointer transition-colors" />
                            <Github className="w-5 h-5 text-gray-400 hover:text-brand-blue cursor-pointer transition-colors" />
                        </div>
                    </div>

                    <div>
                        <h4 className="text-lg font-bold mb-6">Company</h4>
                        <ul className="space-y-4 text-gray-400 font-medium">
                            <li><a href="/about" className="hover:text-brand-blue transition-colors">About Us</a></li>
                            <li><a href="#" className="hover:text-brand-blue transition-colors">Careers</a></li>
                            <li><a href="#" className="hover:text-brand-blue transition-colors">Contact</a></li>
                            <li><a href="#" className="hover:text-brand-blue transition-colors">Blog</a></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-lg font-bold mb-6">Product</h4>
                        <ul className="space-y-4 text-gray-400 font-medium">
                            <li><a href="#features" className="hover:text-brand-blue transition-colors">Features</a></li>
                            <li><a href="#pricing" className="hover:text-brand-blue transition-colors">Pricing</a></li>
                            <li><a href="#" className="hover:text-brand-blue transition-colors">API</a></li>
                            <li><a href="#" className="hover:text-brand-blue transition-colors">Integrations</a></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-lg font-bold mb-6">Newsletter</h4>
                        <p className="text-gray-400 mb-6 font-medium">Get the latest updates on bot detection and marketing ROI.</p>
                        <div className="flex relative">
                            <input
                                type="email"
                                placeholder="Enter email"
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:ring-1 focus:ring-brand-blue transition-all pr-32"
                            />
                            <button className="absolute right-1 top-1 bottom-1 bg-brand-blue text-white px-4 rounded-lg font-bold text-sm">
                                Subscribe
                            </button>
                        </div>
                    </div>
                </div>

                <div className="border-t border-white/5 pt-10 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-500">
                    <div>© 2026 Vyral AI. All rights reserved.</div>
                    <div className="flex gap-8">
                        <a href="#" className="hover:text-brand-blue transition-colors">Privacy Policy</a>
                        <a href="#" className="hover:text-brand-blue transition-colors">Terms of Service</a>
                        <a href="#" className="hover:text-brand-blue transition-colors">Cookie Policy</a>
                    </div>
                </div>
            </div>
        </footer>
    );
};
