import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, PlayCircle, FileQuestion, Trash2, Plus, X, Check } from 'lucide-react';
import type { Course, Lesson } from '../types';

interface QuizQuestion {
    id: number;
    question: string;
    options: string[];
    correctAnswer: number;
}

const EditContent = () => {
    const { courseId, contentId } = useParams<{ courseId: string; contentId: string }>();
    const navigate = useNavigate();

    const [lesson, setLesson] = useState<Lesson | null>(null);
    const [moduleId, setModuleId] = useState<string>('');

    // Content data state
    const [contentData, setContentData] = useState({
        id: contentId || '',
        title: '',
        type: 'video' as 'video' | 'quiz' | 'text',
        duration: '',
        description: '',
        url: '',
        tags: [] as string[],
        thumbnail: '',
    });

    // Quiz questions state
    const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>([
        {
            id: 1,
            question: 'What is the purpose of React Hooks?',
            options: [
                'To manage state in functional components',
                'To style components',
                'To create class components',
                'To handle routing'
            ],
            correctAnswer: 0
        },
        {
            id: 2,
            question: 'Which hook is used for side effects?',
            options: [
                'useState',
                'useEffect',
                'useContext',
                'useReducer'
            ],
            correctAnswer: 1
        }
    ]);

    const [newTag, setNewTag] = useState('');

    // Fetch course and find the specific lesson
    useEffect(() => {
        const fetchLesson = async () => {
            if (!courseId || !contentId) return;

            try {
                const response = await fetch(`http://localhost:5000/api/courses/${courseId}`);
                if (response.ok) {
                    const data = await response.json();
                    const courseData: Course = {
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
                    };

                    // Find the lesson in modules
                    let foundLesson: Lesson | null = null;
                    let foundModuleId = '';

                    if (courseData.modules) {
                        for (const module of courseData.modules) {
                            const lessonInModule = module.lessons.find((l: Lesson) => l.id === contentId);
                            if (lessonInModule) {
                                foundLesson = lessonInModule;
                                foundModuleId = module.id;
                                break;
                            }
                        }
                    }

                    if (foundLesson) {
                        setLesson(foundLesson);
                        setModuleId(foundModuleId);
                        if (foundLesson.type === 'quiz' && (foundLesson as any).questions) {
                            setQuizQuestions((foundLesson as any).questions);
                        }
                        setContentData({
                            id: foundLesson.id,
                            title: foundLesson.title,
                            type: foundLesson.type,
                            duration: foundLesson.duration,
                            description: '', // Not stored in lesson currently
                            url: foundLesson.videoLink || '',
                            tags: [], // Not stored in lesson currently
                            thumbnail: '',
                        });
                    } else {
                        console.error('Lesson not found');
                    }
                } else {
                    console.error("Course not found");
                }
            } catch (error) {
                console.error("Error fetching lesson:", error);
            }
        };
        fetchLesson();
    }, [courseId, contentId]);

    const handleSave = async () => {
        if (!courseId || !contentId || !lesson || !moduleId) return;

        try {
            // 1. Fetch current course to get latest modules
            const response = await fetch(`http://localhost:5000/api/courses/${courseId}`);
            if (!response.ok) throw new Error('Failed to fetch course');
            const courseData = await response.json();

            // 2. Update the specific lesson within the modules
            const updatedModules = courseData.modules.map((m: any) => {
                if (m.id === moduleId) {
                    return {
                        ...m,
                        lessons: m.lessons.map((l: any) => {
                            if (l.id === contentId) {
                                return {
                                    ...l,
                                    title: contentData.title,
                                    duration: contentData.duration,
                                    videoLink: contentData.url,
                                    questions: contentData.type === 'quiz' ? quizQuestions : l.questions
                                };
                            }
                            return l;
                        })
                    };
                }
                return m;
            });

            // 3. Save updated course
            const saveResponse = await fetch(`http://localhost:5000/api/courses/${courseId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...courseData,
                    modules: JSON.stringify(updatedModules)
                })
            });

            if (saveResponse.ok) {
                navigate(`/courses/${courseId}/content`);
            } else {
                alert('Failed to save changes');
            }
        } catch (error) {
            console.error('Error saving content:', error);
            alert('An error occurred while saving.');
        }
    };

    const handleAddTag = () => {
        if (newTag.trim() && !contentData.tags.includes(newTag.trim())) {
            setContentData({
                ...contentData,
                tags: [...contentData.tags, newTag.trim()]
            });
            setNewTag('');
        }
    };

    const handleRemoveTag = (tagToRemove: string) => {
        setContentData({
            ...contentData,
            tags: contentData.tags.filter(tag => tag !== tagToRemove)
        });
    };

    const handleAddQuestion = () => {
        const maxId = quizQuestions.length > 0 ? Math.max(...quizQuestions.map(q => q.id)) : 0;
        const newQuestion: QuizQuestion = {
            id: maxId + 1,
            question: 'New Question',
            options: ['Option 1', 'Option 2', 'Option 3', 'Option 4'],
            correctAnswer: 0
        };
        setQuizQuestions([...quizQuestions, newQuestion]);
    };

    const handleUpdateQuestion = (questionId: number, field: string, value: any) => {
        setQuizQuestions(quizQuestions.map(q =>
            q.id === questionId ? { ...q, [field]: value } : q
        ));
    };

    const handleUpdateOption = (questionId: number, optionIndex: number, value: string) => {
        setQuizQuestions(quizQuestions.map(q => {
            if (q.id === questionId) {
                const newOptions = [...q.options];
                newOptions[optionIndex] = value;
                return { ...q, options: newOptions };
            }
            return q;
        }));
    };

    const handleDeleteQuestion = (questionId: number) => {
        if (confirm('Are you sure you want to delete this question?')) {
            setQuizQuestions(quizQuestions.filter(q => q.id !== questionId));
        }
    };

    return (
        <div className="min-h-screen bg-gray-50/50">
            {/* Header */}
            <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
                <div className="max-w-5xl mx-auto px-6 py-4">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                            <button
                                onClick={() => navigate(`/courses/${courseId}/content`)}
                                className="text-gray-500 hover:text-gray-900 flex items-center gap-2 text-sm font-medium mb-2 transition-colors"
                            >
                                <ArrowLeft className="w-4 h-4" /> Back to Content List
                            </button>
                            <h1 className="text-xl font-bold text-gray-900 tracking-tight">
                                Edit {contentData.type === 'quiz' ? 'Quiz' : 'Video'}
                            </h1>
                            <p className="text-xs text-gray-500 font-medium mt-0.5">Update content details and settings</p>
                        </div>
                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => navigate(`/courses/${courseId}/content`)}
                                className="px-4 py-2 text-sm font-bold text-gray-600 hover:bg-gray-100 rounded-xl border border-gray-200 transition-all"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSave}
                                className="btn-primary flex items-center gap-2 px-4 py-2 text-sm shadow-blue-500/20"
                            >
                                <Save className="w-4 h-4" />
                                <span>Save Changes</span>
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            <div className="max-w-5xl mx-auto px-6 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Basic Information */}
                        <div className="bg-white rounded-xl border border-gray-200 p-6">
                            <h2 className="text-lg font-bold text-gray-900 mb-4">Basic Information</h2>

                            <div className="space-y-4">
                                {/* Title */}
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">
                                        Content Title
                                    </label>
                                    <input
                                        type="text"
                                        value={contentData.title}
                                        onChange={(e) => setContentData({ ...contentData, title: e.target.value })}
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-[#0ea5e9]/10 focus:border-[#0ea5e9] text-gray-900 font-medium transition-all"
                                        placeholder="Enter content title..."
                                    />
                                </div>

                                {/* Description */}
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">
                                        Description
                                    </label>
                                    <textarea
                                        value={contentData.description}
                                        onChange={(e) => setContentData({ ...contentData, description: e.target.value })}
                                        rows={4}
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-[#0ea5e9]/10 focus:border-[#0ea5e9] text-gray-900 font-medium transition-all resize-none"
                                        placeholder="Enter content description..."
                                    />
                                </div>

                                {/* Duration */}
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">
                                        Duration
                                    </label>
                                    <input
                                        type="text"
                                        value={contentData.duration}
                                        onChange={(e) => setContentData({ ...contentData, duration: e.target.value })}
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-[#0ea5e9]/10 focus:border-[#0ea5e9] text-gray-900 font-medium transition-all"
                                        placeholder="e.g., 15 mins"
                                    />
                                </div>

                                {/* URL (for videos) */}
                                {contentData.type === 'video' && (
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">
                                            Video URL
                                        </label>
                                        <input
                                            type="text"
                                            value={contentData.url}
                                            onChange={(e) => setContentData({ ...contentData, url: e.target.value })}
                                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-[#0ea5e9]/10 focus:border-[#0ea5e9] text-gray-900 font-medium transition-all"
                                            placeholder="https://youtube.com/..."
                                        />
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Quiz Questions (only for quiz type) */}
                        {contentData.type === 'quiz' && (
                            <div className="bg-white rounded-xl border border-gray-200 p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <h2 className="text-lg font-bold text-gray-900">Quiz Questions</h2>
                                    <button
                                        onClick={handleAddQuestion}
                                        className="px-3 py-1.5 bg-purple-600 text-white rounded-lg font-bold text-xs hover:bg-purple-700 transition-all flex items-center gap-2"
                                    >
                                        <Plus className="w-3.5 h-3.5" />
                                        Add Question
                                    </button>
                                </div>

                                <div className="space-y-4">
                                    {quizQuestions.map((question, qIndex) => (
                                        <div key={question.id} className="border border-gray-200 rounded-xl p-4 bg-gray-50">
                                            <div className="flex items-start justify-between mb-3">
                                                <span className="text-xs font-bold text-purple-600 uppercase tracking-wide">
                                                    Question {qIndex + 1}
                                                </span>
                                                <button
                                                    onClick={() => handleDeleteQuestion(question.id)}
                                                    className="text-gray-400 hover:text-red-600 transition-colors"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>

                                            {/* Question Text */}
                                            <div className="mb-3">
                                                <input
                                                    type="text"
                                                    value={question.question}
                                                    onChange={(e) => handleUpdateQuestion(question.id, 'question', e.target.value)}
                                                    className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 text-gray-900 font-medium text-sm"
                                                    placeholder="Enter question..."
                                                />
                                            </div>

                                            {/* Options */}
                                            <div className="space-y-2">
                                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">
                                                    Answer Options
                                                </label>
                                                {question.options.map((option, optIndex) => (
                                                    <div key={optIndex} className="flex items-center gap-2">
                                                        <button
                                                            onClick={() => handleUpdateQuestion(question.id, 'correctAnswer', optIndex)}
                                                            className={`flex-shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${question.correctAnswer === optIndex
                                                                ? 'border-green-500 bg-green-500'
                                                                : 'border-gray-300 hover:border-green-400'
                                                                }`}
                                                        >
                                                            {question.correctAnswer === optIndex && (
                                                                <Check className="w-3 h-3 text-white" />
                                                            )}
                                                        </button>
                                                        <input
                                                            type="text"
                                                            value={option}
                                                            onChange={(e) => handleUpdateOption(question.id, optIndex, e.target.value)}
                                                            className="flex-1 px-3 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 text-gray-900 text-sm"
                                                            placeholder={`Option ${optIndex + 1}`}
                                                        />
                                                    </div>
                                                ))}
                                                <p className="text-xs text-gray-500 mt-2">
                                                    Click the circle to mark the correct answer
                                                </p>
                                            </div>
                                        </div>
                                    ))}

                                    {quizQuestions.length === 0 && (
                                        <div className="text-center py-8 text-gray-500">
                                            <FileQuestion className="w-12 h-12 mx-auto mb-2 opacity-50" />
                                            <p className="text-sm font-medium">No questions yet</p>
                                            <p className="text-xs">Click "Add Question" to get started</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Tags */}
                        <div className="bg-white rounded-xl border border-gray-200 p-6">
                            <h2 className="text-lg font-bold text-gray-900 mb-4">Tags</h2>

                            <div className="space-y-4">
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        value={newTag}
                                        onChange={(e) => setNewTag(e.target.value)}
                                        onKeyPress={(e) => e.key === 'Enter' && handleAddTag()}
                                        className="flex-1 px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-[#0ea5e9]/10 focus:border-[#0ea5e9] text-gray-900 font-medium transition-all"
                                        placeholder="Add a tag..."
                                    />
                                    <button
                                        onClick={handleAddTag}
                                        className="px-4 py-2 bg-[#0ea5e9] text-white rounded-xl font-bold text-sm hover:bg-[#0284c7] transition-all flex items-center gap-2"
                                    >
                                        <Plus className="w-4 h-4" />
                                        Add
                                    </button>
                                </div>

                                <div className="flex flex-wrap gap-2">
                                    {contentData.tags.map((tag, index) => (
                                        <div
                                            key={index}
                                            className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 text-blue-600 border border-blue-100 rounded-lg text-sm font-bold"
                                        >
                                            <span>{tag}</span>
                                            <button
                                                onClick={() => handleRemoveTag(tag)}
                                                className="hover:text-red-600 transition-colors"
                                            >
                                                <X className="w-3.5 h-3.5" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Content Type */}
                        <div className="bg-white rounded-xl border border-gray-200 p-6">
                            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide mb-4">Content Type</h3>
                            <div className={`flex items-center gap-3 p-4 rounded-xl border-2 ${contentData.type === 'video'
                                ? 'bg-blue-50 border-[#0ea5e9] text-[#0ea5e9]'
                                : 'bg-purple-50 border-purple-600 text-purple-600'
                                }`}>
                                {contentData.type === 'video' ? (
                                    <PlayCircle className="w-6 h-6" />
                                ) : (
                                    <FileQuestion className="w-6 h-6" />
                                )}
                                <div>
                                    <div className="font-bold text-sm capitalize">{contentData.type}</div>
                                    <div className="text-xs opacity-70">Content Type</div>
                                </div>
                            </div>
                        </div>

                        {/* Quiz Stats */}
                        {contentData.type === 'quiz' && (
                            <div className="bg-white rounded-xl border border-gray-200 p-6">
                                <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide mb-4">Quiz Stats</h3>
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-gray-600">Total Questions</span>
                                        <span className="text-lg font-bold text-purple-600">{quizQuestions.length}</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-gray-600">Pass Score</span>
                                        <span className="text-lg font-bold text-gray-900">70%</span>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Preview */}
                        {contentData.type === 'video' && (
                            <div className="bg-white rounded-xl border border-gray-200 p-6">
                                <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide mb-4">Preview</h3>
                                <div className="aspect-video bg-gray-900 rounded-xl overflow-hidden relative group">
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <PlayCircle className="w-12 h-12 text-white/60" />
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Danger Zone */}
                        <div className="bg-white rounded-xl border border-red-200 p-6">
                            <h3 className="text-sm font-bold text-red-900 uppercase tracking-wide mb-4">Danger Zone</h3>
                            <button className="w-full px-4 py-2.5 bg-red-50 text-red-600 border border-red-200 rounded-xl font-bold text-sm hover:bg-red-100 transition-all flex items-center justify-center gap-2">
                                <Trash2 className="w-4 h-4" />
                                Delete Content
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EditContent;
