import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Play, CheckCircle, Lock, MonitorPlay, FileText, Image as ImageIcon, HelpCircle, MessageSquare } from 'lucide-react';
import { ReviewModal } from '../components/ReviewModal';
import api from '../services/api';

export const CourseDetail: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();
  // const navigate = useNavigate(); // Unused
  
  const [course, setCourse] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [completedLessons, setCompletedLessons] = useState<string[]>([]); // List of completed lesson IDs
  
  const [activeTab, setActiveTab] = useState<'overview' | 'content' | 'reviews'>('content');
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);

  useEffect(() => {
      const fetchData = async () => {
          if (!courseId) return;
          try {
              // Fetch Course Details
              const courseRes = await api.get(`/courses/${courseId}`);
              setCourse(courseRes.data);

              // Check Enrollment & Progress
              const token = localStorage.getItem('token');
              if (token) {
                  // This could be optimized to a single endpoint "getCourseStatus"
                  const enrolledRes = await api.get('/my-courses');
                  const enrolled = enrolledRes.data.find((c: any) => c.id == courseId); // == for string/number match
                  
                  if (enrolled) {
                      setIsEnrolled(true);
                      // Fetch progress
                      const progressRes = await api.get(`/progress/${courseId}`);
                      setCompletedLessons(progressRes.data.completedLessons || []);
                  }
              }
          } catch (error) {
              console.error("Error fetching course details", error);
          } finally {
              setLoading(false);
          }
      };
      fetchData();
  }, [courseId]);

  const handleEnroll = async () => {
      if (!courseId) return;
      try {
          await api.post('/enroll', { courseId });
          setIsEnrolled(true);
          // Refresh page or state?
          // navigate(0);
      } catch (error) {
          console.error("Enrollment failed", error);
          alert("Failed to enroll. Please try again.");
      }
  };

  const handleReviewSubmit = async (rating: number, comment: string) => {
    console.log("Review Submitted:", rating, comment);
    // TODO: Implement review submission API
    // await api.post(`/courses/${courseId}/reviews`, { rating, comment });
    setIsReviewModalOpen(false);
  };

  if (loading) return <div className="text-center py-20">Loading course...</div>;
  if (!course) return <div className="text-center py-20">Course not found</div>;

  const completedCount = completedLessons.length;
  // Ensure totalLessons is valid to avoid NaN
  const totalLessons = course.lessons?.length || 0;
  const progress = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;

  const getLessonIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'video': return <MonitorPlay size={18} />;
      case 'document': return <FileText size={18} />;
      case 'image': return <ImageIcon size={18} />;
      case 'quiz': return <HelpCircle size={18} />;
      default: return <FileText size={18} />;
    }
  };

  // Helper to find next lesson to play
  const getNextLessonId = () => {
      if (!course.lessons || course.lessons.length === 0) return null;
      const next = course.lessons.find((l: any) => !completedLessons.includes(l.id.toString()));
      return next ? next.id : course.lessons[0].id;
  };

  return (
    <div className="animate-fade-in pb-20">
      {/* Header / Hero */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-8">
        <div className="relative h-64 md:h-80">
           <img src={course.image_url || 'https://via.placeholder.com/800x400'} alt={course.title} className="w-full h-full object-cover" />
           <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
           <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
             <div className="flex gap-2 mb-3">
               {(course.tags || []).map((tag: string) => (
                 <span key={tag} className="px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-bold border border-white/30">
                   {tag}
                 </span>
               ))}
             </div>
             <h1 className="text-3xl md:text-5xl font-black mb-4 leading-tight">{course.title}</h1>
             <p className="text-gray-200 line-clamp-2 max-w-2xl text-lg opacity-90">{course.short_description || course.description}</p>
           </div>
        </div>
        
        <div className="p-6 md:p-8 flex flex-col md:flex-row justify-between items-center gap-6">
           <div className="flex-1 w-full">
             {isEnrolled ? (
               <div>
                  <div className="flex justify-between text-sm font-bold text-gray-700 mb-2">
                    <span>Course Progress</span>
                    <span>{progress}%</span>
                  </div>
                  <div className="progress-bar h-3 bg-gray-100 border border-gray-200">
                    <div className="progress-fill" style={{ width: `${progress}%` }}></div>
                  </div>
                  <p className="text-xs text-gray-400 mt-2 font-medium">{completedCount} of {totalLessons} lessons completed</p>
               </div>
             ) : (
                <div className="flex items-center gap-2">
                    <span className="text-2xl font-bold text-gray-900">{course.price ? `$${course.price}` : 'Free'}</span>
                </div>
             )}
           </div>

           <div className="flex gap-4 w-full md:w-auto">
             {!isEnrolled ? (
                <button onClick={handleEnroll} className="btn-primary w-full md:w-auto shadow-xl shadow-blue-500/20">Enroll Now</button>
             ) : (
                <Link 
                  to={`/learn/${course.id}/lesson/${getNextLessonId()}`} 
                  className="btn-primary w-full md:w-auto flex items-center justify-center gap-2 shadow-xl shadow-blue-500/20"
                >
                  <Play size={20} className="fill-current" />
                  <span>{progress > 0 ? (progress === 100 ? 'Revisit Course' : 'Continue Learning') : 'Start Learning'}</span>
                </Link>
             )}
           </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-8 border-b border-gray-200 mb-8 px-4">
        <button 
          onClick={() => setActiveTab('overview')}
          className={`pb-4 px-2 font-bold text-sm transition-all relative ${activeTab === 'overview' ? 'text-blue-600' : 'text-gray-500 hover:text-gray-800'}`}
        >
          Overview
          {activeTab === 'overview' && <span className="absolute bottom-0 left-0 w-full h-1 bg-blue-600 rounded-t-full"></span>}
        </button>
        <button 
          onClick={() => setActiveTab('content')}
          className={`pb-4 px-2 font-bold text-sm transition-all relative ${activeTab === 'content' ? 'text-blue-600' : 'text-gray-500 hover:text-gray-800'}`}
        >
          Course Content
          {activeTab === 'content' && <span className="absolute bottom-0 left-0 w-full h-1 bg-blue-600 rounded-t-full"></span>}
        </button>
        <button 
          onClick={() => setActiveTab('reviews')}
          className={`pb-4 px-2 font-bold text-sm transition-all relative ${activeTab === 'reviews' ? 'text-blue-600' : 'text-gray-500 hover:text-gray-800'}`}
        >
          Reviews
          {activeTab === 'reviews' && <span className="absolute bottom-0 left-0 w-full h-1 bg-blue-600 rounded-t-full"></span>}
        </button>
      </div>

      {/* Tab Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          
          {activeTab === 'overview' && (
             <div className="card">
                <h3 className="text-xl font-bold mb-4">About this course</h3>
                <p className="text-gray-600 leading-relaxed whitespace-pre-line">{course.description}</p>
                
                <h3 className="text-xl font-bold mt-8 mb-4">What you'll learn</h3>
                <ul className="space-y-2">
                   <li className="flex gap-3 text-gray-700">
                      <CheckCircle size={20} className="text-green-500 shrink-0" />
                      <span>Detailed content from an expert instructor</span>
                   </li>
                </ul>
             </div>
          )}

          {activeTab === 'content' && (
            <div className="space-y-4">
               {/* Use modules if available, else flat lessons */}
               {(course.modules && course.modules.length > 0 ? course.modules : [{ title: 'Lessons', lessons: course.lessons }]).map((module: any, modIndex: number) => (
                   <div key={modIndex}>
                       {course.modules && <h4 className="font-bold text-gray-800 mb-2 mt-4">{module.title}</h4>}
                       <div className="space-y-2">
                           {module.lessons.map((lesson: any, index: number) => (
                              <div key={lesson.id} className="bg-white rounded-xl border border-gray-100 p-4 transition-all hover:bg-gray-50 flex items-center justify-between group cursor-pointer shadow-sm hover:shadow-md">
                                <div className="flex items-center gap-4">
                                   <div className={`h-10 w-10 rounded-full flex items-center justify-center shrink-0 ${completedLessons.includes(lesson.id.toString()) ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'}`}>
                                      {completedLessons.includes(lesson.id.toString()) ? <CheckCircle size={20} className="fill-current" /> : <span className="font-bold text-sm">{index + 1}</span>}
                                   </div>
                                   <div>
                                      <h4 className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors">{lesson.title}</h4>
                                      <div className="flex items-center gap-3 text-xs text-gray-500 mt-1">
                                         <div className="flex items-center gap-1">
                                            {getLessonIcon(lesson.type)}
                                            <span className="capitalize">{lesson.type.toLowerCase()}</span>
                                         </div>
                                         {lesson.duration_minutes && <span>• {lesson.duration_minutes}m</span>}
                                      </div>
                                   </div>
                                </div>
                                
                                <div className="mr-2">
                                    {isEnrolled ? (
                                         <Link to={`/learn/${course.id}/lesson/${lesson.id}`} className="btn-secondary px-4 py-2 text-xs flex items-center gap-2">
                                            <Play size={14} className="fill-current" /> Play
                                         </Link>
                                    ) : (
                                         <Lock size={18} className="text-gray-300" />
                                    )}
                                </div>
                             </div>
                           ))}
                       </div>
                   </div>
               ))}
               {!course.lessons?.length && <div className="text-gray-500">No content available yet.</div>}
            </div>
          )}

          {activeTab === 'reviews' && (
              <div className="space-y-6">
                 {/* Reviews implementation skipped for brevity - backend needs review structure */}
                 <div className="text-center py-12 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                     <MessageSquare size={48} className="mx-auto text-gray-300 mb-4" />
                     <h4 className="text-lg font-bold text-gray-900">Reviews coming soon</h4>
                 </div>
              </div>
          )}

        </div>

        {/* Sidebar (Instructor / Course info) */}
        <div className="space-y-6">
            <div className="card-compact">
                <h4 className="font-bold text-gray-900 mb-4 uppercase text-xs tracking-wider text-gray-500">Instructor</h4>
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center font-bold text-gray-500">
                        {course.author ? course.author.charAt(0) : 'I'}
                    </div>
                    <div>
                        <div className="font-bold">{course.author || 'Instructor'}</div>
                        <div className="text-xs text-gray-500">Expert Instructor</div>
                    </div>
                </div>
                <button className="btn-secondary w-full py-2 text-sm">View Profile</button>
            </div>
        </div>
      </div>

      <ReviewModal 
        isOpen={isReviewModalOpen} 
        onClose={() => setIsReviewModalOpen(false)} 
        onSubmit={handleReviewSubmit} 
      />
    </div>
  );
};
