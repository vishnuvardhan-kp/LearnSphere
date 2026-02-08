import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, BookOpen, Save, Plus, X, Search, Video, FileText, HelpCircle, Trash2, GripVertical, Upload, Cloud, Star, ShieldCheck, Sparkles, Zap, GraduationCap, Play, Share2, Heart, Eye, User, Check, Clock, Rocket } from 'lucide-react';


interface Question {
    id: string;
    question: string;
    options: string[];
    correctAnswer: number;
}

interface Lesson {
    id: string;
    title: string;
    type: 'video' | 'quiz' | 'text';
    duration: string;
    videoLink: string;
    questions: Question[];
}

interface Module {
    id: string;
    title: string;
    lessons: Lesson[];
}

interface CourseFormData {
    title: string;
    description: string;
    category: string;
    level: string;
    duration: string;
    price: string;
    instructor: string;
    thumbnail: string;
    thumbnailFile?: File; // Store the actual file for upload
    tags: string[];
    modules: Module[];
}

interface Instructor {
    id: number;
    name: string;
    specialization: string;
}

const AddCourse = () => {
    const navigate = useNavigate();
    const [currentStep, setCurrentStep] = useState(1);
    const [showPreview, setShowPreview] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [createdCourseId, setCreatedCourseId] = useState<number | null>(null);
    const [newTag, setNewTag] = useState('');
    const [instructorSearch, setInstructorSearch] = useState('');
    const [showInstructorDropdown, setShowInstructorDropdown] = useState(false);
    const [instructors, setInstructors] = useState<Instructor[]>([]);

    // Fetch instructors
    useEffect(() => {
        const fetchInstructors = async () => {
            try {
                const response = await fetch('http://127.0.0.1:5000/api/instructors');
                if (response.ok) {
                    const data = await response.json();
                    setInstructors(data);
                }
            } catch (error) {
                console.error('Error fetching instructors:', error);
            }
        };
        fetchInstructors();
    }, []);

    const [formData, setFormData] = useState<CourseFormData>({
        title: '',
        description: '',
        category: '',
        level: 'beginner',
        duration: '',
        price: '',
        instructor: '',
        thumbnail: '',
        tags: [],
        modules: [
            { id: 'm1', title: 'Introduction', lessons: [{ id: 'l1', title: 'Welcome to the course', type: 'video', duration: '5:00', videoLink: '', questions: [] }] }
        ]
    });

    const handleInputChange = (field: keyof CourseFormData, value: any) => {
        setFormData({ ...formData, [field]: value });
    };

    const handleAddTag = () => {
        if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
            setFormData({
                ...formData,
                tags: [...formData.tags, newTag.trim()]
            });
            setNewTag('');
        }
    };

    const handleRemoveTag = (tagToRemove: string) => {
        setFormData({
            ...formData,
            tags: formData.tags.filter(tag => tag !== tagToRemove)
        });
    };

    const handleSelectInstructor = (instructorName: string) => {
        setFormData({ ...formData, instructor: instructorName });
        setInstructorSearch('');
        setShowInstructorDropdown(false);
    };

    const handleThumbnailUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];

            // Create a fake local URL for preview
            const previewUrl = URL.createObjectURL(file);
            // Update state with both preview URL and actual File object
            setFormData({
                ...formData,
                thumbnail: previewUrl,
                thumbnailFile: file
            });

            // Simulate Google Drive Upload (UI feedback)
            console.log("File prepared for upload:", file.name);
        }
    };

    const handleNext = () => {
        if (currentStep < 4) {
            setCurrentStep(currentStep + 1);
        }
    };

    const handleBack = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1);
        } else {
            navigate('/courses');
        }
    };

    // Content Management Functions
    const addModule = () => {
        const newModule: Module = {
            id: `m${Date.now()}`,
            title: '',
            lessons: []
        };
        setFormData({ ...formData, modules: [...formData.modules, newModule] });
    };

    const removeModule = (moduleId: string) => {
        setFormData({ ...formData, modules: formData.modules.filter(m => m.id !== moduleId) });
    };

    const updateModuleTitle = (moduleId: string, title: string) => {
        setFormData({
            ...formData,
            modules: formData.modules.map(m => m.id === moduleId ? { ...m, title } : m)
        });
    };

    const addLesson = (moduleId: string) => {
        const newLesson: Lesson = {
            id: `l${Date.now()}`,
            title: '',
            type: 'video',
            duration: '',
            videoLink: '',
            questions: []
        };
        setFormData({
            ...formData,
            modules: formData.modules.map(m =>
                m.id === moduleId ? { ...m, lessons: [...m.lessons, newLesson] } : m
            )
        });
    };

    const removeLesson = (moduleId: string, lessonId: string) => {
        setFormData({
            ...formData,
            modules: formData.modules.map(m =>
                m.id === moduleId ? { ...m, lessons: m.lessons.filter(l => l.id !== lessonId) } : m
            )
        });
    };

    const updateLesson = (moduleId: string, lessonId: string, updates: Partial<Lesson>) => {
        setFormData({
            ...formData,
            modules: formData.modules.map(m =>
                m.id === moduleId ? {
                    ...m,
                    lessons: m.lessons.map(l => l.id === lessonId ? { ...l, ...updates } : l)
                } : m
            )
        });
    };

    const addQuestion = (moduleId: string, lessonId: string) => {
        const newQuestion: Question = {
            id: `q${Date.now()}`,
            question: '',
            options: ['', '', '', ''],
            correctAnswer: 0
        };
        setFormData({
            ...formData,
            modules: formData.modules.map(m =>
                m.id === moduleId ? {
                    ...m,
                    lessons: m.lessons.map(l =>
                        l.id === lessonId ? { ...l, questions: [...(l.questions || []), newQuestion] } : l
                    )
                } : m
            )
        });
    };

    const removeQuestion = (moduleId: string, lessonId: string, questionId: string) => {
        setFormData({
            ...formData,
            modules: formData.modules.map(m =>
                m.id === moduleId ? {
                    ...m,
                    lessons: m.lessons.map(l =>
                        l.id === lessonId ? { ...l, questions: l.questions.filter(q => q.id !== questionId) } : l
                    )
                } : m
            )
        });
    };

    const updateQuestion = (moduleId: string, lessonId: string, questionId: string, updates: Partial<Question>) => {
        setFormData({
            ...formData,
            modules: formData.modules.map(m =>
                m.id === moduleId ? {
                    ...m,
                    lessons: m.lessons.map(l =>
                        l.id === lessonId ? {
                            ...l,
                            questions: l.questions.map(q => q.id === questionId ? { ...q, ...updates } : q)
                        } : l
                    )
                } : m
            )
        });
    };

    const handleSaveFinish = async () => {
        try {
            const data = new FormData();
            data.append('title', formData.title);
            data.append('description', formData.description);
            data.append('category', formData.category);
            data.append('level', formData.level);
            data.append('duration', formData.duration);
            data.append('price', formData.price);
            data.append('author', formData.instructor);
            data.append('tags', JSON.stringify(formData.tags));
            data.append('modules', JSON.stringify(formData.modules));

            if (formData.thumbnailFile) {
                data.append('thumbnail', formData.thumbnailFile);
            }

            const response = await fetch('http://127.0.0.1:5000/api/courses', {
                method: 'POST',
                body: data, // fetch automatically sets Content-Type to multipart/form-data
            });

            if (response.ok) {
                const result = await response.json();
                console.log('Course created:', result);
                setCreatedCourseId(result.id);
                setIsSuccess(true);
            } else {
                console.error('Failed to create course');
                alert('Failed to publish course. Please try again.');
            }
        } catch (error) {
            console.error('Error creating course:', error);
            alert('An error occurred. Please try again.');
        }
    };

    // Close instructor dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const target = event.target as HTMLElement;
            if (!target.closest('.instructor-dropdown-container')) {
                setShowInstructorDropdown(false);
            }
        };

        const handleEscape = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                setShowInstructorDropdown(false);
            }
        };

        if (showInstructorDropdown) {
            document.addEventListener('mousedown', handleClickOutside);
            document.addEventListener('keydown', handleEscape);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('keydown', handleEscape);
        };
    }, [showInstructorDropdown]);

    const isStep1Valid = formData.title.trim() && formData.description.trim() && formData.category.trim();
    const isStep2Valid = formData.duration.trim();
    const isStep3Valid = formData.modules.length > 0 && formData.modules.every(m => m.title.trim() && m.lessons.length > 0);

    const filteredInstructors = instructors.filter(inst =>
        inst.name.toLowerCase().includes(instructorSearch.toLowerCase())
    );

    const progressPercent = Math.round((currentStep / 4) * 100);

    return (
        <div className="min-h-screen bg-gray-50/50">
            {/* Header */}
            <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
                <div className="max-w-5xl mx-auto px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <button onClick={handleBack} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                                <ArrowLeft className="w-5 h-5 text-gray-600" />
                            </button>
                            <div>
                                <h1 className="text-xl font-bold text-gray-900 tracking-tight">Add New Course</h1>
                                <p className="text-xs text-gray-500 font-medium mt-0.5">
                                    Step {currentStep} of 4 - {
                                        currentStep === 1 ? 'Basic Information' :
                                            currentStep === 2 ? 'Additional Details' :
                                                currentStep === 3 ? 'Course Content' : 'Final Review'
                                    }
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <button onClick={() => navigate('/courses')} className="px-4 py-2 text-sm font-bold text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-all">
                                Cancel
                            </button>
                            {currentStep === 4 && (
                                <button
                                    onClick={handleSaveFinish}
                                    className="px-5 py-2 bg-[#0ea5e9] text-white rounded-xl font-bold text-sm hover:bg-[#0284c7] transition-all flex items-center gap-2 shadow-lg shadow-blue-500/20"
                                >
                                    <Save className="w-4 h-4" />
                                    Publish Course
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </header>

            <div className="max-w-5xl mx-auto px-6 py-8">
                {/* Progress Bar */}
                <div className="mb-8">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-bold text-gray-700">Creation Progress</span>
                        <span className="text-sm font-bold text-[#0ea5e9]">{progressPercent}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-[#0ea5e9] h-2 rounded-full transition-all duration-500 ease-out" style={{ width: `${progressPercent}%` }} />
                    </div>
                </div>

                {/* Step 1: Basic Information */}
                {currentStep === 1 && (
                    <div className="bg-white rounded-xl border border-gray-200 p-8 animate-in fade-in slide-in-from-bottom-4 duration-300">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                                <BookOpen className="w-6 h-6 text-[#0ea5e9]" />
                            </div>
                            <div>
                                <h2 className="text-lg font-bold text-gray-900">Basic Information</h2>
                                <p className="text-sm text-gray-500">Essential course details and categorization</p>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Course Title *</label>
                                <input
                                    type="text"
                                    value={formData.title}
                                    onChange={(e) => handleInputChange('title', e.target.value)}
                                    placeholder="e.g., Complete Web Development Bootcamp"
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-4 focus:ring-[#0ea5e9]/10 focus:border-[#0ea5e9] outline-none transition-all font-medium"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Description *</label>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) => handleInputChange('description', e.target.value)}
                                    placeholder="Detailed overview of the course content..."
                                    rows={4}
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-4 focus:ring-[#0ea5e9]/10 focus:border-[#0ea5e9] outline-none transition-all font-medium resize-none"
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Category *</label>
                                    <select
                                        value={formData.category}
                                        onChange={(e) => handleInputChange('category', e.target.value)}
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-4 focus:ring-[#0ea5e9]/10 focus:border-[#0ea5e9] font-medium"
                                    >
                                        <option value="">Select Category</option>
                                        <option value="programming">Programming</option>
                                        <option value="design">Design</option>
                                        <option value="business">Business</option>
                                        <option value="marketing">Marketing</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Level</label>
                                    <select
                                        value={formData.level}
                                        onChange={(e) => handleInputChange('level', e.target.value)}
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none font-medium"
                                    >
                                        <option value="beginner">Beginner</option>
                                        <option value="intermediate">Intermediate</option>
                                        <option value="advanced">Advanced</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Tags</label>
                                <div className="flex gap-2 mb-3">
                                    <input
                                        type="text"
                                        value={newTag}
                                        onChange={(e) => setNewTag(e.target.value)}
                                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                                        placeholder="Add tag (e.g. React)"
                                        className="flex-1 px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg outline-none"
                                    />
                                    <button onClick={handleAddTag} className="px-4 py-2 bg-[#0ea5e9] text-white rounded-lg font-bold text-sm">Add</button>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {formData.tags.map(tag => (
                                        <span key={tag} className="px-3 py-1 bg-blue-50 text-[#0ea5e9] rounded-lg text-sm font-bold flex items-center gap-2 border border-blue-100">
                                            {tag}
                                            <button onClick={() => handleRemoveTag(tag)} className="hover:text-red-500"><X className="w-3 h-3" /></button>
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="mt-8 flex justify-end">
                            <button onClick={handleNext} disabled={!isStep1Valid} className="px-8 py-3 bg-[#0ea5e9] text-white rounded-xl font-bold shadow-lg shadow-blue-500/20 disabled:opacity-50">
                                Next Step →
                            </button>
                        </div>
                    </div>
                )}

                {/* Step 2: Additional Details */}
                {currentStep === 2 && (
                    <div className="bg-white rounded-xl border border-gray-200 p-8 animate-in fade-in slide-in-from-right-4 duration-300">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                                <Search className="w-6 h-6 text-purple-600" />
                            </div>
                            <div>
                                <h2 className="text-lg font-bold text-gray-900">Additional Details</h2>
                                <p className="text-sm text-gray-500">Instructor and logistics information</p>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="relative instructor-dropdown-container">
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Instructor <span className="text-gray-400 font-normal text-xs">(optional)</span></label>
                                    <div className="relative">
                                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                                        <input
                                            type="text"
                                            value={formData.instructor || instructorSearch}
                                            onChange={(e) => { setInstructorSearch(e.target.value); handleInputChange('instructor', ''); setShowInstructorDropdown(true); }}
                                            onFocus={() => setShowInstructorDropdown(true)}
                                            placeholder="Search instructors..."
                                            className="w-full pl-9 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-4 focus:ring-[#0ea5e9]/10 outline-none"
                                        />
                                    </div>
                                    {showInstructorDropdown && (
                                        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl border border-gray-200 shadow-xl z-50 max-h-60 overflow-y-auto">
                                            <button onClick={() => { handleInputChange('instructor', 'Add Later'); setShowInstructorDropdown(false); }} className="w-full p-4 text-left hover:bg-gray-50 flex items-center gap-3 border-b">
                                                <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center"><Plus className="w-4 h-4" /></div>
                                                <span className="text-sm font-bold">Assign Instructor Later</span>
                                            </button>
                                            {filteredInstructors.map(inst => (
                                                <button key={inst.id} onClick={() => handleSelectInstructor(inst.name)} className="w-full p-3 text-left hover:bg-blue-50 flex items-center gap-3 border-b last:border-0">
                                                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center font-bold text-blue-600 text-xs">{inst.name.charAt(0)}</div>
                                                    <div>
                                                        <p className="text-sm font-bold text-gray-900">{inst.name}</p>
                                                        <p className="text-xs text-gray-500">{(inst as any).expertise}</p>
                                                    </div>
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Course Duration *</label>
                                    <input
                                        type="text"
                                        value={formData.duration}
                                        onChange={(e) => handleInputChange('duration', e.target.value)}
                                        placeholder="e.g. 15 hours"
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-4 focus:ring-[#0ea5e9]/10"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Price (Optional)</label>
                                    <input type="text" value={formData.price} onChange={(e) => handleInputChange('price', e.target.value)} placeholder="e.g. $49.99" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none" />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Thumbnail Image</label>
                                    <div className="flex flex-col gap-3">
                                        {formData.thumbnail && (
                                            <div className="relative w-full h-40 bg-gray-100 rounded-xl overflow-hidden border border-gray-200 group">
                                                <img src={formData.thumbnail} alt="Thumbnail preview" className="w-full h-full object-cover" />
                                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                    <p className="text-white text-xs font-bold flex items-center gap-2">
                                                        <Cloud className="w-4 h-4" /> Saved to Drive
                                                    </p>
                                                </div>
                                                <button
                                                    onClick={() => handleInputChange('thumbnail', '')}
                                                    className="absolute top-2 right-2 p-1.5 bg-white/90 text-red-500 rounded-lg hover:bg-white transition-all shadow-sm"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        )}
                                        {!formData.thumbnail && (
                                            <div className="relative">
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={handleThumbnailUpload}
                                                    className="hidden"
                                                    id="thumbnail-upload"
                                                />
                                                <label
                                                    htmlFor="thumbnail-upload"
                                                    className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:bg-gray-50 hover:border-[#0ea5e9] transition-all group bg-white"
                                                >
                                                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                                        <Upload className="w-8 h-8 text-gray-400 group-hover:text-[#0ea5e9] mb-2 transition-colors" />
                                                        <p className="text-sm text-gray-500 font-medium group-hover:text-gray-700">Click to upload thumbnail</p>
                                                        <p className="text-[10px] text-gray-400 mt-1">SVG, PNG, JPG or GIF (MAX. 2MB)</p>
                                                        <div className="mt-2 flex items-center gap-1.5 px-2 py-1 bg-blue-50 rounded text-[10px] font-bold text-[#0ea5e9]">
                                                            <Cloud className="w-3 h-3" />
                                                            <span>Syncs to Google Drive</span>
                                                        </div>
                                                    </div>
                                                </label>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="mt-8 flex justify-between">
                            <button onClick={handleBack} className="px-8 py-3 text-gray-600 font-bold hover:bg-gray-100 rounded-xl">← Back</button>
                            <button onClick={handleNext} disabled={!isStep2Valid} className="px-8 py-3 bg-[#0ea5e9] text-white rounded-xl font-bold shadow-lg shadow-blue-500/20 disabled:opacity-50">Next Step →</button>
                        </div>
                    </div>
                )}

                {/* Step 3: Course Content */}
                {currentStep === 3 && (
                    <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                        <div className="bg-white rounded-xl border border-gray-200 p-8 mb-6">
                            <div className="flex items-center justify-between mb-8">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                                        <Video className="w-6 h-6 text-green-600" />
                                    </div>
                                    <div>
                                        <h2 className="text-lg font-bold text-gray-900">Course Content</h2>
                                        <p className="text-sm text-gray-500">Organize your lessons into modules</p>
                                    </div>
                                </div>
                                <button onClick={addModule} className="flex items-center gap-2 px-4 py-2 bg-[#0ea5e9] text-white rounded-lg font-bold text-sm hover:bg-[#0284c7] transition-all">
                                    <Plus className="w-4 h-4" /> Add Module
                                </button>
                            </div>

                            <div className="space-y-6">
                                {formData.modules.map((module) => (
                                    <div key={module.id} className="border border-gray-200 rounded-xl overflow-hidden group">
                                        <div className="bg-gray-50 px-4 py-3 border-b flex items-center justify-between">
                                            <div className="flex items-center gap-3 flex-1">
                                                <GripVertical className="w-4 h-4 text-gray-400" />
                                                <input
                                                    type="text"
                                                    value={module.title}
                                                    onChange={(e) => updateModuleTitle(module.id, e.target.value)}
                                                    placeholder="Module Title (e.g., Getting Started)"
                                                    className="bg-transparent border-none font-bold text-gray-900 focus:ring-0 p-0 text-sm w-full"
                                                />
                                            </div>
                                            <button onClick={() => removeModule(module.id)} className="p-1.5 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                        <div className="p-4 space-y-3">
                                            {module.lessons.map((lesson) => (
                                                <div key={lesson.id}>
                                                    <div className="flex items-center gap-3 bg-white border border-gray-100 rounded-lg p-3 hover:border-blue-200 hover:shadow-sm transition-all mb-3">
                                                        {lesson.type === 'video' ? <Video className="w-4 h-4 text-blue-500" /> : lesson.type === 'quiz' ? <HelpCircle className="w-4 h-4 text-orange-500" /> : <FileText className="w-4 h-4 text-green-500" />}
                                                        <input
                                                            type="text"
                                                            value={lesson.title}
                                                            onChange={(e) => updateLesson(module.id, lesson.id, { title: e.target.value })}
                                                            placeholder="Lesson Title"
                                                            className="flex-1 text-sm border-none focus:ring-0 p-0 font-medium"
                                                        />
                                                        <select
                                                            value={lesson.type}
                                                            onChange={(e) => updateLesson(module.id, lesson.id, { type: e.target.value as any })}
                                                            className="text-xs border-none bg-gray-50 rounded p-1"
                                                        >
                                                            <option value="video">Video</option>
                                                            <option value="quiz">Quiz</option>
                                                            <option value="text">Article</option>
                                                        </select>
                                                        {lesson.type === 'video' && (
                                                            <input
                                                                type="text"
                                                                value={lesson.videoLink || ''}
                                                                onChange={(e) => updateLesson(module.id, lesson.id, { videoLink: e.target.value })}
                                                                placeholder="Video Link (YouTube/Drive)"
                                                                className="flex-1 text-xs border-none bg-gray-50 rounded p-1"
                                                            />
                                                        )}
                                                        <input
                                                            type="text"
                                                            value={lesson.duration}
                                                            onChange={(e) => updateLesson(module.id, lesson.id, { duration: e.target.value })}
                                                            placeholder="Dur."
                                                            className="w-16 text-xs text-center bg-gray-50 border-none rounded p-1"
                                                        />
                                                        <button onClick={() => removeLesson(module.id, lesson.id)} className="p-1 text-gray-400 hover:text-red-500"><X className="w-3 h-3" /></button>
                                                    </div>
                                                    {lesson.type === 'quiz' && (
                                                        <div className="ml-7 mt-2 mb-4 space-y-4 p-4 bg-gray-50/50 rounded-xl border border-gray-100">
                                                            <div className="flex items-center justify-between mb-2">
                                                                <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-400">Quiz Configuration</h4>
                                                                <button
                                                                    onClick={() => addQuestion(module.id, lesson.id)}
                                                                    className="px-3 py-1 bg-orange-500/10 text-orange-600 rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-orange-500/20 transition-all flex items-center gap-2"
                                                                >
                                                                    <Plus className="w-3 h-3" /> Add Question
                                                                </button>
                                                            </div>

                                                            {lesson.questions?.map((question, qIdx) => (
                                                                <div key={question.id} className="bg-white p-4 rounded-xl border border-gray-100 space-y-4 shadow-sm relative group/q">
                                                                    <button
                                                                        onClick={() => removeQuestion(module.id, lesson.id, question.id)}
                                                                        className="absolute top-2 right-2 p-1.5 text-gray-300 hover:text-red-500 opacity-0 group-hover/q:opacity-100 transition-opacity"
                                                                    >
                                                                        <Trash2 className="w-3.5 h-3.5" />
                                                                    </button>
                                                                    <div>
                                                                        <label className="block text-[8px] font-black uppercase tracking-[0.2em] text-gray-400 mb-1.5">Question {qIdx + 1}</label>
                                                                        <input
                                                                            type="text"
                                                                            value={question.question}
                                                                            onChange={(e) => updateQuestion(module.id, lesson.id, question.id, { question: e.target.value })}
                                                                            placeholder="Enter your question here..."
                                                                            className="w-full bg-gray-50 border-none rounded-lg text-sm font-bold focus:ring-2 focus:ring-orange-500/20 px-3 py-2"
                                                                        />
                                                                    </div>
                                                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                                                        {question.options.map((option, oIdx) => (
                                                                            <div key={oIdx} className="flex items-center gap-2">
                                                                                <button
                                                                                    onClick={() => updateQuestion(module.id, lesson.id, question.id, { correctAnswer: oIdx })}
                                                                                    className={`w-6 h-6 rounded-lg flex items-center justify-center border font-black text-[10px] transition-all ${question.correctAnswer === oIdx
                                                                                        ? 'bg-orange-500 border-orange-500 text-white'
                                                                                        : 'bg-white border-gray-200 text-gray-300 hover:border-orange-200 hover:text-orange-300'
                                                                                        }`}
                                                                                >
                                                                                    {String.fromCharCode(65 + oIdx)}
                                                                                </button>
                                                                                <input
                                                                                    type="text"
                                                                                    value={option}
                                                                                    onChange={(e) => {
                                                                                        const newOptions = [...question.options];
                                                                                        newOptions[oIdx] = e.target.value;
                                                                                        updateQuestion(module.id, lesson.id, question.id, { options: newOptions });
                                                                                    }}
                                                                                    placeholder={`Option ${String.fromCharCode(65 + oIdx)}`}
                                                                                    className="flex-1 bg-gray-50/50 border-none rounded-lg text-xs font-medium focus:ring-2 focus:ring-orange-500/10 px-3 py-1.5"
                                                                                />
                                                                            </div>
                                                                        ))}
                                                                    </div>
                                                                </div>
                                                            ))}

                                                            {(!lesson.questions || lesson.questions.length === 0) && (
                                                                <div className="text-center py-6 border-2 border-dashed border-gray-100 rounded-xl">
                                                                    <HelpCircle className="w-8 h-8 text-gray-200 mx-auto mb-2" />
                                                                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-300 italic">No questions provisioned for this quiz</p>
                                                                </div>
                                                            )}
                                                        </div>
                                                    )}
                                                </div>
                                            ))}
                                            <button onClick={() => addLesson(module.id)} className="w-full py-2 border border-dashed border-gray-300 rounded-lg text-xs font-bold text-gray-500 hover:bg-gray-50 flex items-center justify-center gap-2">
                                                <Plus className="w-3 h-3" /> Add Lesson
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="flex justify-between items-center bg-gray-50 border border-gray-200 rounded-xl p-6 mb-8">
                            <button onClick={handleBack} className="px-8 py-3 text-gray-600 font-bold hover:bg-gray-100 rounded-xl">← Back</button>
                            <button onClick={handleNext} disabled={!isStep3Valid} className="px-8 py-3 bg-[#0ea5e9] text-white rounded-xl font-bold shadow-lg shadow-blue-500/20 disabled:opacity-50">Review Details →</button>
                        </div>
                    </div>
                )}

                {/* Step 4: Final Review */}
                {currentStep === 4 && (
                    <div className="animate-in fade-in slide-in-from-right-4 duration-300 space-y-6">
                        <div className="bg-white rounded-xl border border-gray-200 p-8">
                            <div className="flex items-center gap-3 mb-8">
                                <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center">
                                    <Save className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <h2 className="text-lg font-bold text-gray-900">Final Review</h2>
                                    <p className="text-sm text-gray-500">Verify all details before publishing</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                {/* Left Column: Basic & Additional Details */}
                                <div className="md:col-span-1 space-y-6">
                                    <div className="p-5 bg-gray-50 rounded-xl border border-gray-100">
                                        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Course Info</h3>
                                        <div className="space-y-4">
                                            <div>
                                                <p className="text-xs text-gray-500">Title</p>
                                                <p className="text-sm font-bold text-gray-900">{formData.title}</p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-gray-500">Category & Level</p>
                                                <p className="text-sm font-bold text-gray-900 capitalize">{formData.category} • {formData.level}</p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-gray-500">Duration</p>
                                                <p className="text-sm font-bold text-gray-900">{formData.duration}</p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-gray-500">Price</p>
                                                <p className="text-sm font-bold text-gray-900">{formData.price || 'Free'}</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="p-5 bg-gray-50 rounded-xl border border-gray-100">
                                        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Instructor</h3>
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center font-bold text-blue-600">
                                                {(formData.instructor || 'A').charAt(0)}
                                            </div>
                                            <p className="text-sm font-bold text-gray-900">{formData.instructor || 'Not assigned'}</p>
                                        </div>
                                    </div>

                                    <div className="p-5 bg-gray-50 rounded-xl border border-gray-100">
                                        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Tags</h3>
                                        <div className="flex flex-wrap gap-2">
                                            {formData.tags.map(tag => (
                                                <span key={tag} className="px-2 py-1 bg-white text-xs font-bold text-gray-600 border border-gray-200 rounded-md">{tag}</span>
                                            ))}
                                            {formData.tags.length === 0 && <p className="text-xs text-gray-400 italic">No tags added</p>}
                                        </div>
                                    </div>
                                </div>

                                {/* Right Column: Description & Content Summary */}
                                <div className="md:col-span-2 space-y-6">
                                    <div className="p-6 bg-gray-50 rounded-xl border border-gray-100">
                                        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Description</h3>
                                        <p className="text-sm text-gray-700 leading-relaxed">{formData.description}</p>
                                    </div>

                                    <div className="p-6 bg-gray-50 rounded-xl border border-gray-100">
                                        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Curriculum Structure</h3>
                                        <div className="space-y-4">
                                            {formData.modules.map((module, idx) => (
                                                <div key={module.id} className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                                                    <div className="flex justify-between items-center mb-2">
                                                        <h4 className="text-sm font-bold text-gray-900">Module {idx + 1}: {module.title}</h4>
                                                        <span className="text-xs text-gray-400">{module.lessons.length} Lessons</span>
                                                    </div>
                                                    <div className="pl-4 space-y-1 border-l-2 border-blue-100">
                                                        {module.lessons.map(lesson => (
                                                            <div key={lesson.id} className="flex justify-between text-xs py-1">
                                                                <div className="flex items-center gap-2 text-gray-600">
                                                                    <span>• {lesson.title}</span>
                                                                    {lesson.type === 'quiz' && (
                                                                        <span className="px-1.5 py-0.5 bg-orange-50 text-orange-600 border border-orange-100 rounded text-[8px] font-black uppercase">
                                                                            {lesson.questions?.length || 0} QUEST.
                                                                        </span>
                                                                    )}
                                                                </div>
                                                                <span className="text-gray-400 uppercase">{lesson.type}</span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-between items-center bg-gray-900 rounded-2xl p-8 text-white shadow-2xl">
                            <div>
                                <h3 className="text-xl font-bold">Ready to Publish?</h3>
                                <p className="text-sm text-gray-400 mt-1">Make sure all details are accurate. You can always edit them later.</p>
                            </div>
                            <div className="flex gap-4">
                                <button onClick={() => setShowPreview(true)} className="px-6 py-3 bg-white/10 text-white rounded-xl font-bold hover:bg-white/20 transition-all flex items-center gap-2">
                                    <Eye className="w-4 h-4" /> Live Preview
                                </button>
                                <button onClick={handleBack} className="px-6 py-3 text-sm font-bold text-gray-400 hover:text-white transition-colors">← Go Back</button>
                                <button onClick={handleSaveFinish} className="px-10 py-3 bg-[#0ea5e9] text-white rounded-xl font-bold shadow-xl shadow-blue-500/20 hover:scale-105 active:scale-95 transition-all">Confirm & Publish</button>
                            </div>
                        </div>

                        {/* Premium Preview Modal */}
                        {showPreview && (
                            <div className="fixed inset-0 z-[100] bg-white overflow-y-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
                                <div className="sticky top-0 z-[110] bg-white/80 backdrop-blur-xl border-b border-gray-100 px-[5%] py-4 flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className="px-3 py-1 bg-blue-50 text-[#0ea5e9] rounded-lg text-[10px] font-black uppercase tracking-widest border border-blue-100">
                                            Preview Mode
                                        </div>
                                        <h2 className="text-sm font-bold text-gray-900 italic">Learner's Perspective Preview</h2>
                                    </div>
                                    <button
                                        onClick={() => setShowPreview(false)}
                                        className="px-4 py-2 bg-gray-900 text-white rounded-xl font-black text-[10px] uppercase tracking-widest hover:scale-105 transition-all shadow-xl shadow-gray-900/20"
                                    >
                                        Exit Preview
                                    </button>
                                </div>

                                <main className="w-full">
                                    {/* Premium Hero Section */}
                                    <div className="relative bg-gray-900 border-b border-white/5 overflow-hidden">
                                        <div className="absolute inset-0">
                                            {formData.thumbnail ? (
                                                <img src={formData.thumbnail} alt="" className="w-full h-full object-cover opacity-20" />
                                            ) : (
                                                <div className="w-full h-full bg-gradient-to-br from-gray-800 to-gray-950 opacity-50"></div>
                                            )}
                                            <div className="absolute inset-0 bg-gradient-to-r from-gray-900 via-gray-900/90 to-transparent"></div>
                                        </div>

                                        <div className="relative z-10 px-[5%] py-20 max-w-7xl">
                                            <div className="space-y-6">
                                                <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#0ea5e9]/20 rounded-full border border-[#0ea5e9]/30 backdrop-blur-md">
                                                    <ShieldCheck className="w-3.5 h-3.5 text-[#0ea5e9]" />
                                                    <span className="text-[10px] font-black uppercase tracking-widest text-[#0ea5e9]">{formData.category || 'GENERAL'}</span>
                                                </div>

                                                <h1 className="text-6xl font-black text-white tracking-tight leading-none italic max-w-4xl">
                                                    {formData.title || 'Untitled Learning Path'}
                                                </h1>

                                                <p className="text-xl text-white/60 font-medium max-w-2xl leading-relaxed italic">
                                                    {formData.description || 'Master the fundamentals of modern technology with this expert-led curriculum.'}
                                                </p>

                                                <div className="flex flex-wrap items-center gap-8 pt-4">
                                                    <div className="flex items-center gap-2">
                                                        <div className="flex -space-x-1">
                                                            {[1, 2, 3, 4, 5].map(i => <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />)}
                                                        </div>
                                                        <span className="text-lg font-black text-white leading-none">4.9</span>
                                                        <span className="text-white/40 text-sm font-bold">(128 reviews)</span>
                                                    </div>
                                                    <div className="flex items-center gap-2 text-white/60 text-sm font-bold uppercase tracking-widest">
                                                        <Clock className="w-4 h-4" />
                                                        {formData.duration || '0h 0m'}
                                                    </div>
                                                    <div className="flex items-center gap-2 text-white/60 text-sm font-bold uppercase tracking-widest">
                                                        <User className="w-4 h-4" />
                                                        0 Learners enrolled
                                                    </div>
                                                </div>

                                                <div className="flex items-center gap-6 pt-10">
                                                    <div className="flex items-center gap-4 group cursor-pointer">
                                                        <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center border-2 border-white/10 group-hover:border-[#0ea5e9] transition-colors">
                                                            <User className="w-6 h-6 text-white" />
                                                        </div>
                                                        <div>
                                                            <div className="text-xs font-black text-white/40 uppercase tracking-widest">Path Instructor</div>
                                                            <div className="text-lg font-black text-white tracking-tight">{formData.instructor || 'LearnSphere Expert'}</div>
                                                        </div>
                                                    </div>
                                                    <div className="h-10 w-px bg-white/10"></div>
                                                    <div className="text-white/40 text-xs font-black uppercase tracking-[0.2em]">Institutional Grade</div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Floating Purchase Card */}
                                        <div className="hidden xl:block absolute top-20 right-[5%] w-[400px] z-20">
                                            <div className="bg-white rounded-[40px] shadow-[0_40px_80px_-20px_rgba(0,0,0,0.3)] overflow-hidden border border-gray-100 p-8 space-y-8">
                                                <div className="relative aspect-video rounded-[32px] overflow-hidden group">
                                                    {formData.thumbnail ? (
                                                        <img src={formData.thumbnail} alt="" className="w-full h-full object-cover" />
                                                    ) : (
                                                        <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-300">
                                                            <BookOpen className="w-12 h-12" />
                                                        </div>
                                                    )}
                                                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-[2px]">
                                                        <Play className="w-12 h-12 text-white fill-current" />
                                                    </div>
                                                    <div className="absolute bottom-4 left-0 right-0 text-center text-white text-[10px] font-black uppercase tracking-[0.2em] drop-shadow-md">Trailer Preview</div>
                                                </div>

                                                <div className="space-y-4">
                                                    <button
                                                        className="w-full bg-[#0ea5e9] text-white py-6 rounded-[28px] font-black text-sm uppercase tracking-[0.2em] flex items-center justify-center gap-3 shadow-2xl shadow-[#0ea5e9]/30 hover:scale-105 active:scale-95 transition-all"
                                                    >
                                                        Enroll Path <Zap className="w-4 h-4 fill-white" />
                                                    </button>
                                                    <button className="w-full bg-gray-50 text-gray-900 py-6 rounded-[28px] font-black text-sm uppercase tracking-[0.2em] hover:bg-gray-100 transition-all">
                                                        Save to Wishlist <Heart className="w-4 h-4" />
                                                    </button>
                                                </div>

                                                <div className="space-y-4">
                                                    <div className="text-xs font-black text-gray-900 uppercase tracking-widest px-2">Path Includes:</div>
                                                    <div className="grid grid-cols-1 gap-3">
                                                        {[
                                                            { icon: Clock, text: 'Full lifetime access' },
                                                            { icon: GraduationCap, text: 'Institutional Certification' },
                                                            { icon: ShieldCheck, text: 'Hands-on AI Playground' },
                                                            { icon: BookOpen, text: 'Digital Assets & Blueprints' }
                                                        ].map((item, i) => (
                                                            <div key={i} className="flex items-center gap-3 text-[11px] font-bold text-gray-500 px-2 leading-none">
                                                                <item.icon className="w-4 h-4 text-[#0ea5e9]" />
                                                                {item.text}
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Content Section */}
                                    <div className="px-[5%] py-24 bg-white">
                                        <div className="max-w-7xl grid grid-cols-1 xl:grid-cols-3 gap-24">
                                            <div className="xl:col-span-2 space-y-20">
                                                {/* What you will learn */}
                                                <section className="bg-gray-50 overflow-hidden rounded-[48px] p-12 border border-gray-100 relative group">
                                                    <div className="absolute top-0 right-0 w-64 h-64 bg-[#0ea5e9]/5 blur-[100px] -mr-32 -mt-32"></div>
                                                    <h2 className="text-3xl font-black text-gray-900 tracking-tight mb-10 flex items-center gap-4 italic">
                                                        Target Learning Intelligence
                                                        <div className="flex-1 h-px bg-gray-200"></div>
                                                    </h2>
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                                        {formData.tags.length > 0 ? formData.tags.map((tag, i) => (
                                                            <div key={i} className="flex items-start gap-4">
                                                                <div className="w-6 h-6 rounded-xl bg-white border border-gray-100 flex items-center justify-center shrink-0 shadow-sm mt-0.5">
                                                                    <Check className="w-3.5 h-3.5 text-[#0ea5e9] stroke-[3]" />
                                                                </div>
                                                                <span className="text-sm font-bold text-gray-600 leading-relaxed italic">Master {tag} concepts and practical applications</span>
                                                            </div>
                                                        )) : (
                                                            ['Automate processes with AI agents', 'Identify modern behavior patterns', 'Configure response protocols'].map((point, i) => (
                                                                <div key={i} className="flex items-start gap-4">
                                                                    <div className="w-6 h-6 rounded-xl bg-white border border-gray-100 flex items-center justify-center shrink-0 shadow-sm mt-0.5">
                                                                        <Check className="w-3.5 h-3.5 text-[#0ea5e9] stroke-[3]" />
                                                                    </div>
                                                                    <span className="text-sm font-bold text-gray-600 leading-relaxed italic">{point}</span>
                                                                </div>
                                                            ))
                                                        )}
                                                    </div>
                                                </section>

                                                {/* Curriculum */}
                                                <section className="space-y-10">
                                                    <h2 className="text-3xl font-black text-gray-900 tracking-tight italic">Technical Curriculum</h2>
                                                    <div className="space-y-4">
                                                        {formData.modules.map((module, i) => (
                                                            <div key={module.id} className="bg-white border border-gray-100 rounded-[32px] overflow-hidden group">
                                                                <div className="p-8 flex items-center justify-between hover:bg-gray-50 transition-colors cursor-pointer">
                                                                    <div className="flex items-center gap-6">
                                                                        <div className="w-10 h-10 bg-gray-900 text-white rounded-xl flex items-center justify-center font-black text-xs italic">0{i + 1}</div>
                                                                        <h4 className="text-lg font-black text-gray-900 tracking-tight italic">{module.title}</h4>
                                                                    </div>
                                                                    <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{module.lessons.length} Modules</div>
                                                                </div>
                                                                <div className="bg-gray-50/50 p-6 space-y-3">
                                                                    {module.lessons.map((lesson) => (
                                                                        <div key={lesson.id} className="flex items-center justify-between px-6 py-4 bg-white rounded-2xl border border-gray-100 text-sm font-bold text-gray-500 italic group/lesson hover:border-[#0ea5e9]/30 transition-all">
                                                                            <div className="flex items-center gap-4">
                                                                                <Play className="w-3.5 h-3.5 text-[#0ea5e9] opacity-40 group-hover/lesson:opacity-100" />
                                                                                {lesson.title}
                                                                            </div>
                                                                            <div className="flex items-center gap-2">
                                                                                {lesson.type === 'quiz' && (
                                                                                    <span className="px-2 py-0.5 bg-orange-50 text-orange-600 border border-orange-100 rounded-[4px] text-[8px] font-black uppercase tracking-widest">
                                                                                        Quiz
                                                                                    </span>
                                                                                )}
                                                                                <span className="text-[10px] text-gray-400 font-black">{lesson.duration || '0m'}</span>
                                                                            </div>
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </section>
                                            </div>

                                            <div className="space-y-12">
                                                {/* Requirements */}
                                                <div className="space-y-6">
                                                    <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Operational Requirements</h3>
                                                    <ul className="space-y-4">
                                                        {["Basic understanding of technology architecture", "Institutional access token", "Familiarity with digital perimeter defense"].map((req, i) => (
                                                            <li key={i} className="flex lg:items-center gap-3 text-sm font-bold text-gray-900 border-b border-gray-50 pb-4 italic">
                                                                <Sparkles className="w-4 h-4 text-[#0ea5e9] shrink-0" />
                                                                {req}
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>

                                                {/* Trust Badge */}
                                                <div className="p-8 bg-[#0ea5e9]/5 rounded-[40px] border border-[#0ea5e9]/10 space-y-6 text-center italic relative overflow-hidden">
                                                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#0ea5e9] to-purple-600"></div>
                                                    <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto shadow-xl shadow-[#0ea5e9]/10">
                                                        <ShieldCheck className="w-8 h-8 text-[#0ea5e9]" />
                                                    </div>
                                                    <h4 className="text-xl font-black text-gray-900 italic tracking-tight">Institutional Guarantee</h4>
                                                    <p className="text-sm font-medium text-gray-500">Upon completion, receive an autonomous verification badge recognizable across all partner ecosystems.</p>
                                                    <Share2 className="w-6 h-6 text-[#0ea5e9]/40 mx-auto" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </main>
                            </div>
                        )}

                        {/* Success Modal */}
                        {isSuccess && (
                            <div className="fixed inset-0 z-[200] bg-gray-900/60 backdrop-blur-md flex items-center justify-center p-4">
                                <div className="bg-white rounded-[40px] p-12 max-w-md w-full text-center space-y-8 animate-in zoom-in-95 duration-300">
                                    <div className="w-24 h-24 bg-green-50 rounded-[32px] flex items-center justify-center mx-auto shadow-xl shadow-green-500/10">
                                        <Check className="w-12 h-12 text-green-500" />
                                    </div>
                                    <div className="space-y-4">
                                        <h2 className="text-4xl font-black text-gray-900 italic tracking-tight italic">Published!</h2>
                                        <p className="text-gray-500 font-medium">Your course is now live and ready for enrollment.</p>
                                    </div>
                                    <div className="space-y-4 pt-4">
                                        <a
                                            href={`http://localhost:5174/company/course/${createdCourseId}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="w-full bg-[#0ea5e9] text-white py-6 rounded-[28px] font-black text-sm uppercase tracking-[0.2em] flex items-center justify-center gap-3 shadow-2xl shadow-blue-500/30 hover:scale-105 active:scale-95 transition-all"
                                        >
                                            Enroll & View Course <Rocket className="w-5 h-5 fill-white" />
                                        </a>
                                        <button
                                            onClick={() => navigate('/courses')}
                                            className="w-full bg-gray-50 text-gray-900 py-6 rounded-[28px] font-black text-sm uppercase tracking-[0.2em] hover:bg-gray-100 transition-all"
                                        >
                                            Return to Dashboard
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default AddCourse;
