import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { COURSES } from '../data/mockData';
import { QuizPlayer } from '../components/QuizPlayer';
import { StrictVideoPlayer } from '../components/StrictVideoPlayer';
import { getCompletedLessons, markLessonAsComplete, addPoints } from '../services/progressService';
import { ChevronLeft, ChevronRight, CheckCircle, Menu, X, ArrowLeft, Play, FileText, Image, HelpCircle, Circle, Loader } from 'lucide-react';

export const LessonPlayer: React.FC = () => {
  const { courseId, lessonId } = useParams<{ courseId: string; lessonId: string }>();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const [completedLessons, setCompletedLessons] = useState<string[]>([]);
  const [activeFilter, setActiveFilter] = useState<'all' | 'video' | 'document' | 'image' | 'quiz'>('all');
  // In a real app, this would come from backend. For now we use local state or mock.

  const course = COURSES.find(c => c.id === courseId);
  const lessonIndex = course?.lessons.findIndex(l => l.id === lessonId) ?? -1;
  const lesson = course?.lessons[lessonIndex];

  useEffect(() => {
    // Load from persistent service
    if (course) {
        const completed = getCompletedLessons(course.id);
        setCompletedLessons(completed);
    }
  }, [course]);

  if (!course || !lesson) {
    return <div>Lesson not found</div>;
  }

  const handleNext = () => {
    if (lessonIndex < course.lessons.length - 1) {
      navigate(`/learn/${course.id}/lesson/${course.lessons[lessonIndex + 1].id}`);
    } else {
        // Course completed logic
        alert("Course Completed! (Mock)");
        navigate('/dashboard');
    }
  };

  const handlePrev = () => {
    if (lessonIndex > 0) {
      navigate(`/learn/${course.id}/lesson/${course.lessons[lessonIndex - 1].id}`);
    }
  };

  const markCompleted = (score?: number) => {
    if (!completedLessons.includes(lesson.id)) {
        // Persist change
        markLessonAsComplete(course.id, lesson.id);
        
        // Update local state
        setCompletedLessons(prev => [...prev, lesson.id]);
        
        if(score) {
             addPoints(score);
        }
    }
  };

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
                    <div className="bg-green-500 h-1.5 rounded-full" style={{ width: `${(completedLessons.length / course.lessons.length) * 100}%` }}></div>
                </div>
                <div className="text-xs text-gray-500 font-medium">{Math.round((completedLessons.length / course.lessons.length) * 100)}% Complete</div>
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
                {course.lessons
                    .filter(l => activeFilter === 'all' || l.type === activeFilter)
                    .map((l) => {
                    const isActive = l.id === lessonId;
                    const isDone = completedLessons.includes(l.id);
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
                                        {l.type === 'video' ? <Play size={10} /> :
                                         l.type === 'document' ? <FileText size={10} /> :
                                         l.type === 'quiz' ? <HelpCircle size={10} /> : <Image size={10} />}
                                        {l.type === 'document' ? 'Article' : l.type}
                                    </span>
                                    {l.duration && <span className="text-[10px] text-gray-400">• {l.duration}</span>}
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
                 <button onClick={handleNext} disabled={lessonIndex === course.lessons.length - 1} className="p-2 border border-gray-200 rounded-lg disabled:opacity-50 hover:bg-gray-50 transition-all">
                     <ChevronRight size={20} />
                 </button>
             </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto bg-gray-100 p-4 md:p-8">
             {lesson.type === 'video' ? (
                 <div className="bg-white rounded-2xl shadow-premium w-full max-w-5xl mx-auto">
                     <div className="aspect-video bg-black w-full relative group">
                         <StrictVideoPlayer 
                            key={lesson.id}
                            url={lesson.url || ''} 
                            isCompleted={completedLessons.includes(lesson.id)}
                            onComplete={() => markCompleted()}
                         />
                     </div>
                 </div>
             ) : lesson.type === 'document' ? (
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
                                     components={{
                                         h1: ({node, ...props}) => <h1 className="text-3xl font-bold text-gray-900 mb-6 mt-10 pb-2 border-b border-gray-200" {...props} />,
                                         h2: ({node, ...props}) => <h2 className="text-2xl font-bold text-gray-800 mb-4 mt-8" {...props} />,
                                         h3: ({node, ...props}) => <h3 className="text-xl font-bold text-gray-800 mb-3 mt-6" {...props} />,
                                         p: ({node, ...props}) => <p className="mb-5 text-base leading-7 text-gray-600" {...props} />,
                                         ul: ({node, ...props}) => <ul className="list-disc pl-6 mb-6 space-y-2 text-gray-600 marker:text-gray-400" {...props} />,
                                         ol: ({node, ...props}) => <ol className="list-decimal pl-6 mb-6 space-y-2 text-gray-600 marker:text-gray-400" {...props} />,
                                         li: ({node, ...props}) => <li className="pl-1 text-base" {...props} />,
                                         blockquote: ({node, ...props}) => <blockquote className="border-l-4 border-indigo-500 pl-6 py-2 my-8 bg-gray-50 text-gray-700 italic rounded-r-lg" {...props} />,
                                         code: ({node, className, children, ...props}: any) => {
                                             const match = /language-(\w+)/.exec(className || '')
                                             const isInline = !match && !String(children).includes('\n');
                                             return isInline ? (
                                                 <code className="bg-gray-100 text-pink-600 px-1.5 py-0.5 rounded text-sm font-mono font-medium border border-gray-200" {...props}>
                                                     {children}
                                                 </code>
                                             ) : (
                                                 <div className="relative group my-8 rounded-xl overflow-hidden shadow-sm border border-gray-200">
                                                     <div className="bg-gray-800 px-4 py-2 flex items-center justify-between">
                                                         <span className="text-xs font-mono text-gray-400 uppercase tracking-wider">
                                                             {match ? match[1] : 'code'}
                                                         </span>
                                                         <div className="flex gap-1.5">
                                                             <div className="w-2.5 h-2.5 rounded-full bg-red-400/20"></div>
                                                             <div className="w-2.5 h-2.5 rounded-full bg-yellow-400/20"></div>
                                                             <div className="w-2.5 h-2.5 rounded-full bg-green-400/20"></div>
                                                         </div>
                                                     </div>
                                                     <div className="bg-gray-900 p-6 overflow-x-auto">
                                                         <code className={`${className} text-gray-200 text-sm font-mono leading-relaxed`} {...props}>
                                                             {children}
                                                         </code>
                                                     </div>
                                                 </div>
                                             )
                                         },
                                         a: ({node, ...props}) => <a className="text-indigo-600 hover:text-indigo-800 hover:underline font-medium decoration-indigo-200 underline-offset-2" target="_blank" rel="noopener noreferrer" {...props} />,
                                     }}
                                 >
                                     {lesson.content || ''}
                                 </ReactMarkdown>
                             </div>
                             
                             <div className="mt-16 p-8 bg-indigo-50 rounded-2xl border border-indigo-100 flex flex-col sm:flex-row items-center justify-between gap-6">
                                 <div>
                                     <h4 className="font-bold text-indigo-900 text-lg m-0 mb-1">Finished reading?</h4>
                                     <p className="text-indigo-700/80 text-sm m-0">Mark this lesson as complete to track your progress.</p>
                                 </div>
                                 {completedLessons.includes(lesson.id) ? (
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
                ) : lesson.type === 'quiz' && lesson.quizConfig ? (
                     <div className="h-full min-h-[600px]">
                        <QuizPlayer 
                            key={lesson.id}
                            quizConfig={lesson.quizConfig} 
                            onComplete={(score) => markCompleted(score)} 
                        />
                     </div>
                ) : (
                     <div className="p-8 flex flex-col items-center justify-center min-h-[500px]">
                         <img src={lesson.url} alt={lesson.title} className="max-w-2xl w-full rounded-xl shadow-lg mb-8" />
                         <div className="text-center">
                            <h3 className="text-xl font-bold text-gray-900 mb-2">Image Resource</h3>
                            <p className="text-gray-500 mb-6">Review the image above carefully.</p>
                            
                            {completedLessons.includes(lesson.id) ? (
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
