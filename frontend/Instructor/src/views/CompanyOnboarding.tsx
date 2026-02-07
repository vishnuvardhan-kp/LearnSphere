import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Bot, Check, ChevronRight, ChevronLeft, Building2, Rocket, Briefcase, User, Target, Globe } from 'lucide-react';

export const CompanyOnboarding = () => {
    const [step, setStep] = React.useState(1);
    const [orgType, setOrgType] = React.useState('');
    const [industry, setIndustry] = React.useState('');
    const [market, setMarket] = React.useState('United States & Canada');
    const [spend, setSpend] = React.useState('$1,000 - $10,000');
    const [loading, setLoading] = React.useState(false);

    const navigate = useNavigate();

    const totalSteps = 3;

    const handleNext = async () => {
        if (step < totalSteps) {
            setStep(step + 1);
        } else {
            setLoading(true);
            try {
                const token = localStorage.getItem('botfree_token');
                const response = await fetch('http://localhost:5000/api/onboarding/details', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        onboardingData: { orgType, industry, market, spend }
                    })
                });

                if (!response.ok) throw new Error('Failed to save onboarding details');

                navigate('/company-dashboard');
            } catch (err) {
                console.error(err);
                alert('Something went wrong. Please try again.');
            } finally {
                setLoading(false);
            }
        }
    };

    const handleBack = () => {
        if (step > 1) setStep(step - 1);
    };

    const orgTypes = [
        { id: 'individual', name: 'Individual', icon: User, desc: 'Solopreneur or Consultant' },
        { id: 'startup', name: 'Startup', icon: Rocket, desc: 'Early stage high-growth team' },
        { id: 'company', name: 'Company', icon: Building2, desc: 'Established enterprise' },
        { id: 'investor', name: 'Investor', icon: Briefcase, desc: 'Venture Capital or PEG' }
    ];

    return (
        <div className="min-h-screen bg-[#F8FAFC] flex flex-col">
            {/* Header */}
            <header className="bg-white border-b border-gray-100 py-4 px-8 flex justify-between items-center sticky top-0 z-10">
                <div className="flex items-center gap-2">
                    <Bot className="w-8 h-8 text-brand-blue" />
                    <span className="text-xl font-bold tracking-tighter">Vyral AI</span>
                </div>
                <div className="flex items-center gap-2">
                    {Array.from({ length: totalSteps }).map((_, i) => (
                        <div
                            key={i}
                            className={`h-2 rounded-full transition-all ${i + 1 <= step ? 'w-8 bg-brand-blue' : 'w-2 bg-gray-200'}`}
                        />
                    ))}
                </div>
                <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Step {step} of {totalSteps}</div>
            </header>

            <main className="flex-1 flex items-center justify-center p-6">
                <div className="max-w-2xl w-full">
                    {step === 1 && (
                        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <div className="text-center">
                                <div className="w-16 h-16 bg-brand-blue/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                                    <Building2 className="w-8 h-8 text-brand-blue" />
                                </div>
                                <h1 className="text-4xl font-black text-gray-900 mb-2 tracking-tighter">Tell us about your organization</h1>
                                <p className="text-gray-500 font-medium">Select the best fit for your marketing activities</p>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {orgTypes.map(t => (
                                    <button
                                        key={t.id}
                                        onClick={() => setOrgType(t.id)}
                                        className={`relative p-8 rounded-3xl border-2 transition-all flex flex-col items-start gap-4 text-left group ${orgType === t.id ? 'border-brand-blue bg-brand-blue/5' : 'border-white bg-white hover:border-brand-blue/20 shadow-sm'
                                            }`}
                                    >
                                        {orgType === t.id && (
                                            <div className="absolute top-6 right-6 w-6 h-6 bg-brand-blue rounded-full flex items-center justify-center shadow-lg shadow-brand-blue/20 animate-in zoom-in">
                                                <Check className="w-4 h-4 text-white" />
                                            </div>
                                        )}
                                        <div className={`p-4 rounded-2xl transition-all ${orgType === t.id ? 'bg-brand-blue text-white shadow-lg shadow-brand-blue/20' : 'bg-gray-50 text-gray-400 group-hover:bg-brand-blue/10 group-hover:text-brand-blue'}`}>
                                            <t.icon className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <div className="font-black text-gray-900 tracking-tight text-lg mb-1">{t.name}</div>
                                            <div className="text-xs text-gray-400 font-bold uppercase tracking-widest">{t.desc}</div>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {step === 2 && (
                        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <div className="text-center">
                                <div className="w-16 h-16 bg-brand-indigo/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                                    <Target className="w-8 h-8 text-brand-indigo" />
                                </div>
                                <h1 className="text-4xl font-black text-gray-900 mb-2 tracking-tighter">Your Primary Industry</h1>
                                <p className="text-gray-500 font-medium">We'll tailor your bot detection models based on this</p>
                            </div>

                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                {['E-commerce', 'SaaS', 'Fintech', 'Gaming', 'Health', 'Crypto', 'Automotive', 'Media', 'Other'].map(n => (
                                    <button
                                        key={n}
                                        onClick={() => setIndustry(n)}
                                        className={`p-5 rounded-2xl border-2 font-black transition-all text-[10px] uppercase tracking-widest ${industry === n ? 'border-brand-blue bg-brand-blue/5 text-brand-blue shadow-lg shadow-brand-blue/5' : 'border-white bg-white text-gray-400 hover:border-gray-100 shadow-sm'
                                            }`}
                                    >
                                        {n}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {step === 3 && (
                        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <div className="text-center">
                                <div className="w-16 h-16 bg-green-50 rounded-2xl flex items-center justify-center mx-auto mb-6">
                                    <Globe className="w-8 h-8 text-green-600" />
                                </div>
                                <h1 className="text-4xl font-black text-gray-900 mb-2 tracking-tighter">Global Reach Goals</h1>
                                <p className="text-gray-500 font-medium">Where do you run your primary marketing campaigns?</p>
                            </div>

                            <div className="bg-white p-10 rounded-3xl border border-gray-100 shadow-sm space-y-8">
                                <div className="space-y-4">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] px-2">Primary Market</label>
                                    <select
                                        value={market}
                                        onChange={(e) => setMarket(e.target.value)}
                                        className="w-full p-5 bg-gray-50 border border-gray-100 rounded-2xl outline-none font-bold text-gray-900 appearance-none cursor-pointer"
                                    >
                                        <option>United States & Canada</option>
                                        <option>European Union</option>
                                        <option>United Kingdom</option>
                                        <option>Asia Pacific</option>
                                        <option>Middle East</option>
                                    </select>
                                </div>
                                <div className="space-y-4">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] px-2">Estimated Monthly Spend</label>
                                    <select
                                        value={spend}
                                        onChange={(e) => setSpend(e.target.value)}
                                        className="w-full p-5 bg-gray-50 border border-gray-100 rounded-2xl outline-none font-bold text-gray-900 appearance-none cursor-pointer"
                                    >
                                        <option>$1,000 - $10,000</option>
                                        <option>$10,000 - $50,000</option>
                                        <option>$50,000 - $250,000</option>
                                        <option>$250,000+</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="mt-12 flex items-center justify-between gap-4">
                        <button
                            onClick={handleBack}
                            disabled={step === 1}
                            className={`flex items-center gap-2 px-8 py-5 rounded-[1.5rem] font-black text-xs uppercase tracking-widest transition-all ${step === 1 ? 'opacity-0 pointer-events-none' : 'text-gray-400 hover:bg-gray-100 hover:text-gray-900'
                                }`}
                        >
                            <ChevronLeft className="w-5 h-5" />
                            Back
                        </button>
                        <button
                            onClick={handleNext}
                            disabled={(step === 1 && !orgType) || (step === 2 && !industry) || loading}
                            className="flex items-center gap-3 px-10 py-5 bg-black hover:bg-gray-900 text-white rounded-2xl font-black text-xs uppercase tracking-[0.15em] transition-all shadow-2xl shadow-gray-200 disabled:opacity-50 disabled:shadow-none group min-w-[180px] justify-center"
                        >
                            {loading ? (
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                            ) : (
                                <>
                                    {step === totalSteps ? 'Complete Setup' : 'Continue'}
                                    <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </main>
        </div>
    );
};
