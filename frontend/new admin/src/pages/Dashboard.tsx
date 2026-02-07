import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { Search, LayoutGrid, List, Eye, Clock, BookOpen, Edit, Share2, X, Check, Users, Settings } from 'lucide-react';
import api from '../services/api';

// Types
interface Course {
    id: number;
    title: string;
    tags: string[];
    views: number;
    lessons: number;
    duration: string;
    status: 'yet-to-start' | 'in-progress' | 'completed';
}

// Participant interface removed


// Mock Data removed - using API data

const Dashboard = () => {
    const navigate = useNavigate();
    const [stats, setStats] = useState({ total: 0, yetToStart: 0, inProgress: 0, completed: 0 });
    const [viewData, setViewData] = useState<any[]>([]);
    const [coursePerformanceData, setCoursePerformanceData] = useState<any[]>([]);
    const [recentActivity, setRecentActivity] = useState<any[]>([]);
    const [participants, setParticipants] = useState<any[]>([]);
    const [courses, setCourses] = useState<Course[]>([]);
    const [loading, setLoading] = useState(true);

    const [viewMode, setViewMode] = useState<'kanban' | 'list'>('kanban');
    const [searchQuery, setSearchQuery] = useState('');
    const [showSearchResults, setShowSearchResults] = useState(false);
    const [selectedFilter, setSelectedFilter] = useState<'all' | 'yet-to-start' | 'in-progress' | 'completed'>('all');
    const [visibleColumns, setVisibleColumns] = useState({
        srNo: true,
        course: true,
        participant: true,
        progress: true,
        status: true,
    });
    const [showColumnPanel, setShowColumnPanel] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [statsRes, graphRes, activityRes, detailedRes, coursesRes] = await Promise.all([
                    api.get('/reports/stats'),
                    api.get('/reports/graph-data'),
                    api.get('/reports/activity'),
                    api.get('/reports/detailed'), // For participants list
                    api.get('/courses') // For courses list
                ]);

                // Stats
                setStats({
                    total: statsRes.data?.total_participants || 0,
                    yetToStart: statsRes.data?.course_status_distribution?.YET_TO_START || 0,
                    inProgress: statsRes.data?.course_status_distribution?.IN_PROGRESS || 0,
                    completed: statsRes.data?.course_status_distribution?.COMPLETED || 0
                });

                // Graphs
                const processedViewData = (graphRes.data?.enrollments || []).map((item: any) => ({
                    name: item.day_name,
                    enrolments: parseInt(item.count),
                    views: 0 // Mocking views as 0 since backend doesn't track it yet
                }));
                setViewData(processedViewData);
                setCoursePerformanceData((graphRes.data?.coursePerformance || []).map((item: any) => ({
                    name: item.name,
                    students: parseInt(item.students || 0),
                    completions: parseInt(item.completions || 0)
                })));

                // Activity
                const processedActivity = (activityRes.data || []).map((item: any) => ({
                    text: `${item.user || 'Unknown User'} ${item.type === 'enrollment' ? 'enrolled in' : 'completed'} ${item.course || 'Unknown Course'}`,
                    time: item.time ? new Date(item.time).toLocaleDateString() : 'Just now',
                    type: item.type
                }));
                setRecentActivity(processedActivity);

                // Participants
                const participantsList = detailedRes.data?.data || [];
                const processedParticipants = Array.isArray(participantsList) ? participantsList.map((item: any, index: number) => ({
                    id: index + 1,
                    name: item.participant_name || 'Unknown',
                    course: item.course_name || 'Unknown',
                    progress: item.completion_percentage || 0,
                    status: item.status || 'yet-to-start'
                })) : [];
                setParticipants(processedParticipants);

                // Courses
                // backend returns { data: [], pagination: {} }
                setCourses(coursesRes.data?.data || []);

                setLoading(false);
            } catch (error) {
                console.error('Error loading dashboard data:', error);
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    // Close search results when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const target = event.target as HTMLElement;
            if (!target.closest('.search-container')) {
                setShowSearchResults(false);
            }
        };

        const handleEscape = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                setShowSearchResults(false);
            }
        };

        if (showSearchResults) {
            document.addEventListener('mousedown', handleClickOutside);
            document.addEventListener('keydown', handleEscape);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('keydown', handleEscape);
        };
    }, [showSearchResults]);


    // Filter participants based on selected filter
    const filteredParticipants = selectedFilter === 'all'
        ? participants
        : participants.filter(p => p.status === selectedFilter);

    // Filter courses based on search
    const filteredCourses = courses.filter(course =>
        (course.title || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (course.tags && course.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())))
    );


    const getStatusLabel = (status: string) => {
        const labels: Record<string, string> = {
            'yet-to-start': 'Yet to Start',
            'in-progress': 'In Progress',
            'completed': 'Completed',
        };
        return labels[status] || status;
    };

    if (loading) {
        return <div className="min-h-screen flex items-center justify-center">Loading Dashboard...</div>;
    }

    return (
        <div className="min-h-screen bg-gray-50/50">
            {/* Header */}
            <header className="bg-white/80 backdrop-blur-xl border-b border-gray-200 sticky top-0 z-40 shadow-sm transition-all duration-200">
                <div className="max-w-7xl mx-auto px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div>
                                <h1 className="text-xl font-bold text-gray-900 tracking-tight">Overview</h1>
                                <p className="text-xs text-gray-500 font-medium mt-0.5">Real-time dashboard monitoring</p>
                            </div>
                            <div className="flex items-center gap-1.5 px-2.5 py-1 bg-green-50 rounded-full border border-green-100">
                                <span className="relative flex h-2 w-2">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                                </span>
                                <span className="text-[10px] font-bold text-green-700 uppercase tracking-wide">Live</span>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="relative group search-container">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 transition-colors group-focus-within:text-[#0ea5e9] z-10" />
                                <input
                                    type="text"
                                    placeholder="Search courses, learners, pages..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    onFocus={() => setShowSearchResults(true)}
                                    className="pl-9 pr-4 py-2 bg-gray-100/50 border border-transparent hover:bg-white hover:border-gray-200 focus:bg-white focus:border-[#0ea5e9] rounded-lg text-sm transition-all focus:outline-none focus:ring-4 focus:ring-[#0ea5e9]/10 w-80 text-gray-700 placeholder:text-gray-400"
                                />

                                {/* Search Results Dropdown */}
                                {showSearchResults && searchQuery.trim() && (
                                    <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl border border-gray-200 shadow-2xl z-50 max-h-96 overflow-y-auto">
                                        {/* Pages Section */}
                                        {(() => {
                                            const pages = [
                                                { name: 'Dashboard', path: '/dashboard', icon: '📊', description: 'Overview and analytics' },
                                                { name: 'Courses', path: '/courses', icon: '📚', description: 'Manage all courses' },
                                                { name: 'Learners', path: '/learners', icon: '👥', description: 'Student management' },
                                                { name: 'Instructors', path: '/instructor', icon: '👨‍🏫', description: 'Instructor profiles' },
                                                { name: 'Analytics', path: '/analytics', icon: '📈', description: 'Detailed insights' },
                                                { name: 'Settings', path: '/settings', icon: '⚙️', description: 'System settings' }
                                            ].filter(page =>
                                                page.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                                page.description.toLowerCase().includes(searchQuery.toLowerCase())
                                            );

                                            return pages.length > 0 && (
                                                <div className="p-2">
                                                    <div className="px-3 py-2 text-xs font-bold text-gray-500 uppercase tracking-wider">Pages</div>
                                                    {pages.map((page) => (
                                                        <button
                                                            key={page.path}
                                                            onClick={() => {
                                                                navigate(page.path);
                                                                setSearchQuery('');
                                                                setShowSearchResults(false);
                                                            }}
                                                            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-blue-50 transition-colors text-left group"
                                                        >
                                                            <span className="text-2xl">{page.icon}</span>
                                                            <div className="flex-1">
                                                                <p className="text-sm font-bold text-gray-900 group-hover:text-[#0ea5e9]">{page.name}</p>
                                                                <p className="text-xs text-gray-500">{page.description}</p>
                                                            </div>
                                                        </button>
                                                    ))}
                                                </div>
                                            );
                                        })()}

                                        {/* Courses Section */}
                                        {(() => {
                                            const courses = filteredCourses.slice(0, 3);
                                            return courses.length > 0 && (
                                                <div className="p-2 border-t border-gray-100">
                                                    <div className="px-3 py-2 text-xs font-bold text-gray-500 uppercase tracking-wider">Courses</div>
                                                    {courses.map((course) => (
                                                        <button
                                                            key={course.id}
                                                            onClick={() => {
                                                                navigate(`/courses/${course.id}`);
                                                                setSearchQuery('');
                                                                setShowSearchResults(false);
                                                            }}
                                                            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-purple-50 transition-colors text-left group"
                                                        >
                                                            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                                                <BookOpen className="w-5 h-5 text-purple-600" />
                                                            </div>
                                                            <div className="flex-1 min-w-0">
                                                                <p className="text-sm font-bold text-gray-900 group-hover:text-purple-600 truncate">{course.title}</p>
                                                                <p className="text-xs text-gray-500">{course.lessons} lessons • {course.duration}</p>
                                                            </div>
                                                        </button>
                                                    ))}
                                                    {filteredCourses.length > 3 && (
                                                        <button
                                                            onClick={() => {
                                                                navigate('/courses');
                                                                setSearchQuery('');
                                                                setShowSearchResults(false);
                                                            }}
                                                            className="w-full px-3 py-2 text-xs text-[#0ea5e9] hover:text-[#0284c7] font-bold text-center"
                                                        >
                                                            View all {filteredCourses.length} courses →
                                                        </button>
                                                    )}
                                                </div>
                                            );
                                        })()}

                                        {/* Learners Section */}
                                        {(() => {
                                            const learners = participants.filter(p =>
                                                p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                                p.course.toLowerCase().includes(searchQuery.toLowerCase())
                                            ).slice(0, 3);

                                            return learners.length > 0 && (
                                                <div className="p-2 border-t border-gray-100">
                                                    <div className="px-3 py-2 text-xs font-bold text-gray-500 uppercase tracking-wider">Learners</div>
                                                    {learners.map((learner) => (
                                                        <button
                                                            key={learner.id}
                                                            onClick={() => {
                                                                navigate('/learners');
                                                                setSearchQuery('');
                                                                setShowSearchResults(false);
                                                            }}
                                                            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-green-50 transition-colors text-left group"
                                                        >
                                                            <div className="w-10 h-10 bg-gradient-to-br from-[#0ea5e9] to-[#0284c7] rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                                                                {(learner.name || '').split(' ').map((n: string) => n[0]).join('')}
                                                            </div>
                                                            <div className="flex-1 min-w-0">
                                                                <p className="text-sm font-bold text-gray-900 group-hover:text-green-600">{learner.name}</p>
                                                                <p className="text-xs text-gray-500 truncate">{learner.course} • {learner.progress}% complete</p>
                                                            </div>
                                                        </button>
                                                    ))}
                                                </div>
                                            );
                                        })()}

                                        {/* No Results */}
                                        {filteredCourses.length === 0 &&
                                            !participants.some(p => p.name.toLowerCase().includes(searchQuery.toLowerCase())) &&
                                            !['/dashboard', '/courses', '/learners', '/instructor', '/analytics', '/settings'].some(path =>
                                                path.toLowerCase().includes(searchQuery.toLowerCase())
                                            ) && (
                                                <div className="p-8 text-center">
                                                    <div className="text-4xl mb-2">🔍</div>
                                                    <p className="text-sm font-bold text-gray-900 mb-1">No results found</p>
                                                    <p className="text-xs text-gray-500">Try searching for courses, learners, or pages</p>
                                                </div>
                                            )}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            <div className="max-w-7xl mx-auto px-6 py-8">
                {/* Stats Row */}
                <section className="mb-10">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
                        <div
                            onClick={() => navigate('/learners')}
                            className="bg-white p-6 rounded-xl border border-gray-200/60 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] hover:border-[#0ea5e9]/30 transition-all group relative overflow-hidden cursor-pointer"
                        >
                            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                <Users className="w-16 h-16 text-[#0ea5e9] transform rotate-12" />
                            </div>
                            <div className="flex items-center gap-3 mb-2">
                                <div className="p-2 bg-blue-50 rounded-lg text-[#0ea5e9]">
                                    <Users className="w-5 h-5" />
                                </div>
                                <span className="text-sm font-semibold text-gray-600">Total Learners</span>
                            </div>
                            <div className="flex items-baseline gap-2">
                                <h3 className="text-2xl font-bold text-gray-900">{stats.total.toLocaleString()}</h3>
                                <span className="text-xs font-bold text-green-600 flex items-center bg-green-50 px-1.5 py-0.5 rounded-md">
                                    +12.5%
                                </span>
                            </div>
                            <div className="w-full bg-gray-100 h-1 mt-4 rounded-full overflow-hidden">
                                <div className="bg-[#0ea5e9] h-full rounded-full" style={{ width: '75%' }}></div>
                            </div>
                        </div>

                        <div
                            onClick={() => navigate('/learners')}
                            className="bg-white p-6 rounded-xl border border-gray-200/60 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] hover:border-[#6366f1]/30 transition-all group relative overflow-hidden cursor-pointer"
                        >
                            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                <Clock className="w-16 h-16 text-[#6366f1] transform rotate-12" />
                            </div>
                            <div className="flex items-center gap-3 mb-2">
                                <div className="p-2 bg-indigo-50 rounded-lg text-[#6366f1]">
                                    <Clock className="w-5 h-5" />
                                </div>
                                <span className="text-sm font-semibold text-gray-600">Active Now</span>
                            </div>
                            <div className="flex items-baseline gap-2">
                                <h3 className="text-2xl font-bold text-gray-900">{stats.inProgress.toLocaleString()}</h3>
                                <span className="text-xs font-bold text-green-600 flex items-center bg-green-50 px-1.5 py-0.5 rounded-md">
                                    +5.2%
                                </span>
                            </div>
                            <div className="w-full bg-gray-100 h-1 mt-4 rounded-full overflow-hidden">
                                <div className="bg-[#6366f1] h-full rounded-full" style={{ width: '45%' }}></div>
                            </div>
                        </div>

                        <div
                            onClick={() => navigate('/learners')}
                            className="bg-white p-6 rounded-xl border border-gray-200/60 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] hover:border-green-500/30 transition-all group relative overflow-hidden cursor-pointer"
                        >
                            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                <Check className="w-16 h-16 text-green-600 transform rotate-12" />
                            </div>
                            <div className="flex items-center gap-3 mb-2">
                                <div className="p-2 bg-green-50 rounded-lg text-green-600">
                                    <Check className="w-5 h-5" />
                                </div>
                                <span className="text-sm font-semibold text-gray-600">Course Completion</span>
                            </div>
                            <div className="flex items-baseline gap-2">
                                <h3 className="text-2xl font-bold text-gray-900">{stats.completed.toLocaleString()}</h3>
                                <span className="text-xs font-bold text-gray-400 bg-gray-50 px-1.5 py-0.5 rounded-md">
                                    0.0%
                                </span>
                            </div>
                            <div className="w-full bg-gray-100 h-1 mt-4 rounded-full overflow-hidden">
                                <div className="bg-green-500 h-full rounded-full" style={{ width: '30%' }}></div>
                            </div>
                        </div>

                        <div
                            onClick={() => navigate('/courses')}
                            className="bg-white p-6 rounded-xl border border-gray-200/60 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] hover:border-orange-500/30 transition-all group relative overflow-hidden cursor-pointer"
                        >
                            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                <BookOpen className="w-16 h-16 text-orange-500 transform rotate-12" />
                            </div>
                            <div className="flex items-center gap-3 mb-2">
                                <div className="p-2 bg-orange-50 rounded-lg text-orange-500">
                                    <BookOpen className="w-5 h-5" />
                                </div>
                                <span className="text-sm font-semibold text-gray-600">Total Courses</span>
                            </div>
                            <div className="flex items-baseline gap-2">
                                <h3 className="text-2xl font-bold text-gray-900">{courses.length}</h3>
                                <span className="text-xs font-bold text-orange-600 flex items-center bg-orange-50 px-1.5 py-0.5 rounded-md">
                                    New
                                </span>
                            </div>
                            <div className="w-full bg-gray-100 h-1 mt-4 rounded-full overflow-hidden">
                                <div className="bg-orange-500 h-full rounded-full" style={{ width: '60%' }}></div>
                            </div>
                        </div>
                    </div>
                </section>



                {/* Analytics & Recent Activity */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
                    {/* Left Column: Charts */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Views Chart */}
                        <div className="bg-white p-6 rounded-xl border border-gray-200/60 shadow-sm relative overflow-hidden">
                            <div className="flex items-center justify-between mb-6">
                                <div>
                                    <h3 className="text-lg font-bold text-gray-900">Views Analytics</h3>
                                    <p className="text-xs text-gray-500 font-medium">Platform traffic over the last week</p>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="flex items-center gap-2">
                                        <div className="flex items-center gap-1.5">
                                            <div className="w-2 h-2 rounded-full bg-[#0ea5e9]"></div>
                                            <span className="text-xs text-gray-500 font-medium">Views</span>
                                        </div>
                                        <div className="flex items-center gap-1.5">
                                            <div className="w-2 h-2 rounded-full bg-[#6366f1]"></div>
                                            <span className="text-xs text-gray-500 font-medium">Enrolments</span>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => navigate('/analytics')}
                                        className="px-3 py-1.5 bg-[#0ea5e9] text-white rounded-lg text-xs font-bold hover:bg-[#0284c7] transition-all shadow-sm hover:shadow-md"
                                    >
                                        Explore More
                                    </button>
                                </div>
                            </div>
                            <div className="h-64">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={viewData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                        <defs>
                                            <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.1} />
                                                <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0} />
                                            </linearGradient>
                                            <linearGradient id="colorEnrolments" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.1} />
                                                <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                                            </linearGradient>
                                        </defs>
                                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#9ca3af', fontWeight: 600 }} dy={10} />
                                        <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#9ca3af', fontWeight: 600 }} />
                                        <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="#f3f4f6" />
                                        <RechartsTooltip
                                            contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.95)', borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px -2px rgba(0, 0, 0, 0.1)' }}
                                            itemStyle={{ fontSize: '12px', fontWeight: '600', color: '#374151' }}
                                        />
                                        <Area type="monotone" dataKey="views" stroke="#0ea5e9" strokeWidth={3} fillOpacity={1} fill="url(#colorViews)" />
                                        <Area type="monotone" dataKey="enrolments" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorEnrolments)" />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        {/* Course Performance Chart */}
                        <div className="bg-white p-6 rounded-xl border border-gray-200/60 shadow-sm relative overflow-hidden">
                            <div className="flex items-center justify-between mb-6">
                                <div>
                                    <h3 className="text-lg font-bold text-gray-900">Course Performance</h3>
                                    <p className="text-xs text-gray-500 font-medium">Student engagement across top courses</p>
                                </div>
                            </div>
                            <div className="h-48">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={coursePerformanceData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }} barSize={30}>
                                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#9ca3af', fontWeight: 600 }} dy={10} />
                                        <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#9ca3af', fontWeight: 600 }} />
                                        <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="#f3f4f6" />
                                        <RechartsTooltip
                                            cursor={{ fill: 'transparent' }}
                                            contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.95)', borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px -2px rgba(0, 0, 0, 0.1)' }}
                                        />
                                        <Bar dataKey="students" fill="#0ea5e9" radius={[4, 4, 0, 0]} />
                                        <Bar dataKey="completions" fill="#22c55e" radius={[4, 4, 0, 0]} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Recent Activity */}
                    <div className="space-y-6">
                        <div className="bg-white p-6 rounded-xl border border-gray-200/60 shadow-sm h-full">
                            <h3 className="text-lg font-bold text-gray-900 mb-6">Recent Activity</h3>
                            <div className="relative pl-4 border-l-2 border-gray-100 space-y-8">
                                {recentActivity.length > 0 ? (
                                    recentActivity.map((item, index) => (
                                        <div key={index} className="relative group">
                                            <div className={`absolute -left-[21px] top-1 w-3 h-3 rounded-full border-2 border-white box-content ${item.type === 'enrollment' ? 'bg-[#0ea5e9]' :
                                                item.type === 'completion' ? 'bg-green-500' :
                                                    item.type === 'comment' ? 'bg-orange-500' :
                                                        item.type === 'course' ? 'bg-purple-500' : 'bg-gray-400'
                                                }`}></div>
                                            <div className="group-hover:translate-x-1 transition-transform duration-200">
                                                <p className="text-sm text-gray-800 font-bold leading-snug">{item.text}</p>
                                                <p className="text-[10px] text-gray-400 font-medium mt-1 uppercase tracking-wide">{item.time}</p>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-sm text-gray-500 italic">No recent activity</p>
                                )}
                            </div>
                            {recentActivity.length > 0 && (
                                <button className="w-full mt-8 py-2.5 text-xs font-bold text-gray-500 bg-gray-50 hover:bg-gray-100 hover:text-gray-900 rounded-lg transition-all border border-transparent hover:border-gray-200">
                                    View All History
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                {/* Module A: Course Management */}
                <section className="mb-12">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h2 className="text-lg font-bold text-gray-900 tracking-tight">Active Courses</h2>
                            <p className="text-xs text-gray-500 mt-1 font-medium">Manage and monitor learning content performance</p>
                        </div>
                        <div className="flex items-center gap-1 bg-gray-100/80 p-1 rounded-lg border border-gray-200">
                            <button
                                onClick={() => setViewMode('kanban')}
                                className={`p-1.5 rounded-md transition-all ${viewMode === 'kanban' ? 'bg-white text-gray-900 shadow-sm border border-gray-100' : 'text-gray-500 hover:text-gray-700'}`}
                            >
                                <LayoutGrid className="w-4 h-4" />
                            </button>
                            <button
                                onClick={() => setViewMode('list')}
                                className={`p-1.5 rounded-md transition-all ${viewMode === 'list' ? 'bg-white text-gray-900 shadow-sm border border-gray-100' : 'text-gray-500 hover:text-gray-700'}`}
                            >
                                <List className="w-4 h-4" />
                            </button>
                        </div>
                    </div>

                    {/* Kanban View */}
                    {viewMode === 'kanban' && (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {filteredCourses.map((course) => (
                                <div
                                    key={course.id}
                                    onClick={() => navigate(`/courses/${course.id}`)}
                                    className="bg-white rounded-xl p-0 border border-gray-200 shadow-sm hover:shadow-md hover:border-[#0ea5e9]/50 transition-all duration-300 group cursor-pointer overflow-hidden flex flex-col"
                                >
                                    {/* Card Header Color Stripe */}
                                    <div className={`h-1.5 w-full ${(course.tags || []).includes('Frontend') ? 'bg-blue-500' :
                                        (course.tags || []).includes('Backend') ? 'bg-purple-500' :
                                            (course.tags || []).includes('Design') ? 'bg-pink-500' : 'bg-green-500'
                                        }`}></div>

                                    <div className="p-5 flex-1 flex flex-col">
                                        <div className="flex justify-between items-start mb-3">
                                            <div className="flex flex-wrap gap-1.5">
                                                {(course.tags || []).slice(0, 2).map((tag, index) => (
                                                    <span key={index} className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide border ${tag === 'Frontend' ? 'bg-blue-50 text-blue-600 border-blue-100' :
                                                        tag === 'Backend' ? 'bg-purple-50 text-purple-600 border-purple-100' :
                                                            'bg-gray-50 text-gray-600 border-gray-100'
                                                        }`}>
                                                        {tag}
                                                    </span>
                                                ))}
                                            </div>
                                            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                                        </div>

                                        <h3 className="text-base font-bold text-gray-900 mb-4 leading-tight group-hover:text-[#0ea5e9] transition-colors line-clamp-2">
                                            {course.title}
                                        </h3>

                                        <div className="mt-auto space-y-3">
                                            <div className="flex items-center justify-between text-xs text-gray-500 font-medium">
                                                <div className="flex items-center gap-1.5">
                                                    <Eye className="w-3.5 h-3.5 text-gray-400" />
                                                    {(course.views || 0).toLocaleString()}
                                                </div>
                                                <div className="flex items-center gap-1.5">
                                                    <Clock className="w-3.5 h-3.5 text-gray-400" />
                                                    {course.duration}
                                                </div>
                                            </div>

                                            <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden">
                                                <div className="bg-gradient-to-r from-[#0ea5e9] to-[#6366f1] h-full rounded-full" style={{ width: `${Math.random() * 40 + 20}%` }}></div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="px-5 py-3 bg-gray-50/50 border-t border-gray-100 flex gap-3">
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                navigate(`/courses/${course.id}`);
                                            }}
                                            className="flex-1 text-xs font-semibold text-gray-600 hover:text-[#0ea5e9] hover:bg-white border border-transparent hover:border-gray-200 py-1.5 rounded-lg transition-all flex items-center justify-center gap-1.5"
                                        >
                                            <Edit className="w-3.5 h-3.5" />
                                            Edit
                                        </button>
                                        <button
                                            onClick={(e) => e.stopPropagation()}
                                            className="flex-1 text-xs font-semibold text-gray-600 hover:text-[#0ea5e9] hover:bg-white border border-transparent hover:border-gray-200 py-1.5 rounded-lg transition-all flex items-center justify-center gap-1.5"
                                        >
                                            <Share2 className="w-3.5 h-3.5" />
                                            Share
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* List View with sharper styling */}
                    {viewMode === 'list' && (
                        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-gray-50/80 border-b border-gray-200">
                                        <tr>
                                            <th className="text-left py-3 px-6 font-bold text-gray-600 text-xs uppercase tracking-wider">Course Detail</th>
                                            <th className="text-left py-3 px-6 font-bold text-gray-600 text-xs uppercase tracking-wider">Tags</th>
                                            <th className="text-left py-3 px-6 font-bold text-gray-600 text-xs uppercase tracking-wider">Performance</th>
                                            <th className="text-left py-3 px-6 font-bold text-gray-600 text-xs uppercase tracking-wider">Meta</th>
                                            <th className="text-right py-3 px-6 font-bold text-gray-600 text-xs uppercase tracking-wider">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {filteredCourses.map((course) => (
                                            <tr
                                                key={course.id}
                                                onClick={() => navigate(`/courses/${course.id}`)}
                                                className="hover:bg-gray-50 transition-colors group cursor-pointer"
                                            >
                                                <td className="py-4 px-6">
                                                    <div className="font-bold text-gray-900 text-sm group-hover:text-[#0ea5e9] transition-colors">{course.title}</div>
                                                </td>
                                                <td className="py-4 px-6">
                                                    <div className="flex flex-wrap gap-1.5">
                                                        {(course.tags || []).map((tag, index) => (
                                                            <span key={index} className="px-2 py-0.5 rounded-md bg-gray-100 text-gray-600 text-[10px] font-bold uppercase tracking-wide border border-gray-200">
                                                                {tag}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </td>
                                                <td className="py-4 px-6">
                                                    <div className="flex items-center gap-4 text-xs font-medium text-gray-600">
                                                        <span className="flex items-center gap-1"><Eye className="w-3 h-3 text-[#0ea5e9]" /> {(course.views || 0).toLocaleString()}</span>
                                                        <div className="w-16 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                                            <div className="bg-[#0ea5e9] h-full" style={{ width: '60%' }}></div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="py-4 px-6">
                                                    <div className="text-xs text-gray-500 font-medium">
                                                        {course.lessons} lessons • {course.duration}
                                                    </div>
                                                </td>
                                                <td className="py-4 px-6 text-right">
                                                    <div className="flex justify-end gap-2">
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                navigate(`/courses/${course.id}`);
                                                            }}
                                                            className="p-1.5 hover:bg-[#0ea5e9]/10 rounded-lg text-gray-400 hover:text-[#0ea5e9] transition-colors"
                                                        >
                                                            <Edit className="w-4 h-4" />
                                                        </button>
                                                        <button
                                                            onClick={(e) => e.stopPropagation()}
                                                            className="p-1.5 hover:bg-[#0ea5e9]/10 rounded-lg text-gray-400 hover:text-[#0ea5e9] transition-colors"
                                                        >
                                                            <Share2 className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </section>

                {/* Module B: Reporting Dashboard */}
                <section>
                    <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                            <h2 className="text-lg font-bold text-gray-900 tracking-tight">Student Leaderboard</h2>
                            <p className="text-xs text-gray-500 mt-1 font-medium">Top performing students this week</p>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-gray-500 uppercase tracking-widest mr-2">Filter by:</span>
                            {['All', 'Yet to Start', 'In Progress', 'Completed'].map((filter) => {
                                const val = filter.toLowerCase().replace(/ /g, '-');
                                const isActive = selectedFilter === (val === 'all' ? 'all' : val);
                                return (
                                    <button
                                        key={filter}
                                        onClick={() => setSelectedFilter(val === 'all' ? 'all' : val as any)}
                                        className={`text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-lg border transition-all ${isActive
                                            ? 'bg-gray-900 text-white border-gray-900'
                                            : 'bg-white text-gray-500 border-gray-200 hover:border-gray-300'
                                            }`}
                                    >
                                        {filter}
                                    </button>
                                )
                            })}
                        </div>
                    </div>

                    {/* Data Table with Column Visibility */}
                    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                        <div className="flex items-center justify-between p-4 border-b border-gray-100 bg-gray-50/30">
                            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide">
                                Participant List <span className="text-gray-400 ml-2 font-medium normal-case">({filteredParticipants.length})</span>
                            </h3>
                            <button
                                onClick={() => setShowColumnPanel(!showColumnPanel)}
                                className="text-xs font-semibold text-[#0ea5e9] hover:text-[#0284c7] flex items-center gap-1"
                            >
                                <Settings className="w-3.5 h-3.5" />
                                Customize View
                            </button>
                        </div>

                        {/* Wrapper for table to handle relative positioning of panel */}
                        <div className="relative">
                            {/* Column Visibility Panel */}
                            {showColumnPanel && (
                                <div className="absolute right-4 top-2 bg-white border border-gray-200 rounded-xl p-4 shadow-xl z-20 w-56 animate-in fade-in zoom-in-95 duration-200">
                                    <div className="flex items-center justify-between mb-3 border-b border-gray-100 pb-2">
                                        <h4 className="font-bold text-xs uppercase tracking-wider text-gray-900">Columns</h4>
                                        <button onClick={() => setShowColumnPanel(false)} className="text-gray-400 hover:text-gray-600">
                                            <X className="w-3.5 h-3.5" />
                                        </button>
                                    </div>
                                    <div className="space-y-1">
                                        {Object.entries(visibleColumns).map(([key, value]) => (
                                            <label key={key} className="flex items-center gap-2.5 cursor-pointer hover:bg-gray-50 p-1.5 rounded-lg transition-colors">
                                                <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${value ? 'bg-[#0ea5e9] border-[#0ea5e9]' : 'bg-white border-gray-300'}`}>
                                                    {value && <Check className="w-3 h-3 text-white" />}
                                                </div>
                                                {/* Hidden checkbox for logic */}
                                                <input
                                                    type="checkbox"
                                                    checked={value}
                                                    onChange={(e) => setVisibleColumns({ ...visibleColumns, [key]: e.target.checked })}
                                                    className="hidden"
                                                />
                                                <span className="capitalize text-xs font-semibold text-gray-700">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-gray-50 border-b border-gray-200">
                                        <tr>
                                            {visibleColumns.srNo && <th className="text-left py-3 px-6 font-bold text-gray-500 text-[10px] uppercase tracking-widest w-16">No.</th>}
                                            {visibleColumns.course && <th className="text-left py-3 px-6 font-bold text-gray-500 text-[10px] uppercase tracking-widest">Enrolled Course</th>}
                                            {visibleColumns.participant && <th className="text-left py-3 px-6 font-bold text-gray-500 text-[10px] uppercase tracking-widest">Student Name</th>}
                                            {visibleColumns.progress && <th className="text-left py-3 px-6 font-bold text-gray-500 text-[10px] uppercase tracking-widest w-48">Progress Status</th>}
                                            {visibleColumns.status && <th className="text-right py-3 px-6 font-bold text-gray-500 text-[10px] uppercase tracking-widest">State</th>}
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-50">
                                        {filteredParticipants.map((participant, index) => (
                                            <tr key={participant.id} className="hover:bg-blue-50/30 transition-colors group">
                                                {visibleColumns.srNo && (
                                                    <td className="py-4 px-6 text-gray-400 font-mono text-xs">{(index + 1).toString().padStart(2, '0')}</td>
                                                )}
                                                {visibleColumns.course && (
                                                    <td className="py-4 px-6 font-semibold text-gray-900 text-sm">{participant.course}</td>
                                                )}
                                                {visibleColumns.participant && (
                                                    <td className="py-4 px-6">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-gray-200 to-gray-100 border border-gray-200 flex items-center justify-center text-xs font-bold text-gray-600">
                                                                {participant.name.charAt(0)}
                                                            </div>
                                                            <span className="text-sm text-gray-700 font-medium">{participant.name}</span>
                                                        </div>
                                                    </td>
                                                )}
                                                {visibleColumns.progress && (
                                                    <td className="py-4 px-6">
                                                        <div className="flex flex-col gap-1.5">
                                                            <div className="flex justify-between items-end">
                                                                <span className="text-[10px] font-bold text-gray-400 uppercase">Completed</span>
                                                                <span className="text-xs font-bold text-[#0ea5e9]">{participant.progress}%</span>
                                                            </div>
                                                            <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
                                                                <div
                                                                    className={`h-full transition-all duration-1000 ease-out rounded-full ${participant.progress === 100 ? 'bg-green-500' : 'bg-[#0ea5e9]'
                                                                        }`}
                                                                    style={{ width: `${participant.progress}%` }}
                                                                />
                                                            </div>
                                                        </div>
                                                    </td>
                                                )}
                                                {visibleColumns.status && (
                                                    <td className="py-4 px-6 text-right">
                                                        <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wide border ${participant.status === 'completed' ? 'bg-green-50 text-green-700 border-green-100' :
                                                            participant.status === 'in-progress' ? 'bg-yellow-50 text-yellow-700 border-yellow-100' :
                                                                'bg-gray-50 text-gray-500 border-gray-100'
                                                            }`}>
                                                            {participant.status === 'completed' && <Check className="w-3 h-3 mr-1" />}
                                                            {getStatusLabel(participant.status)}
                                                        </span>
                                                    </td>
                                                )}
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </section>
            </div>


        </div >
    );
};

export default Dashboard;
