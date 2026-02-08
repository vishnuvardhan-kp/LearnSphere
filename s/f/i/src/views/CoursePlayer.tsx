import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    ChevronLeft, CheckCircle2, Play, BookOpen,
    Award, Clock, ArrowRight,
    Lock, Menu, Sparkles, Rocket, Cpu, Layers, Library,
    Eye, ThumbsUp, Share2
} from 'lucide-react';

interface Question {
    id: string;
    question: string;
    options: string[];
    correctAnswer: number;
}

interface Lesson {
    id: number;
    title: string;
    duration: string;
    completed: boolean;
    locked: boolean;
    type: 'video' | 'quiz' | 'reading' | 'text';
    content?: string;
    questions?: Question[];
}

interface Course {
    id: number;
    title: string;
    totalLessons: number;
    completedLessons: number;
    lessons: Lesson[];
}

export const CoursePlayer = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [course, setCourse] = useState<Course | null>(null);
    const [activeLesson, setActiveLesson] = useState<number>(0);
    const [showCertificate, setShowCertificate] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    // Quiz State
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
    const [quizCompleted, setQuizCompleted] = useState(false);
    const [score, setScore] = useState(0);

    useEffect(() => {
        const fetchCourse = async () => {
            try {
                const response = await fetch(`http://localhost:5000/api/courses/${id}`);
                if (response.ok) {
                    const data = await response.json();

                    // Flatten modules and lessons
                    const flattenedLessons: Lesson[] = [];
                    if (data.modules && Array.isArray(data.modules)) {
                        data.modules.forEach((module: any) => {
                            if (module.lessons && Array.isArray(module.lessons)) {
                                module.lessons.forEach((l: any) => {
                                    flattenedLessons.push({
                                        id: flattenedLessons.length + 1,
                                        title: l.title || "Untitled Lesson",
                                        duration: l.duration || "10:00",
                                        completed: false,
                                        locked: flattenedLessons.length > 0, // Lock all but first
                                        type: (l.type as any) || 'video',
                                        content: l.videoLink || l.content || data.video_link || "",
                                        questions: l.questions || []
                                    });
                                });
                            }
                        });
                    }

                    const mappedCourse: Course = {
                        id: Number(data.id),
                        title: data.title,
                        totalLessons: flattenedLessons.length,
                        completedLessons: 0,
                        lessons: flattenedLessons
                    };
                    setCourse(mappedCourse);
                }
            } catch (error) {
                console.error("Error fetching course player data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchCourse();
    }, [id]);

    // Reset quiz state when active lesson changes
    useEffect(() => {
        setCurrentQuestionIndex(0);
        setSelectedAnswer(null);
        setQuizCompleted(false);
        setScore(0);
    }, [activeLesson]);

    const syncProgress = async (completedCount: number, isFinished: boolean) => {
        if (!id) return;
        const token = localStorage.getItem('botfree_token');
        if (!token) return;

        try {
            const progress = Math.round((completedCount / course!.totalLessons) * 100);
            await fetch('http://localhost:5000/api/enrollments/update', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    courseId: id,
                    status: isFinished ? 'completed' : 'in-progress',
                    progress: progress
                })
            });
        } catch (error) {
            console.error("Failed to sync progress:", error);
        }
    };

    const handleMarkComplete = () => {
        if (!course) return;
        const newLessons = [...course.lessons];
        newLessons[activeLesson].completed = true;

        if (activeLesson + 1 < newLessons.length) {
            newLessons[activeLesson + 1].locked = false;
        }

        const completedCount = newLessons.filter(l => l.completed).length;
        const isFinished = completedCount === course.totalLessons;

        setCourse({
            ...course,
            completedLessons: completedCount,
            lessons: newLessons
        });

        // Sync with database
        syncProgress(completedCount, isFinished);

        if (activeLesson + 1 < newLessons.length) {
            setActiveLesson(activeLesson + 1);
        } else if (isFinished) {
            setShowCertificate(true);
        }
    };

    if (loading) return (
        <div className="min-h-screen bg-white flex items-center justify-center">
            <div className="flex flex-col items-center gap-6">
                <div className="relative">
                    <div className="w-16 h-16 border-4 border-brand-blue/10 border-t-brand-blue rounded-full animate-spin"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <Cpu className="w-6 h-6 text-brand-blue animate-pulse" />
                    </div>
                </div>
                <div className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-400 animate-pulse">Initializing Environment...</div>
            </div>
        </div>
    );

    if (!course) return (
        <div className="min-h-screen bg-white flex flex-col items-center justify-center p-20 text-center">
            <div className="w-20 h-20 bg-red-50 rounded-[32px] flex items-center justify-center mb-8">
                <Lock className="w-10 h-10 text-red-500" />
            </div>
            <h1 className="text-3xl font-black text-gray-900 tracking-tight italic mb-4">Core Data Mismatch</h1>
            <p className="text-gray-500 font-medium italic mb-8">The requested institutional module could not be provisioned.</p>
            <button onClick={() => navigate('/company/courses')} className="px-10 py-5 bg-gray-900 text-white rounded-[20px] font-black text-xs uppercase tracking-widest flex items-center gap-2 hover:scale-105 transition-all">
                <ChevronLeft className="w-4 h-4" /> Return to Catalog
            </button>
        </div>
    );

    if (!course.lessons || course.lessons.length === 0) {
        return (
            <div className="min-h-screen bg-[#fcfcfd] flex items-center justify-center p-20 text-center">
                <div className="max-w-md w-full space-y-8">
                    <div className="w-24 h-24 bg-brand-blue/5 rounded-[40px] flex items-center justify-center mx-auto border border-brand-blue/10 animate-bounce">
                        <Rocket className="w-10 h-10 text-brand-blue" />
                    </div>
                    <div className="space-y-4">
                        <h2 className="text-4xl font-black text-gray-900 tracking-tight leading-none italic">Path Under Construction</h2>
                        <p className="text-gray-500 font-medium italic">Institutional modules are currently being synchronized for this curriculum path. Please check back later.</p>
                    </div>
                    <button onClick={() => navigate('/company/courses')} className="px-10 py-5 bg-white border border-gray-100 rounded-[24px] text-gray-900 font-black text-[10px] uppercase tracking-[0.2em] hover:bg-gray-50 transition-all shadow-xl shadow-gray-200/50 flex items-center gap-2 mx-auto">
                        <ChevronLeft className="w-4 h-4" /> Back to Catalog
                    </button>
                </div>
            </div>
        );
    }

    const progress = Math.round((course.completedLessons / course.totalLessons) * 100);
    const currentLesson = course.lessons[activeLesson];

    const getYouTubeEmbedUrl = (url?: string) => {
        if (!url) return undefined;
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
        const match = url.match(regExp);
        if (match && match[2].length === 11) {
            return `https://www.youtube.com/embed/${match[2]}`;
        }
        return url;
    };

    return (
        <div className="min-h-screen bg-white flex flex-col font-sans selection:bg-brand-blue/30 selection:text-brand-blue">
            {/* Completion Success Overlay */}
            {showCertificate && (
                <div className="fixed inset-0 z-[100] bg-gray-900/98 backdrop-blur-2xl flex items-center justify-center p-6 animate-in fade-in duration-700">
                    <div className="max-w-2xl w-full bg-white rounded-[60px] p-16 text-center space-y-10 relative overflow-hidden shadow-[0_0_100px_rgba(0,0,0,0.5)] border border-white/20">
                        <div className="absolute top-0 left-0 w-full h-4 bg-gradient-to-r from-brand-blue via-purple-500 to-indigo-600"></div>
                        <div className="absolute -top-24 -right-24 w-64 h-64 bg-brand-blue/10 blur-[100px] rounded-full"></div>

                        <div className="w-28 h-28 bg-emerald-50 rounded-[40px] flex items-center justify-center mx-auto mb-4 animate-bounce shadow-[inset_0_4px_12px_rgba(16,185,129,0.1)]">
                            <Award className="w-14 h-14 text-emerald-500" />
                        </div>

                        <div className="space-y-4">
                            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-brand-blue/5 rounded-full border border-brand-blue/10">
                                <Sparkles className="w-3.5 h-3.5 text-brand-blue" />
                                <span className="text-[10px] font-black text-brand-blue uppercase tracking-[0.3em]">Institutional Achievement</span>
                            </div>
                            <h2 className="text-6xl font-black text-gray-900 tracking-tighter italic leading-tight">Mastery Confirmed!</h2>
                            <p className="text-lg text-gray-500 font-medium italic">Congratulations! You have successfully verified <br /><span className="text-gray-900 font-black">"{course.title}"</span>.</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6">
                            <button
                                onClick={() => navigate('/company-dashboard')}
                                className="px-10 py-6 bg-gray-900 text-white font-black text-xs uppercase tracking-[0.2em] rounded-[28px] hover:bg-black transition-all shadow-2xl flex items-center justify-center gap-3 group"
                            >
                                <Rocket className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" /> Dashboard
                            </button>
                            <button className="px-10 py-6 bg-brand-blue text-white font-black text-xs uppercase tracking-[0.2em] rounded-[28px] shadow-[0_20px_40px_rgba(59,130,246,0.3)] hover:scale-105 transition-all flex items-center justify-center gap-3">
                                <Award className="w-5 h-5" /> Certificate
                            </button>
                        </div>

                        <div className="pt-6">
                            <button
                                onClick={() => setShowCertificate(false)}
                                className="text-gray-400 text-[10px] font-black uppercase tracking-[0.3em] hover:text-gray-900 transition-colors py-2 border-b-2 border-transparent hover:border-gray-200 italic"
                            >
                                Continue Research
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Main Header - Immersive Dark */}
            <header className="h-20 bg-gray-950 text-white flex items-center justify-between px-10 sticky top-0 z-[60] shadow-2xl border-b border-white/5 backdrop-blur-xl bg-opacity-95">
                <div className="flex items-center gap-8">
                    <button
                        onClick={() => navigate('/company/courses')}
                        className="group flex items-center gap-3 text-white/40 hover:text-white transition-all"
                    >
                        <div className="w-10 h-10 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-brand-blue group-hover:border-brand-blue transition-all">
                            <ChevronLeft className="w-5 h-5" />
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-[0.3em] hidden md:block">Exit Path</span>
                    </button>
                    <div className="h-8 w-px bg-white/10"></div>
                    <div className="space-y-0.5">
                        <h1 className="text-lg font-black tracking-tight italic text-white/90 truncate max-w-[300px]">{course.title}</h1>
                        <div className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-brand-blue animate-pulse"></div>
                            <span className="text-[9px] font-bold uppercase tracking-[0.1em] text-white/30 italic">Module: {currentLesson.title}</span>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-8">
                    <div className="hidden lg:flex flex-col items-end gap-2">
                        <div className="flex items-center gap-3">
                            <span className="text-[9px] font-black uppercase tracking-[0.2em] text-white/40">Level Progress</span>
                            <span className="text-xs font-black text-brand-blue">{progress}%</span>
                        </div>
                        <div className="w-48 h-1.5 bg-white/5 rounded-full overflow-hidden border border-white/5 backdrop-blur-md">
                            <div className="h-full bg-brand-blue shadow-[0_0_20px_rgba(59,130,246,0.8)] transition-all duration-1000" style={{ width: `${progress}%` }}></div>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                            className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all border ${isSidebarOpen ? 'bg-brand-blue border-brand-blue text-white shadow-[0_0_20px_rgba(59,130,246,0.3)]' : 'bg-white/5 border-white/10 text-white/60 hover:bg-white/10'}`}
                        >
                            <Menu className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </header>

            <div className="flex flex-1 relative bg-[#fcfcfd] overflow-x-hidden">
                {/* Immersive Sidebar */}
                <aside className={`sticky top-0 z-40 w-96 bg-white flex flex-col transition-all duration-500 h-[calc(100vh-80px)] border-r border-gray-100 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:-ml-96 lg:w-0 overflow-hidden'}`}>
                    <div className="p-10 border-b border-gray-50 bg-[#fcfcfd]/80 backdrop-blur-sm sticky top-0 z-10">
                        <div className="flex items-center justify-between mb-8">
                            <h2 className="text-[11px] font-black uppercase tracking-[0.3em] text-gray-400">Sequence Map</h2>
                            <div className="px-3 py-1 bg-brand-blue/5 rounded-lg border border-brand-blue/10">
                                <span className="text-[10px] font-black text-brand-blue">{course.completedLessons}/{course.totalLessons}</span>
                            </div>
                        </div>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between text-[11px] font-black tracking-widest text-gray-900 uppercase italic">
                                <span>Path Completion</span>
                                <span>{progress}%</span>
                            </div>
                            <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden flex p-0.5">
                                <div className="h-full bg-brand-blue rounded-full transition-all duration-700 shadow-[0_0_10px_rgba(59,130,246,0.3)]" style={{ width: `${progress}%` }}></div>
                            </div>
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto p-6 space-y-3 no-scrollbar">
                        {course.lessons.map((lesson, idx) => (
                            <button
                                key={lesson.id}
                                disabled={lesson.locked}
                                onClick={() => setActiveLesson(idx)}
                                className={`w-full p-5 rounded-[28px] flex items-center gap-5 text-left transition-all group relative overflow-hidden ${activeLesson === idx
                                    ? 'bg-gray-900 text-white shadow-2xl shadow-gray-900/20 active-lesson'
                                    : 'hover:bg-gray-50 text-gray-600 border border-transparent'
                                    } ${lesson.locked ? 'opacity-30 grayscale cursor-not-allowed' : ''}`}
                            >
                                {activeLesson === idx && (
                                    <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-brand-blue shadow-[0_0_20px_rgba(59,130,246,1)]"></div>
                                )}
                                <div className={`w-12 h-12 shrink-0 rounded-[20px] flex items-center justify-center transition-all ${lesson.completed
                                    ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20'
                                    : activeLesson === idx
                                        ? 'bg-brand-blue text-white shadow-lg shadow-brand-blue/30 scale-110'
                                        : 'bg-gray-50 text-gray-400 group-hover:bg-gray-100 group-hover:scale-105'
                                    }`}>
                                    {lesson.completed ? (
                                        <CheckCircle2 className="w-6 h-6" />
                                    ) : lesson.locked ? (
                                        <Lock className="w-5 h-5 opacity-40" />
                                    ) : (
                                        <div className="flex items-center justify-center animate-pulse">
                                            {lesson.type === 'video' ? <Play className="w-5 h-5 fill-current ml-0.5" /> : <BookOpen className="w-5 h-5" />}
                                        </div>
                                    )}
                                </div>
                                <div className="flex-1 min-w-0 pr-2">
                                    <div className={`text-xs font-black leading-tight tracking-tight mb-1 truncate ${activeLesson === idx ? 'text-white' : 'text-gray-900'}`}>{lesson.title}</div>
                                    <div className="flex items-center gap-3">
                                        <div className="flex items-center gap-1.5">
                                            <Clock className="w-3 h-3 opacity-40 shrink-0" />
                                            <span className={`text-[9px] font-bold uppercase tracking-widest ${activeLesson === idx ? 'text-white/40' : 'text-gray-400'}`}>{lesson.duration}</span>
                                        </div>
                                        <div className={`w-1 h-1 rounded-full ${activeLesson === idx ? 'bg-brand-blue' : 'bg-gray-200'}`}></div>
                                        <span className={`text-[8px] font-black uppercase tracking-[0.2em] italic ${activeLesson === idx ? 'text-brand-blue' : 'text-gray-300'}`}>{lesson.type}</span>
                                    </div>
                                </div>
                            </button>
                        ))}
                    </div>
                </aside>

                {/* Main Content Area - Dark Mode Immersive */}
                <main className="flex-1 overflow-y-auto custom-scrollbar relative">
                    {/* Integrated Player Section */}
                    <div className="w-full bg-black shadow-2xl relative z-10 group/player">
                        <div className="aspect-video max-w-7xl mx-auto overflow-hidden relative shadow-[0_50px_100px_rgba(0,0,0,0.4)]">
                            {currentLesson.type === 'video' && currentLesson.content ? (
                                <iframe
                                    className="w-full h-full"
                                    src={`${getYouTubeEmbedUrl(currentLesson.content)}?autoplay=0&rel=0&modestbranding=1&showinfo=0`}
                                    title={currentLesson.title}
                                    frameBorder="0"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                ></iframe>
                            ) : currentLesson.type === 'quiz' ? (
                                <div className="w-full h-full flex flex-col items-center justify-center bg-gray-950 p-12 overflow-hidden relative">
                                    <div className="absolute inset-0 bg-brand-blue/5 blur-[120px]"></div>
                                    <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-5 pointer-events-none">
                                        <div className="grid grid-cols-6 gap-8 rotate-12 scale-150">
                                            {Array.from({ length: 24 }).map((_, i) => (
                                                <Cpu key={i} className="w-32 h-32" />
                                            ))}
                                        </div>
                                    </div>

                                    <div className="max-w-4xl w-full relative z-10">
                                        {!quizCompleted ? (
                                            <div className="space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-700">
                                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-white/10 pb-10">
                                                    <div className="space-y-3">
                                                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-brand-blue/10 rounded-full border border-brand-blue/20">
                                                            <div className="w-2 h-2 bg-brand-blue rounded-full pulse"></div>
                                                            <span className="text-[10px] font-black text-brand-blue uppercase tracking-[0.3em]">Knowledge Check Alpha</span>
                                                        </div>
                                                        <h3 className="text-[10px] font-black text-white/40 uppercase tracking-[0.4em]">Question Module {currentQuestionIndex + 1} of {currentLesson.questions?.length || 0}</h3>
                                                    </div>
                                                    <div className="flex gap-2">
                                                        {currentLesson.questions?.map((_, i) => (
                                                            <div key={i} className={`h-1.5 w-8 rounded-full transition-all duration-500 ${i === currentQuestionIndex ? 'bg-brand-blue shadow-[0_0_10px_rgba(59,130,246,0.5)]' : i < currentQuestionIndex ? 'bg-emerald-500' : 'bg-white/10'}`}></div>
                                                        ))}
                                                    </div>
                                                </div>

                                                <div className="space-y-10">
                                                    <h2 className="text-5xl font-black text-white tracking-tighter italic leading-tight max-w-3xl">
                                                        {currentLesson.questions?.[currentQuestionIndex]?.question || "Sequence logic pending implementation."}
                                                    </h2>

                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                        {currentLesson.questions?.[currentQuestionIndex]?.options.map((option, oIdx) => (
                                                            <button
                                                                key={oIdx}
                                                                onClick={() => setSelectedAnswer(oIdx)}
                                                                className={`p-8 rounded-[32px] border text-left transition-all duration-300 group flex items-start gap-6 relative overflow-hidden ${selectedAnswer === oIdx
                                                                    ? 'bg-brand-blue border-brand-blue text-white shadow-[0_20px_50px_rgba(59,130,246,0.3)] scale-[1.02]'
                                                                    : 'bg-white/5 border-white/10 text-white/50 hover:bg-white/10 hover:border-white/20'
                                                                    }`}
                                                            >
                                                                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-sm shrink-0 transition-all ${selectedAnswer === oIdx ? 'bg-white text-brand-blue shadow-inner' : 'bg-white/10 text-white/40 group-hover:bg-white/20'}`}>
                                                                    {String.fromCharCode(65 + oIdx)}
                                                                </div>
                                                                <div className="font-bold text-lg italic tracking-tight pt-2">{option}</div>
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>

                                                <div className="flex justify-between items-center pt-8 border-t border-white/10">
                                                    <div className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em] hidden sm:block italic">Security Protocol: Active Session</div>
                                                    <button
                                                        disabled={selectedAnswer === null}
                                                        onClick={() => {
                                                            const isCorrect = selectedAnswer === currentLesson.questions?.[currentQuestionIndex]?.correctAnswer;
                                                            if (isCorrect) setScore(score + 1);

                                                            if (currentQuestionIndex + 1 < (currentLesson.questions?.length || 0)) {
                                                                setCurrentQuestionIndex(currentQuestionIndex + 1);
                                                                setSelectedAnswer(null);
                                                            } else {
                                                                setQuizCompleted(true);
                                                            }
                                                        }}
                                                        className={`px-14 py-6 rounded-[28px] font-black text-[11px] uppercase tracking-[0.3em] transition-all flex items-center gap-3 group relative overflow-hidden ${selectedAnswer === null ? 'bg-white/5 text-white/20 cursor-not-allowed' : 'bg-[#0ea5e9] text-white hover:scale-105 active:scale-95 shadow-2xl shadow-blue-500/30'}`}
                                                    >
                                                        <span className="relative z-10 transition-transform group-hover:translate-x-1">Verify Module Logic</span>
                                                        <ArrowRight className="w-5 h-5 relative z-10 group-hover:translate-x-2 transition-transform" />
                                                    </button>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="text-center space-y-12 animate-in zoom-in-95 duration-1000 max-w-xl mx-auto">
                                                <div className="relative">
                                                    <div className="w-32 h-32 bg-emerald-500/20 rounded-[48px] flex items-center justify-center mx-auto border border-emerald-500/30 shadow-[0_0_50px_rgba(16,185,129,0.2)]">
                                                        <CheckCircle2 className="w-16 h-16 text-emerald-500" />
                                                    </div>
                                                    <div className="absolute inset-0 animate-ping opacity-20 bg-emerald-500 rounded-full scale-150"></div>
                                                </div>
                                                <div className="space-y-4">
                                                    <h2 className="text-6xl font-black text-white italic tracking-tighter leading-none">Verified.</h2>
                                                    <div className="text-white/40 font-medium italic text-xl">Intelligence Score: <span className="text-brand-blue font-black tracking-widest">{Math.round((score / (currentLesson.questions?.length || 1)) * 100)}%</span></div>
                                                    <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden mt-4">
                                                        <div className="h-full bg-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.8)]" style={{ width: `${(score / (currentLesson.questions?.length || 1)) * 100}%` }}></div>
                                                    </div>
                                                </div>
                                                <button
                                                    onClick={handleMarkComplete}
                                                    className="w-full bg-white text-gray-900 py-7 rounded-[32px] font-black text-xs uppercase tracking-[0.3em] hover:scale-[1.02] transition-all shadow-[0_30px_60px_rgba(255,255,255,0.1)] flex items-center justify-center gap-4 group"
                                                >
                                                    Continue Curriculum <Rocket className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ) : (
                                <div className="w-full h-full flex flex-col items-center justify-center bg-gray-950 p-12 overflow-hidden relative">
                                    <div className="absolute inset-0 bg-brand-blue/5 blur-[120px]"></div>
                                    <div className="max-w-3xl w-full text-center space-y-10 relative z-10 animate-in fade-in duration-1000">
                                        <div className="w-28 h-28 bg-white/5 rounded-[48px] flex items-center justify-center mx-auto border border-white/10 shadow-2xl backdrop-blur-2xl hover:scale-110 transition-transform duration-700 group">
                                            <BookOpen className="w-12 h-12 text-brand-blue" />
                                        </div>
                                        <div className="space-y-4">
                                            <h2 className="text-6xl font-black text-white tracking-tighter italic leading-none">Research Archive</h2>
                                            <p className="text-white/40 font-medium italic text-xl leading-relaxed max-w-2xl mx-auto">This module contains proprietary architectural frameworks and institutional reading material classified for your security level.</p>
                                        </div>
                                        <button className="bg-white text-gray-900 px-16 py-6 rounded-[28px] font-black text-xs uppercase tracking-[0.3em] hover:scale-105 transition-all shadow-2xl shadow-white/10 mt-4">Initialize Session Buffer</button>
                                    </div>
                                </div>
                            )}

                            {/* Institutional HUD Overlays */}
                            <div className="absolute top-10 left-10 flex items-center gap-4 pointer-events-none opacity-0 group-hover/player:opacity-100 transition-all duration-700 translate-x-4 group-hover/player:translate-x-0">
                                <div className="w-10 h-10 bg-black/60 backdrop-blur-xl rounded-[14px] flex items-center justify-center border border-white/10 shadow-2xl">
                                    <Sparkles className="w-5 h-5 text-brand-blue" />
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-[9px] font-black text-white italic uppercase tracking-[0.5em] drop-shadow-lg">Institutional Core</span>
                                    <span className="text-[8px] font-bold text-white/40 uppercase tracking-[0.2em]">Telemetry v.2.8.4</span>
                                </div>
                            </div>

                            <div className="absolute bottom-10 right-10 flex items-center gap-6 pointer-events-none opacity-0 group-hover/player:opacity-100 transition-all duration-700 -translate-x-4 group-hover/player:translate-x-0">
                                <div className="flex flex-col items-end">
                                    <span className="text-[9px] font-black text-white italic uppercase tracking-[0.3em] drop-shadow-lg">Active Frequency</span>
                                    <span className="text-[10px] font-black text-brand-blue uppercase tracking-widest">99.8% Verified</span>
                                </div>
                                <div className="w-32 h-1.5 bg-white/10 rounded-full overflow-hidden backdrop-blur-md">
                                    <div className="h-full bg-brand-blue shadow-[0_0_10px_rgba(59,130,246,1)] animate-progress-slow"></div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Information Context Layer */}
                    <div className="max-w-7xl mx-auto px-8 md:px-12 lg:px-20 py-16 md:py-24 relative">
                        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-20 mb-20">
                            <div className="flex-1 space-y-10">
                                <div className="space-y-6">
                                    <div className="inline-flex items-center gap-3 px-5 py-2 bg-gray-900 rounded-[18px] text-white">
                                        <div className="w-2.5 h-2.5 bg-brand-blue rounded-full animate-pulse shadow-[0_0_12px_rgba(59,130,246,1)]"></div>
                                        <span className="text-[10px] font-black uppercase tracking-[0.3em] italic">Sequence Sequence Alpha-{id}</span>
                                    </div>
                                    <h1 className="text-7xl lg:text-8xl font-black text-gray-900 tracking-tighter italic leading-[0.85]">{currentLesson.title}</h1>
                                    <div className="flex flex-wrap items-center gap-12 text-[12px] font-black uppercase tracking-[0.2em] text-gray-400">
                                        <div className="flex items-center gap-3 text-emerald-600 italic bg-emerald-50 px-5 py-2.5 rounded-2xl border border-emerald-100">
                                            <Clock className="w-5 h-5" />
                                            {currentLesson.duration} Module Time
                                        </div>
                                        <div className="flex items-center gap-3 italic">
                                            <Award className="w-5 h-5 text-brand-blue" />
                                            Level-4 Clearance
                                        </div>
                                        <div className="flex items-center gap-3 italic">
                                            <Eye className="w-5 h-5 text-gray-400" />
                                            1.2k Verifications
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    <div className="flex items-center gap-4">
                                        <div className="h-px bg-gray-200 flex-1"></div>
                                        <h3 className="text-[11px] font-black text-gray-400 uppercase tracking-[0.5em] italic">Institutional Overview</h3>
                                        <div className="h-px bg-gray-200 flex-1"></div>
                                    </div>
                                    <p className="text-gray-500 leading-relaxed font-medium italic text-xl lg:text-2xl pt-4">
                                        {currentLesson.content && currentLesson.type === 'reading'
                                            ? currentLesson.content
                                            : "This institutional module focuses on establishing modular logic frameworks for high-security environments. You will iterate on existing telemetry to ensure absolute perimeter integrity across all synchronized architectures."
                                        }
                                    </p>
                                </div>
                            </div>

                            {/* Side Actions Controls */}
                            <div className="w-full lg:w-96 shrink-0 space-y-8">
                                <button
                                    onClick={handleMarkComplete}
                                    disabled={currentLesson.completed}
                                    className={`w-full py-10 rounded-[48px] font-black uppercase tracking-[0.3em] text-[11px] shadow-2xl transition-all flex flex-col items-center justify-center gap-4 relative overflow-hidden group/btn-main ${currentLesson.completed
                                        ? 'bg-emerald-500 text-white shadow-emerald-500/30'
                                        : 'bg-gray-900 text-white hover:bg-black hover:shadow-gray-900/40 scale-[1.05] hover:-translate-y-2'
                                        }`}
                                >
                                    <div className="absolute inset-0 bg-brand-blue scale-x-0 group-hover/btn-main:scale-x-100 origin-left transition-transform duration-700 opacity-20"></div>
                                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-1 transition-all group-hover/btn-main:scale-110 ${currentLesson.completed ? 'bg-white/20' : 'bg-brand-blue shadow-[0_0_20px_rgba(59,130,246,0.5)]'}`}>
                                        {currentLesson.completed ? <CheckCircle2 className="w-6 h-6" /> : <Rocket className="w-6 h-6" />}
                                    </div>
                                    <span className="relative z-10 flex flex-col items-center gap-1">
                                        {currentLesson.completed ? (
                                            <>
                                                <span>Session Verified</span>
                                                <span className="text-[8px] font-bold opacity-60">Sequence Logic Logged</span>
                                            </>
                                        ) : (
                                            <>
                                                <span>{activeLesson === course.lessons.length - 1 ? 'Conclude Path' : 'Master Logical Block'}</span>
                                                <span className="text-[8px] font-bold opacity-60">Synchronize Intelligence</span>
                                            </>
                                        )}
                                    </span>
                                </button>

                                <div className="grid grid-cols-2 gap-4">
                                    <button className="flex flex-col items-center gap-3 p-6 bg-white border border-gray-100 rounded-[32px] hover:bg-gray-50 transition-all group shadow-sm">
                                        <ThumbsUp className="w-5 h-5 text-gray-400 group-hover:text-brand-blue transition-colors" />
                                        <span className="text-[9px] font-black uppercase tracking-widest text-gray-400 italic">Endorse</span>
                                    </button>
                                    <button className="flex flex-col items-center gap-3 p-6 bg-white border border-gray-100 rounded-[32px] hover:bg-gray-50 transition-all group shadow-sm">
                                        <Share2 className="w-5 h-5 text-gray-400 group-hover:text-brand-blue transition-colors" />
                                        <span className="text-[9px] font-black uppercase tracking-widest text-gray-400 italic">Transmit</span>
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Intelligence Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {[
                                { title: 'Modular Protocol', icon: Cpu, desc: 'Execution of logic architecture in isolated environments.' },
                                { title: 'Perimeter Logic', icon: Layers, desc: 'Establishment of multi-tier security barriers for telemetry.' },
                                { title: 'Registry Sync', icon: Library, desc: 'Global synchronization of institutional learning data.' }
                            ].map((item, i) => (
                                <div key={i} className="bg-white p-10 rounded-[40px] border border-gray-100 hover:shadow-2xl transition-all duration-500 group relative overflow-hidden">
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-brand-blue/5 blur-[50px] -mr-16 -mt-16 group-hover:bg-brand-blue/10 transition-colors"></div>
                                    <div className="relative z-10 space-y-6">
                                        <div className="w-14 h-14 bg-gray-900 rounded-2xl flex items-center justify-center text-white group-hover:bg-brand-blue transition-all group-hover:scale-110 group-hover:rotate-6">
                                            <item.icon className="w-7 h-7" />
                                        </div>
                                        <div className="space-y-4">
                                            <h4 className="text-2xl font-black text-gray-900 tracking-tighter italic">{item.title}</h4>
                                            <p className="text-gray-500 text-sm font-medium italic leading-relaxed">{item.desc}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </main>
            </div>

            {/* Global Context Tip - Immersive Glass */}
            {!showCertificate && (
                <div className="fixed bottom-12 right-12 z-[70] hidden xl:block animate-in slide-in-from-right duration-1000">
                    <div className="bg-white/80 backdrop-blur-2xl p-8 rounded-[40px] shadow-[0_40px_80px_rgba(0,0,0,0.1)] border border-white/40 relative overflow-hidden group max-w-sm">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-brand-blue/10 blur-[60px]"></div>
                        <div className="flex items-start gap-5 relative z-10">
                            <div className="w-14 h-14 bg-gray-900 rounded-[20px] flex items-center justify-center shrink-0 border border-white/10 shadow-xl group-hover:rotate-12 transition-transform">
                                <Sparkles className="w-6 h-6 text-brand-blue" />
                            </div>
                            <div className="space-y-2">
                                <div className="text-[10px] font-black uppercase tracking-[0.4em] text-brand-blue">Director Intelligence</div>
                                <div className="text-base font-black italic tracking-tight leading-tight text-gray-900 pb-1">Mastery of module "{currentLesson.title}" will unlock advanced telemetry paths.</div>
                                <div className="flex items-center gap-2 pt-2 cursor-pointer group/link">
                                    <span className="text-[9px] font-black uppercase tracking-widest text-gray-400 group-hover/link:text-brand-blue transition-colors">Acknowledge Status</span>
                                    <ArrowRight className="w-3 h-3 text-gray-400 group-hover/link:text-brand-blue transition-all group-hover/link:translate-x-1" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
