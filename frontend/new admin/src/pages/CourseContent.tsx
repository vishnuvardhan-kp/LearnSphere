import { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, Plus, PlayCircle, FileQuestion, Edit, Trash2, Search, X, Check, Eye, Clock } from 'lucide-react';
import api from '../services/api';

const CourseContent = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const location = useLocation();

    const [searchQuery, setSearchQuery] = useState('');
    const [filterType, setFilterType] = useState<'all' | 'video' | 'quiz'>('all');

    // Add Content Modal State
    const [showAddModal, setShowAddModal] = useState(false);
    const [contentType, setContentType] = useState<'video' | 'quiz'>('video');
    const [newContentTitle, setNewContentTitle] = useState('');
    const [newContentUrl, setNewContentUrl] = useState('');
    const [newContentDuration, setNewContentDuration] = useState('');

    // Preview Modal State
    const [showPreviewModal, setShowPreviewModal] = useState(false);
    const [previewContent, setPreviewContent] = useState<any>(null);

    const [courseContent, setCourseContent] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    // Fetch Content
    useEffect(() => {
        const fetchContent = async () => {
            if (!id) return;
            try {
                const res = await api.get(`/courses/${id}`);
                const data = res.data;
                // Flatten modules to get all lessons
                const lessons: any[] = [];
                if (data.modules && Array.isArray(data.modules)) {
                    data.modules.forEach((mod: any) => {
                        if (mod.lessons && Array.isArray(mod.lessons)) {
                            lessons.push(...mod.lessons.map((l: any) => ({
                                id: l.id,
                                title: l.title,
                                type: l.type.toLowerCase(),
                                duration: l.duration || l.duration_minutes || '0m',
                                views: 0, // Not currently in API
                                videoLink: l.videoLink || l.content_url,
                                moduleId: mod.id,
                                moduleTitle: mod.title
                            })));
                        }
                    });
                }
                setCourseContent(lessons);

                // Handle Auto Play from State
                if (location.state?.autoPlayVideo) {
                    const videoDetails = location.state.autoPlayVideo;
                    setPreviewContent({
                        ...videoDetails,
                        type: videoDetails.type.toLowerCase()
                    });
                    setShowPreviewModal(true);
                    // Clear state to prevent reopening on refresh
                    window.history.replaceState({}, document.title);
                }

            } catch (error) {
                console.error("Error fetching course content:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchContent();
    }, [id, location.state]);


    const filteredContent = courseContent.filter((item) => {
        const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesType = filterType === 'all' || item.type === filterType;
        return matchesSearch && matchesType;
    });

    const handleDelete = async (itemId: number) => {
        if (confirm('Are you sure you want to delete this content?')) {
            try {
                await api.delete(`/courses/${id}/lessons/${itemId}`);
                setCourseContent(courseContent.filter(item => item.id !== itemId));
            } catch (error) {
                console.error('Error deleting content:', error);
                alert('Failed to delete content. Please try again.');
            }
        }
    };

    const openAddModal = () => {
        setNewContentTitle('');
        setNewContentUrl('');
        setNewContentDuration('');
        setContentType('video');
        setShowAddModal(true);
    };

    const handleAddContent = async () => {
        if (!newContentTitle.trim()) {
            alert('Please enter a title');
            return;
        }

        try {
            const lessonData = {
                title: newContentTitle,
                type: contentType.toUpperCase(),
                content_url: newContentUrl || '',
                duration_minutes: parseInt(newContentDuration) || (contentType === 'video' ? 10 : 5)
            };

            const res = await api.post(`/courses/${id}/lessons`, lessonData);
            const newLesson = res.data;

            const newContent = {
                id: newLesson.id || Math.max(...courseContent.map(c => c.id), 0) + 1,
                title: newContentTitle,
                type: contentType,
                duration: newContentDuration || (contentType === 'video' ? '10 mins' : '5 mins'),
                views: 0,
                videoLink: newContentUrl
            };

            setCourseContent([...courseContent, newContent]);
            setShowAddModal(false);
            setNewContentTitle('');
            setNewContentUrl('');
            setNewContentDuration('');
        } catch (error) {
            console.error('Error adding content:', error);
            alert('Failed to add content. Please try again.');
        }
    };

    const handlePreview = (item: any) => {
        setPreviewContent(item);
        setShowPreviewModal(true);
    };

    return (
        <div className="min-h-screen bg-gray-50/50">
            {/* Header */}
            <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
                <div className="max-w-7xl mx-auto px-6 py-4">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                            <button
                                onClick={() => navigate(`/courses/${id}`)}
                                className="text-gray-500 hover:text-gray-900 flex items-center gap-2 text-sm font-medium mb-2 transition-colors"
                            >
                                <ArrowLeft className="w-4 h-4" /> Back to Course Details
                            </button>
                            <h1 className="text-xl font-bold text-gray-900 tracking-tight">Course Content Management</h1>
                            <p className="text-xs text-gray-500 font-medium mt-0.5">Manage all videos and quizzes for this course</p>
                        </div>
                        <button
                            onClick={openAddModal}
                            className="btn-primary flex items-center gap-2 px-4 py-2 text-sm shadow-blue-500/20"
                        >
                            <Plus className="w-4 h-4" />
                            <span>Add Content</span>
                        </button>
                    </div>
                </div>
            </header>

            <div className="max-w-7xl mx-auto px-6 py-8">
                {/* Filters */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                    <div className="relative group flex-1 max-w-md">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 transition-colors group-focus-within:text-[#0ea5e9]" />
                        <input
                            type="text"
                            placeholder="Search content..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0ea5e9]/20 focus:border-[#0ea5e9] w-full transition-all"
                        />
                    </div>

                    <div className="flex items-center gap-2">
                        {['All', 'Video', 'Quiz'].map((filter) => {
                            const val = filter.toLowerCase() as 'all' | 'video' | 'quiz';
                            const isActive = filterType === val;
                            return (
                                <button
                                    key={filter}
                                    onClick={() => setFilterType(val)}
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
                </div>

                {/* Content List */}
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b border-gray-200">
                                <tr>
                                    <th className="text-left py-3 px-6 font-bold text-gray-500 text-[10px] uppercase tracking-widest">Content</th>
                                    <th className="text-left py-3 px-6 font-bold text-gray-500 text-[10px] uppercase tracking-widest">Type</th>
                                    <th className="text-left py-3 px-6 font-bold text-gray-500 text-[10px] uppercase tracking-widest">Duration</th>
                                    <th className="text-left py-3 px-6 font-bold text-gray-500 text-[10px] uppercase tracking-widest">Views</th>
                                    <th className="text-right py-3 px-6 font-bold text-gray-500 text-[10px] uppercase tracking-widest">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {loading ? (
                                    <tr>
                                        <td colSpan={5} className="py-8 text-center text-gray-500">Loading content...</td>
                                    </tr>
                                ) : filteredContent.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="py-12 text-center">
                                            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                                <FileQuestion className="w-8 h-8 text-gray-400" />
                                            </div>
                                            <h3 className="text-lg font-bold text-gray-900 mb-1">No Content Found</h3>
                                            <p className="text-gray-500">Try adjusting your search or filters</p>
                                        </td>
                                    </tr>
                                ) : (
                                    filteredContent.map((item) => (
                                        <tr
                                            key={item.id}
                                            onClick={() => handlePreview(item)}
                                            className="hover:bg-gray-50 transition-colors cursor-pointer"
                                        >
                                            <td className="py-4 px-6">
                                                <div className="flex items-center gap-3">
                                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${item.type === 'video' ? 'bg-blue-50 text-[#0ea5e9]' : 'bg-purple-50 text-purple-600'
                                                        }`}>
                                                        {item.type === 'video' ? (
                                                            <PlayCircle className="w-5 h-5" />
                                                        ) : (
                                                            <FileQuestion className="w-5 h-5" />
                                                        )}
                                                    </div>
                                                    <div>
                                                        <div className="font-bold text-gray-900 text-sm">{item.title}</div>
                                                        {item.moduleTitle && <div className="text-[10px] text-gray-400 uppercase tracking-wide">{item.moduleTitle}</div>}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="py-4 px-6">
                                                <span className={`text-[10px] font-bold px-2 py-1 rounded border uppercase ${item.type === 'video'
                                                    ? 'bg-blue-50 text-blue-600 border-blue-100'
                                                    : 'bg-purple-50 text-purple-600 border-purple-100'
                                                    }`}>
                                                    {item.type}
                                                </span>
                                            </td>
                                            <td className="py-4 px-6 text-sm text-gray-600 font-medium">{item.duration}</td>
                                            <td className="py-4 px-6 text-sm text-gray-600 font-medium">{item.views.toLocaleString()}</td>
                                            <td className="py-4 px-6 text-right">
                                                <div className="flex justify-end gap-2">
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handlePreview(item);
                                                        }}
                                                        className="p-1.5 hover:bg-blue-50 rounded-lg text-gray-400 hover:text-[#0ea5e9] transition-colors"
                                                        title="Preview"
                                                    >
                                                        <Eye className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            navigate(`/courses/${id}/content/${item.id}/edit`);
                                                        }}
                                                        className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-[#0ea5e9] transition-colors"
                                                        title="Edit"
                                                    >
                                                        <Edit className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleDelete(item.id);
                                                        }}
                                                        className="p-1.5 hover:bg-red-50 rounded-lg text-gray-400 hover:text-red-600 transition-colors"
                                                        title="Delete"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    )))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                    <div className="bg-white rounded-xl border border-gray-200 p-6">
                        <div className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">Total Content</div>
                        <div className="text-2xl font-black text-gray-900">{courseContent.length}</div>
                    </div>
                    <div className="bg-white rounded-xl border border-gray-200 p-6">
                        <div className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">Videos</div>
                        <div className="text-2xl font-black text-[#0ea5e9]">{courseContent.filter(c => c.type === 'video').length}</div>
                    </div>
                    <div className="bg-white rounded-xl border border-gray-200 p-6">
                        <div className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">Quizzes</div>
                        <div className="text-2xl font-black text-purple-600">{courseContent.filter(c => c.type === 'quiz').length}</div>
                    </div>
                </div>
            </div>

            {/* Preview Modal */}
            {showPreviewModal && previewContent && (
                <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
                    <div className="bg-white rounded-2xl p-0 w-full max-w-4xl border border-gray-100 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
                        <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                            <div className="flex items-center gap-3">
                                <div className={`p-2 rounded-lg ${previewContent.type === 'video' ? 'bg-blue-50 text-[#0ea5e9]' : 'bg-purple-50 text-purple-600'}`}>
                                    {previewContent.type === 'video' ? (
                                        <PlayCircle className="w-5 h-5" />
                                    ) : (
                                        <FileQuestion className="w-5 h-5" />
                                    )}
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-gray-900">{previewContent.title}</h3>
                                    <p className="text-xs text-gray-500 font-medium">
                                        {previewContent.type === 'video' ? 'Video Content' : 'Quiz Assessment'}
                                    </p>
                                </div>
                            </div>
                            <button onClick={() => setShowPreviewModal(false)} className="text-gray-400 hover:text-red-500 transition-colors">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="p-6">
                            {/* Content Details */}
                            <div className="grid grid-cols-3 gap-4 mb-6">
                                <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                                    <div className="flex items-center gap-2 text-gray-500 mb-1">
                                        <Clock className="w-4 h-4" />
                                        <span className="text-xs font-bold uppercase tracking-wide">Duration</span>
                                    </div>
                                    <div className="text-lg font-bold text-gray-900">{previewContent.duration}</div>
                                </div>
                                <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                                    <div className="flex items-center gap-2 text-gray-500 mb-1">
                                        <Eye className="w-4 h-4" />
                                        <span className="text-xs font-bold uppercase tracking-wide">Views</span>
                                    </div>
                                    <div className="text-lg font-bold text-gray-900">{(previewContent.views || 0).toLocaleString()}</div>
                                </div>
                                <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                                    <div className="flex items-center gap-2 text-gray-500 mb-1">
                                        {previewContent.type === 'video' ? (
                                            <PlayCircle className="w-4 h-4" />
                                        ) : (
                                            <FileQuestion className="w-4 h-4" />
                                        )}
                                        <span className="text-xs font-bold uppercase tracking-wide">Type</span>
                                    </div>
                                    <div className="text-lg font-bold text-gray-900 capitalize">{previewContent.type}</div>
                                </div>
                            </div>

                            {/* Video Player Simulation */}
                            {previewContent.type === 'video' && (
                                <div className="aspect-video bg-gray-900 rounded-xl overflow-hidden relative group">
                                    {/* Use Iframe if available or simulate */}
                                    {previewContent.videoLink && (previewContent.videoLink.includes('youtube') || previewContent.videoLink.includes('youtu.be')) ? (
                                        <iframe
                                            src={previewContent.videoLink.replace('watch?v=', 'embed/')}
                                            className="w-full h-full"
                                            title="Video Preview"
                                            frameBorder="0"
                                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                            allowFullScreen
                                        ></iframe>
                                    ) : (
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <div className="text-center">
                                                <PlayCircle className="w-20 h-20 text-white/80 mx-auto mb-3 group-hover:scale-110 transition-transform" />
                                                <p className="text-white/60 text-sm font-medium">Video Player Placeholder</p>
                                                <p className="text-white/40 text-xs mt-1">URL: {previewContent.videoLink || 'No URL'}</p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Quiz Preview */}
                            {previewContent.type === 'quiz' && (
                                <div className="space-y-4">
                                    <div className="bg-purple-50 border border-purple-100 rounded-xl p-6">
                                        <div className="flex items-center justify-between mb-4">
                                            <h4 className="text-sm font-bold text-purple-900 uppercase tracking-wide">Quiz Overview</h4>
                                            <span className="px-3 py-1 bg-purple-600 text-white text-xs font-bold rounded-full">
                                                10 Questions
                                            </span>
                                        </div>
                                        <div className="space-y-3">
                                            <div className="flex items-center gap-2 text-purple-700">
                                                <Check className="w-4 h-4" />
                                                <span className="text-sm font-medium">Multiple choice questions</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-purple-700">
                                                <Check className="w-4 h-4" />
                                                <span className="text-sm font-medium">Instant feedback on answers</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-purple-700">
                                                <Check className="w-4 h-4" />
                                                <span className="text-sm font-medium">Progress tracking</span>
                                            </div>
                                        </div>
                                    </div>
                                    {/* Mock Question */}
                                    <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                                        <div className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-3">Sample Question</div>
                                        <div className="bg-white rounded-lg p-4 border border-gray-200 mb-3">
                                            <p className="text-sm font-bold text-gray-900 mb-3">What is the purpose of React Hooks?</p>
                                            <div className="space-y-2">
                                                {['To manage state in functional components', 'To style components', 'To create class components', 'To handle routing'].map((option, idx) => (
                                                    <div key={idx} className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer">
                                                        <div className="w-4 h-4 rounded-full border-2 border-gray-300"></div>
                                                        <span className="text-sm text-gray-700">{option}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-end gap-3">
                            <button
                                onClick={() => setShowPreviewModal(false)}
                                className="px-5 py-2.5 rounded-xl font-bold text-sm text-gray-600 hover:bg-white hover:text-gray-900 border border-transparent hover:border-gray-200 transition-all"
                            >
                                Close
                            </button>
                            <button
                                onClick={() => navigate(`/courses/${id}/content/${previewContent.id}/edit`)}
                                className="px-5 py-2.5 rounded-xl font-bold text-sm text-white bg-[#0ea5e9] hover:bg-[#0284c7] shadow-lg shadow-blue-500/30 hover:shadow-blue-500/40 active:scale-95 transition-all flex items-center gap-2"
                            >
                                <Edit className="w-4 h-4" />
                                Edit Content
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Add Content Modal */}
            {showAddModal && (
                <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
                    <div className="bg-white rounded-2xl p-0 w-full max-w-lg border border-gray-100 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
                        <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                            <h3 className="text-lg font-bold text-gray-900">Add New Content</h3>
                            <button onClick={() => setShowAddModal(false)} className="text-gray-400 hover:text-red-500 transition-colors">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="p-6 space-y-4">
                            {/* Content Type Selection */}
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Content Type</label>
                                <div className="flex gap-3">
                                    <button
                                        onClick={() => setContentType('video')}
                                        className={`flex-1 py-3 px-4 rounded-xl border-2 transition-all ${contentType === 'video'
                                            ? 'border-[#0ea5e9] bg-blue-50 text-[#0ea5e9]'
                                            : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
                                            }`}
                                    >
                                        <PlayCircle className="w-5 h-5 mx-auto mb-1" />
                                        <div className="text-xs font-bold">Video</div>
                                    </button>
                                    <button
                                        onClick={() => setContentType('quiz')}
                                        className={`flex-1 py-3 px-4 rounded-xl border-2 transition-all ${contentType === 'quiz'
                                            ? 'border-purple-600 bg-purple-50 text-purple-600'
                                            : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
                                            }`}
                                    >
                                        <FileQuestion className="w-5 h-5 mx-auto mb-1" />
                                        <div className="text-xs font-bold">Quiz</div>
                                    </button>
                                </div>
                            </div>

                            {/* Title */}
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Title</label>
                                <input
                                    type="text"
                                    value={newContentTitle}
                                    onChange={(e) => setNewContentTitle(e.target.value)}
                                    placeholder={`Enter ${contentType} title...`}
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-[#0ea5e9]/10 focus:border-[#0ea5e9] text-gray-900 font-medium transition-all"
                                    autoFocus
                                />
                            </div>

                            {/* URL/ID Field */}
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">
                                    {contentType === 'video' ? 'Video URL (YouTube/Drive)' : 'Quiz ID'}
                                </label>
                                <input
                                    type="text"
                                    value={newContentUrl}
                                    onChange={(e) => setNewContentUrl(e.target.value)}
                                    placeholder={contentType === 'video' ? 'https://youtube.com/...' : 'Q-12345'}
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-[#0ea5e9]/10 focus:border-[#0ea5e9] text-gray-900 font-medium transition-all"
                                />
                            </div>

                            {/* Duration */}
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Duration (optional)</label>
                                <input
                                    type="text"
                                    value={newContentDuration}
                                    onChange={(e) => setNewContentDuration(e.target.value)}
                                    placeholder="e.g., 15 mins"
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-[#0ea5e9]/10 focus:border-[#0ea5e9] text-gray-900 font-medium transition-all"
                                />
                            </div>
                        </div>

                        <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-end gap-3">
                            <button
                                onClick={() => setShowAddModal(false)}
                                className="px-5 py-2.5 rounded-xl font-bold text-sm text-gray-600 hover:bg-white hover:text-gray-900 border border-transparent hover:border-gray-200 transition-all"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleAddContent}
                                disabled={!newContentTitle.trim()}
                                className="px-5 py-2.5 rounded-xl font-bold text-sm text-white bg-[#0ea5e9] hover:bg-[#0284c7] shadow-lg shadow-blue-500/30 hover:shadow-blue-500/40 active:scale-95 transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <Check className="w-4 h-4" />
                                Add {contentType === 'video' ? 'Video' : 'Quiz'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CourseContent;
