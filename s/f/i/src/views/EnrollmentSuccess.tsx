import { useNavigate, useParams, Link } from 'react-router-dom';
import {
    CheckCircle2, Rocket, ArrowRight, Library,
    Layers, Cpu, Sparkles
} from 'lucide-react';
import { LearnerNavbar } from '../components/LearnerNavbar';

export const EnrollmentSuccess = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const sampleModels = [
        { title: "Neural Logic Model", type: "AI Engine", accuracy: "99.8%" },
        { title: "Pattern Guard 2.0", type: "Security", status: "Active" },
        { title: "Ecosystem Mapper", type: "Analytics", coverage: "Global" }
    ];

    return (
        <div className="min-h-screen bg-[#fcfcfd]">
            <LearnerNavbar />

            <main className="w-full max-w-7xl mx-auto px-[5%] py-16 text-center">
                {/* Success Header */}
                <div className="mb-16 space-y-6">
                    <div className="w-24 h-24 bg-emerald-50 rounded-[32px] flex items-center justify-center mx-auto shadow-xl shadow-emerald-500/10 animate-bounce">
                        <CheckCircle2 className="w-12 h-12 text-emerald-500" />
                    </div>
                    <div className="space-y-2">
                        <h1 className="text-5xl font-black text-gray-900 tracking-tight italic">Enrollment Confirmed!</h1>
                        <p className="text-xl text-gray-500 font-medium">Your institutional access to Path #{id} has been provisioned.</p>
                    </div>
                </div>

                {/* Model Preview Section */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20 text-left">
                    {sampleModels.map((model, i) => (
                        <div key={i} className="bg-white p-8 rounded-[40px] border border-gray-100 shadow-sm relative overflow-hidden group hover:shadow-2xl transition-all duration-500">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-brand-blue/5 blur-[60px] -mr-16 -mt-16 group-hover:bg-brand-blue/10 transition-colors"></div>
                            <div className="relative z-10">
                                <div className="w-12 h-12 bg-gray-900 rounded-2xl flex items-center justify-center mb-6 text-white group-hover:scale-110 transition-transform">
                                    {i === 0 ? <Cpu className="w-6 h-6" /> : i === 1 ? <Layers className="w-6 h-6" /> : <Library className="w-6 h-6" />}
                                </div>
                                <div className="text-[10px] font-black text-brand-blue uppercase tracking-widest mb-2">{model.type}</div>
                                <h3 className="text-xl font-black text-gray-900 mb-4">{model.title}</h3>
                                <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Metric</span>
                                    <span className="text-sm font-black text-gray-900">{model.accuracy || model.status || model.coverage}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Call to Action */}
                <div className="bg-gray-900 rounded-[48px] p-12 relative overflow-hidden text-white">
                    <div className="absolute top-0 left-0 w-full h-full">
                        <div className="absolute top-1/2 left-1/4 w-96 h-96 bg-brand-blue/20 blur-[120px] rounded-full"></div>
                        <div className="absolute bottom-1/2 right-1/4 w-96 h-96 bg-purple-600/10 blur-[120px] rounded-full"></div>
                    </div>

                    <div className="relative z-10 flex flex-col items-center gap-8">
                        <div className="space-y-4">
                            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 rounded-full border border-white/20">
                                <Sparkles className="w-3.5 h-3.5 text-brand-blue" />
                                <span className="text-[10px] font-black uppercase tracking-widest">Workspace Ready</span>
                            </div>
                            <h2 className="text-4xl font-black tracking-tight leading-none italic">Begin Your Institutional Journey</h2>
                            <p className="text-white/60 font-medium max-w-xl mx-auto">Click below to enter the interactive workspace and access your curriculum activity.</p>
                        </div>

                        <Link
                            to={`/company/course/${id}`}
                            className="bg-white text-gray-900 px-12 py-6 rounded-[28px] font-black text-sm uppercase tracking-[0.2em] flex items-center gap-3 hover:scale-105 active:scale-95 transition-all shadow-2xl shadow-white/10"
                        >
                            Go to Activity <Rocket className="w-5 h-5 fill-gray-900" />
                        </Link>
                    </div>
                </div>

                <button
                    onClick={() => navigate('/company/courses')}
                    className="mt-12 text-sm font-black text-gray-400 uppercase tracking-widest hover:text-gray-900 transition-colors flex items-center gap-2 mx-auto group"
                >
                    <ArrowRight className="w-4 h-4 rotate-180 group-hover:-translate-x-1 transition-transform" />
                    Back to Catalog
                </button>
            </main>
        </div>
    );
};
