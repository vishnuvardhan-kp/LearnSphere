export type LessonType = 'video' | 'document' | 'image' | 'quiz';

export interface Question {
  id: string;
  text: string;
  options: string[];
  correctOption: number; // Index
}

export interface QuizConfig {
  questions: Question[];
  rewards: {
    first: number;
    second: number;
    third: number;
    fourthPlus: number;
  };
}

export interface Lesson {
  id: string;
  title: string;
  type: LessonType;
  duration?: string; // For video
  url?: string; // For video/image
  content?: string; // For text/document
  isCompleted: boolean;
  quizConfig?: QuizConfig;
}

export interface Review {
  id: string;
  userName: string;
  avatar: string;
  rating: number;
  comment: string;
  date: string;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  image: string;
  tags: string[];
  lessons: Lesson[];
  reviews: Review[];
  totalPoints: number; // Sum of potential quiz points? Or just course points.
}

export interface User {
  id: string;
  name: string;
  points: number;
  badges: string[];
  enrolledCourses: string[]; // Course IDs
}

export const CURRENT_USER: User = {
  id: 'u1',
  name: 'John Learner',
  points: 45,
  badges: ['Newbie', 'Explorer'],
  enrolledCourses: ['c1', 'c2'],
};

export const COURSES: Course[] = [
  {
    id: 'c1',
    title: 'Modern React Development',
    description: 'Master React with modern practices, hooks, and performance optimization techniques.',
    image: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?q=80&w=2070&auto=format&fit=crop',
    tags: ['React', 'Frontend', 'Intermediate'],
    totalPoints: 100,
    reviews: [
      { id: 'r1', userName: 'Alice', avatar: 'https://i.pravatar.cc/150?u=a', rating: 5, comment: 'Excellent course!', date: '2023-10-15' },
    ],
    lessons: [
      { id: 'l1', title: 'Introduction to React', type: 'video', duration: '10:00', url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4', isCompleted: true },
      { 
        id: 'l2', 
        title: 'Components & Props', 
        type: 'document', 
        content: `
# Understanding React Components

Components are the building blocks of any React application. They let you split the UI into independent, reusable pieces, and think about each piece in isolation.

## Functional Components

The simplest way to define a component is to write a JavaScript function:

\`\`\`jsx
function Welcome(props) {
  return <h1>Hello, {props.name}</h1>;
}
\`\`\`

## Props

Props (short for properties) are how we pass data from parent to child components. They are read-only and help make your components dynamic and reusable.

### Key Rules:
1. Components stay pure regarding their props.
2. Props flow down (unidirectional data flow).
3. Never modify props directly.
        `, 
        isCompleted: true 
      },
      {
        id: 'l3',
        title: 'React Quiz',
        type: 'quiz',
        isCompleted: false,
        quizConfig: {
          rewards: { first: 50, second: 30, third: 20, fourthPlus: 10 },
          questions: [
            { id: 'q1', text: 'What is a Hook?', options: ['A function', 'A class', 'A component'], correctOption: 0 },
            { id: 'q2', text: 'Which hook manages state?', options: ['useEffect', 'useState', 'usePv'], correctOption: 1 },
          ],
        },
      },
    ],
  },
  {
    id: 'c2',
    title: 'Advanced CSS Layouts',
    description: 'Deep dive into Grid, Flexbox, and responsive design patterns.',
    image: 'https://images.unsplash.com/photo-1507721999472-8ed4421c4af2?q=80&w=2070&auto=format&fit=crop',
    tags: ['CSS', 'Design', 'Beginner'],
    totalPoints: 50,
    reviews: [],
    lessons: [
      { id: 'l4', title: 'Flexbox Fundamentals', type: 'video', duration: '15:00', url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4', isCompleted: false },
      { id: 'l5', title: 'Grid Layouts', type: 'image', url: 'https://images.unsplash.com/photo-1507721999472-8ed4421c4af2', isCompleted: false },
    ],
  },
  {
    id: 'c3',
    title: 'Node.js Backend Architecture',
    description: 'Build scalable backends with Node.js and Express.',
    image: 'https://images.unsplash.com/photo-1627398242454-45a1465c2479?q=80&w=2074&auto=format&fit=crop',
    tags: ['Backend', 'Node.js', 'Advanced'],
    totalPoints: 120,
    reviews: [],
    lessons: [
        { id: 'l6', title: 'Node.js Basics', type: 'video', duration: '12:00', url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4', isCompleted: false },
      { 
        id: 'l7', 
        title: 'Express.js Routing', 
        type: 'document', 
        content: `
# Express.js Routing Guide

Routing refers to determining how an application responds to a client request to a particular endpoint, which is a URI (or path) and a specific HTTP request method (GET, POST, and so on).

## Basic Routing

Each route can have one or more handler functions, which are executed when the route is matched.

\`\`\`javascript
app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.post('/user', (req, res) => {
  res.send('Got a POST request')
})
\`\`\`

## Route Parameters

To handle dynamic data (like user IDs), we use route parameters:

\`\`\`javascript
app.get('/users/:userId/books/:bookId', (req, res) => {
  res.send(req.params)
})
\`\`\`

Express offers a powerful, intuitive way to manage your API structure.
        `, 
        isCompleted: false 
      },
      {
        id: 'l8',
        title: 'Node.js Mastery Quiz',
        type: 'quiz',
        isCompleted: false,
        quizConfig: {
            rewards: { first: 100, second: 75, third: 50, fourthPlus: 25 },
            questions: [
                { id: 'nq1', text: 'Which core module is used for file system operations?', options: ['fs', 'file', 'system', 'io'], correctOption: 0 },
                { id: 'nq2', text: 'What is the default event loop phase order?', options: ['Timers, Pending, Poll', 'Poll, Timers, Check', 'Check, Poll, Timers'], correctOption: 0 },
                { id: 'nq3', text: 'Which method is used to include modules?', options: ['include()', 'import()', 'require()', 'fetch()'], correctOption: 2 }
            ]
        }
      }
    ],
  },
];
