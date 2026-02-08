import React, { useState } from 'react';
import { X, Save, Eye, UserPlus, MoreVertical, FileText, Settings, CircleHelp, List, Plus, Trash2, Video, File, ChevronRight, Image as ImageIcon, Mail } from 'lucide-react';


interface CourseEditorProps {
    course: any;
    onClose: () => void;
    onSave: (course: any) => void;
}

export const CourseEditor: React.FC<CourseEditorProps> = ({ course, onClose, onSave }) => {
    interface Lesson {
        id: number;
        title: string;
        type: 'video' | 'document';
        content: string; // URL or text
        duration: string;
        isFree: boolean;
    }

    interface AnswerOption {
        id: number;
        text: string;
        isCorrect: boolean;
    }

    interface Question {
        id: number;
        text: string;
        options: AnswerOption[];
        points: number;
    }

    interface Quiz {
        id: number;
        title: string;
        questions: Question[];
    }

    // State
    const [activeTab, setActiveTab] = useState<'content' | 'description' | 'options' | 'quiz'>('content');
    const [title, setTitle] = useState(course.title);
    const [category, setCategory] = useState(course.tags?.[0] || '');
    const [price, setPrice] = useState(course.price || '');
    const [isPublished, setIsPublished] = useState(course.status === 'published');
    const [showLessonModal, setShowLessonModal] = useState(false);
    const [currentLesson, setCurrentLesson] = useState<Lesson | null>(null);
    const [lessonTab, setLessonTab] = useState<'content' | 'description' | 'attachments'>('content');
    const [lessons, setLessons] = useState<Lesson[]>(course.lessons || []);

    // New Lesson State
    const [lessonTitle, setLessonTitle] = useState('');
    const [lessonType, setLessonType] = useState<'video' | 'document'>('video');
    const [lessonContent, setLessonContent] = useState('');
    const [lessonDuration, setLessonDuration] = useState('');
    const [lessonIsFree, setLessonIsFree] = useState(false);

    // Header Actions
    const handlePublishToggle = () => setIsPublished(!isPublished);

    // Quiz State
    const [viewingQuizId, setViewingQuizId] = useState<number | null>(null);
    const [quizzes, setQuizzes] = useState<Quiz[]>(course.quizzes || []);
    const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);

    // Attendees & Image State
    const [showAttendeeMenu, setShowAttendeeMenu] = useState(false);
    const [showAddAttendee, setShowAddAttendee] = useState(false);
    const [showContactAttendee, setShowContactAttendee] = useState(false);
    const [courseImage, setCourseImage] = useState<string | null>(null);

    const handleLessonSave = () => {
        if (currentLesson) {
            // Update existing
            setLessons(lessons.map(l => l.id === currentLesson.id ? { ...l, title: lessonTitle, type: lessonType, content: lessonContent, duration: lessonDuration, isFree: lessonIsFree } : l));
        } else {
            // Add new lesson
            const newLesson: Lesson = {
                id: Date.now(),
                title: lessonTitle,
                type: lessonType,
                content: lessonContent,
                duration: lessonDuration || '0:00',
                isFree: lessonIsFree
            };
            setLessons([...lessons, newLesson]);
        }
        setShowLessonModal(false);
    };

    // Tab Content Renderers
    const renderContentTab = () => (
        <div className="space-y-4">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-gray-900">Course Content</h3>
                <button
                    onClick={() => {
                        setLessonTitle('');
                        setLessonType('video');
                        setLessonContent('');
                        setLessonDuration('');
                        setLessonIsFree(false);
                        setCurrentLesson(null);
                        setShowLessonModal(true);
                    }}
                    className="flex items-center gap-2 px-4 py-2 bg-brand-blue text-white rounded-xl text-sm font-bold shadow-lg shadow-brand-blue/20 hover:scale-105 transition-transform"
                >
                    <Plus className="w-4 h-4" /> Add Lesson
                </button>
            </div>

            <div className="space-y-3">
                {lessons.map((lesson) => (
                    <div key={lesson.id} className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex items-center justify-between group hover:border-brand-blue/50 transition-colors">
                        <div className="flex items-center gap-4">
                            <div className="w-8 h-8 bg-gray-50 rounded-lg flex items-center justify-center text-gray-400">
                                {lesson.type === 'video' ? <Video className="w-4 h-4" /> : <File className="w-4 h-4" />}
                            </div>
                            <div>
                                <h4 className="font-bold text-gray-900 text-sm">{lesson.title}</h4>
                                <span className="text-xs text-gray-400 font-medium">{lesson.duration} • {lesson.type === 'video' ? 'Video' : 'Document'}</span>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => {
                                    setLessonTitle(lesson.title);
                                    setLessonType(lesson.type);
                                    setLessonContent(lesson.content);
                                    setLessonDuration(lesson.duration);
                                    setLessonIsFree(lesson.isFree);
                                    setCurrentLesson(lesson);
                                    setShowLessonModal(true);
                                }}
                                className="p-2 text-gray-400 hover:text-brand-blue hover:bg-brand-blue/5 rounded-lg transition-colors"
                            >
                                <Settings className="w-4 h-4" />
                            </button>
                            <button className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                                <Trash2 className="w-4 h-4" />
                            </button>
                            <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg">
                                <MoreVertical className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                ))}

                {lessons.length === 0 && (
                    <div className="text-center py-12 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
                        <p className="text-gray-400 font-medium text-sm">No lessons yet. Add your first lesson to get started.</p>
                    </div>
                )}
            </div>
        </div>
    );

    const renderDescriptionTab = () => (
        <div className="space-y-6">
            <h3 className="text-xl font-bold text-gray-900">Course Details</h3>

            {/* Course Image Upload */}
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">Course Cover Image</label>
                <div className="flex items-start gap-6">
                    <div className="w-40 h-24 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200 flex items-center justify-center overflow-hidden relative group">
                        {courseImage || course.image ? (
                            <img src={courseImage || course.image} alt="Course Cover" className="w-full h-full object-cover" />
                        ) : (
                            <ImageIcon className="w-8 h-8 text-gray-300" />
                        )}
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <button className="p-2 bg-white rounded-full text-gray-900 hover:scale-110 transition-transform">
                                <Plus className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                    <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900 mb-1">Upload your course thumbnail.</p>
                        <p className="text-xs text-gray-500 mb-3">1200x630px recommended. Max 2MB.</p>
                        <label className="flex items-center gap-2 px-4 py-2 bg-gray-50 hover:bg-gray-100 text-gray-600 rounded-xl text-xs font-bold transition-colors cursor-pointer w-fit">
                            <ImageIcon className="w-4 h-4" /> Choose File
                            <input
                                type="file"
                                className="hidden"
                                accept="image/*"
                                onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (file) {
                                        const url = URL.createObjectURL(file);
                                        setCourseImage(url);
                                    }
                                }}
                            />
                        </label>
                    </div>
                </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">Description (Rich Text)</label>
                <textarea
                    className="w-full h-64 p-4 bg-gray-50 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-blue/20 font-medium text-sm resize-none"
                    placeholder="# Course Introduction\n\nWrite your comprehensive course description here..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />
                <div className="mt-4 flex gap-2 text-xs font-bold text-gray-400">
                    <button className="px-3 py-1 hover:bg-gray-100 rounded">Bold</button>
                    <button className="px-3 py-1 hover:bg-gray-100 rounded">Italic</button>
                    <button className="px-3 py-1 hover:bg-gray-100 rounded">List</button>
                    <button className="px-3 py-1 hover:bg-gray-100 rounded">Link</button>
                </div>
            </div>
        </div>
    );

    const renderOptionsTab = () => (
        <div className="space-y-8">
            <h3 className="text-xl font-bold text-gray-900">Configuration</h3>

            <div className="space-y-6">
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                    <h4 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <Eye className="w-4 h-4 text-brand-blue" /> Visibility
                    </h4>
                    <div className="space-y-3">
                        <label className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 cursor-pointer transition-colors">
                            <input type="radio" name="visibility" className="text-brand-blue focus:ring-brand-blue" defaultChecked />
                            <div>
                                <div className="text-sm font-bold text-gray-900">Everyone</div>
                                <div className="text-xs text-gray-500">Publicly visible to all users</div>
                            </div>
                        </label>
                        <label className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 cursor-pointer transition-colors">
                            <input type="radio" name="visibility" className="text-brand-blue focus:ring-brand-blue" />
                            <div>
                                <div className="text-sm font-bold text-gray-900">Signed In Users</div>
                                <div className="text-xs text-gray-500">Only visible to authenticated users</div>
                            </div>
                        </label>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                    <h4 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <Settings className="w-4 h-4 text-brand-blue" /> Access Rules
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <label className="p-4 rounded-xl border border-gray-200 cursor-pointer hover:border-brand-blue hover:bg-brand-blue/5 transition-all">
                            <input type="radio" name="access" className="mb-2 text-brand-blue focus:ring-brand-blue" />
                            <div className="text-sm font-bold text-gray-900">Open</div>
                            <div className="text-[10px] text-gray-500 mt-1">Free for everyone</div>
                        </label>
                        <label className="p-4 rounded-xl border border-gray-200 cursor-pointer hover:border-brand-blue hover:bg-brand-blue/5 transition-all">
                            <input type="radio" name="access" className="mb-2 text-brand-blue focus:ring-brand-blue" />
                            <div className="text-sm font-bold text-gray-900">Invitation</div>
                            <div className="text-[10px] text-gray-500 mt-1">Private access only</div>
                        </label>
                        <label className="p-4 rounded-xl border border-gray-200 cursor-pointer hover:border-brand-blue hover:bg-brand-blue/5 transition-all">
                            <input type="radio" name="access" className="mb-2 text-brand-blue focus:ring-brand-blue" defaultChecked />
                            <div className="text-sm font-bold text-gray-900">Payment</div>
                            <div className="text-[10px] text-gray-500 mt-1">Paid enrollment</div>
                        </label>
                    </div>

                    <div className="mt-6 pt-6 border-t border-gray-100">
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">Price (USD)</label>
                        <input type="number" placeholder="49.99" className="w-full md:w-48 px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-blue/20 font-bold" />
                    </div>
                </div>
            </div>
        </div>
    );

    const renderQuizTab = () => {
        const activeQuiz = quizzes.find(q => q.id === viewingQuizId);

        if (viewingQuizId !== null && activeQuiz) {
            // Quiz Builder/Editor
            return (
                <div className="h-[600px] flex gap-6">
                    {/* Left Panel: List */}
                    <div className="w-1/3 flex flex-col gap-4">
                        <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex-1 overflow-y-auto">
                            <div className="flex justify-between items-center mb-4">
                                <button onClick={() => setViewingQuizId(null)} className="text-xs font-bold text-gray-400 hover:text-gray-900 flex items-center gap-1">
                                    <ChevronRight className="w-3 h-3 rotate-180" /> Back
                                </button>
                                <h4 className="text-sm font-bold text-gray-900">Questions</h4>
                                <button
                                    onClick={() => setEditingQuestion({
                                        id: Date.now(),
                                        text: 'New Question',
                                        points: 10,
                                        options: [
                                            { id: 1, text: 'Option A', isCorrect: true },
                                            { id: 2, text: 'Option B', isCorrect: false }
                                        ]
                                    })}
                                    className="text-xs font-bold text-brand-blue hover:underline"
                                >
                                    + Add
                                </button>
                            </div>
                            <div className="space-y-2">
                                {activeQuiz.questions.map((q, i) => (
                                    <div
                                        key={q.id}
                                        onClick={() => setEditingQuestion(q)}
                                        className={`p-3 rounded-xl text-sm font-medium cursor-pointer transition-colors ${editingQuestion?.id === q.id ? 'bg-brand-blue text-white' : 'hover:bg-gray-50 text-gray-700'}`}
                                    >
                                        <div className="flex justify-between">
                                            <span>Q{i + 1}: {q.text.substring(0, 30)}...</span>
                                            <span className="opacity-70 text-xs">{q.points}pts</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right Panel: Editor */}
                    <div className="flex-1 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm overflow-y-auto">
                        {editingQuestion ? (
                            <>
                                <h4 className="text-sm font-bold text-gray-900 mb-6">Edit Question</h4>
                                <div className="space-y-6">
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Question Text</label>
                                        <textarea
                                            className="w-full p-4 bg-gray-50 rounded-xl border border-gray-200 h-24 text-sm font-medium resize-none focus:outline-none focus:ring-2 focus:ring-brand-blue/20"
                                            value={editingQuestion.text}
                                            onChange={(e) => setEditingQuestion({ ...editingQuestion, text: e.target.value })}
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Points</label>
                                        <input
                                            type="number"
                                            className="w-24 px-4 py-2 bg-gray-50 rounded-xl font-bold text-sm"
                                            value={editingQuestion.points}
                                            onChange={(e) => setEditingQuestion({ ...editingQuestion, points: parseInt(e.target.value) || 0 })}
                                        />
                                    </div>

                                    <div className="space-y-3">
                                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Answers</label>
                                        {editingQuestion.options.map((opt, i) => (
                                            <div key={opt.id} className="flex items-center gap-3">
                                                <input
                                                    type="radio"
                                                    name="correct"
                                                    checked={opt.isCorrect}
                                                    onChange={() => {
                                                        const newOptions = editingQuestion.options.map(o => ({ ...o, isCorrect: o.id === opt.id }));
                                                        setEditingQuestion({ ...editingQuestion, options: newOptions });
                                                    }}
                                                    className="w-4 h-4 text-brand-blue focus:ring-brand-blue"
                                                />
                                                <input
                                                    type="text"
                                                    value={opt.text}
                                                    onChange={(e) => {
                                                        const newOptions = [...editingQuestion.options];
                                                        newOptions[i] = { ...opt, text: e.target.value };
                                                        setEditingQuestion({ ...editingQuestion, options: newOptions });
                                                    }}
                                                    className="flex-1 px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-brand-blue/20"
                                                />
                                                <button
                                                    onClick={() => {
                                                        const newOptions = editingQuestion.options.filter(o => o.id !== opt.id);
                                                        setEditingQuestion({ ...editingQuestion, options: newOptions });
                                                    }}
                                                    className="p-2 text-gray-400 hover:text-red-500"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        ))}
                                        <button
                                            onClick={() => {
                                                const newOption = { id: Date.now(), text: '', isCorrect: false };
                                                setEditingQuestion({ ...editingQuestion, options: [...editingQuestion.options, newOption] });
                                            }}
                                            className="text-xs font-bold text-brand-blue mt-2"
                                        >
                                            + Add Answer Option
                                        </button>
                                    </div>

                                    <button
                                        onClick={() => {
                                            // Save Question to Quiz
                                            const updatedQuestions = activeQuiz.questions.some(q => q.id === editingQuestion.id)
                                                ? activeQuiz.questions.map(q => q.id === editingQuestion.id ? editingQuestion : q)
                                                : [...activeQuiz.questions, editingQuestion];

                                            setQuizzes(quizzes.map(z => z.id === activeQuiz.id ? { ...z, questions: updatedQuestions } : z));
                                            setEditingQuestion(null);
                                        }}
                                        className="w-full py-3 bg-brand-blue text-white font-bold rounded-xl shadow-lg shadow-brand-blue/20"
                                    >
                                        Save Question
                                    </button>
                                </div>
                            </>
                        ) : (
                            <div className="h-full flex flex-col items-center justify-center text-gray-400">
                                <CircleHelp className="w-12 h-12 mb-4 opacity-20" />
                                <p className="font-medium">Select a question to edit or add a new one.</p>
                            </div>
                        )}
                    </div>
                </div>
            );
        }

        // Quiz List
        return (
            <div className="space-y-6">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold text-gray-900">Linked Quizzes</h3>
                    <button
                        onClick={() => {
                            const newQuiz: Quiz = { id: Date.now(), title: 'New Assessment', questions: [] };
                            setQuizzes([...quizzes, newQuiz]);
                            setViewingQuizId(newQuiz.id);
                        }}
                        className="flex items-center gap-2 px-4 py-2 bg-brand-blue text-white rounded-xl text-sm font-bold shadow-lg shadow-brand-blue/20 hover:scale-105 transition-transform"
                    >
                        <Plus className="w-4 h-4" /> Add Quiz
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {quizzes.map(q => (
                        <div key={q.id} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex justify-between items-center group hover:border-brand-blue/30 transition-all">
                            <div>
                                <div className="text-sm font-bold text-gray-900 mb-1">{q.title}</div>
                                <div className="text-xs text-gray-400 font-medium">{q.questions.length} Questions</div>
                            </div>
                            <button
                                onClick={() => setViewingQuizId(q.id)}
                                className="px-4 py-2 bg-gray-50 text-gray-600 rounded-xl text-xs font-bold group-hover:bg-brand-blue group-hover:text-white transition-colors"
                            >
                                Edit Quiz
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    // Description State
    const [description, setDescription] = useState(course.description || "");

    return (
        <div className="fixed inset-0 bg-white z-[100] overflow-hidden flex flex-col animate-in slide-in-from-bottom-10 duration-300">
            {/* Header */}
            <header className="h-16 border-b border-gray-100 px-8 flex items-center justify-between bg-white/80 backdrop-blur-md sticky top-0 z-20">
                <div className="flex items-center gap-4">
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                        <X className="w-6 h-6 text-gray-400" />
                    </button>
                    <div>
                        <h2 className="text-lg font-black text-gray-900 tracking-tight">{course.title}</h2>
                        <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full ${isPublished ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                            {isPublished ? 'Published' : 'Draft'}
                        </span>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 bg-gray-50 p-1 rounded-lg border border-gray-200">
                        <span className="text-[10px] font-bold uppercase tracking-widest px-3 text-gray-400">Publish</span>
                        <button
                            onClick={handlePublishToggle}
                            className={`w-10 h-6 rounded-md transition-colors relative ${isPublished ? 'bg-green-500' : 'bg-gray-300'}`}
                        >
                            <span className={`absolute top-1 left-1 w-4 h-4 bg-white rounded shadow-sm transition-transform ${isPublished ? 'translate-x-4' : 'translate-x-0'}`}></span>
                        </button>
                    </div>

                    <div className="h-6 w-px bg-gray-200 mx-2"></div>

                    <button className="flex items-center gap-2 px-4 py-2 hover:bg-gray-50 rounded-xl text-sm font-bold text-gray-600 transition-colors">
                        <Eye className="w-4 h-4" /> Preview
                    </button>
                    <div className="relative">
                        <button
                            onClick={() => setShowAttendeeMenu(!showAttendeeMenu)}
                            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-colors ${showAttendeeMenu ? 'bg-brand-blue text-white shadow-md' : 'hover:bg-gray-50 text-gray-600'}`}
                        >
                            <UserPlus className="w-4 h-4" /> Attendees
                        </button>

                        {showAttendeeMenu && (
                            <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-xl border border-gray-100 shadow-xl py-2 z-50 animate-in fade-in slide-in-from-top-2">
                                <button
                                    onClick={() => { setShowAddAttendee(true); setShowAttendeeMenu(false); }}
                                    className="w-full text-left px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-brand-blue flex items-center gap-2"
                                >
                                    <Plus className="w-4 h-4" /> Add Attendees
                                </button>
                                <button
                                    onClick={() => { setShowContactAttendee(true); setShowAttendeeMenu(false); }}
                                    className="w-full text-left px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-brand-blue flex items-center gap-2"
                                >
                                    <Mail className="w-4 h-4" /> Contact Attendees
                                </button>
                            </div>
                        )}
                    </div>
                    <button
                        onClick={() => onSave({
                            ...course,
                            title,
                            tags: [category],
                            price,
                            description,
                            lessons,
                            quizzes,
                            image: courseImage || course.image,
                            status: isPublished ? 'published' : 'draft'
                        })}
                        className="flex items-center gap-2 px-6 py-2 bg-brand-blue text-white rounded-xl text-sm font-bold shadow-lg shadow-brand-blue/20 hover:scale-105 transition-transform"
                    >
                        <Save className="w-4 h-4" /> Save
                    </button>
                </div>
            </header>

            {/* Main Layout */}
            <div className="flex-1 flex overflow-hidden">
                {/* Sidebar Tabs */}
                <aside className="w-64 border-r border-gray-100 bg-gray-50/50 p-6 flex flex-col gap-2">
                    {[
                        { id: 'content', label: 'Content', icon: List },
                        { id: 'description', label: 'Description', icon: FileText },
                        { id: 'options', label: 'Options', icon: Settings },
                        { id: 'quiz', label: 'Quiz', icon: CircleHelp }
                    ].map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id as any)}
                            className={`flex items-center gap-3 p-3 rounded-xl transition-all text-sm font-bold ${activeTab === tab.id
                                ? 'bg-white text-brand-blue shadow-sm'
                                : 'text-gray-500 hover:text-gray-900 hover:bg-white/50'
                                }`}
                        >
                            <tab.icon className="w-4 h-4" />
                            {tab.label}
                        </button>
                    ))}
                </aside>

                {/* Content Area */}
                <main className="flex-1 overflow-y-auto p-10 bg-gray-50/30">
                    <div className="max-w-5xl mx-auto animate-in fade-in duration-300">
                        {activeTab === 'content' && renderContentTab()}
                        {activeTab === 'description' && renderDescriptionTab()}
                        {activeTab === 'options' && renderOptionsTab()}
                        {activeTab === 'quiz' && renderQuizTab()}
                    </div>
                </main>
            </div>

            {/* Lesson Modal (Simplified) */}
            {showLessonModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[200] flex items-center justify-center p-4">
                    <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-2xl max-h-[80vh] overflow-hidden flex flex-col">
                        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                            <h3 className="text-xl font-black text-gray-900">Edit Lesson</h3>
                            <button onClick={() => setShowLessonModal(false)}><X className="w-6 h-6 text-gray-400" /></button>
                        </div>

                        {/* Modal Tabs */}
                        <div className="px-6 border-b border-gray-100 flex gap-6">
                            {['content', 'description', 'attachments'].map(t => (
                                <button
                                    key={t}
                                    onClick={() => setLessonTab(t as any)}
                                    className={`pb-4 pt-2 text-xs font-bold uppercase tracking-wider relative ${lessonTab === t ? 'text-brand-blue' : 'text-gray-400'}`}
                                >
                                    {t}
                                    {lessonTab === t && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-brand-blue rounded-full"></span>}
                                </button>
                            ))}
                        </div>

                        <div className="p-8 overflow-y-auto space-y-6">
                            {lessonTab === 'content' && (
                                <>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Lesson Title</label>
                                        <input
                                            type="text"
                                            className="w-full px-4 py-3 bg-gray-50 rounded-xl font-bold"
                                            placeholder="e.g. Chapter 1"
                                            value={lessonTitle}
                                            onChange={(e) => setLessonTitle(e.target.value)}
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <button
                                            onClick={() => setLessonType('video')}
                                            className={`p-4 rounded-xl border-2 font-bold text-center flex flex-col items-center gap-2 transition-all ${lessonType === 'video' ? 'border-brand-blue bg-brand-blue/5 text-brand-blue' : 'border-gray-100 text-gray-400 hover:border-brand-blue hover:text-brand-blue'}`}
                                        >
                                            <Video className="w-6 h-6" /> Video
                                        </button>
                                        <button
                                            onClick={() => setLessonType('document')}
                                            className={`p-4 rounded-xl border-2 font-bold text-center flex flex-col items-center gap-2 transition-all ${lessonType === 'document' ? 'border-brand-blue bg-brand-blue/5 text-brand-blue' : 'border-gray-100 text-gray-400 hover:border-brand-blue hover:text-brand-blue'}`}
                                        >
                                            <FileText className="w-6 h-6" /> Document
                                        </button>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest">{lessonType === 'video' ? 'Video URL' : 'Document URL/Text'}</label>
                                        <input
                                            type="text"
                                            className="w-full px-4 py-3 bg-gray-50 rounded-xl font-medium text-sm"
                                            placeholder={lessonType === 'video' ? "https://youtube.com/..." : "Paste content or URL..."}
                                            value={lessonContent}
                                            onChange={(e) => setLessonContent(e.target.value)}
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest">Duration</label>
                                        <input
                                            type="text"
                                            className="w-full px-4 py-3 bg-gray-50 rounded-xl font-medium text-sm"
                                            placeholder="e.g. 15:00"
                                            value={lessonDuration}
                                            onChange={(e) => setLessonDuration(e.target.value)}
                                        />
                                    </div>

                                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                                        <div className="flex items-center gap-3">
                                            <Eye className="w-5 h-5 text-gray-500" />
                                            <span className="text-sm font-bold text-gray-700">Free Preview</span>
                                        </div>
                                        <input
                                            type="checkbox"
                                            className="w-5 h-5 text-brand-blue rounded focus:ring-brand-blue"
                                            checked={lessonIsFree}
                                            onChange={(e) => setLessonIsFree(e.target.checked)}
                                        />
                                    </div>
                                </>
                            )}

                            {lessonTab === 'description' && (
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Lesson Description</label>
                                    <textarea className="w-full p-4 bg-gray-50 rounded-xl border border-gray-200 h-48 focus:outline-none focus:ring-2 focus:ring-brand-blue/20" placeholder="Describe what this lesson covers..." />
                                </div>
                            )}

                            {lessonTab === 'attachments' && (
                                <div className="text-center py-12 bg-gray-50 border-2 border-dashed border-gray-200 rounded-xl">
                                    <File className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                                    <p className="text-gray-500 text-sm font-bold">Drag & Drop files here</p>
                                    <p className="text-xs text-gray-400 mt-1">PDF, DOCX, ZIP supported</p>
                                </div>
                            )}

                        </div>
                        <div className="p-6 border-t border-gray-100 flex justify-end gap-4">
                            <button onClick={() => setShowLessonModal(false)} className="px-6 py-3 font-bold text-gray-500 hover:bg-gray-50 rounded-xl">Cancel</button>
                            <button
                                onClick={handleLessonSave}
                                className="px-8 py-3 bg-brand-blue text-white font-bold rounded-xl shadow-lg shadow-brand-blue/20"
                            >
                                Save Lesson
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {/* Add Attendee Modal */}
            {showAddAttendee && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[200] flex items-center justify-center p-4">
                    <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md animate-in zoom-in-95 duration-200">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-black text-gray-900">Add Attendee</h3>
                            <button onClick={() => setShowAddAttendee(false)}><X className="w-6 h-6 text-gray-400" /></button>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Email Address</label>
                                <input type="email" placeholder="learner@example.com" className="w-full px-4 py-3 bg-gray-50 rounded-xl font-medium focus:outline-none focus:ring-2 focus:ring-brand-blue/20" />
                            </div>
                            <button onClick={() => setShowAddAttendee(false)} className="w-full py-3 bg-brand-blue text-white font-bold rounded-xl shadow-lg shadow-brand-blue/20 hover:scale-[1.02] transition-transform">
                                Send Invite
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Contact Attendee Modal */}
            {showContactAttendee && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[200] flex items-center justify-center p-4">
                    <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-lg animate-in zoom-in-95 duration-200">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-black text-gray-900">Contact Attendees</h3>
                            <button onClick={() => setShowContactAttendee(false)}><X className="w-6 h-6 text-gray-400" /></button>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Subject</label>
                                <input type="text" placeholder="Important Announcement..." className="w-full px-4 py-3 bg-gray-50 rounded-xl font-medium focus:outline-none focus:ring-2 focus:ring-brand-blue/20" />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Message</label>
                                <textarea className="w-full p-4 bg-gray-50 rounded-xl font-medium h-32 resize-none focus:outline-none focus:ring-2 focus:ring-brand-blue/20" placeholder="Write your message here..." />
                            </div>
                            <button onClick={() => setShowContactAttendee(false)} className="w-full py-3 bg-brand-blue text-white font-bold rounded-xl shadow-lg shadow-brand-blue/20 hover:scale-[1.02] transition-transform flex items-center justify-center gap-2">
                                <Mail className="w-4 h-4" /> Send Message
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
