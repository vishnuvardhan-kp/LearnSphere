import { useState, useEffect } from 'react';
import { DashboardLayout } from '../components/DashboardLayout';
import { Search, LayoutGrid, List as ListIcon, Plus, Share2, Edit3, X, Video, Clock, Eye, Users, PlayCircle, CheckCircle, Circle, Filter, User, Mail, Shield, Camera } from 'lucide-react';
import { CourseEditor } from '../components/CourseEditor';
import { useLocation } from 'react-router-dom';
import { useUser } from '../context/UserContext';

export const InfluencerDashboard = () => {
    const location = useLocation();
    const { profile, loading: profileLoading } = useUser();
    const queryParams = new URLSearchParams(location.search);

    const initialTab = queryParams.get('tab') as 'courses' | 'reporting' | 'profile' || 'courses';

    const [activeTab, setActiveTab] = useState<'courses' | 'reporting' | 'profile'>(initialTab);

    useEffect(() => {
        const tab = queryParams.get('tab') as any;
        if (tab && ['courses', 'reporting', 'profile'].includes(tab)) {
            setActiveTab(tab);
        }
    }, [location.search]);
    const [viewMode, setViewMode] = useState<'kanban' | 'list'>('kanban');
    const [searchQuery, setSearchQuery] = useState('');

    // Course Creation & Editing State
    // Course Creation & Editing State
    const [editingCourse, setEditingCourse] = useState<any>(null); // For the Course Editor
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [newCourseTitle, setNewCourseTitle] = useState('');

    // Reporting State
    const [reportingFilter, setReportingFilter] = useState<'all' | 'pending' | 'active' | 'completed'>('all');
    const [showColumnPanel, setShowColumnPanel] = useState(false);
    const [visibleColumns, setVisibleColumns] = useState({
        enrolledDate: true,
        lastActive: true,
        progress: true,
        timeSpent: false
    });

    // Mock Courses Data
    interface Course {
        id: number;
        title: string;
        tags: string[];
        views: number;
        totalLessons: number;
        duration: string;
        status: 'published' | 'draft';
        description?: string;
        image?: string;
        lessons?: any[];
        quizzes?: any[];
    }

    // Real Data State
    const [courses, setCourses] = useState<Course[]>([]);
    const [reportingUsers, setReportingUsers] = useState<any[]>([]);
    const [loadingData, setLoadingData] = useState(true);

    // Fetch Data
    useEffect(() => {
        const fetchData = async () => {
            if (!profile?.name) return;
            setLoadingData(true);
            try {
                // Fetch Courses
                const coursesRes = await fetch('http://127.0.0.1:5000/api/courses');
                const coursesData = await coursesRes.json();

                // Filter courses by the logged-in instructor's name
                const myCourses = coursesData.filter((c: any) => c.author === profile.name);
                setCourses(myCourses);

                // Fetch Reporting/Participants
                const participantsRes = await fetch('http://127.0.0.1:5000/api/participants');
                const participantsData = await participantsRes.json();
                // Map backend participants to frontend reporting format
                const mappedParticipants = participantsData.map((p: any) => ({
                    id: p.id,
                    name: p.name,
                    email: p.email,
                    status: p.status === 'active' ? 'active' : (p.status === 'offline' ? 'pending' : 'completed'),
                    progress: p.progress || 0,
                    enrolledDate: p.created_at ? new Date(p.created_at).toISOString().split('T')[0] : '2024-01-01',
                    lastActive: '2h ago',
                    timeSpent: '1h 30m'
                }));
                setReportingUsers(mappedParticipants);
            } catch (err) {
                console.error('Error fetching dashboard data:', err);
            } finally {
                setLoadingData(false);
            }
        };

        fetchData();
    }, [profile]);

    const getFilteredUsers = () => {
        if (reportingFilter === 'all') return reportingUsers;
        return reportingUsers.filter(u => u.status === reportingFilter);
    };

    const handleAddCourse = () => {
        setNewCourseTitle('');
        setShowCreateModal(true);
    };

    const confirmCreateCourse = async () => {
        if (!newCourseTitle.trim()) return;

        const newCourseData = {
            title: newCourseTitle,
            description: 'New course description...',
            author: profile?.name || 'Instructor',
            duration: '0m',
            tags: JSON.stringify([]),
            modules: JSON.stringify([])
        };

        try {
            const response = await fetch('http://127.0.0.1:5000/api/courses', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newCourseData)
            });

            if (response.ok) {
                const result = await response.json();
                const createdCourse: Course = {
                    id: result.id,
                    title: newCourseTitle,
                    tags: [],
                    views: 0,
                    totalLessons: 0,
                    duration: '0m',
                    status: 'draft',
                    image: ''
                };
                setCourses([createdCourse, ...courses]);
                setEditingCourse(createdCourse);
                setShowCreateModal(false);
            }
        } catch (err) {
            console.error('Error creating course:', err);
        }
    };

    const handleDeleteTag = (courseId: number, tagIndex: number) => {
        setCourses(courses.map(course => {
            if (course.id === courseId) {
                const newTags = [...course.tags];
                newTags.splice(tagIndex, 1);
                return { ...course, tags: newTags };
            }
            return course;
        }));
    };

    const saveCourse = async (updatedCourse: any) => {
        try {
            const body = {
                title: updatedCourse.title,
                description: updatedCourse.description,
                author: profile?.name || 'Instructor',
                tags: JSON.stringify(updatedCourse.tags),
                duration: updatedCourse.duration,
                status: updatedCourse.status,
                modules: JSON.stringify(updatedCourse.lessons), // Mapping lessons to modules key for backend
                image: updatedCourse.image
            };

            const response = await fetch(`http://127.0.0.1:5000/api/courses/${updatedCourse.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body)
            });

            if (response.ok) {
                setCourses(courses.map(c => c.id === updatedCourse.id ? updatedCourse : c));
                setEditingCourse(null);
            }
        } catch (err) {
            console.error('Error saving course:', err);
        }
    };

    const formatNumber = (num: number) => {
        if (!num) return '0';
        if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
        if (num >= 1000) return (num / 1000).toFixed(1) + 'k';
        return num.toString();
    };




    return (
        <DashboardLayout role="influencer">
            {/* Header & Navigation */}
            <div className="mb-10">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
                    <div>
                        <h1 className="text-4xl font-black text-gray-900 tracking-tighter mb-2">Instructor Portal</h1>
                        <p className="text-gray-500 font-medium">Manage your courses and analytics.</p>
                    </div>
                    {activeTab === 'courses' && (
                        <button
                            onClick={handleAddCourse}
                            className="flex items-center gap-2 px-6 py-3 bg-brand-blue hover:bg-brand-indigo text-white rounded-xl shadow-lg shadow-brand-blue/20 transition-all hover:scale-105 active:scale-95 font-bold text-sm"
                        >
                            <Plus className="w-5 h-5" />
                            Add Course
                        </button>
                    )}
                </div>

                {/* Tabs */}
                <div className="flex gap-8 border-b border-gray-100">
                    {['courses', 'reporting', 'profile'].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab as any)}
                            className={`pb-4 px-2 text-xs font-black uppercase tracking-[0.15em] transition-all relative ${activeTab === tab
                                ? 'text-brand-blue'
                                : 'text-gray-400 hover:text-gray-600'
                                }`}
                        >
                            {tab}
                            {activeTab === tab && (
                                <span className="absolute bottom-0 left-0 w-full h-1 bg-brand-blue rounded-t-full"></span>
                            )}
                        </button>
                    ))}
                </div>
            </div>

            {/* --- COURSES TAB --- */}
            {activeTab === 'courses' && (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                    {loadingData ? (
                        <div className="flex items-center justify-center py-20">
                            <div className="w-10 h-10 border-4 border-brand-blue/30 border-t-brand-blue rounded-full animate-spin"></div>
                        </div>
                    ) : (
                        <>
                            {/* Toolbar */}
                            <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8">
                                <div className="relative w-full md:w-96">
                                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    <input
                                        type="text"
                                        placeholder="Search courses..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="w-full pl-12 pr-4 py-3 bg-white border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-brand-blue/20 font-medium text-sm"
                                    />
                                </div>
                                <div className="flex bg-white p-1 rounded-xl border border-gray-100">
                                    <button
                                        onClick={() => setViewMode('kanban')}
                                        className={`p-2 rounded-lg transition-all ${viewMode === 'kanban' ? 'bg-brand-blue text-white shadow-md' : 'text-gray-400 hover:text-gray-600'}`}
                                    >
                                        <LayoutGrid className="w-5 h-5" />
                                    </button>
                                    <button
                                        onClick={() => setViewMode('list')}
                                        className={`p-2 rounded-lg transition-all ${viewMode === 'list' ? 'bg-brand-blue text-white shadow-md' : 'text-gray-400 hover:text-gray-600'}`}
                                    >
                                        <ListIcon className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>

                            {/* Courses Grid */}
                            <div className={viewMode === 'kanban' ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" : "space-y-4"}>
                                {courses.filter(c => c.title.toLowerCase().includes(searchQuery.toLowerCase())).map((course) => (
                                    viewMode === 'kanban' ? (
                                        <div key={course.id} onClick={() => setEditingCourse(course)} className={`group relative overflow-hidden rounded-[2.5rem] border shadow-sm hover:shadow-premium hover:-translate-y-1 transition-all duration-300 cursor-pointer h-[400px] flex flex-col ${course.image ? 'border-gray-900/10' : 'bg-white border-gray-100'}`}>

                                            {/* Background Image Layer */}
                                            {course.image && (
                                                <>
                                                    <div className="absolute inset-0 z-0 bg-gray-900">
                                                        <img src={course.image} alt={course.title} className="w-full h-full object-cover opacity-90 transition-transform duration-700 group-hover:scale-105" />
                                                    </div>
                                                    <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
                                                </>
                                            )}

                                            {/* Content Layer */}
                                            <div className={`relative z-20 flex flex-col h-full p-8 ${course.image ? 'text-white' : 'text-gray-900'}`}>

                                                {/* Top Header */}
                                                <div className="flex justify-between items-start mb-auto">
                                                    {/* Status Badge */}
                                                    <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest backdrop-blur-md ${course.status === 'published'
                                                        ? (course.image ? 'bg-white/20 text-white border border-white/20' : 'bg-brand-blue/10 text-brand-blue border border-brand-blue/10')
                                                        : (course.image ? 'bg-white/10 text-white/50 border border-white/10' : 'bg-gray-100 text-gray-400 border border-gray-100')
                                                        }`}>
                                                        {course.status}
                                                    </span>

                                                    {/* Actions */}
                                                    <div className="flex gap-2">
                                                        <button
                                                            className={`w-10 h-10 flex items-center justify-center rounded-xl backdrop-blur-md transition-all ${course.image
                                                                ? 'bg-black/20 hover:bg-white text-white hover:text-gray-900 border border-white/10'
                                                                : 'bg-gray-50 hover:bg-gray-100 text-gray-400 hover:text-gray-900'
                                                                }`}
                                                            title="Share"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                navigator.clipboard.writeText(`https://vyral.ai/course/${course.id}`);
                                                            }}
                                                        >
                                                            <Share2 className="w-4 h-4" />
                                                        </button>
                                                        <button
                                                            className={`w-10 h-10 flex items-center justify-center rounded-xl backdrop-blur-md transition-all ${course.image
                                                                ? 'bg-black/20 hover:bg-white text-white hover:text-brand-blue border border-white/10'
                                                                : 'bg-gray-50 hover:bg-gray-100 text-gray-400 hover:text-brand-blue'
                                                                }`}
                                                            title="Edit"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                setEditingCourse(course);
                                                            }}
                                                        >
                                                            <Edit3 className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                </div>

                                                {/* Bottom Content */}
                                                <div>
                                                    {/* Fallback Icon if no image */}
                                                    {!course.image && (
                                                        <div className="w-14 h-14 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl flex items-center justify-center text-brand-blue mb-6">
                                                            <Video className="w-7 h-7" />
                                                        </div>
                                                    )}

                                                    <h3 className={`text-3xl font-black mb-4 leading-tight tracking-tight ${course.image ? 'text-white drop-shadow-sm' : 'text-gray-900'}`}>
                                                        {course.title}
                                                    </h3>

                                                    <div className="flex flex-wrap gap-2 mb-8">
                                                        {course.tags.map((tag, tagIdx) => (
                                                            <span key={tagIdx} className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wide backdrop-blur-md ${course.image
                                                                ? 'bg-white/20 text-white border border-white/20'
                                                                : 'bg-gray-50 text-gray-500 border border-gray-100'
                                                                }`}>
                                                                {tag}
                                                                <button
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        handleDeleteTag(course.id, tagIdx);
                                                                    }}
                                                                    className={`transition-colors ${course.image ? 'hover:text-red-300' : 'hover:text-red-500'}`}
                                                                >
                                                                    <X className="w-3 h-3" />
                                                                </button>
                                                            </span>
                                                        ))}
                                                    </div>

                                                    <div className={`grid grid-cols-3 gap-4 pt-6 border-t ${course.image ? 'border-white/20 text-white' : 'border-gray-50 text-gray-900'}`}>
                                                        <div className="text-center group/stat">
                                                            <div className="text-lg font-black flex items-center justify-center gap-1.5">
                                                                <Eye className={`w-4 h-4 ${course.image ? 'text-white/70' : 'text-gray-400 group-hover/stat:text-brand-blue'}`} />
                                                                {formatNumber(course.views)}
                                                            </div>
                                                            <div className={`text-[10px] font-bold uppercase mt-0.5 tracking-wider ${course.image ? 'text-white/60' : 'text-gray-400'}`}>Views</div>
                                                        </div>
                                                        <div className={`text-center group/stat border-l ${course.image ? 'border-white/20' : 'border-gray-100'}`}>
                                                            <div className="text-lg font-black flex items-center justify-center gap-1.5">
                                                                <ListIcon className={`w-4 h-4 ${course.image ? 'text-white/70' : 'text-gray-400 group-hover/stat:text-brand-blue'}`} />
                                                                {course.totalLessons}
                                                            </div>
                                                            <div className={`text-[10px] font-bold uppercase mt-0.5 tracking-wider ${course.image ? 'text-white/60' : 'text-gray-400'}`}>Lessons</div>
                                                        </div>
                                                        <div className={`text-center group/stat border-l ${course.image ? 'border-white/20' : 'border-gray-100'}`}>
                                                            <div className="text-lg font-black flex items-center justify-center gap-1.5">
                                                                <Clock className={`w-4 h-4 ${course.image ? 'text-white/70' : 'text-gray-400 group-hover/stat:text-brand-blue'}`} />
                                                                {course.duration}
                                                            </div>
                                                            <div className={`text-[10px] font-bold uppercase mt-0.5 tracking-wider ${course.image ? 'text-white/60' : 'text-gray-400'}`}>Duration</div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        <div key={course.id} onClick={() => setEditingCourse(course)} className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-6 group hover:shadow-md transition-all cursor-pointer">
                                            <div className="w-16 h-16 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl flex-shrink-0 flex items-center justify-center text-brand-blue overflow-hidden relative">
                                                {course.image ? (
                                                    <img src={course.image} alt={course.title} className="w-full h-full object-cover" />
                                                ) : (
                                                    <Video className="w-8 h-8" />
                                                )}
                                            </div>

                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-3 mb-1">
                                                    <h3 className="text-lg font-black text-gray-900 truncate">{course.title}</h3>
                                                    {course.status === 'published' && (
                                                        <span className="px-2 py-0.5 bg-brand-blue/10 text-brand-blue text-[9px] font-black uppercase tracking-widest rounded-full">
                                                            Published
                                                        </span>
                                                    )}
                                                </div>
                                                <div className="flex flex-wrap gap-2">
                                                    {course.tags.map((tag, tagIdx) => (
                                                        <span key={tagIdx} className="text-[10px] font-bold text-gray-500 bg-gray-50 px-2 py-0.5 rounded-md uppercase tracking-wide">
                                                            {tag}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-8 px-8 border-l border-gray-100">
                                                <div className="text-center w-16">
                                                    <div className="text-sm font-black text-gray-900">{formatNumber(course.views)}</div>
                                                    <div className="text-[9px] font-bold text-gray-400 uppercase">Views</div>
                                                </div>
                                                <div className="text-center w-16 border-l border-gray-50">
                                                    <div className="text-sm font-black text-gray-900">{course.totalLessons}</div>
                                                    <div className="text-[9px] font-bold text-gray-400 uppercase">Lessons</div>
                                                </div>
                                                <div className="text-center w-16 border-l border-gray-50">
                                                    <div className="text-sm font-black text-gray-900">{course.duration}</div>
                                                    <div className="text-[9px] font-bold text-gray-400 uppercase">Time</div>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-2 pl-4 border-l border-gray-100">
                                                <button
                                                    className="p-2 hover:bg-gray-50 rounded-lg text-gray-400 hover:text-brand-blue transition-colors"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setEditingCourse(course);
                                                    }}
                                                >
                                                    <Edit3 className="w-4 h-4" />
                                                </button>
                                                <button
                                                    className="p-2 hover:bg-gray-50 rounded-lg text-gray-400 hover:text-gray-900 transition-colors"
                                                    onClick={(e) => e.stopPropagation()}
                                                >
                                                    <Share2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>
                                    )
                                ))}
                            </div>
                        </>
                    )}
                </div>
            )}

            {/* --- REPORTING TAB --- */}
            {activeTab === 'reporting' && (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                    {/* Overview Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
                        {[
                            { id: 'all', label: 'Total Participants', value: reportingUsers.length, icon: Users, color: 'text-brand-blue', bg: 'bg-brand-blue/10' },
                            { id: 'pending', label: 'Yet to Start', value: reportingUsers.filter(u => u.status === 'pending').length, icon: Circle, color: 'text-gray-400', bg: 'bg-gray-100' },
                            { id: 'active', label: 'In Progress', value: reportingUsers.filter(u => u.status === 'active').length, icon: PlayCircle, color: 'text-orange-500', bg: 'bg-orange-100' },
                            { id: 'completed', label: 'Completed', value: reportingUsers.filter(u => u.status === 'completed').length, icon: CheckCircle, color: 'text-green-500', bg: 'bg-green-100' }
                        ].map((stat) => (
                            <div
                                key={stat.id}
                                onClick={() => setReportingFilter(stat.id as any)}
                                className={`cursor-pointer bg-white p-6 rounded-[2rem] border transition-all duration-300 ${reportingFilter === stat.id ? 'border-brand-blue ring-2 ring-brand-blue/20 shadow-lg' : 'border-gray-100 shadow-sm hover:shadow-md'}`}
                            >
                                <div className={`w-12 h-12 ${stat.bg} ${stat.color} rounded-2xl flex items-center justify-center mb-4`}>
                                    <stat.icon className="w-6 h-6" />
                                </div>
                                <div className="text-3xl font-black text-gray-900 tracking-tight mb-1">{stat.value}</div>
                                <div className="text-[10px] font-black text-gray-400 uppercase tracking-[0.15em]">{stat.label}</div>
                            </div>
                        ))}
                    </div>

                    <div className="flex gap-6">
                        {/* Users Table */}
                        <div className="flex-1 bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
                            <div className="p-8 border-b border-gray-100 flex justify-between items-center">
                                <h3 className="text-xl font-black tracking-tight">Participant Report</h3>
                                <button
                                    onClick={() => setShowColumnPanel(!showColumnPanel)}
                                    className={`p-2 rounded-xl transition-all ${showColumnPanel ? 'bg-brand-blue text-white' : 'hover:bg-gray-50 text-gray-400'}`}
                                >
                                    <Filter className="w-5 h-5" />
                                </button>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="bg-gray-50/50">
                                            <th className="px-8 py-4 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">User</th>
                                            <th className="px-8 py-4 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Status</th>
                                            {visibleColumns.progress && <th className="px-8 py-4 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Progress</th>}
                                            {visibleColumns.enrolledDate && <th className="px-8 py-4 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Enrolled</th>}
                                            {visibleColumns.lastActive && <th className="px-8 py-4 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Last Active</th>}
                                            {visibleColumns.timeSpent && <th className="px-8 py-4 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Time Spent</th>}
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-50">
                                        {getFilteredUsers().map(user => (
                                            <tr key={user.id} className="hover:bg-gray-50/50 transition-colors">
                                                <td className="px-8 py-4">
                                                    <div className="font-bold text-sm text-gray-900">{user.name}</div>
                                                </td>
                                                <td className="px-8 py-4">
                                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide
                                                        ${user.status === 'completed' ? 'bg-green-100 text-green-700' :
                                                            user.status === 'active' ? 'bg-orange-100 text-orange-700' :
                                                                'bg-gray-100 text-gray-500'}`}>
                                                        {user.status}
                                                    </span>
                                                </td>
                                                {visibleColumns.progress && (
                                                    <td className="px-8 py-4">
                                                        <div className="w-24 bg-gray-100 rounded-full h-1.5 overflow-hidden">
                                                            <div className="bg-brand-blue h-full rounded-full" style={{ width: `${user.progress}%` }}></div>
                                                        </div>
                                                        <div className="text-[10px] font-bold text-gray-400 mt-1">{user.progress}%</div>
                                                    </td>
                                                )}
                                                {visibleColumns.enrolledDate && <td className="px-8 py-4 text-xs font-medium text-gray-500">{user.enrolledDate}</td>}
                                                {visibleColumns.lastActive && <td className="px-8 py-4 text-xs font-medium text-gray-500">{user.lastActive}</td>}
                                                {visibleColumns.timeSpent && <td className="px-8 py-4 text-xs font-medium text-gray-500">{user.timeSpent}</td>}
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Side Panel for Columns */}
                        {showColumnPanel && (
                            <div className="w-64 bg-white rounded-[2rem] border border-gray-100 shadow-sm p-6 animate-in slide-in-from-right-4">
                                <h4 className="text-sm font-bold text-gray-900 mb-4">View Options</h4>
                                <div className="space-y-3">
                                    {Object.entries(visibleColumns).map(([key, isVisible]) => (
                                        <label key={key} className="flex items-center gap-3 cursor-pointer group">
                                            <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${isVisible ? 'bg-brand-blue border-brand-blue' : 'border-gray-200 bg-white'}`}>
                                                {isVisible && <CheckCircle className="w-3.5 h-3.5 text-white" />}
                                            </div>
                                            <input
                                                type="checkbox"
                                                className="hidden"
                                                checked={isVisible}
                                                onChange={() => setVisibleColumns(prev => ({ ...prev, [key]: !prev[key as keyof typeof visibleColumns] }))}
                                            />
                                            <span className="text-xs font-bold text-gray-600 group-hover:text-gray-900 capitalize">
                                                {key.replace(/([A-Z])/g, ' $1').trim()}
                                            </span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* --- PROFILE TAB --- */}
            {activeTab === 'profile' && (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="max-w-4xl mx-auto">
                        <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
                            {/* Profile Header Background */}
                            <div className="h-48 bg-gradient-to-r from-brand-blue/20 via-brand-indigo/10 to-brand-blue/20 relative">
                                <div className="absolute inset-0 bg-grid opacity-10"></div>
                            </div>

                            <div className="px-12 pb-12 relative">
                                {/* Profile Picture Overlay */}
                                <div className="absolute -top-16 left-12">
                                    <div className="relative group">
                                        <div className="w-32 h-32 bg-white rounded-3xl p-1 shadow-xl">
                                            <div className="w-full h-full bg-brand-blue/10 rounded-2xl flex items-center justify-center font-black text-4xl text-brand-blue border border-brand-blue/20">
                                                {profile?.name?.[0] || 'I'}
                                            </div>
                                        </div>
                                        <button className="absolute bottom-2 right-2 p-2 bg-black text-white rounded-xl shadow-lg opacity-0 group-hover:opacity-100 transition-all hover:scale-110">
                                            <Camera className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>

                                <div className="pt-20 flex flex-col md:flex-row md:items-center justify-between gap-6">
                                    <div>
                                        <h2 className="text-3xl font-black text-gray-900 tracking-tight mb-2">
                                            {profileLoading ? 'Loading...' : profile?.name || 'Instructor Name'}
                                        </h2>
                                        <div className="flex items-center gap-4 text-gray-400 font-bold text-xs uppercase tracking-widest">
                                            <span className="flex items-center gap-1.5">
                                                <User className="w-3.5 h-3.5" />
                                                {profile?.handle || '@instructor'}
                                            </span>
                                            <span className="flex items-center gap-1.5">
                                                <Shield className="w-3.5 h-3.5" />
                                                Verified Educator
                                            </span>
                                        </div>
                                    </div>
                                    <button className="px-8 py-3 bg-black text-white rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-gray-900 transition-all active:scale-95 shadow-lg shadow-gray-200">
                                        Edit Profile
                                    </button>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12 pt-12 border-t border-gray-50">
                                    <div className="space-y-6">
                                        <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Contact Information</h4>
                                        <div className="space-y-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center text-gray-400">
                                                    <Mail className="w-4 h-4" />
                                                </div>
                                                <div>
                                                    <div className="text-[9px] font-black text-gray-400 uppercase tracking-tighter">Email</div>
                                                    <div className="text-sm font-bold text-gray-900">{profile?.email || 'N/A'}</div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="col-span-2 space-y-6">
                                        <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">About Me</h4>
                                        <div className="p-6 bg-gray-50 rounded-2xl">
                                            <p className="text-sm text-gray-500 font-medium leading-relaxed">
                                                Professional educator focused on delivering high-quality digital learning experiences. Dedicated to transforming complex topics into accessible mastery programs.
                                            </p>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="p-6 bg-brand-blue/5 rounded-2xl border border-brand-blue/10">
                                                <div className="text-2xl font-black text-brand-blue mb-1">{courses.length}</div>
                                                <div className="text-[9px] font-black text-brand-blue/60 uppercase tracking-widest">Active Courses</div>
                                            </div>
                                            <div className="p-6 bg-brand-indigo/5 rounded-2xl border border-brand-indigo/10">
                                                <div className="text-2xl font-black text-brand-indigo mb-1">{formatNumber(courses.reduce((acc, c) => acc + c.views, 0))}</div>
                                                <div className="text-[9px] font-black text-brand-indigo/60 uppercase tracking-widest">Total Students</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}





            {/* Create Course Modal */}
            {showCreateModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[200] flex items-center justify-center p-4">
                    <div className="bg-white p-8 rounded-[2rem] shadow-2xl w-full max-w-md animate-in zoom-in-95 duration-200">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-2xl font-black text-gray-900 tracking-tight">Create New Course</h3>
                            <button onClick={() => setShowCreateModal(false)}><X className="w-6 h-6 text-gray-400 hover:text-gray-600 transition-colors" /></button>
                        </div>
                        <div className="space-y-6">
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Course Title</label>
                                <input
                                    autoFocus
                                    type="text"
                                    placeholder="e.g. Advanced React Patterns"
                                    className="w-full px-5 py-4 bg-gray-50 rounded-xl font-bold text-lg focus:outline-none focus:ring-2 focus:ring-brand-blue/20 border-transparent focus:bg-white transition-all"
                                    value={newCourseTitle}
                                    onChange={(e) => setNewCourseTitle(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && confirmCreateCourse()}
                                />
                            </div>
                            <div className="flex gap-3">
                                <button
                                    onClick={() => setShowCreateModal(false)}
                                    className="flex-1 py-3.5 font-bold text-gray-500 hover:bg-gray-50 rounded-xl transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={confirmCreateCourse}
                                    disabled={!newCourseTitle.trim()}
                                    className="flex-1 py-3.5 bg-brand-blue text-white font-bold rounded-xl shadow-lg shadow-brand-blue/20 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Create Course
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Course Editor Overlay */}
            {editingCourse && (
                <div className="fixed inset-0 z-[200]">
                    <CourseEditor
                        course={editingCourse}
                        onClose={() => setEditingCourse(null)}
                        onSave={saveCourse}
                    />
                </div>
            )}
        </DashboardLayout>
    );
};
