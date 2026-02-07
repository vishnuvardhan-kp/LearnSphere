import React from 'react';
import { Play, BookOpen, Star } from 'lucide-react';
import { Link } from 'react-router-dom';

export interface CourseCardProps {
  course: {
    id: string | number;
    title: string;
    description: string;
    image: string;
    tags: string[];
    totalLessons: number;
    rating?: number;
    progress?: number;
  };
  isEnrolled: boolean;
}

export const CourseCard: React.FC<CourseCardProps> = ({ course, isEnrolled }) => {
  const progress = course.progress || 0; 

  return (
    <div className="card group hover:shadow-premium-lg transition-all duration-300 transform hover:-translate-y-1 overflow-hidden flex flex-col h-full">
      {/* Course Image */}
      <div className="relative h-48 -mx-8 -mt-8 mb-6 overflow-hidden">
        <img 
          src={course.image || 'https://via.placeholder.com/400x200?text=No+Image'} 
          alt={course.title} 
          className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-60 group-hover:opacity-40 transition-opacity"></div>
        {isEnrolled && (
            <div className="absolute bottom-4 left-8 right-8">
                <div className="flex justify-between text-white text-xs font-semibold mb-1">
                    <span>{Math.round(progress)}% Completed</span>
                </div>
                <div className="h-1.5 bg-white/30 rounded-full overflow-hidden backdrop-blur-sm">
                    <div 
                        className="h-full bg-blue-500 rounded-full transition-all duration-1000 ease-out"
                        style={{ width: `${progress}%` }}
                    ></div>
                </div>
            </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col">
          <div className="flex gap-2 mb-3">
              {(course.tags || []).slice(0, 2).map(tag => (
                  <span key={tag} className="tag tag-blue text-[10px] py-1 px-2.5">
                      {tag}
                  </span>
              ))}
          </div>

          <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors line-clamp-2">
              {course.title}
          </h3>
          
          <p className="text-gray-500 text-sm mb-6 line-clamp-2 flex-1">
              {course.description}
          </p>

          <div className="flex items-center gap-4 text-xs text-gray-500 font-medium mb-6">
              <div className="flex items-center gap-1.5">
                  <BookOpen size={14} className="text-blue-500" />
                  <span>{course.totalLessons} Lessons</span>
              </div>
              <div className="flex items-center gap-1.5">
                  <Star size={14} className="text-amber-500 fill-amber-500" />
                  <span>{course.rating ? Number(course.rating).toFixed(1) : 'New'}</span>
              </div>
          </div>

          {/* Action Button */}
          <Link 
            to={`/course/${course.id}`}
            className="w-full btn-primary flex items-center justify-center gap-2 group-hover:shadow-glow text-center"
          >
            {isEnrolled ? (
                <>
                    <Play size={18} className="fill-current" />
                    <span>Continue Learning</span>
                </>
            ) : (
                <>
                    <span>Enroll Now</span>
                </>
            )}
          </Link>
      </div>
    </div>
  );
};
