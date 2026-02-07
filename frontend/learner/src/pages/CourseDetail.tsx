import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { COURSES, CURRENT_USER, type Lesson } from '../data/mockData';
import { Play, CheckCircle, Lock, MonitorPlay, FileText, Image as ImageIcon, HelpCircle, Star, MessageSquare, Trophy } from 'lucide-react';
import { ReviewModal } from '../components/ReviewModal';
import { getCompletedLessons, isLessonCompleted } from '../services/progressService';

export const CourseDetail: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const course = COURSES.find(c => c.id === courseId);
  const [activeTab, setActiveTab] = useState<'overview' | 'content' | 'reviews'>('content');
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);

  const handleReviewSubmit = (rating: number, comment: string) => {
    console.log("Review Submitted:", rating, comment);
    // In a real app, update backend/state here
    if (course) {
        course.reviews.unshift({
            id: `new-${Date.now()}`,
            userName: CURRENT_USER.name,
            avatar: 'https://ui-avatars.com/api/?name=' + CURRENT_USER.name,
            rating,
            comment,
            date: new Date().toLocaleDateString()
        });
    }
  };

  if (!course) {
    return <div className="text-center py-20">Course not found</div>;
  }

  const isEnrolled = CURRENT_USER.enrolledCourses.includes(course.id);
  // Get persisted progress
  const userCompletedLessons = getCompletedLessons(course.id);
  const completedCount = userCompletedLessons.length;
  const progress = Math.round((completedCount / course.lessons.length) * 100) || 0;

  const getLessonIcon = (type: Lesson['type']) => {
    switch (type) {
      case 'video': return <MonitorPlay size={18} />;
      case 'document': return <FileText size={18} />;
      case 'image': return <ImageIcon size={18} />;
      case 'quiz': return <HelpCircle size={18} />;
    }
  };

  return (
    <div className="animate-fade-in pb-20">
      {/* Header / Hero */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-8">
        <div className="relative h-64 md:h-80">
           <img src={course.image} alt={course.title} className="w-full h-full object-cover" />
           <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
           <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
             <div className="flex gap-2 mb-3">
               {course.tags.map(tag => (
                 <span key={tag} className="px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-bold border border-white/30">
                   {tag}
                 </span>
               ))}
             </div>
             <h1 className="text-3xl md:text-5xl font-black mb-4 leading-tight">{course.title}</h1>
             <p className="text-gray-200 line-clamp-2 max-w-2xl text-lg opacity-90">{course.description}</p>
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
                  <p className="text-xs text-gray-400 mt-2 font-medium">{completedCount} of {course.lessons.length} lessons completed</p>
               </div>
             ) : (
                <div className="flex items-center gap-2">
                    <span className="text-2xl font-bold text-gray-900">Free</span>
                    <span className="text-sm text-gray-500 line-through opacity-60">$99.00</span>
                </div>
             )}
           </div>

           <div className="flex gap-4 w-full md:w-auto">
             {!isEnrolled ? (
                <button className="btn-primary w-full md:w-auto shadow-xl shadow-blue-500/20">Enroll Now</button>
             ) : (
                <Link 
                  to={`/learn/${course.id}/lesson/${course.lessons.find(l => !isLessonCompleted(course.id, l.id))?.id || course.lessons[0].id}`} 
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
                <p className="text-gray-600 leading-relaxed">{course.description}</p>
                
                <h3 className="text-xl font-bold mt-8 mb-4">What you'll learn</h3>
                <ul className="space-y-2">
                   {/* Dummy objectives */}
                   <li className="flex gap-3 text-gray-700">
                      <CheckCircle size={20} className="text-green-500 shrink-0" />
                      <span>Master core concepts and advanced techniques</span>
                   </li>
                   <li className="flex gap-3 text-gray-700">
                      <CheckCircle size={20} className="text-green-500 shrink-0" />
                      <span>Build real-world projects from scratch</span>
                   </li>
                   <li className="flex gap-3 text-gray-700">
                      <CheckCircle size={20} className="text-green-500 shrink-0" />
                      <span>Best practices for performance and scalability</span>
                   </li>
                </ul>
             </div>
          )}

          {activeTab === 'content' && (
            <div className="space-y-4">
               {course.lessons.map((lesson, index) => (
                  <div key={lesson.id} className="bg-white rounded-xl border border-gray-100 p-4 transition-all hover:bg-gray-50 flex items-center justify-between group cursor-pointer shadow-sm hover:shadow-md">
                    <div className="flex items-center gap-4">
                       <div className={`h-10 w-10 rounded-full flex items-center justify-center shrink-0 ${isLessonCompleted(course.id, lesson.id) ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'}`}>
                          {isLessonCompleted(course.id, lesson.id) ? <CheckCircle size={20} className="fill-current" /> : <span className="font-bold text-sm">{index + 1}</span>}
                       </div>
                       <div>
                          <h4 className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors">{lesson.title}</h4>
                          <div className="flex items-center gap-3 text-xs text-gray-500 mt-1">
                             <div className="flex items-center gap-1">
                                {getLessonIcon(lesson.type)}
                                <span className="capitalize">{lesson.type}</span>
                             </div>
                             {lesson.duration && <span>• {lesson.duration}</span>}
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
          )}

          {activeTab === 'reviews' && (
              <div className="space-y-6">
                 <div className="flex items-center gap-4 mb-6">
                    <div className="text-5xl font-black text-gray-900">4.8</div>
                    <div>
                       <div className="flex text-amber-500 mb-1">
                          {[1,2,3,4,5].map(i => <Star key={i} size={16} className="fill-current" />)}
                       </div>
                       <div className="text-sm text-gray-500 font-medium">Based on 120 reviews</div>
                    </div>
                    <button onClick={() => setIsReviewModalOpen(true)} className="ml-auto btn-primary px-6 py-2 text-sm">Write a Review</button>
                 </div>

                 {course.reviews.length > 0 ? (
                    course.reviews.map(review => (
                        <div key={review.id} className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                             <div className="flex justify-between items-start mb-4">
                                <div className="flex gap-3">
                                   <img src={review.avatar} alt={review.userName} className="w-10 h-10 rounded-full border border-gray-200" />
                                   <div>
                                      <div className="font-bold text-gray-900">{review.userName}</div>
                                      <div className="text-xs text-gray-500">{review.date}</div>
                                   </div>
                                </div>
                                <div className="flex text-amber-500">
                                   {[...Array(5)].map((_, i) => (
                                     <Star key={i} size={14} className={i < review.rating ? "fill-current" : "text-gray-300"} />
                                   ))}
                                </div>
                             </div>
                             <p className="text-gray-600 text-sm leading-relaxed">{review.comment}</p>
                        </div>
                    ))
                 ) : (
                    <div className="text-center py-12 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                        <MessageSquare size={48} className="mx-auto text-gray-300 mb-4" />
                        <h4 className="text-lg font-bold text-gray-900">No reviews yet</h4>
                        <p className="text-gray-500">Be the first to review this course!</p>
                    </div>
                 )}
              </div>
          )}

        </div>

        {/* Sidebar (Instructor / Course info) */}
        <div className="space-y-6">
            <div className="card-compact">
                <h4 className="font-bold text-gray-900 mb-4 uppercase text-xs tracking-wider text-gray-500">Instructor</h4>
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-full bg-gray-200"></div>
                    <div>
                        <div className="font-bold">Dr. Angela Yu</div>
                        <div className="text-xs text-gray-500">Lead Instructor</div>
                    </div>
                </div>
                <p className="text-sm text-gray-600 mb-4">Passionate about teaching code to everyone. 1M+ students worldwide.</p>
                <button className="btn-secondary w-full py-2 text-sm">View Profile</button>
            </div>

            <div className="card-compact bg-blue-50 border-blue-100">
                 <h4 className="font-bold text-blue-900 mb-2 flex items-center gap-2">
                    <Trophy size={18} className="text-blue-600" />
                    <span>Earn Certificates</span>
                 </h4>
                 <p className="text-blue-800/80 text-sm mb-4">Complete this course to earn a Verified Certificate of Completion.</p>
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
