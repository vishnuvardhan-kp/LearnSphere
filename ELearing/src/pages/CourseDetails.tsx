
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock, BookOpen, Eye, User, Calendar, PlayCircle, X, Check, FileQuestion } from 'lucide-react';
import type { Course } from '../types';

const CourseDetails = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const [course, setCourse] = useState<Course | undefined>(undefined);
    const [instructors, setInstructors] = useState<any[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            if (!id) return;
            try {
                // Fetch Course
                const courseRes = await fetch(`http://127.0.0.1:5000/api/courses/${id}`);
                if (courseRes.ok) {
                    const data = await courseRes.json();
                    setCourse({
                        id: Number(data.id),
                        title: data.title,
                        description: data.description,
                        tags: data.tags || [],
                        views: data.views || 0,
                        lessons: data.lessons || 0,
                        duration: data.duration || '0 hours',
                        status: data.status,
                        lastUpdated: new Date(data.last_updated).toLocaleDateString(),
                        author: data.author,
                        videoLink: data.video_link,
                        modules: data.modules || []
                    });
                }

                // Fetch Instructors
                const instructorsRes = await fetch('http://127.0.0.1:5000/api/instructors');
                if (instructorsRes.ok) {
                    const insData = await instructorsRes.json();
                    setInstructors(insData);
                }
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };
        fetchData();
    }, [id]);

    const [showEditModal, setShowEditModal] = useState(false);
    const [editForm, setEditForm] = useState({
        title: '',
        description: '',
        author: '',
        duration: '',
        lessons: 0,
        tags: '',
        status: 'draft' as 'published' | 'draft' | 'archived',
        videoLink: ''
    });

    const [activeTab, setActiveTab] = useState('curriculum');

    const openEditModal = () => {
        if (!course) return;
        setEditForm({
            title: course.title,
            description: course.description,
            author: course.author,
            duration: course.duration,
            lessons: course.lessons,
            tags: course.tags.join(', '),
            status: course.status,
            videoLink: course.videoLink || ''
        });
        setShowEditModal(true);
    };

    const handleSaveChanges = async () => {
        if (!course) return;

        const updatedData = {
            title: editForm.title,
            description: editForm.description,
            author: editForm.author,
            duration: editForm.duration,
            tags: JSON.stringify(editForm.tags.split(',').map(t => t.trim()).filter(Boolean)),
            status: editForm.status,
            modules: JSON.stringify(course.modules),
            image: '' // Not currently in edit form but required by backend
        };

        try {
            const response = await fetch(`http://127.0.0.1:5000/api/courses/${course.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatedData)
            });

            if (response.ok) {
                setCourse({
                    ...course,
                    title: editForm.title,
                    description: editForm.description,
                    author: editForm.author,
                    duration: editForm.duration,
                    tags: editForm.tags.split(',').map(t => t.trim()).filter(Boolean),
                    status: editForm.status
                });
                setShowEditModal(false);
            } else {
                alert('Failed to save changes');
            }
        } catch (error) {
            console.error('Error saving course:', error);
            alert('Error connecting to server');
        }
    };



    const handlePublishToggle = () => {
        if (!course) return;
        setCourse({
            ...course,
            status: course.status === 'published' ? 'draft' : 'published'
        });
    };

    const handleDelete = async () => {
        if (!course) return;
        if (confirm('Are you sure you want to delete this course? This action cannot be undone.')) {
            try {
                const response = await fetch(`http://127.0.0.1:5000/api/courses/${course.id}`, {
                    method: 'DELETE'
                });
                if (response.ok) {
                    navigate('/courses');
                } else {
                    alert('Failed to delete course');
                }
            } catch (err) {
                console.error('Error deleting course:', err);
                alert('An error occurred while deleting the course.');
            }
        }
    };

    if (!course) {
        return (
            <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Course Not Found</h2>
                <button
                    onClick={() => navigate('/courses')}
                    className="text-[#0ea5e9] hover:underline flex items-center gap-2"
                >
                    <ArrowLeft className="w-4 h-4" /> Back to Courses
                </button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50/50 pb-20">
            {/* Header / Banner */}
            <div className="bg-white border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-6 py-6 sm:py-10">
                    <button
                        onClick={() => navigate('/courses')}
                        className="text-gray-500 hover:text-gray-900 flex items-center gap-2 text-sm font-medium mb-6 transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4" /> Back to Courses
                    </button>

                    <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
                        <div className="flex-1">
                            <div className="flex flex-wrap gap-2 mb-4">
                                {course.tags.map((tag, index) => (
                                    <span key={index} className="px-2.5 py-1 rounded-md bg-blue-50 text-blue-600 text-xs font-bold uppercase tracking-wide border border-blue-100">
                                        {tag}
                                    </span>
                                ))}
                                <span className={`px-2.5 py-1 rounded-md text-xs font-bold uppercase tracking-wide border ${course.status === 'published' ? 'bg-green-50 text-green-600 border-green-100' :
                                    course.status === 'draft' ? 'bg-yellow-50 text-yellow-600 border-yellow-100' :
                                        'bg-gray-100 text-gray-500 border-gray-200'
                                    }`}>
                                    {course.status}
                                </span>
                            </div>

                            <h1 className="text-3xl sm:text-4xl font-black text-gray-900 mb-4 tracking-tight">{course.title}</h1>
                            <p className="text-lg text-gray-600 max-w-3xl leading-relaxed">{course.description}</p>

                            <div className="flex flex-wrap items-center gap-6 mt-8 text-sm font-medium text-gray-500">
                                <div className="flex items-center gap-2">
                                    <User className="w-4 h-4 text-gray-400" />
                                    <span className="text-gray-900">{course.author}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Calendar className="w-4 h-4 text-gray-400" />
                                    <span>Updated {course.lastUpdated}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Eye className="w-4 h-4 text-gray-400" />
                                    <span>{course.views.toLocaleString()} views</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex-shrink-0 w-full lg:w-80">
                            <div className="bg-white rounded-2xl border border-gray-200 shadow-xl shadow-gray-200/50 p-6">
                                <div className="space-y-4 mb-6">
                                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-100">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-white rounded-lg border border-gray-200 shadow-sm text-gray-500">
                                                <Clock className="w-4 h-4" />
                                            </div>
                                            <span className="text-sm font-bold text-gray-600">Duration</span>
                                        </div>
                                        <span className="text-sm font-bold text-gray-900">{course.duration}</span>
                                    </div>
                                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-100">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-white rounded-lg border border-gray-200 shadow-sm text-gray-500">
                                                <BookOpen className="w-4 h-4" />
                                            </div>
                                            <span className="text-sm font-bold text-gray-600">Lessons</span>
                                        </div>
                                        <span className="text-sm font-bold text-gray-900">{course.lessons}</span>
                                    </div>
                                </div>

                                {course.videoLink && (
                                    <a
                                        href={course.videoLink}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="w-full py-3 px-4 bg-red-500 hover:bg-red-600 text-white font-bold rounded-xl shadow-lg shadow-red-500/30 transition-all active:scale-95 flex items-center justify-center gap-2 mb-3"
                                    >
                                        <PlayCircle className="w-5 h-5" />
                                        Watch Course Video
                                    </a>
                                )}

                                <button
                                    onClick={openEditModal}
                                    className="w-full py-3 px-4 bg-[#0ea5e9] hover:bg-[#0284c7] text-white font-bold rounded-xl shadow-lg shadow-blue-500/30 transition-all active:scale-95 flex items-center justify-center gap-2"
                                >
                                    Edit Course Content
                                </button>
                                <a
                                    href={`http://localhost:5174/company/course/${course.id}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-full py-3 px-4 bg-gray-900 hover:bg-black text-white font-bold rounded-xl shadow-lg shadow-gray-900/20 transition-all active:scale-95 flex items-center justify-center gap-2 mt-3"
                                >
                                    <span>🎓</span>
                                    Enroll & View as student
                                </a>
                                <div className="grid grid-cols-2 gap-3 mt-3">
                                    <button
                                        onClick={handlePublishToggle}
                                        className={`py-2.5 px-4 rounded-xl font-bold text-sm shadow-sm transition-all flex items-center justify-center gap-2 border ${course.status === 'published'
                                            ? 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
                                            : 'bg-green-500 border-transparent text-white hover:bg-green-600 shadow-green-500/20'
                                            }`}
                                    >
                                        <span>🌐</span>
                                        {course.status === 'published' ? 'Unpublish' : 'Publish'}
                                    </button>
                                    <button
                                        onClick={handleDelete}
                                        className="py-2.5 px-4 bg-white border border-red-100 text-red-600 hover:bg-red-50 hover:border-red-200 font-bold rounded-xl shadow-sm transition-all flex items-center justify-center gap-2"
                                    >
                                        <span>🗑</span>
                                        Delete
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Tabs Navigation */}
            <div className="bg-white border-b border-gray-200 sticky top-[73px] z-30">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="flex items-center gap-8 overflow-x-auto no-scrollbar">
                        {['curriculum', 'overview', 'students', 'reviews'].map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`py-4 text-sm font-bold border-b-2 transition-all capitalize whitespace-nowrap ${activeTab === tab
                                    ? 'border-[#0ea5e9] text-[#0ea5e9]'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                    }`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Content Tabs / Sections */}
            <div className="max-w-7xl mx-auto px-6 py-10">
                {activeTab === 'curriculum' && (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-2 space-y-8">
                            <div>
                                <div className="flex items-center justify-between mb-4">
                                    <h2 className="text-xl font-bold text-gray-900">Course Content</h2>
                                    <button
                                        onClick={() => navigate(`/courses/${id}/content`)}
                                        className="px-4 py-2 bg-gray-50 text-gray-700 hover:bg-gray-100 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-colors border border-gray-200"
                                    >
                                        View All
                                    </button>
                                </div>
                                <div className="bg-white rounded-xl border border-gray-200 overflow-hidden space-y-2 p-2">
                                    {course.modules && course.modules.length > 0 ? (
                                        course.modules.map((module) => (
                                            <div key={module.id} className="border border-gray-100 rounded-lg overflow-hidden">
                                                <div className="px-4 py-3 bg-gray-50/50 border-b border-gray-200/50 font-bold text-sm text-gray-700 flex justify-between items-center">
                                                    <span>{module.title || 'Untitled Module'}</span>
                                                    <span className="text-[10px] uppercase font-bold text-gray-400">{module.lessons.length} Lessons</span>
                                                </div>
                                                <div className="divide-y divide-gray-100">
                                                    {module.lessons.map((lesson) => (
                                                        <button
                                                            key={lesson.id}
                                                            onClick={() => {
                                                                if (lesson.type === 'video' && lesson.videoLink) {
                                                                    navigate(`/courses/${id}/content`, {
                                                                        state: {
                                                                            autoPlayVideo: {
                                                                                title: lesson.title,
                                                                                videoLink: lesson.videoLink,
                                                                                type: 'video',
                                                                                duration: lesson.duration,
                                                                                views: 0 // Mock or fetch if available
                                                                            }
                                                                        }
                                                                    });
                                                                } else {
                                                                    // Fallback or just navigate
                                                                    navigate(`/courses/${id}/content`);
                                                                }
                                                            }}
                                                            className="w-full flex items-center justify-between p-4 hover:bg-blue-50/50 transition-all duration-200 text-left group"
                                                        >
                                                            <div className="flex items-center gap-4">
                                                                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${lesson.type === 'video' ? 'bg-blue-50 text-[#0ea5e9]' : 'bg-purple-50 text-purple-600'
                                                                    }`}>
                                                                    {lesson.type === 'video' ? '▶' : '?'}
                                                                </div>
                                                                <div>
                                                                    <h4 className="text-sm font-bold text-gray-900 group-hover:text-[#0ea5e9] transition-colors">{lesson.title}</h4>
                                                                    <div className="flex items-center gap-2 mt-0.5">
                                                                        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded border ${lesson.type === 'video'
                                                                            ? 'bg-blue-50 text-blue-600 border-blue-100'
                                                                            : 'bg-purple-50 text-purple-600 border-purple-100'
                                                                            } uppercase`}>
                                                                            {lesson.type}
                                                                        </span>
                                                                        <span className="text-xs text-gray-500">{lesson.duration}</span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            {lesson.type === 'video' ? (
                                                                <PlayCircle className="w-5 h-5 text-gray-300 group-hover:text-[#0ea5e9] transition-colors" />
                                                            ) : (
                                                                <FileQuestion className="w-5 h-5 text-gray-300 group-hover:text-purple-600 transition-colors" />
                                                            )}
                                                        </button>
                                                    ))}
                                                    {module.lessons.length === 0 && (
                                                        <div className="p-4 text-center text-xs text-gray-400 font-medium">No lessons in this module</div>
                                                    )}
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="p-8 text-center text-gray-400">
                                            <p>No curriculum content available yet.</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div className="bg-white rounded-xl border border-gray-200 p-6">
                                <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide mb-4">Analytics</h3>
                                <div className="space-y-4">
                                    <div>
                                        <div className="flex justify-between text-xs font-medium mb-1.5">
                                            <span className="text-gray-500">Engagement Score</span>
                                            <span className="text-gray-900">85%</span>
                                        </div>
                                        <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
                                            <div className="bg-green-500 h-full rounded-full" style={{ width: '85%' }}></div>
                                        </div>
                                    </div>
                                    <div>
                                        <div className="flex justify-between text-xs font-medium mb-1.5">
                                            <span className="text-gray-500">Completion Rate</span>
                                            <span className="text-gray-900">42%</span>
                                        </div>
                                        <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
                                            <div className="bg-orange-500 h-full rounded-full" style={{ width: '42%' }}></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'overview' && (
                    <div className="bg-white rounded-xl border border-gray-200 p-8">
                        <h2 className="text-xl font-bold text-gray-900 mb-4">About this Course</h2>
                        <p className="text-gray-600 leading-relaxed mb-6">{course?.description}</p>

                        <h3 className="text-lg font-bold text-gray-900 mb-3">What you'll learn</h3>
                        <ul className="space-y-2 mb-6">
                            {[1, 2, 3, 4].map((i) => (
                                <li key={i} className="flex items-start gap-3">
                                    <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                                    <span className="text-gray-600">Comprehensive understanding of core concepts</span>
                                </li>
                            ))}
                        </ul>

                        <h3 className="text-lg font-bold text-gray-900 mb-3">Requirements</h3>
                        <ul className="list-disc list-inside text-gray-600 space-y-1">
                            <li>Basic understanding of programming</li>
                            <li>A computer with internet access</li>
                        </ul>
                    </div>
                )}

                {activeTab === 'students' && (
                    <div className="bg-white rounded-xl border border-gray-200 p-8 text-center py-20">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <User className="w-8 h-8 text-gray-400" />
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 mb-1">Students List</h3>
                        <p className="text-gray-500">View and manage enrolled students here.</p>
                    </div>
                )}

                {activeTab === 'reviews' && (
                    <div className="bg-white rounded-xl border border-gray-200 p-8 text-center py-20">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Eye className="w-8 h-8 text-gray-400" />
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 mb-1">Course Reviews</h3>
                        <p className="text-gray-500">Student feedback and ratings will appear here.</p>
                    </div>
                )}
            </div>

            {/* Edit Course Modal */}
            {showEditModal && (
                <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
                    <div className="bg-white rounded-2xl p-0 w-full max-w-lg border border-gray-100 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
                        <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                            <h3 className="text-lg font-bold text-gray-900">Edit Course</h3>
                            <button onClick={() => setShowEditModal(false)} className="text-gray-400 hover:text-red-500 transition-colors">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="p-6 space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Course Title</label>
                                <input
                                    type="text"
                                    value={editForm.title}
                                    onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-[#0ea5e9]/10 focus:border-[#0ea5e9] text-gray-900 font-bold transition-all"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Description</label>
                                <textarea
                                    value={editForm.description}
                                    onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                                    rows={3}
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-[#0ea5e9]/10 focus:border-[#0ea5e9] text-gray-900 font-medium transition-all resize-none"
                                />
                            </div>



                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Instructor</label>
                                <select
                                    value={editForm.author}
                                    onChange={(e) => setEditForm({ ...editForm, author: e.target.value })}
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-[#0ea5e9]/10 focus:border-[#0ea5e9] text-gray-900 font-medium transition-all"
                                >
                                    <option value="" disabled>Select an instructor ({instructors.length} loaded)</option>
                                    {instructors.map((ins) => (
                                        <option key={ins.id} value={ins.name}>{ins.name}</option>
                                    ))}
                                </select>
                            </div>



                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Tags (comma separated)</label>
                                <input
                                    type="text"
                                    value={editForm.tags}
                                    onChange={(e) => setEditForm({ ...editForm, tags: e.target.value })}
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-[#0ea5e9]/10 focus:border-[#0ea5e9] text-gray-900 font-medium transition-all"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Status</label>
                                <select
                                    value={editForm.status}
                                    onChange={(e) => setEditForm({ ...editForm, status: e.target.value as any })}
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-[#0ea5e9]/10 focus:border-[#0ea5e9] text-gray-900 font-medium transition-all"
                                >
                                    <option value="draft">Draft</option>
                                    <option value="published">Published</option>
                                    <option value="archived">Archived</option>
                                </select>
                            </div>
                        </div>
                        <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-end gap-3">
                            <button
                                onClick={() => setShowEditModal(false)}
                                className="px-5 py-2.5 rounded-xl font-bold text-sm text-gray-600 hover:bg-white hover:text-gray-900 border border-transparent hover:border-gray-200 transition-all"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSaveChanges}
                                className="px-5 py-2.5 rounded-xl font-bold text-sm text-white bg-[#0ea5e9] hover:bg-[#0284c7] shadow-lg shadow-blue-500/30 hover:shadow-blue-500/40 active:scale-95 transition-all flex items-center gap-2"
                            >
                                <Check className="w-4 h-4" />
                                Save Changes
                            </button>
                        </div>
                    </div>
                </div>
            )}




        </div>
    );
};

export default CourseDetails;
