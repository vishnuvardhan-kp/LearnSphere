import { useEffect, useState } from 'react';
import { Search, Star, Clock, Filter, ChevronRight, Play, BookOpen, Grid, List, LayoutGrid } from 'lucide-react';
import { Link } from 'react-router-dom';
import { LearnerNavbar } from '../components/LearnerNavbar';

interface Course {
    id: number;
    title: string;
    description: string;
    category?: string;
    subCategory?: string;
    duration?: string;
    rating?: number;
    students?: string;
    image: string;
    tags?: string[];
}

export const LearnerCourses = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [courses, setCourses] = useState<Course[]>([]);
    const [loading, setLoading] = useState(true);
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/courses');
                if (response.ok) {
                    const data = await response.json();
                    const mappedCourses = data.map((c: any) => ({
                        id: c.id,
                        title: c.title,
                        description: c.description || "Master the fundamentals of modern technology.",
                        category: c.tags?.[0] || "COURSE",
                        subCategory: c.tags?.[1] || "LEARNING",
                        duration: c.duration || "12h 30m",
                        rating: 4.8,
                        students: "1.2k",
                        image: `https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop&q=60&sig=${c.id}`,
                        tags: c.tags
                    }));
                    setCourses(mappedCourses);
                }
            } catch (error) {
                console.error("Failed to fetch courses:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchCourses();
    }, []);

    const filteredCourses = courses.filter(c =>
        c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    return (
        <div className="min-h-screen bg-[#fcfcfd]">
            <LearnerNavbar />

            <main className="w-full px-[5%] py-8">
                {/* Search & Filter Section */}
                <div className="mb-10">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
                        <div className="space-y-2">
                            <div className="inline-flex items-center gap-2 px-2.5 py-0.5 bg-brand-blue/10 rounded-full border border-brand-blue/20">
                                <LayoutGrid className="w-3 h-3 text-brand-blue" />
                                <span className="text-[9px] font-black uppercase tracking-widest text-brand-blue">Catalog</span>
                            </div>
                            <h1 className="text-3xl font-black text-gray-900 tracking-tight leading-none">Explore Courses</h1>
                        </div>
                    </div>

                    <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex flex-col xl:flex-row gap-4 items-center">
                        <div className="relative flex-1 group w-full">
                            <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-brand-blue transition-colors" />
                            <input
                                type="text"
                                placeholder="Search our catalog..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-12 pr-6 py-3.5 bg-gray-50/50 border-none rounded-xl text-sm focus:outline-none focus:ring-4 focus:ring-brand-blue/5 transition-all outline-none italic font-medium"
                            />
                        </div>

                        <div className="flex items-center gap-4 w-full xl:w-auto">
                            <button className="flex-1 xl:flex-none px-6 py-3.5 bg-white border border-gray-100 rounded-xl text-gray-400 hover:text-brand-blue transition-all flex items-center justify-center gap-2 font-black text-[10px] uppercase tracking-widest shadow-sm">
                                <Filter className="w-3.5 h-3.5" />
                                Filters
                            </button>
                            <div className="h-8 w-px bg-gray-100 hidden xl:block"></div>
                            <div className="flex bg-gray-50 p-1 rounded-xl border border-gray-100">
                                <button
                                    onClick={() => setViewMode('grid')}
                                    className={`p-2.5 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-white text-brand-blue shadow-sm' : 'text-gray-400'}`}
                                >
                                    <Grid className="w-4 h-4" />
                                </button>
                                <button
                                    onClick={() => setViewMode('list')}
                                    className={`p-2.5 rounded-lg transition-all ${viewMode === 'list' ? 'bg-white text-brand-blue shadow-sm' : 'text-gray-400'}`}
                                >
                                    <List className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Categories Bar */}
                <div className="flex gap-3 overflow-x-auto pb-6 mb-10 no-scrollbar">
                    {['All', 'Data Science', 'Design', 'Business', 'Marketing'].map((cat, i) => (
                        <button
                            key={cat}
                            className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest whitespace-nowrap transition-all border ${i === 0
                                ? 'bg-gray-900 border-gray-900 text-white shadow-lg'
                                : 'bg-white border-gray-100 text-gray-400 hover:border-brand-blue/30 hover:text-brand-blue shadow-sm'
                                }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                {/* Courses Grid */}
                {loading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                        {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
                            <div key={i} className="bg-white rounded-3xl h-80 border border-gray-100 animate-pulse"></div>
                        ))}
                    </div>
                ) : (
                    <div className={viewMode === 'grid' ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-6" : "flex flex-col gap-4"}>
                        {filteredCourses.map(course => (
                            <div key={course.id} className={`bg-white rounded-[24px] overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-500 group flex ${viewMode === 'list' ? 'flex-row h-48' : 'flex-col h-[400px]'}`}>
                                <div className={`relative overflow-hidden ${viewMode === 'list' ? 'w-64 shrink-0' : 'h-44'}`}>
                                    <img
                                        src={course.image}
                                        alt={course.title}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                                    />
                                    <div className="absolute inset-0 bg-gray-900/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[1px]">
                                        <Link to={`/company/course/preview/${course.id}`} className="bg-white text-gray-900 px-6 py-2.5 rounded-xl font-black uppercase tracking-widest text-[9px] flex items-center gap-2 transform translate-y-4 group-hover:translate-y-0 transition-all duration-500 shadow-xl">
                                            Preview <Play className="w-3 h-3 fill-gray-900" />
                                        </Link>
                                    </div>
                                    <div className="absolute top-4 left-4">
                                        <span className="px-3 py-1 bg-white/95 backdrop-blur-md text-gray-900 rounded-lg text-[8px] font-black uppercase tracking-widest shadow-sm">{course.category}</span>
                                    </div>
                                </div>

                                <div className={`p-6 flex flex-col justify-between flex-1`}>
                                    <div>
                                        <div className="flex items-center justify-between mb-4">
                                            <div className="flex items-center gap-1.5 text-amber-500 bg-amber-50 px-2 py-1 rounded-lg border border-amber-100">
                                                <Star className="w-3.5 h-3.5 fill-amber-500" />
                                                <span className="text-[10px] font-black leading-none">{course.rating}</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-gray-400 text-[8px] font-black uppercase tracking-widest leading-none">
                                                <BookOpen className="w-3.5 h-3.5" />
                                                {course.students} Learners
                                            </div>
                                        </div>
                                        <h3 className="text-[16px] font-black text-gray-900 mb-2 leading-tight group-hover:text-brand-blue transition-colors line-clamp-2">
                                            {course.title}
                                        </h3>
                                        <p className="text-gray-500 font-medium text-xs leading-relaxed line-clamp-2 mb-4">
                                            {course.description}
                                        </p>
                                    </div>

                                    <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                                        <div className="flex items-center gap-2 text-[10px] font-black text-gray-900">
                                            <Clock className="w-3.5 h-3.5 text-gray-400" />
                                            {course.duration}
                                        </div>
                                        <Link to={`/company/course/${course.id}`} className="text-brand-blue font-black text-[10px] uppercase tracking-widest group/btn hover:gap-2 transition-all flex items-center border-b-2 border-transparent hover:border-brand-blue/30 pb-0.5">
                                            Enroll <ChevronRight className="w-4 h-4" />
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
};
