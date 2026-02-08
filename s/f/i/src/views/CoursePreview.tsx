import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
    ChevronLeft, Star, Clock, User, BookOpen,
    ShieldCheck, Sparkles, Zap, GraduationCap,
    Play, Check, Share2, Heart
} from 'lucide-react';
import { LearnerNavbar } from '../components/LearnerNavbar';

interface CourseDetails {
    id: number;
    title: string;
    description: string;
    longDescription: string;
    category: string;
    rating: number;
    reviews: number;
    students: string;
    duration: string;
    lastUpdated: string;
    instructor: {
        name: string;
        role: string;
        avatar: string;
    };
    curriculum: {
        title: string;
        lessons: string[];
    }[];
    image: string;
}

export const CoursePreview = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [course, setCourse] = useState<CourseDetails | null>(null);

    useEffect(() => {
        const fetchCourse = async () => {
            try {
                const response = await fetch(`http://localhost:5000/api/courses/${id}`);
                if (response.ok) {
                    const data = await response.json();

                    // Map API data to CourseDetails interface
                    const mappedData: CourseDetails = {
                        id: data.id,
                        title: data.title,
                        description: data.description || "Master the fundamentals of modern technology.",
                        longDescription: data.description || "Detailed course description is currently being finalized for this professional educational path.",
                        category: (data.tags && Array.isArray(data.tags)) ? data.tags[0] : "GENERAL",
                        rating: 4.8,
                        reviews: Math.floor(Math.random() * 500) + 100,
                        students: data.views ? `${(data.views / 1000).toFixed(1)}k` : "1.2k",
                        duration: data.duration || "12h 30m",
                        lastUpdated: data.last_updated ? new Date(data.last_updated).toLocaleDateString() : "Present",
                        instructor: {
                            name: data.author || "LearnSphere Expert",
                            role: "Instructor",
                            avatar: `https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop`
                        },
                        curriculum: data.modules && data.modules.length > 0 ? (
                            // Check if modules is already in {title, lessons} format
                            data.modules[0].lessons ? data.modules : [
                                {
                                    title: "Course Curriculum",
                                    lessons: data.modules.map((m: any) => m.title || "Untitled Lesson")
                                }
                            ]
                        ) : [
                            {
                                title: "Foundations",
                                lessons: ["Introduction", "Core Concepts", "Course Overview"]
                            }
                        ],
                        image: data.image
                            ? (data.image.startsWith('http') ? data.image : `http://localhost:5000/${data.image}`)
                            : `https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=1600&auto=format&fit=crop`
                    };
                    setCourse(mappedData);
                } else {
                    console.error("Failed to fetch course");
                }
            } catch (error) {
                console.error("Error fetching course:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchCourse();
    }, [id]);

    if (loading) return (
        <div className="min-h-screen bg-white flex items-center justify-center">
            <div className="flex flex-col items-center gap-4">
                <div className="w-12 h-12 border-4 border-brand-blue/20 border-t-brand-blue rounded-full animate-spin"></div>
                <div className="text-[10px] font-black uppercase tracking-widest text-gray-400">Syncing Intelligence...</div>
            </div>
        </div>
    );

    if (!course) return <div>Course not found</div>;

    return (
        <div className="min-h-screen bg-[#fcfcfd]">
            <LearnerNavbar />

            <main className="w-full">
                {/* Premium Hero Section */}
                <div className="relative bg-gray-900 border-b border-white/5 overflow-hidden">
                    <div className="absolute inset-0">
                        <img src={course.image} alt="" className="w-full h-full object-cover opacity-20" />
                        <div className="absolute inset-0 bg-gradient-to-r from-gray-900 via-gray-900/90 to-transparent"></div>
                    </div>

                    <div className="relative z-10 px-[5%] py-20 max-w-7xl">
                        <button
                            onClick={() => navigate(-1)}
                            className="inline-flex items-center gap-2 text-white/60 hover:text-white transition-colors mb-8 group"
                        >
                            <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                            <span className="text-[10px] font-black uppercase tracking-widest">Return to catalog</span>
                        </button>

                        <div className="space-y-6">
                            <div className="inline-flex items-center gap-2 px-3 py-1 bg-brand-blue/20 rounded-full border border-brand-blue/30 backdrop-blur-md">
                                <ShieldCheck className="w-3.5 h-3.5 text-brand-blue" />
                                <span className="text-[10px] font-black uppercase tracking-widest text-brand-blue">{course.category}</span>
                            </div>

                            <h1 className="text-6xl font-black text-white tracking-tight leading-none italic max-w-4xl">
                                {course.title}
                            </h1>

                            <p className="text-xl text-white/60 font-medium max-w-2xl leading-relaxed italic">
                                {course.description}
                            </p>

                            <div className="flex flex-wrap items-center gap-8 pt-4">
                                <div className="flex items-center gap-2">
                                    <div className="flex -space-x-1">
                                        {[1, 2, 3, 4, 5].map(i => <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />)}
                                    </div>
                                    <span className="text-lg font-black text-white leading-none">{course.rating}</span>
                                    <span className="text-white/40 text-sm font-bold">({course.reviews} reviews)</span>
                                </div>
                                <div className="flex items-center gap-2 text-white/60 text-sm font-bold uppercase tracking-widest">
                                    <Clock className="w-4 h-4" />
                                    {course.duration}
                                </div>
                                <div className="flex items-center gap-2 text-white/60 text-sm font-bold uppercase tracking-widest">
                                    <User className="w-4 h-4" />
                                    {course.students} Learners enrolled
                                </div>
                            </div>

                            <div className="flex items-center gap-6 pt-10">
                                <div className="flex items-center gap-4 group cursor-pointer">
                                    <div className="w-12 h-12 rounded-2xl overflow-hidden border-2 border-white/10 group-hover:border-brand-blue transition-colors">
                                        <img src={course.instructor.avatar} alt="" className="w-full h-full object-cover" />
                                    </div>
                                    <div>
                                        <div className="text-xs font-black text-white/40 uppercase tracking-widest">Path Instructor</div>
                                        <div className="text-lg font-black text-white tracking-tight">{course.instructor.name}</div>
                                    </div>
                                </div>
                                <div className="h-10 w-px bg-white/10"></div>
                                <div className="text-white/40 text-xs font-black uppercase tracking-[0.2em]">Institutional Grade</div>
                            </div>
                        </div>
                    </div>

                    {/* Floating Purchase Card */}
                    <div className="hidden xl:block absolute top-20 right-[5%] w-[400px] z-20">
                        <div className="bg-white rounded-[40px] shadow-[0_40px_80px_-20px_rgba(0,0,0,0.3)] overflow-hidden border border-gray-100 p-8 space-y-8">
                            <div className="relative aspect-video rounded-[32px] overflow-hidden group">
                                <img src={course.image} alt="" className="w-full h-full object-cover" />
                                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-[2px]">
                                    <Play className="w-12 h-12 text-white fill-current" />
                                </div>
                                <div className="absolute bottom-4 left-0 right-0 text-center text-white text-[10px] font-black uppercase tracking-[0.2em] drop-shadow-md">Trailer Preview</div>
                            </div>

                            <div className="space-y-4">
                                <Link
                                    to={`/company/course/success/${course.id}`}
                                    className="w-full bg-brand-blue text-white py-6 rounded-[28px] font-black text-sm uppercase tracking-[0.2em] flex items-center justify-center gap-3 shadow-2xl shadow-brand-blue/30 hover:scale-105 active:scale-95 transition-all"
                                >
                                    Enroll Path <Zap className="w-4 h-4 fill-white" />
                                </Link>
                                <button className="w-full bg-gray-50 text-gray-900 py-6 rounded-[28px] font-black text-sm uppercase tracking-[0.2em] hover:bg-gray-100 transition-all">
                                    Save to Wishlist <Heart className="w-4 h-4" />
                                </button>
                            </div>

                            <div className="space-y-4">
                                <div className="text-xs font-black text-gray-900 uppercase tracking-widest px-2">Path Includes:</div>
                                <div className="grid grid-cols-1 gap-3">
                                    {[
                                        { icon: Clock, text: 'Full lifetime access' },
                                        { icon: GraduationCap, text: 'Institutional Certification' },
                                        { icon: ShieldCheck, text: 'Hands-on AI Playground' },
                                        { icon: BookOpen, text: 'Digital Assets & Blueprints' }
                                    ].map((item, i) => (
                                        <div key={i} className="flex items-center gap-3 text-[11px] font-bold text-gray-500 px-2 leading-none">
                                            <item.icon className="w-4 h-4 text-brand-blue" />
                                            {item.text}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Content Section */}
                <div className="px-[5%] py-24 bg-white">
                    <div className="max-w-7xl grid grid-cols-1 xl:grid-cols-3 gap-24">
                        <div className="xl:col-span-2 space-y-20">
                            {/* What you will learn */}
                            <section className="bg-gray-50 overflow-hidden rounded-[48px] p-12 border border-gray-100 relative group">
                                <div className="absolute top-0 right-0 w-64 h-64 bg-brand-blue/5 blur-[100px] -mr-32 -mt-32"></div>
                                <h2 className="text-3xl font-black text-gray-900 tracking-tight mb-10 flex items-center gap-4 italic">
                                    Target Learning Intelligence
                                    <div className="flex-1 h-px bg-gray-200"></div>
                                </h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    {[
                                        "Automate perimeter defense using custom AI agents",
                                        "Identify polymorphic bot behavior in real-time telemetry",
                                        "Configure autonomous threat response protocols",
                                        "Audit institutional security landscapes at scale",
                                        "Master pattern recognition for digital asset protection",
                                        "Deploy edge-protection using LearnSphere Guard"
                                    ].map((point, i) => (
                                        <div key={i} className="flex items-start gap-4">
                                            <div className="w-6 h-6 rounded-xl bg-white border border-gray-100 flex items-center justify-center shrink-0 shadow-sm mt-0.5">
                                                <Check className="w-3.5 h-3.5 text-brand-blue stroke-[3]" />
                                            </div>
                                            <span className="text-sm font-bold text-gray-600 leading-relaxed italic">{point}</span>
                                        </div>
                                    ))}
                                </div>
                            </section>

                            {/* Description */}
                            <section className="space-y-6">
                                <h2 className="text-3xl font-black text-gray-900 tracking-tight italic">Detailed Overview</h2>
                                <div className="prose prose-lg max-w-none text-gray-500 font-medium italic space-y-6">
                                    <p>{course.longDescription}</p>
                                    <p>Our curriculum is built on real-world industrial intelligence. We don't just teach theory; we provide the exact blueprints used by top-tier protection agencies to secure multi-billion dollar ecosystems.</p>
                                </div>
                            </section>

                            {/* Curriculum */}
                            <section className="space-y-10">
                                <h2 className="text-3xl font-black text-gray-900 tracking-tight italic">Technical Curriculum</h2>
                                <div className="space-y-4">
                                    {course.curriculum.map((module, i) => (
                                        <div key={i} className="bg-white border border-gray-100 rounded-[32px] overflow-hidden group">
                                            <div className="p-8 flex items-center justify-between hover:bg-gray-50 transition-colors cursor-pointer">
                                                <div className="flex items-center gap-6">
                                                    <div className="w-10 h-10 bg-gray-900 text-white rounded-xl flex items-center justify-center font-black text-xs italic">0{i + 1}</div>
                                                    <h4 className="text-lg font-black text-gray-900 tracking-tight italic">{module.title}</h4>
                                                </div>
                                                <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{module.lessons.length} Modules</div>
                                            </div>
                                            <div className="bg-gray-50/50 p-6 space-y-3">
                                                {module.lessons.map((lesson, j) => (
                                                    <div key={j} className="flex items-center gap-4 px-6 py-4 bg-white rounded-2xl border border-gray-100 text-sm font-bold text-gray-500 italic group/lesson hover:border-brand-blue/30 transition-all">
                                                        <Play className="w-3.5 h-3.5 text-brand-blue opacity-40 group-hover/lesson:opacity-100" />
                                                        {typeof lesson === 'string' ? lesson : ((lesson as any).title || "Untitled Lesson")}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        </div>

                        <div className="space-y-12">
                            {/* Requirements */}
                            <div className="space-y-6">
                                <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Operational Requirements</h3>
                                <ul className="space-y-4">
                                    {["Basic understanding of JSON architecture", "Familiarity with digital perimeter defense", "Access to LearnSphere Enterprise Token"].map((req, i) => (
                                        <li key={i} className="flex lg:items-center gap-3 text-sm font-bold text-gray-900 border-b border-gray-50 pb-4 italic">
                                            <Sparkles className="w-4 h-4 text-brand-blue shrink-0" />
                                            {req}
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Trust Badge */}
                            <div className="p-8 bg-brand-blue/5 rounded-[40px] border border-brand-blue/10 space-y-6 text-center italic relative overflow-hidden">
                                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-brand-blue to-purple-600"></div>
                                <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto shadow-xl shadow-brand-blue/10">
                                    <ShieldCheck className="w-8 h-8 text-brand-blue" />
                                </div>
                                <h4 className="text-xl font-black text-gray-900 italic tracking-tight">Institutional Guarantee</h4>
                                <p className="text-sm font-medium text-gray-500">Upon completion, receive an autonomous verification badge recognizable across all partner ecosystems.</p>
                                <Share2 className="w-6 h-6 text-brand-blue/40 mx-auto" />
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};
