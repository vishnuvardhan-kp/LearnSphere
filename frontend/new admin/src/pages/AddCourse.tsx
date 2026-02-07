


import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Save, X, Plus, Trash2, GripVertical, ChevronRight, Layout, Video, FileText, HelpCircle, ChevronDown, Search } from 'lucide-react';
import api from '../services/api';


interface Lesson {
    id: number;
    title: string;
    type: 'video' | 'quiz' | 'text';
    duration: string;
    isFree: boolean;
}

interface Module {
    id: number;
    title: string;
    lessons: Lesson[];
}

interface CourseFormData {
    title: string;
    shortDescription: string;
    description: string;
    duration: string;
    category: string;
    level: string;
    language: string;
    price: string;
    discountPrice: string;
    instructor: string; // Will store instructor ID
    thumbnail: string;
    video: string;
    tags: string[];
    modules: Module[];
}

const AddCourse = () => {
    const navigate = useNavigate();
    const [activeStep, setActiveStep] = useState(1);
    const [newTag, setNewTag] = useState('');
    const [instructors, setInstructors] = useState<any[]>([]); // Added state for instructors
    const [instructorSearch, setInstructorSearch] = useState('');
    const [showInstructorDropdown, setShowInstructorDropdown] = useState(false);

    const [formData, setFormData] = useState<CourseFormData>({
        title: '',
        shortDescription: '',
        description: '',
        duration: '',
        category: '',
        level: 'Beginner',
        language: 'English',
        price: '',
        discountPrice: '',
        instructor: '',
        thumbnail: '',
        video: '',
        tags: [],
        modules: [
            {
                id: 1,
                title: 'Introduction',
                lessons: [
                    { id: 1, title: 'Course Overview', type: 'video', duration: '5:00', isFree: true }
                ]
            }
        ]
    });

    useEffect(() => {
        // Fetch instructors for the dropdown
        const fetchInstructors = async () => {
            try {
                const res = await api.get('/users/instructors');
                setInstructors(res.data);
            } catch (error) {
                console.error("Error fetching instructors", error);
            }
        };
        fetchInstructors();
    }, []);

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

    const handleNext = () => {
        if (activeStep < 4) {
            setActiveStep(activeStep + 1);
        }
    };

    const handleBack = () => {
        if (activeStep > 1) {
            setActiveStep(activeStep - 1);
        } else {
            navigate('/courses');
        }
    };

    // Content Management Functions
    const addModule = () => {
        const newModule: Module = {
            id: Date.now(),
            title: '',
            lessons: []
        };
        setFormData({ ...formData, modules: [...formData.modules, newModule] });
    };

    const removeModule = (moduleId: number) => {
        setFormData({ ...formData, modules: formData.modules.filter(m => m.id !== moduleId) });
    };

    const updateModuleTitle = (moduleId: number, title: string) => {
        setFormData({
            ...formData,
            modules: formData.modules.map(m => m.id === moduleId ? { ...m, title } : m)
        });
    };

    const addLesson = (moduleId: number) => {
        const newLesson: Lesson = {
            id: Date.now(),
            title: '',
            type: 'video',
            duration: '',
            isFree: false
        };
        setFormData({
            ...formData,
            modules: formData.modules.map(m =>
                m.id === moduleId ? { ...m, lessons: [...m.lessons, newLesson] } : m
            )
        });
    };

    const removeLesson = (moduleId: number, lessonId: number) => {
        setFormData({
            ...formData,
            modules: formData.modules.map(m =>
                m.id === moduleId ? { ...m, lessons: m.lessons.filter(l => l.id !== lessonId) } : m
            )
        });
    };

    const updateLesson = (moduleId: number, lessonId: number, updates: Partial<Lesson>) => {
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

    const isStep1Valid = formData.title.trim() && formData.description.trim() && formData.category.trim();
    const isStep2Valid = !!formData.duration.trim();
    const isStep3Valid = formData.modules.length > 0 && formData.modules.every(m => m.title.trim() && m.lessons.length > 0);

    const progressPercent = Math.round((activeStep / 4) * 100);

    const filteredInstructors = instructors.filter(inst =>
        inst.name.toLowerCase().includes(instructorSearch.toLowerCase())
    );

    const handleSelectInstructor = (id: string, name: string) => {
        setFormData({ ...formData, instructor: id });
        setInstructorSearch(name);
        setShowInstructorDropdown(false);
    };


    // ... handles logic ...
    const handleSaveFinish = async () => {
        try {
            // Construct payload
            const payload = {
                title: formData.title,
                short_description: formData.shortDescription,
                description: formData.description,
                price: parseFloat(formData.price) || 0,
                course_admin_id: parseInt(formData.instructor) || 1, // Defaulting to admin if not selected
                visibility: 'EVERYONE', // Default
                modules: formData.modules.map(m => ({
                    title: m.title,
                    lessons: m.lessons.map((l: any) => ({
                        title: l.title,
                        type: l.type.toUpperCase(),
                        duration_minutes: parseInt(l.duration.split(':')[0]) || 0 // Very basic parsing
                    }))
                }))
            };

            await api.post('/courses', payload);
            navigate('/courses');
        } catch (error) {
            console.error("Error creating course", error);
            alert("Failed to create course");
        }
    };

    return (
        <div className="min-h-screen bg-gray-50/50">
            {/* Header */}
            <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
                <div className="max-w-5xl mx-auto px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <button onClick={handleBack} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                                <ChevronRight className="w-5 h-5 text-gray-600 rotate-180" />
                            </button>
                            <div>
                                <h1 className="text-xl font-bold text-gray-900 tracking-tight">Add New Course</h1>
                                <p className="text-xs text-gray-500 font-medium mt-0.5">
                                    Step {activeStep} of 4 - {
                                        activeStep === 1 ? 'Basic Information' :
                                            activeStep === 2 ? 'Additional Details' :
                                                activeStep === 3 ? 'Course Content' : 'Final Review'
                                    }
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <button onClick={() => navigate('/courses')} className="px-4 py-2 text-sm font-bold text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-all">
                                Cancel
                            </button>
                            {activeStep === 4 && (
                                <button
                                    onClick={handleSaveFinish}
                                    className="flex items-center gap-2 px-6 py-2.5 bg-[#0ea5e9] text-white rounded-xl font-bold hover:bg-[#0284c7] transition-all shadow-lg shadow-blue-500/30"
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
                        <div className="bg-[#0ea5e9] h-2 rounded-full transition-all duration-500 ease-out" style={{ width: progressPercent + '%' }} />
                    </div>
                </div>

                {/* Step 1: Basic Information */}
                {activeStep === 1 && (
                    <div className="bg-white rounded-xl border border-gray-200 p-8 animate-in fade-in slide-in-from-bottom-4 duration-300">
                        {/* ... truncated for focus ... */}
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                                <Layout className="w-6 h-6 text-[#0ea5e9]" />
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
                                <label className="block text-sm font-bold text-gray-700 mb-2">Short Description *</label>
                                <textarea
                                    value={formData.shortDescription}
                                    onChange={(e) => handleInputChange('shortDescription', e.target.value)}
                                    placeholder="A brief, catchy description of the course..."
                                    rows={2}
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-4 focus:ring-[#0ea5e9]/10 focus:border-[#0ea5e9] outline-none transition-all font-medium resize-none"
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
                                <div className="space-y-2">
                                    <label className="block text-sm font-bold text-gray-900">Instructor</label>
                                    <div className="relative">
                                        <select
                                            value={formData.instructor}
                                            onChange={(e) => setFormData({ ...formData, instructor: e.target.value })}
                                            className="w-full pl-4 pr-10 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0ea5e9]/20 focus:border-[#0ea5e9] appearance-none cursor-pointer"
                                        >
                                            <option value="">Select Instructor</option>
                                            {instructors.map((inst) => (
                                                <option key={inst.id} value={inst.id}>
                                                    {inst.name}
                                                </option>
                                            ))}
                                        </select>
                                        <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
                                    </div>
                                </div>
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
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Level</label>
                                    <select
                                        value={formData.level}
                                        onChange={(e) => handleInputChange('level', e.target.value)}
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none font-medium"
                                    >
                                        <option value="Beginner">Beginner</option>
                                        <option value="Intermediate">Intermediate</option>
                                        <option value="Advanced">Advanced</option>
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
                {activeStep === 2 && (
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
                                                <button key={inst.id} onClick={() => handleSelectInstructor(inst.id, inst.name)} className="w-full p-3 text-left hover:bg-blue-50 flex items-center gap-3 border-b last:border-0">
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
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Thumbnail URL</label>
                                    <input type="text" value={formData.thumbnail} onChange={(e) => handleInputChange('thumbnail', e.target.value)} placeholder="https://image-url.com" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none" />
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
                {activeStep === 3 && (
                    <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                        {/* ... truncated for focus ... */}
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
                                                <div key={lesson.id} className="flex items-center gap-3 bg-white border border-gray-100 rounded-lg p-3 hover:border-blue-200 hover:shadow-sm transition-all">
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
                                                    <input
                                                        type="text"
                                                        value={lesson.duration}
                                                        onChange={(e) => updateLesson(module.id, lesson.id, { duration: e.target.value })}
                                                        placeholder="Dur."
                                                        className="w-16 text-xs text-center bg-gray-50 border-none rounded p-1"
                                                    />
                                                    <button onClick={() => removeLesson(module.id, lesson.id)} className="p-1 text-gray-400 hover:text-red-500"><X className="w-3 h-3" /></button>
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
                {activeStep === 4 && (
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
                                                                <span className="text-gray-600">• {lesson.title}</span>
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
                                <button onClick={handleBack} className="px-6 py-3 text-sm font-bold text-gray-400 hover:text-white transition-colors">← Go Back</button>
                                <button onClick={handleSaveFinish} className="px-10 py-3 bg-[#0ea5e9] text-white rounded-xl font-bold shadow-xl shadow-blue-500/20 hover:scale-105 active:scale-95 transition-all">Confirm & Publish</button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div >
    );
};

export default AddCourse;
