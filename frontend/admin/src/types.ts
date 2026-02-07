export interface Lesson {
    id: number;
    title: string;
    type: 'video' | 'quiz' | 'text' | 'VIDEO' | 'QUIZ' | 'TEXT';
    duration: string;
    isFree: boolean;
    videoLink?: string;
    content?: string;
}

export interface Module {
    id: number;
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
    modules: Module[];
}
