import React from 'react';
import { useNavigate } from 'react-router-dom';
import { GraduationCap, BookOpen, PenTool, Check, ChevronRight, ChevronLeft, Target, Users2, Sparkles } from 'lucide-react';

export const InfluencerOnboarding = () => {
    const [step, setStep] = React.useState(1);
    const [platforms, setPlatforms] = React.useState<string[]>([]);
    const [niche, setNiche] = React.useState('');
    const [ageGroup, setAgeGroup] = React.useState('18-24');
    const [region, setRegion] = React.useState('North America');
    const [loading, setLoading] = React.useState(false);

    const navigate = useNavigate();

    const totalSteps = 3;

    const togglePlatform = (p: string) => {
        setPlatforms(prev => prev.includes(p) ? prev.filter(x => x !== p) : [...prev, p]);
    };

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
                        onboardingData: { platforms, niche, ageGroup, region }
                    })
                });

                if (!response.ok) throw new Error('Failed to save onboarding details');

                navigate('/influencer-dashboard');
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

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            {/* Header */}
            <header className="bg-white border-b border-gray-100 py-4 px-8 flex justify-between items-center sticky top-0 z-10">
                <div className="flex items-center gap-2">
                    <GraduationCap className="w-8 h-8 text-brand-blue" />
                    <span className="text-xl font-bold text-gray-900">Learn<span className="text-brand-blue">Sphere</span></span>
                </div>
                <div className="flex items-center gap-2">
                    {Array.from({ length: totalSteps }).map((_, i) => (
                        <div
                            key={i}
                            className={`h-2 rounded-full transition-all ${i + 1 <= step ? 'w-8 bg-brand-blue' : 'w-2 bg-gray-200'}`}
                        />
                    ))}
                </div>
                <div className="text-sm font-bold text-gray-400 uppercase tracking-widest">Step {step} / {totalSteps}</div>
            </header>

            <main className="flex-1 flex items-center justify-center p-6">
                <div className="max-w-xl w-full">
                    {step === 1 && (
                        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <div className="text-center">
                                <div className="w-16 h-16 bg-brand-blue/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                                    <Sparkles className="w-8 h-8 text-brand-blue" />
                                </div>
                                <h1 className="text-3xl font-extrabold text-gray-900 mb-2 tracking-tight">Setup Your Academy</h1>
                                <p className="text-gray-500 font-medium">Select your primary content formats</p>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {[
                                    { id: 'video', name: 'Video Courses', icon: BookOpen, color: 'hover:border-brand-blue hover:bg-brand-blue/5' },
                                    { id: 'pdf', name: 'Document Lessons', icon: PenTool, color: 'hover:border-brand-blue hover:bg-brand-blue/5' }
                                ].map(p => (
                                    <button
                                        key={p.id}
                                        onClick={() => togglePlatform(p.id)}
                                        className={`relative p-8 rounded-3xl border-2 transition-all flex flex-col items-center gap-4 ${platforms.includes(p.id) ? 'border-brand-blue bg-brand-blue/5 shadow-premium' : 'border-gray-100 bg-white ' + p.color
                                            }`}
                                    >
                                        {platforms.includes(p.id) && (
                                            <div className="absolute top-4 right-4 w-6 h-6 bg-brand-blue rounded-full flex items-center justify-center">
                                                <Check className="w-4 h-4 text-white" />
                                            </div>
                                        )}
                                        <p.icon className={`w-12 h-12 ${platforms.includes(p.id) ? 'text-brand-blue' : 'text-gray-400'}`} />
                                        <span className="font-bold text-gray-900 tracking-tight">{p.name}</span>
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
                                <h1 className="text-3xl font-extrabold text-gray-900 mb-2 tracking-tight">Teaching Domain</h1>
                                <p className="text-gray-500 font-medium font-medium">Select the category that best describes your expertise</p>
                            </div>

                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                {['Software', 'Business', 'Design', 'Marketing', 'Languages', 'Music', 'Health', 'Personal Dev', 'Creative'].map(n => (
                                    <button
                                        key={n}
                                        onClick={() => setNiche(n)}
                                        className={`p-4 rounded-2xl border-2 font-bold transition-all text-xs tracking-tight ${niche === n ? 'border-brand-blue bg-brand-blue/5 text-brand-blue' : 'border-gray-100 bg-white text-gray-500 hover:border-gray-200'
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
                                    <Users2 className="w-8 h-8 text-green-600" />
                                </div>
                                <h1 className="text-3xl font-extrabold text-gray-900 mb-2 tracking-tight">Student Demographics</h1>
                                <p className="text-gray-500 font-medium">Who is your primary target audience?</p>
                            </div>

                            <div className="space-y-6 bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-700">Primary Age Group</label>
                                    <select
                                        value={ageGroup}
                                        onChange={(e) => setAgeGroup(e.target.value)}
                                        className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none font-medium"
                                    >
                                        <option>18-24</option>
                                        <option>25-34</option>
                                        <option>35-44</option>
                                        <option>45+</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-700">Top Audience Region</label>
                                    <select
                                        value={region}
                                        onChange={(e) => setRegion(e.target.value)}
                                        className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none font-medium"
                                    >
                                        <option>North America</option>
                                        <option>Europe</option>
                                        <option>Asia Pacific</option>
                                        <option>Latin America</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="mt-12 flex items-center justify-between gap-4">
                        <button
                            onClick={handleBack}
                            disabled={step === 1}
                            className={`flex items-center gap-2 px-8 py-4 rounded-2xl font-bold transition-all ${step === 1 ? 'opacity-0 pointer-events-none' : 'text-gray-500 hover:bg-gray-100'
                                }`}
                        >
                            <ChevronLeft className="w-5 h-5" />
                            Back
                        </button>
                        <button
                            onClick={handleNext}
                            disabled={(step === 1 && platforms.length === 0) || loading}
                            className="flex items-center gap-2 px-10 py-4 bg-brand-blue hover:bg-brand-blue/90 text-white rounded-2xl font-bold transition-all shadow-lg shadow-brand-blue/20 disabled:opacity-50 disabled:shadow-none"
                        >
                            {loading ? (
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                            ) : (
                                <>
                                    {step === totalSteps ? 'Finish Onboarding' : 'Next Step'}
                                    <ChevronRight className="w-5 h-5" />
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </main>
        </div>
    );
};
