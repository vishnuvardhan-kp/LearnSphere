import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { QuizPlayer } from '../components/QuizPlayer';
import { StrictVideoPlayer } from '../components/StrictVideoPlayer';
import { ChevronLeft, ChevronRight, CheckCircle, Menu, X, ArrowLeft, Play, FileText, Image, HelpCircle, Circle, Loader } from 'lucide-react';
import api from '../services/api';

export const LessonPlayer: React.FC = () => {
  const { courseId, lessonId } = useParams<{ courseId: string; lessonId: string }>();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  
  const [course, setCourse] = useState<any>(null);
  const [completedLessons, setCompletedLessons] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<'all' | 'video' | 'document' | 'image' | 'quiz'>('all');

  useEffect(() => {
     const fetchData = async () => {
         if (!courseId) return;
         try {
             // Fetch Course
             const courseRes = await api.get(`/courses/${courseId}`);
             setCourse(courseRes.data);

             // Fetch Progress
             const token = localStorage.getItem('token');
             if (token) {
                 const progressRes = await api.get(`/progress/${courseId}`);
                 setCompletedLessons(progressRes.data.completedLessons || []);
             }
         } catch (error) {
             console.error("Error fetching lesson data", error);
         } finally {
             setLoading(false);
         }
     };
     fetchData();
  }, [courseId]);

  if (loading) return <div className="h-screen flex items-center justify-center">Loading lesson...</div>;
  if (!course) return <div className="h-screen flex items-center justify-center">Course not found</div>;

  // Flatten lessons if grouped by modules, otherwise use direct lessons
  const allLessons = course.modules && course.modules.length > 0
      ? course.modules.flatMap((m: any) => m.lessons)
      : (course.lessons || []);

  const lessonIndex = allLessons.findIndex((l: any) => l.id.toString() === lessonId);
  const lesson = allLessons[lessonIndex];

  if (!lesson) {
    return <div className="h-screen flex items-center justify-center">Lesson not found</div>;
  }

  // Normalize type
  const lessonType = lesson.type ? lesson.type.toLowerCase() : 'document';
  
  // Parse content if needed (e.g. for quiz)
  let quizConfig = null;
  if (lessonType === 'quiz' && lesson.content_url) {
      try {
          quizConfig = JSON.parse(lesson.content_url);
      } catch (e) {
          console.error("Failed to parse quiz config", e);
      }
  }

  const handleNext = () => {
    if (lessonIndex < allLessons.length - 1) {
      navigate(`/learn/${course.id}/lesson/${allLessons[lessonIndex + 1].id}`);
    } else {
        // Course completed logic
        alert("Course Completed!");
        navigate('/dashboard');
    }
  };

  const handlePrev = () => {
    if (lessonIndex > 0) {
      navigate(`/learn/${course.id}/lesson/${allLessons[lessonIndex - 1].id}`);
    }
  };

  const markCompleted = async (score?: number) => {
    if (!completedLessons.includes(lesson.id.toString())) {
        try {
            // Update local state immediately for responsiveness
            setCompletedLessons(prev => [...prev, lesson.id.toString()]);
            
            await api.post('/progress', { 
                courseId: course.id, 
                lessonId: lesson.id, 
                status: 'completed' 
            });
            
            if(score) {
                 // addPoints(score); 
            }
        } catch (e) {
            console.error("Failed to update progress", e);
            // Revert on failure?
        }
    }
  };

  // Safe content for markdown
  const markdownContent = lesson.content_url || lesson.description || 'No content';

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden font-sans">
      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-30 w-80 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:relative md:translate-x-0 ${!sidebarOpen && 'md:!w-0 md:!border-none md:overflow-hidden'}`}>
        <div className="h-full flex flex-col">
            <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                <Link to={`/course/${course.id}`} className="flex items-center gap-2 text-gray-500 hover:text-gray-900 transition-colors">
                    <ArrowLeft size={18} />
                    <span className="font-bold text-sm">Back to Course</span>
                </Link>
                <button onClick={() => setSidebarOpen(false)} className="md:hidden p-2 text-gray-400">
                    <X size={20} />
                </button>
            </div>
            
            <div className="p-6 bg-gray-50/50">
                <h2 className="font-bold text-gray-900 mb-2 leading-tight">{course.title}</h2>
                <div className="w-full bg-gray-200 rounded-full h-1.5 mb-2">
                    <div className="bg-green-500 h-1.5 rounded-full" style={{ width: `${(completedLessons.length / allLessons.length) * 100}%` }}></div>
                </div>
                <div className="text-xs text-gray-500 font-medium">{Math.round((completedLessons.length / allLessons.length) * 100)}% Complete</div>
            </div>

            {/* Content Filters */}
            <div className="px-4 py-2 border-b border-gray-100 flex gap-1 overflow-x-auto no-scrollbar">
                {[
                    { id: 'all', label: 'All' },
                    { id: 'video', label: 'Video' },
                    { id: 'document', label: 'Article' },
                    { id: 'image', label: 'Image' },
                    { id: 'quiz', label: 'Quiz' },
                ].map(filter => (
                    <button
                        key={filter.id}
                        onClick={() => setActiveFilter(filter.id as typeof activeFilter)}
                        className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
                            activeFilter === filter.id 
                            ? 'bg-gray-900 text-white shadow-md' 
                            : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                        }`}
                    >
                        {filter.label}
                    </button>
                ))}
            </div>

            <div className="flex-1 overflow-y-auto p-2 space-y-1">
                {allLessons
                    .filter((l: any) => activeFilter === 'all' || (l.type && l.type.toLowerCase() === activeFilter))
                    .map((l: any) => {
                    const isActive = l.id.toString() === lessonId;
                    const isDone = completedLessons.includes(l.id.toString());
                    const lType = l.type ? l.type.toLowerCase() : 'document';
                    
                    return (
                        <Link 
                            key={l.id} 
                            to={`/learn/${course.id}/lesson/${l.id}`}
                            className={`flex items-start gap-3 p-3 rounded-lg text-sm transition-all group ${
                                isActive 
                                ? 'bg-blue-50 text-blue-900 border border-blue-100 shadow-sm' 
                                : 'text-gray-600 hover:bg-gray-50 border border-transparent'
                            }`}
                        >
                            <div className={`mt-0.5 shrink-0 w-8 h-8 rounded-lg flex items-center justify-center ${
                                isDone ? 'bg-green-100 text-green-600' : 
                                isActive ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-400 group-hover:bg-gray-200'
                            }`}>
                                {isDone ? (
                                    <CheckCircle size={16} className="fill-current" />
                                ) : isActive ? (
                                    <Loader size={16} className="animate-spin text-blue-600" />
                                ) : (
                                    <Circle size={16} className="text-gray-300" />
                                )}
                            </div>
                            <div className="flex-1">
                                <span className={`line-clamp-2 font-medium ${isActive ? 'text-blue-900' : 'text-gray-700'}`}>{l.title}</span>
                                <div className="flex items-center gap-2 mt-1">
                                    <span className="text-[10px] uppercase font-bold text-gray-400 bg-gray-50 px-1.5 py-0.5 rounded border border-gray-100 flex items-center gap-1">
                                        {lType === 'video' ? <Play size={10} /> :
                                         lType === 'document' ? <FileText size={10} /> :
                                         lType === 'quiz' ? <HelpCircle size={10} /> : <Image size={10} />}
                                        {lType === 'document' ? 'Article' : lType}
                                    </span>
                                    {l.duration_minutes && <span className="text-[10px] text-gray-400">• {l.duration_minutes}m</span>}
                                </div>
                            </div>
                        </Link>
                    )
                })}
            </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-full overflow-hidden w-full relative">
        {/* Top Bar */}
        <div className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 z-20 shadow-sm shrink-0">
             <div className="flex items-center gap-4">
                 <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 hover:bg-gray-100 rounded-lg text-gray-500 transition-colors">
                     <Menu size={20} />
                 </button>
                 <h1 className="font-bold text-gray-900 line-clamp-1">{lesson.title}</h1>
             </div>
             <div className="flex items-center gap-2">
                 <button onClick={handlePrev} disabled={lessonIndex === 0} className="p-2 border border-gray-200 rounded-lg disabled:opacity-50 hover:bg-gray-50 transition-all">
                     <ChevronLeft size={20} />
                 </button>
                 <button onClick={handleNext} disabled={lessonIndex === allLessons.length - 1} className="p-2 border border-gray-200 rounded-lg disabled:opacity-50 hover:bg-gray-50 transition-all">
                     <ChevronRight size={20} />
                 </button>
             </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto bg-gray-100 p-4 md:p-8">
             {lessonType === 'video' ? (
                 <div className="bg-white rounded-2xl shadow-premium w-full max-w-5xl mx-auto">
                     <div className="aspect-video bg-black w-full relative group">
                         <StrictVideoPlayer 
                            key={lesson.id}
                            url={lesson.content_url || ''} 
                            isCompleted={completedLessons.includes(lesson.id.toString())}
                            onComplete={() => markCompleted()}
                         />
                     </div>
                 </div>
             ) : lessonType === 'document' ? (
                 <div className="w-full max-w-4xl mx-auto">
                     <div className="bg-white rounded-2xl shadow-premium p-8 md:p-12">
                         <div className="max-w-3xl mx-auto">
                             <div className="mb-8 border-b border-gray-100 pb-6">
                                 <div className="flex items-center gap-3 mb-2">
                                     <h3 className="text-3xl font-bold text-gray-900 m-0 tracking-tight">{lesson.title}</h3>
                                     <span className="bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide border border-indigo-100 shrink-0">Article</span>
                                 </div>
                             </div>
                             
                             <div className="article-content text-gray-700 leading-relaxed font-sans">
                                 <ReactMarkdown 
                                     remarkPlugins={[remarkGfm]}
                                 >
                                     {markdownContent}
                                 </ReactMarkdown>
                             </div>
                             
                             <div className="mt-16 p-8 bg-indigo-50 rounded-2xl border border-indigo-100 flex flex-col sm:flex-row items-center justify-between gap-6">
                                 <div>
                                     <h4 className="font-bold text-indigo-900 text-lg m-0 mb-1">Finished reading?</h4>
                                     <p className="text-indigo-700/80 text-sm m-0">Mark this lesson as complete to track your progress.</p>
                                 </div>
                                 {completedLessons.includes(lesson.id.toString()) ? (
                                     <button disabled className="bg-white text-green-600 py-3 px-8 rounded-xl font-bold border border-green-100 flex items-center gap-2 cursor-default shadow-sm shrink-0">
                                         <CheckCircle size={20} className="fill-current" /> Completed
                                     </button>
                                 ) : (
                                     <button onClick={() => markCompleted()} className="bg-indigo-600 text-white py-3 px-8 rounded-xl font-bold shadow-lg shadow-indigo-200 hover:bg-indigo-700 hover:shadow-indigo-300 transform transition-all active:scale-95 shrink-0">
                                         Mark as Complete
                                     </button>
                                 )}
                             </div>
                         </div>
                     </div>
                 </div>
                ) : lessonType === 'quiz' && quizConfig ? (
                     <div className="h-full min-h-[600px]">
                        <QuizPlayer 
                            key={lesson.id}
                            quizConfig={quizConfig} 
                            onComplete={(score) => markCompleted(score)} 
                        />
                     </div>
                ) : (
                     <div className="p-8 flex flex-col items-center justify-center min-h-[500px]">
                         <img src={lesson.content_url || 'https://via.placeholder.com/600x400'} alt={lesson.title} className="max-w-2xl w-full rounded-xl shadow-lg mb-8" />
                         <div className="text-center">
                            <h3 className="text-xl font-bold text-gray-900 mb-2">Image Resource</h3>
                            <p className="text-gray-500 mb-6">Review the image above carefully.</p>
                            
                            {completedLessons.includes(lesson.id.toString()) ? (
                                <button disabled className="btn-success py-2 px-6 flex items-center gap-2 mx-auto cursor-default">
                                    <CheckCircle size={18} /> Completed
                                </button>
                            ) : (
                                <button onClick={() => markCompleted()} className="btn-primary py-2 px-8 mx-auto">
                                    Mark as Viewed
                                </button>
                            )}
                         </div>
                     </div>
                 )}
         </div>
       </div>
     </div>
  );
};
