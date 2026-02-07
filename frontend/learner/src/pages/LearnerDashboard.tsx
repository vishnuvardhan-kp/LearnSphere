import React, { useState } from 'react';
import { CourseCard } from '../components/CourseCard';
import { COURSES, CURRENT_USER } from '../data/mockData';
import { Trophy, Medal, Star, Search, RotateCcw } from 'lucide-react';
import { clearProgress } from '../services/progressService';

export const LearnerDashboard: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredCourses = COURSES.filter(c => 
    c.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    c.tags.some(t => t.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const enrolledCourses = filteredCourses.filter(c => CURRENT_USER.enrolledCourses.includes(c.id));
  const otherCourses = filteredCourses.filter(c => !CURRENT_USER.enrolledCourses.includes(c.id));

  return (
    <div className="space-y-12 animate-fade-in">
      {/* Welcome Section */}
      <header className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Welcome back, <span className="text-gradient">{CURRENT_USER.name}</span>!
            </h1>
            <p className="text-gray-500">Pick up where you left off or explore new skills today.</p>
        </div>
        <div className="relative w-full md:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input 
                type="text" 
                placeholder="Search courses..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input-premium pl-10 py-2.5 w-full text-sm shadow-sm"
            />
        </div>
        <button 
            onClick={clearProgress}
            className="flex items-center gap-2 text-xs font-bold text-gray-400 hover:text-red-500 transition-colors ml-auto md:ml-0"
            title="Clear all progress and reset to default"
        >
            <RotateCcw size={14} /> Reset Demo Prop
        </button>
      </header>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="card-compact bg-gradient-to-br from-blue-500 to-indigo-600 text-white border-none transform hover:-translate-y-1">
            <div className="flex items-start justify-between mb-4">
                <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                    <Trophy size={24} className="text-white" />
                </div>
                <span className="text-xs font-bold uppercase tracking-wider bg-white/20 px-2 py-1 rounded-lg">Total Points</span>
            </div>
            <div className="text-4xl font-black mb-1">{CURRENT_USER.points}</div>
            <div className="text-blue-100 text-sm font-medium">Top 15% of learners</div>
        </div>

        <div className="card-compact border border-purple-100 bg-purple-50/50 hover:border-purple-200">
             <div className="flex items-start justify-between mb-4">
                <div className="p-3 bg-purple-100 text-purple-600 rounded-xl">
                    <Medal size={24} />
                </div>
                <span className="text-xs font-bold uppercase tracking-wider text-purple-600 bg-purple-100 px-2 py-1 rounded-lg">Badges</span>
            </div>
            <div className="flex flex-wrap gap-2">
                {CURRENT_USER.badges.map(badge => (
                    <span key={badge} className="px-3 py-1 bg-white border border-purple-100 rounded-full text-xs font-bold text-purple-700 shadow-sm">
                        {badge}
                    </span>
                ))}
            </div>
        </div>

        <div className="card-compact border border-amber-100 bg-amber-50/50 hover:border-amber-200">
             <div className="flex items-start justify-between mb-4">
                <div className="p-3 bg-amber-100 text-amber-600 rounded-xl">
                    <Star size={24} />
                </div>
                <span className="text-xs font-bold uppercase tracking-wider text-amber-600 bg-amber-100 px-2 py-1 rounded-lg">Courses</span>
            </div>
            <div className="text-4xl font-black text-gray-900 mb-1">{CURRENT_USER.enrolledCourses.length}</div>
            <div className="text-gray-500 text-sm">Active Enrollments</div>
        </div>
      </div>

      {/* My Courses */}
      <section>
        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
            <span className="w-1.5 h-8 bg-blue-500 rounded-full"></span>
            My Learning
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {enrolledCourses.map(course => (
                <CourseCard key={course.id} course={course} isEnrolled={true} />
            ))}
        </div>
      </section>

      {/* Recommended (Other Courses) */}
       <section>
        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
            <span className="w-1.5 h-8 bg-indigo-500 rounded-full"></span>
            Recommended for You
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {otherCourses.map(course => (
                <CourseCard key={course.id} course={course} isEnrolled={false} />
            ))}
        </div>
      </section>
    </div>
  );
};
