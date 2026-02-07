import React, { useState, useEffect } from 'react';
import { CourseCard } from '../components/CourseCard';
import { COURSES as MOCK_COURSES, CURRENT_USER as MOCK_USER, type Course, type User } from '../data/mockData';
import { Trophy, Medal, Star, Search, RotateCcw, Loader2 } from 'lucide-react';
import { clearProgress } from '../services/progressService';
import { fetchCourses, fetchEnrolledCourses, fetchStats, isAuthenticated, getCurrentUser } from '../services/api';

export const LearnerDashboard: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [courses, setCourses] = useState<Course[]>(MOCK_COURSES);
  const [enrolledCourseIds, setEnrolledCourseIds] = useState<string[]>(MOCK_USER.enrolledCourses);
  const [user, setUser] = useState<User>(MOCK_USER);
  const [loading, setLoading] = useState(true);
  const [usingMockData, setUsingMockData] = useState(true);

  // Fetch data on mount
  useEffect(() => {
    const loadData = async () => {
      try {
        // Try to fetch from API
        const [coursesData, statsData] = await Promise.all([
          fetchCourses(),
          isAuthenticated() ? fetchStats() : Promise.resolve(null)
        ]);

        if (coursesData && coursesData.length > 0) {
          setCourses(coursesData);
          setUsingMockData(false);
        }

        if (statsData) {
          const currentUser = getCurrentUser();
          setUser({
            id: currentUser?.id?.toString() || 'u1',
            name: currentUser?.name || 'Learner',
            points: statsData.points || 0,
            badges: statsData.badges || ['Newbie'],
            enrolledCourses: []
          });

          // Fetch enrolled courses if authenticated
          if (isAuthenticated()) {
            const enrolled = await fetchEnrolledCourses();
            setEnrolledCourseIds(enrolled);
          }
        }
      } catch (error) {
        console.log('Using mock data - API not available:', error);
        // Fall back to mock data (already set as default)
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const filteredCourses = courses.filter(c =>
    c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.tags.some(t => t.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const enrolledCourses = filteredCourses.filter(c => enrolledCourseIds.includes(c.id));
  const otherCourses = filteredCourses.filter(c => !enrolledCourseIds.includes(c.id));

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <div className="space-y-12 animate-fade-in">
      {/* Welcome Section */}
      <header className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, <span className="text-gradient">{user.name}</span>!
          </h1>
          <p className="text-gray-500">
            {usingMockData ? 'Demo mode - ' : ''}Pick up where you left off or explore new skills today.
          </p>
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
        {usingMockData && (
          <button
            onClick={clearProgress}
            className="flex items-center gap-2 text-xs font-bold text-gray-400 hover:text-red-500 transition-colors ml-auto md:ml-0"
            title="Clear all progress and reset to default"
          >
            <RotateCcw size={14} /> Reset Demo
          </button>
        )}
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
          <div className="text-4xl font-black mb-1">{user.points}</div>
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
            {user.badges.map(badge => (
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
          <div className="text-4xl font-black text-gray-900 mb-1">{enrolledCourseIds.length}</div>
          <div className="text-gray-500 text-sm">Active Enrollments</div>
        </div>
      </div>

      {/* My Courses */}
      <section>
        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
          <span className="w-1.5 h-8 bg-blue-500 rounded-full"></span>
          My Learning
        </h2>
        {enrolledCourses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {enrolledCourses.map(course => (
              <CourseCard key={course.id} course={course} isEnrolled={true} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-gray-50 rounded-xl border border-dashed border-gray-200">
            <p className="text-gray-500">You haven't enrolled in any courses yet.</p>
            <p className="text-gray-400 text-sm mt-1">Browse courses below to get started!</p>
          </div>
        )}
      </section>

      {/* Recommended (Other Courses) */}
      <section>
        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
          <span className="w-1.5 h-8 bg-indigo-500 rounded-full"></span>
          {enrolledCourses.length > 0 ? 'Recommended for You' : 'Available Courses'}
        </h2>
        {otherCourses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {otherCourses.map(course => (
              <CourseCard key={course.id} course={course} isEnrolled={false} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-gray-50 rounded-xl border border-dashed border-gray-200">
            <p className="text-gray-500">No more courses available.</p>
          </div>
        )}
      </section>
    </div>
  );
};
