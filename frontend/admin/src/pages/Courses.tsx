import { useState } from 'react';
import { Search, Plus, LayoutGrid, List, Eye, Clock, BookOpen, Edit, Share2, MoreVertical, Filter, Download, X, Check } from 'lucide-react';

// Types
interface Course {
    id: number;
    title: string;
    description: string;
    tags: string[];
    views: number;
    lessons: number;
    duration: string;
    status: 'published' | 'draft' | 'archived';
    lastUpdated: string;
    author: string;
}

// Mock Data
const mockCourses: Course[] = [
    {
        id: 1,
        title: 'Introduction to React',
        description: 'Learn the basics of React, including components, props, and state.',
        tags: ['Frontend', 'JavaScript'],
        views: 1250,
        lessons: 24,
        duration: '8h 30m',
        status: 'published',
        lastUpdated: '2 hours ago',
        author: 'Sarah Jenkins'
    },
    {
        id: 2,
        title: 'Advanced TypeScript',
        description: 'Master advanced TypeScript concepts like generics, decorators, and utility types.',
        tags: ['Typescript', 'Programming'],
        views: 890,
        lessons: 18,
        duration: '6h 15m',
        status: 'draft',
        lastUpdated: '5 mins ago',
        author: 'Mike Chen'
    },
    {
        id: 3,
        title: 'Node.js Fundamentals',
        description: 'Build scalable network applications with Node.js.',
        tags: ['Backend', 'JavaScript'],
        views: 2100,
        lessons: 32,
        duration: '12h 45m',
        status: 'published',
        lastUpdated: '1 day ago',
        author: 'Sarah Jenkins'
    },
    {
        id: 4,
        title: 'UI/UX Design Principles',
        description: 'Fundamental principles of creating user-friendly interfaces.',
        tags: ['Design', 'UI/UX'],
        views: 450,
        lessons: 15,
        duration: '5h 20m',
        status: 'archived',
        lastUpdated: '1 week ago',
        author: 'Jessica Lee'
    },
    {
        id: 5,
        title: 'Next.js 14 Masterclass',
        description: 'Complete guide to building full-stack apps with Next.js 14.',
        tags: ['Frontend', 'React', 'Next.js'],
        views: 3200,
        lessons: 45,
        duration: '14h 20m',
        status: 'published',
        lastUpdated: 'Just now',
        author: 'Mike Chen'
    },
    {
        id: 6,
        title: 'Python for Data Science',
        description: 'Analyze data with Python, Pandas, and NumPy.',
        tags: ['Python', 'Data Science'],
        views: 1500,
        lessons: 28,
        duration: '10h 10m',
        status: 'published',
        lastUpdated: '3 days ago',
        author: 'David Kim'
    }
];

