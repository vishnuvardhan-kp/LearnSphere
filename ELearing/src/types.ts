export interface Question {
    id: string;
    question: string;
    options: string[];
    correctAnswer: number;
}

export interface Lesson {
    id: string;
    title: string;
    type: 'video' | 'quiz' | 'text';
    duration: string;
    videoLink?: string;
    questions?: Question[];
}

export interface Module {
    id: string;
    title: string;
    lessons: Lesson[];
}

export interface Course {
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
    videoLink?: string;
    modules?: Module[];
}

export interface Instructor {
    id: number;
    name: string;
    expertise: string;
    courses: number;
}

export interface Participant {
    id: number;
    name: string;
    course: string;
    progress: number;
    status: 'yet-to-start' | 'in-progress' | 'completed';
}

export interface ViewData {
    name: string;
    views: number;
    enrolments: number;
}

export interface CoursePerformance {
    name: string;
    students: number;
    completions: number;
}

export interface Activity {
    text: string;
    time: string;
    type: 'enrollment' | 'completion' | 'comment' | 'course' | 'system';
}
