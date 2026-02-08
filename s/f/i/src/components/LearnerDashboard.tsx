import { useEffect, useState } from 'react';
import { Search, Play, Clock, Star, ChevronRight, MoreVertical, Trophy, Rocket, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { LearnerNavbar } from './LearnerNavbar';

interface Course {
    id: number;
    title: string;
    category?: string;
    subCategory?: string;
    progress: number;
    image: string;
    lastAccessed: string;
    tags?: string[];
}

export const LearnerDashboard = () => {
    const { profile } = useUser();
    const [searchQuery, setSearchQuery] = useState("");
    const [courses, setCourses] = useState<Course[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const token = localStorage.getItem('botfree_token');
                const [coursesRes, enrollmentsRes] = await Promise.all([
                    fetch('http://localhost:5000/api/courses'),
                    fetch('http://localhost:5000/api/enrollments/user', {
                        headers: { 'Authorization': `Bearer ${token}` }
                    })
                ]);

                if (coursesRes.ok && enrollmentsRes.ok) {
                    const allCourses = await coursesRes.json();
                    const enrollments = await enrollmentsRes.json();

                    const mappedCourses = allCourses.map((c: any) => {
                        const enrollment = enrollments.find((e: any) => e.course_id === c.id);
                        return {
                            id: c.id,
                            title: c.title,
                            category: c.tags?.[0] || "COURSE",
                            subCategory: c.tags?.[1] || "LEARNING",
                            progress: enrollment ? enrollment.progress : 0,
                            status: enrollment ? enrollment.status : 'not-enrolled',
                            image: `https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop&q=60&sig=${c.id}`,
                            lastAccessed: enrollment ? "Recently" : "Never",
                            tags: c.tags
                        };
                    });
                    setCourses(mappedCourses);
                }
            } catch (error) {
                console.error("Failed to fetch dashboard data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    const filteredCourses = courses.filter(c =>
        c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    return (
        <div className="min-h-screen bg-[#fcfcfd]">
            <LearnerNavbar />

            <main className="w-full px-[5%] py-8">
                {/* Hero Section */}
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-10">
                    <div className="space-y-2">
                        <div className="inline-flex items-center gap-2 px-2.5 py-0.5 bg-brand-blue/10 rounded-full border border-brand-blue/20">
                            <Sparkles className="w-3 h-3 text-brand-blue" />
                            <span className="text-[9px] font-black uppercase tracking-widest text-brand-blue">Active session</span>
                        </div>
                        <h1 className="text-4xl font-black text-gray-900 tracking-tight leading-none">
                            Welcome, <span className="text-gradient lowercase">{profile?.name?.split(' ')[0] || 'student'}</span>
                        </h1>
                        <p className="text-sm text-gray-500 font-medium">You've completed <span className="text-gray-900 font-black">65%</span> of your weekly goal.</p>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="relative group">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 group-focus-within:text-brand-blue transition-colors" />
                            <input
                                type="text"
                                placeholder="Search courses..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10 pr-6 py-2.5 bg-white border border-gray-100 rounded-xl text-xs focus:outline-none focus:ring-4 focus:ring-brand-blue/5 focus:border-brand-blue/30 transition-all w-64 shadow-sm"
                            />
                        </div>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                    {/* Points Card */}
                    <div className="bg-gray-900 p-8 rounded-[32px] text-white relative overflow-hidden group shadow-xl">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-brand-blue/20 blur-[60px] -mr-16 -mt-16"></div>
                        <div className="relative z-10 flex items-center gap-6">
                            <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center backdrop-blur-md group-hover:scale-110 transition-all duration-500">
                                <Trophy className="w-7 h-7 text-brand-blue fill-brand-blue/20" />
                            </div>
                            <div>
                                <div className="text-4xl font-black tracking-tighter">450 <span className="text-sm text-white/40 tracking-normal font-bold">XP</span></div>
                                <p className="text-[9px] font-black text-white/50 uppercase tracking-widest">Elite Status</p>
                            </div>
                        </div>
                    </div>

                    {/* Progress Card */}
                    <div className="bg-white p-8 rounded-[32px] border border-gray-100 relative group transition-all hover:border-brand-blue/20 shadow-sm flex items-center gap-6">
                        <div className="w-14 h-14 bg-brand-blue/5 rounded-2xl flex items-center justify-center text-brand-blue group-hover:scale-110 transition-all duration-500">
                            <Rocket className="w-7 h-7" />
                        </div>
                        <div>
                            <div className="text-4xl font-black tracking-tighter text-gray-900">
                                {courses.filter(c => (c as any).status === 'completed').length}
                                <span className="text-sm text-gray-300 tracking-normal font-bold ml-2">Verified</span>
                            </div>
                            <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Mastery Badges</p>
                        </div>
                    </div>

                    {/* Available Card */}
                    <div className="bg-white p-8 rounded-[32px] border border-gray-100 relative group transition-all hover:border-brand-blue/20 shadow-sm flex items-center gap-6">
                        <div className="w-14 h-14 bg-amber-50 rounded-2xl flex items-center justify-center text-amber-500 group-hover:scale-110 transition-all duration-500">
                            <Star className="w-7 h-7 fill-amber-500/20" />
                        </div>
                        <div>
                            <div className="text-4xl font-black tracking-tighter text-gray-900">{courses.length} <span className="text-sm text-gray-300 tracking-normal font-bold">Courses</span></div>
                            <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Available now</p>
                        </div>
                    </div>
                </div>

                {/* My Learning Section */}
                <section>
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-3">
                            <div className="w-1 h-6 bg-gray-900 rounded-full"></div>
                            <h2 className="text-2xl font-black text-gray-900 tracking-tight">Active Learning</h2>
                        </div>
                    </div>

                    {loading ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                            {[1, 2, 3, 4, 5].map(i => (
                                <div key={i} className="bg-white rounded-3xl h-72 border border-gray-100 animate-pulse"></div>
                            ))}
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                            {filteredCourses.map(course => (
                                <div key={course.id} className="bg-white rounded-[24px] overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-500 group flex flex-col">
                                    <div className="relative aspect-[4/3] overflow-hidden">
                                        <img
                                            src={course.image}
                                            alt={course.title}
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 to-transparent opacity-60 group-hover:opacity-90 transition-opacity"></div>

                                        <div className="absolute bottom-4 left-4 right-4">
                                            <div className="flex items-center justify-between mb-2">
                                                <div className="text-[14px] font-black text-white">{course.progress}%</div>
                                                <Link to={`/company/course/${course.id}`} className="w-12 h-12 bg-brand-blue rounded-2xl flex items-center justify-center text-white shadow-lg shadow-brand-blue/20 group-hover:scale-110 transition-transform">
                                                    <Play className="w-3.5 h-3.5 fill-white ml-0.5" />
                                                </Link>
                                            </div>
                                            <div className="w-full h-1 bg-white/20 rounded-full overflow-hidden">
                                                <div
                                                    className="h-full bg-brand-blue rounded-full transition-all duration-1000"
                                                    style={{ width: `${course.progress}%` }}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="p-5 flex-1 flex flex-col">
                                        <div className="mb-3">
                                            <span className="text-[8px] font-black text-brand-blue uppercase tracking-widest bg-brand-blue/5 px-2 py-0.5 rounded-lg border border-brand-blue/10">
                                                {course.category}
                                            </span>
                                        </div>
                                        <h3 className="text-[14px] font-black text-gray-900 mb-4 leading-tight group-hover:text-brand-blue transition-colors line-clamp-2">
                                            {course.title}
                                        </h3>
                                        <div className="mt-auto pt-4 border-t border-gray-50 flex items-center justify-between">
                                            <div className="flex items-center gap-2 text-[8px] font-black text-gray-400 uppercase tracking-widest">
                                                <Clock className="w-3 h-3" />
                                                {course.lastAccessed}
                                            </div>
                                            <button className="text-gray-400 hover:text-brand-blue transition-colors">
                                                <MoreVertical className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}

                            {/* Browse More Placeholder */}
                            <div className="border-2 border-dashed border-gray-100 rounded-[24px] flex flex-col items-center justify-center p-8 text-center group hover:border-brand-blue/20 hover:bg-brand-blue/[0.01] transition-all cursor-pointer">
                                <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-white group-hover:shadow-md transition-all">
                                    <Sparkles className="w-6 h-6 text-brand-blue" />
                                </div>
                                <h4 className="text-sm font-black text-gray-900 mb-1 tracking-tight">Expand Skills</h4>
                                <button className="flex items-center gap-1.5 text-brand-blue font-black text-[9px] uppercase tracking-widest group-hover:gap-2 transition-all">
                                    Browse Catalog <ChevronRight className="w-3 h-3" />
                                </button>
                            </div>
                        </div>
                    )}
                </section>
            </main>
        </div>
    );
};
