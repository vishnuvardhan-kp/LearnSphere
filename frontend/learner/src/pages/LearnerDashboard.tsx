import React, { useState, useEffect } from 'react';
import { CourseCard } from '../components/CourseCard';
import { Trophy, Medal, Star, Search } from 'lucide-react';
import api from '../services/api';

export const LearnerDashboard: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [courses, setCourses] = useState<any[]>([]);
  const [enrolledCourses, setEnrolledCourses] = useState<any[]>([]);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
        try {
            const userStr = localStorage.getItem('user');
            if (userStr) setUser(JSON.parse(userStr));

            const [publicRes, enrolledRes] = await Promise.all([
                api.get('/courses'),
                api.get('/my-courses').catch(() => ({ data: [] })) // Handle if not logged in or error
            ]);

            const mappedPublic = publicRes.data.data.map((c: any) => ({
                id: c.id,
                title: c.title,
                description: c.short_description || c.description,
                image: c.image_url,
                tags: c.tags || [],
                totalLessons: parseInt(c.total_lessons) || 0,
                rating: c.rating
            }));

            const mappedEnrolled = enrolledRes.data.map((c: any) => ({
                id: c.id,
                title: c.title,
                description: c.short_description || c.description,
                image: c.image_url,
                tags: c.tags || [],
                totalLessons: parseInt(c.total_lessons) || 0,
                progress: parseFloat(c.overall_progress) || 0
            }));

            setCourses(mappedPublic);
            setEnrolledCourses(mappedEnrolled);
        } catch (error) {
            console.error("Failed to fetch dashboard data", error);
        } finally {
            setLoading(false);
        }
    };
    fetchData();
  }, []);

  const filteredEnrolled = enrolledCourses.filter(c => 
    c.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Filter out enrolled courses from public list
  const filteredPublic = courses.filter(c => 
    !enrolledCourses.find(e => e.id === c.id) &&
    (c.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    c.tags.some((t: string) => t.toLowerCase().includes(searchTerm.toLowerCase())))
  ); // Fixed syntax error here in thought process, careful in implementation

  if (loading) {
      return (
          <div className="flex h-screen items-center justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
      );
  }

  return (
    <div className="space-y-12 animate-fade-in">
      {/* Welcome Section */}
      <header className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Welcome back, <span className="text-gradient">{user?.name || 'Learner'}</span>!
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
      </header>

      {/* Stats Overview - Using placeholders for points/badges for now */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="card-compact bg-gradient-to-br from-blue-500 to-indigo-600 text-white border-none transform hover:-translate-y-1">
            <div className="flex items-start justify-between mb-4">
                <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                    <Trophy size={24} className="text-white" />
                </div>
                <span className="text-xs font-bold uppercase tracking-wider bg-white/20 px-2 py-1 rounded-lg">Total Points</span>
            </div>
            <div className="text-4xl font-black mb-1">0</div>
            <div className="text-blue-100 text-sm font-medium">Start learning to earn!</div>
        </div>

        <div className="card-compact border border-purple-100 bg-purple-50/50 hover:border-purple-200">
             <div className="flex items-start justify-between mb-4">
                <div className="p-3 bg-purple-100 text-purple-600 rounded-xl">
                    <Medal size={24} />
                </div>
                <span className="text-xs font-bold uppercase tracking-wider text-purple-600 bg-purple-100 px-2 py-1 rounded-lg">Badges</span>
            </div>
            <div className="flex flex-wrap gap-2">
                <span className="text-sm text-gray-500">No badges yet</span>
            </div>
        </div>

        <div className="card-compact border border-amber-100 bg-amber-50/50 hover:border-amber-200">
             <div className="flex items-start justify-between mb-4">
                <div className="p-3 bg-amber-100 text-amber-600 rounded-xl">
                    <Star size={24} />
                </div>
                <span className="text-xs font-bold uppercase tracking-wider text-amber-600 bg-amber-100 px-2 py-1 rounded-lg">Courses</span>
            </div>
            <div className="text-4xl font-black text-gray-900 mb-1">{enrolledCourses.length}</div>
            <div className="text-gray-500 text-sm">Active Enrollments</div>
        </div>
      </div>

      {/* My Courses */}
      {enrolledCourses.length > 0 && (
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                <span className="w-1.5 h-8 bg-blue-500 rounded-full"></span>
                My Learning
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredEnrolled.map(course => (
                    <CourseCard key={course.id} course={course} isEnrolled={true} />
                ))}
            </div>
          </section>
      )}

      {/* Recommended (Other Courses) */}
       <section>
        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
            <span className="w-1.5 h-8 bg-indigo-500 rounded-full"></span>
            Recommended for You
        </h2>
        {filteredPublic.length === 0 ? (
            <div className="text-gray-500 italic">No other courses available at the moment.</div>
        ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredPublic.map(course => (
                    <CourseCard key={course.id} course={course} isEnrolled={false} />
                ))}
            </div>
        )}
      </section>
    </div>
  );
};