const Courses = () => {
    const [viewMode, setViewMode] = useState<'kanban' | 'list'>('kanban');
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState<'all' | 'published' | 'draft' | 'archived'>('all');

    // New Course Modal State
    const [showNewCourseModal, setShowNewCourseModal] = useState(false);
    const [newCourseTitle, setNewCourseTitle] = useState('');
    const [newCourseDescription, setNewCourseDescription] = useState('');

    const [courses, setCourses] = useState<Course[]>(mockCourses);

    const filteredCourses = courses.filter((course) => {
        const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            course.description.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = statusFilter === 'all' || course.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const handleCreateCourse = () => {
        if (!newCourseTitle.trim()) return;

        const newCourse: Course = {
            id: courses.length + 1,
            title: newCourseTitle,
            description: newCourseDescription || 'No description provided.',
            tags: ['New'],
            views: 0,
            lessons: 0,
            duration: '0h 0m',
            status: 'draft',
            lastUpdated: 'Just now',
            author: 'You'
        };

        setCourses([newCourse, ...courses]);
        setNewCourseTitle('');
        setNewCourseDescription('');
        setShowNewCourseModal(false);
    };

    return (
        <div className="min-h-screen bg-gray-50/50">
            {/* Header */}
            <header className="bg-white/80 backdrop-blur-xl border-b border-gray-200 sticky top-0 z-40 transition-all duration-200">
                <div className="max-w-7xl mx-auto px-6 py-4">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                            <h1 className="text-xl font-bold text-gray-900 tracking-tight">All Courses</h1>
                            <p className="text-xs text-gray-500 font-medium mt-0.5">Manage your entire course catalog</p>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="relative group">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 transition-colors group-focus-within:text-[#0ea5e9]" />
                                <input
                                    type="text"
                                    placeholder="Search courses..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0ea5e9]/20 focus:border-[#0ea5e9] w-64 transition-all"
                                />
                            </div>
                            <button
                                onClick={() => setShowNewCourseModal(true)}
                                className="btn-primary flex items-center gap-2 px-4 py-2 text-sm shadow-blue-500/20"
                            >
                                <Plus className="w-4 h-4" />
                                <span>Create New</span>
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            <div className="max-w-7xl mx-auto px-6 py-8">
                {/* Filters and View Toggle */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                    <div className="flex items-center gap-2">
                        {['All', 'Published', 'Draft', 'Archived'].map((filter) => {
                            const val = filter.toLowerCase();
                            const isActive = statusFilter === val;
                            return (
                                <button
                                    key={filter}
                                    onClick={() => setStatusFilter(val as any)}
                                    className={`text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-lg border transition-all ${isActive
                                        ? 'bg-gray-900 text-white border-gray-900'
                                        : 'bg-white text-gray-500 border-gray-200 hover:border-gray-300'
                                        }`}
                                >
                                    {filter}
                                </button>
                            );
                        })}
                    </div>

                    <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1 bg-white p-1 rounded-lg border border-gray-200">
                            <button
                                onClick={() => setViewMode('kanban')}
                                className={`p-1.5 rounded-md transition-all ${viewMode === 'kanban' ? 'bg-gray-100 text-gray-900' : 'text-gray-400 hover:text-gray-600'}`}
                            >
                                <LayoutGrid className="w-4 h-4" />
                            </button>
                            <button
                                onClick={() => setViewMode('list')}
                                className={`p-1.5 rounded-md transition-all ${viewMode === 'list' ? 'bg-gray-100 text-gray-900' : 'text-gray-400 hover:text-gray-600'}`}
                            >
                                <List className="w-4 h-4" />
                            </button>
                        </div>
                        <button className="p-2 bg-white border border-gray-200 rounded-lg text-gray-500 hover:text-gray-700">
                            <Filter className="w-4 h-4" />
                        </button>
                        <button className="p-2 bg-white border border-gray-200 rounded-lg text-gray-500 hover:text-gray-700">
                            <Download className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                {/* Course Grid/List */}
                {viewMode === 'kanban' ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredCourses.map((course) => (
                            <div key={course.id} className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all group overflow-hidden flex flex-col">
                                <div className="p-5 flex-1">
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="flex flex-wrap gap-1.5">
                                            {course.tags.slice(0, 2).map((tag, index) => (
                                                <span key={index} className="px-2 py-0.5 rounded-md bg-blue-50 text-blue-600 text-[10px] font-bold uppercase tracking-wide border border-blue-100">
                                                    {tag}
                                                </span>
                                            ))}
                                            {course.tags.length > 2 && (
                                                <span className="px-2 py-0.5 rounded-md bg-gray-50 text-gray-500 text-[10px] font-bold border border-gray-100">+{course.tags.length - 2}</span>
                                            )}
                                        </div>
                                        <button className="text-gray-400 hover:text-gray-600">
                                            <MoreVertical className="w-4 h-4" />
                                        </button>
                                    </div>

                                    <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-[#0ea5e9] transition-colors">{course.title}</h3>
                                    <p className="text-xs text-gray-500 mb-4 line-clamp-2">{course.description}</p>

                                    <div className="flex items-center gap-4 text-xs font-medium text-gray-500 mb-4">
                                        <div className="flex items-center gap-1">
                                            <Clock className="w-3.5 h-3.5" />
                                            {course.duration}
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <BookOpen className="w-3.5 h-3.5" />
                                            {course.lessons} Lessons
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <Eye className="w-3.5 h-3.5" />
                                            {course.views.toLocaleString()}
                                        </div>
                                    </div>

                                    <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center text-[10px] font-bold text-gray-600">
                                                {course.author.charAt(0)}
                                            </div>
                                            <span className="text-xs text-gray-500">{course.author}</span>
                                        </div>
                                        <span className={`flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full ${course.status === 'published' ? 'bg-green-50 text-green-600' :
                                            course.status === 'draft' ? 'bg-yellow-50 text-yellow-600' :
                                                'bg-gray-100 text-gray-500'
                                            }`}>
                                            <span className={`w-1.5 h-1.5 rounded-full ${course.status === 'published' ? 'bg-green-500' :
                                                course.status === 'draft' ? 'bg-yellow-500' :
                                                    'bg-gray-400'
                                                }`}></span>
                                            {course.status}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50 border-b border-gray-200">
                                    <tr>
                                        <th className="text-left py-3 px-6 font-bold text-gray-500 text-[10px] uppercase tracking-widest">Course Name</th>
                                        <th className="text-left py-3 px-6 font-bold text-gray-500 text-[10px] uppercase tracking-widest">Status</th>
                                        <th className="text-left py-3 px-6 font-bold text-gray-500 text-[10px] uppercase tracking-widest">Stats</th>
                                        <th className="text-left py-3 px-6 font-bold text-gray-500 text-[10px] uppercase tracking-widest">Last Updated</th>
                                        <th className="text-right py-3 px-6 font-bold text-gray-500 text-[10px] uppercase tracking-widest">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {filteredCourses.map((course) => (
                                        <tr key={course.id} className="hover:bg-gray-50 transition-colors">
                                            <td className="py-4 px-6">
                                                <div>
                                                    <div className="font-bold text-gray-900 text-sm hover:text-[#0ea5e9] cursor-pointer transition-colors">{course.title}</div>
                                                    <div className="text-xs text-gray-500 mt-0.5">{course.author}</div>
                                                </div>
                                            </td>
                                            <td className="py-4 px-6">
                                                <span className={`inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full ${course.status === 'published' ? 'bg-green-50 text-green-600' :
                                                    course.status === 'draft' ? 'bg-yellow-50 text-yellow-600' :
                                                        'bg-gray-100 text-gray-500'
                                                    }`}>
                                                    <span className={`w-1.5 h-1.5 rounded-full ${course.status === 'published' ? 'bg-green-500' :
                                                        course.status === 'draft' ? 'bg-yellow-500' :
                                                            'bg-gray-400'
                                                        }`}></span>
                                                    {course.status}
                                                </span>
                                            </td>
                                            <td className="py-4 px-6">
                                                <div className="flex items-center gap-4 text-xs font-medium text-gray-600">
                                                    <span className="flex items-center gap-1"><Eye className="w-3 h-3 text-gray-400" /> {course.views.toLocaleString()}</span>
                                                    <span className="flex items-center gap-1"><BookOpen className="w-3 h-3 text-gray-400" /> {course.lessons}</span>
                                                </div>
                                            </td>
                                            <td className="py-4 px-6 text-xs text-gray-500 font-medium">
                                                {course.lastUpdated}
                                            </td>
                                            <td className="py-4 px-6 text-right">
                                                <div className="flex justify-end gap-2">
                                                    <button className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-[#0ea5e9] transition-colors">
                                                        <Edit className="w-4 h-4" />
                                                    </button>
                                                    <button className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-[#0ea5e9] transition-colors">
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
            </div>

            {/* New Course Modal */}
            {showNewCourseModal && (
                <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
                    <div className="bg-white rounded-2xl p-0 w-full max-w-lg border border-gray-100 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
                        <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                            <h3 className="text-lg font-bold text-gray-900">Add New Course</h3>
                            <button onClick={() => setShowNewCourseModal(false)} className="text-gray-400 hover:text-red-500 transition-colors">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="p-6 space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Course Title</label>
                                <input
                                    type="text"
                                    value={newCourseTitle}
                                    onChange={(e) => setNewCourseTitle(e.target.value)}
                                    placeholder="e.g., Advanced React Patterns"
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-[#0ea5e9]/10 focus:border-[#0ea5e9] text-gray-900 placeholder:text-gray-400 font-bold transition-all"
                                    autoFocus
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Description</label>
                                <textarea
                                    value={newCourseDescription}
                                    onChange={(e) => setNewCourseDescription(e.target.value)}
                                    placeholder="Brief description of the course content..."
                                    rows={3}
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-[#0ea5e9]/10 focus:border-[#0ea5e9] text-gray-900 placeholder:text-gray-400 font-medium transition-all resize-none"
                                />
                            </div>
                        </div>
                        <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-end gap-3">
                            <button
                                onClick={() => setShowNewCourseModal(false)}
                                className="px-5 py-2.5 rounded-xl font-bold text-sm text-gray-600 hover:bg-white hover:text-gray-900 border border-transparent hover:border-gray-200 transition-all"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleCreateCourse}
                                className="px-5 py-2.5 rounded-xl font-bold text-sm text-white bg-[#0ea5e9] hover:bg-[#0284c7] shadow-lg shadow-blue-500/30 hover:shadow-blue-500/40 active:scale-95 transition-all flex items-center gap-2"
                                disabled={!newCourseTitle.trim()}
                            >
                                <Check className="w-4 h-4" />
                                Create Course
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Courses;
