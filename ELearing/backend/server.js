const express = require('express');
const cors = require('cors');
require('dotenv').config();
const db = require('./db'); // Import database connection

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Basic Route for testing
app.get('/', (req, res) => {
    res.send('Elearning Backend API is running');
});

// API Routes
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Configure Multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadDir = 'uploads/';
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir);
        }
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage: storage });

app.use('/uploads', express.static('uploads'));

// 1. Get All Courses
app.get('/api/courses', (req, res) => {
    const query = 'SELECT * FROM courses ORDER BY created_at DESC';
    db.query(query, (err, results) => {
        if (err) {
            console.error('Error fetching courses:', err);
            return res.status(500).json({ error: 'Database error' });
        }
        const courses = results.map(course => ({
            ...course,
            tags: typeof course.tags === 'string' ? JSON.parse(course.tags) : course.tags
        }));
        res.json(courses);
    });
});

// 2. Get Single Course by ID
app.get('/api/courses/:id', (req, res) => {
    const courseId = req.params.id;
    const query = 'SELECT * FROM courses WHERE id = ?';
    db.query(query, [courseId], (err, results) => {
        if (err) {
            console.error('Error fetching course:', err);
            return res.status(500).json({ error: 'Database error' });
        }
        if (results.length === 0) {
            return res.status(404).json({ error: 'Course not found' });
        }
        const course = results[0];
        course.tags = typeof course.tags === 'string' ? JSON.parse(course.tags) : course.tags;
        course.modules = course.modules ? (typeof course.modules === 'string' ? JSON.parse(course.modules) : course.modules) : [];
        res.json(course);
    });
});

// 3. Create New Course
app.post('/api/courses', upload.single('thumbnail'), (req, res) => {
    try {
        const { title, description, author, tags, modules, duration } = req.body;
        const tagsJson = tags || '[]';
        const modulesJson = modules || '[]';

        const query = `
            INSERT INTO courses (title, description, tags, duration, status, author, last_updated, modules)
            VALUES (?, ?, ?, ?, 'draft', ?, NOW(), ?)
        `;

        db.query(query, [title, description, tagsJson, duration, author, modulesJson], (err, result) => {
            if (err) {
                console.error('Error creating course:', err);
                return res.status(500).json({ error: 'Database error' });
            }
            res.status(201).json({ message: 'Course created successfully', id: result.insertId });
        });
    } catch (error) {
        console.error("Server error:", error);
        res.status(500).json({ error: "Server error" });
    }
});

// 4. Update Course
app.put('/api/courses/:id', (req, res) => {
    const courseId = req.params.id;
    const { title, description, tags, duration, status, modules, author, image } = req.body;

    const query = `
        UPDATE courses 
        SET title = ?, description = ?, tags = ?, duration = ?, status = ?, author = ?, modules = ?, last_updated = NOW()
        WHERE id = ?
    `;

    db.query(query, [title, description, tags, duration, status, author, modules, courseId], (err, result) => {
        if (err) {
            console.error('Error updating course:', err);
            return res.status(500).json({ error: 'Database error' });
        }
        res.json({ message: 'Course updated successfully' });
    });
});

// 5. Delete Course
app.delete('/api/courses/:id', (req, res) => {
    const courseId = req.params.id;
    const query = 'DELETE FROM courses WHERE id = ?';
    db.query(query, [courseId], (err, result) => {
        if (err) {
            console.error('Error deleting course:', err);
            return res.status(500).json({ error: 'Database error' });
        }
        res.json({ message: 'Course deleted successfully' });
    });
});

// 6. Get Participants
app.get('/api/participants', (req, res) => {
    const query = 'SELECT * FROM participants ORDER BY created_at DESC';
    db.query(query, (err, results) => {
        if (err) {
            console.error('Error fetching participants:', err);
            return res.status(500).json({ error: 'Database error' });
        }
        res.json(results);
    });
});

// 7. Instructor Routes
app.get('/api/instructors', (req, res) => {
    const query = 'SELECT * FROM instructors ORDER BY created_at DESC';
    db.query(query, (err, results) => {
        if (err) {
            console.error('Error fetching instructors:', err);
            return res.status(500).json({ error: 'Database error' });
        }
        res.json(results);
    });
});

app.post('/api/instructors', (req, res) => {
    const { name, email, password, role, specialization } = req.body;
    const query = 'INSERT INTO instructors (name, email, password, role, specialization) VALUES (?, ?, ?, ?, ?)';
    db.query(query, [name, email, password, role || 'Instructor', specialization || 'General'], (err, result) => {
        if (err) {
            console.error('Error adding instructor:', err);
            if (err.code === 'ER_DUP_ENTRY') {
                return res.status(400).json({ error: 'Email already exists' });
            }
            return res.status(500).json({ error: 'Database error' });
        }
        res.status(201).json({ message: 'Instructor added successfully', id: result.insertId });
    });
});

app.put('/api/instructors/:id', (req, res) => {
    const { id } = req.params;
    const { name, email, role, specialization, status } = req.body;
    const query = 'UPDATE instructors SET name = ?, email = ?, role = ?, specialization = ?, status = ? WHERE id = ?';
    db.query(query, [name, email, role, specialization, status, id], (err, result) => {
        if (err) {
            console.error('Error updating instructor:', err);
            return res.status(500).json({ error: 'Database error' });
        }
        res.json({ message: 'Instructor updated successfully' });
    });
});

app.delete('/api/instructors/:id', (req, res) => {
    const { id } = req.params;
    const query = 'DELETE FROM instructors WHERE id = ?';
    db.query(query, [id], (err, result) => {
        if (err) {
            console.error('Error deleting instructor:', err);
            return res.status(500).json({ error: 'Database error' });
        }
        res.json({ message: 'Instructor deleted successfully' });
    });
});

// 8. Authentication Routes

// Add password column to participants if it doesn't exist
const ensureParticipantsPasswordColumn = () => {
    const checkColumnQuery = "SHOW COLUMNS FROM participants LIKE 'password'";
    db.query(checkColumnQuery, (err, results) => {
        if (err) {
            console.error('Error checking participants columns:', err);
            return;
        }
        if (results.length === 0) {
            const addColumnQuery = "ALTER TABLE participants ADD COLUMN password VARCHAR(255) AFTER email";
            db.query(addColumnQuery, (err) => {
                if (err) console.error('Error adding password column to participants:', err);
                else console.log('Added password column to participants table');
            });
        }
    });
};
ensureParticipantsPasswordColumn();

app.post('/api/register/learner', (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    const query = 'INSERT INTO participants (name, email, password, role, status) VALUES (?, ?, ?, ?, ?)';
    db.query(query, [name, email, password, 'Student', 'active'], (err, result) => {
        if (err) {
            console.error('Error registering learner:', err);
            if (err.code === 'ER_DUP_ENTRY') {
                return res.status(400).json({ error: 'Email already exists' });
            }
            return res.status(500).json({ error: 'Database error' });
        }
        res.status(201).json({
            success: true,
            message: 'Learner registered successfully',
            id: result.insertId,
            user: {
                id: result.insertId,
                name: name,
                email: email,
                role: 'company' // Mapping Student to company role for frontend
            }
        });
    });
});

app.post('/api/login', (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' });
    }

    // Check participants first (learners)
    db.query('SELECT * FROM participants WHERE email = ? AND password = ?', [email, password], (err, pResults) => {
        if (err) return res.status(500).json({ error: 'Database error' });

        if (pResults.length > 0) {
            const user = pResults[0];
            return res.json({
                success: true,
                token: `learner_token_${user.id}`,
                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    role: 'company'
                }
            });
        }

        // Then check instructors
        db.query('SELECT * FROM instructors WHERE email = ? AND password = ?', [email, password], (err, iResults) => {
            if (err) return res.status(500).json({ error: 'Database error' });

            if (iResults.length > 0) {
                const user = iResults[0];
                return res.json({
                    success: true,
                    token: `instructor_token_${user.id}`,
                    user: {
                        id: user.id,
                        name: user.name,
                        email: user.email,
                        role: 'influencer'
                    }
                });
            }

            res.status(401).json({ error: 'Invalid email or password' });
        });
    });
});

// 9. Analytics Routes
app.get('/api/analytics/stats', (req, res) => {
    db.query('SELECT COUNT(*) as count FROM participants', (err, pResult) => {
        if (err) return res.status(500).json({ error: 'Database error' });
        const students = pResult[0].count;
        db.query('SELECT COUNT(*) as count FROM courses', (err, cResult) => {
            if (err) return res.status(500).json({ error: 'Database error' });
            const courses = cResult[0].count;
            db.query('SELECT COUNT(*) as count FROM instructors', (err, iResult) => {
                if (err) return res.status(500).json({ error: 'Database error' });
                const instructors = iResult[0].count;

                res.json([
                    { title: 'Total Revenue', value: '$' + (courses * 1250).toLocaleString(), change: '+12.5%', trend: 'up' },
                    { title: 'Active Students', value: students.toLocaleString(), change: '+8.2%', trend: 'up' },
                    { title: 'Total Courses', value: courses.toLocaleString(), change: '+15.3%', trend: 'up' },
                    { title: 'Instructors', value: instructors.toLocaleString(), change: '+5.4%', trend: 'up' }
                ]);
            });
        });
    });
});

app.get('/api/analytics/revenue', (req, res) => {
    const monthlyData = [
        { month: 'Jan', revenue: 32000, students: 1200, enrollments: 450 },
        { month: 'Feb', revenue: 35000, students: 1350, enrollments: 520 },
        { month: 'Mar', revenue: 38000, students: 1500, enrollments: 580 },
        { month: 'Apr', revenue: 42000, students: 1680, enrollments: 640 },
        { month: 'May', revenue: 45000, students: 1850, enrollments: 720 },
        { month: 'Jun', revenue: 48000, students: 2100, enrollments: 800 }
    ];
    res.json(monthlyData);
});

app.get('/api/analytics/course-performance', (req, res) => {
    const query = 'SELECT title as name, views as students, (views * 0.15) as revenue, (60 + RAND() * 20) as completion, (4.5 + RAND() * 0.5) as rating FROM courses LIMIT 5';
    db.query(query, (err, results) => {
        if (err) return res.status(500).json({ error: 'Database error' });
        res.json(results.map(r => ({ ...r, revenue: '$' + Math.floor(r.revenue).toLocaleString() })));
    });
});

app.get('/api/analytics/activity', (req, res) => {
    const query = 'SELECT p.name as user, "Enrolled" as action, c.title as course, "2 hours ago" as time FROM participants p JOIN enrollments e ON p.id = e.participant_id JOIN courses c ON e.course_id = c.id ORDER BY e.enrolled_at DESC LIMIT 5';
    db.query(query, (err, results) => {
        if (err) {
            // Fallback if no enrollments yet
            return res.json([]);
        }
        res.json(results);
    });
});

app.get('/api/analytics/views', (req, res) => {
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const data = days.map(day => ({
        name: day,
        views: Math.floor(Math.random() * 5000) + 2000,
        enrolments: Math.floor(Math.random() * 500) + 100
    }));
    res.json(data);
});

app.get('/api/analytics/demographics', (req, res) => {
    res.json([
        { category: 'Beginners', count: 1234, percentage: 43, color: 'bg-blue-500' },
        { category: 'Intermediate', count: 987, percentage: 35, color: 'bg-purple-500' },
        { category: 'Advanced', count: 456, percentage: 16, color: 'bg-green-500' },
        { category: 'Expert', count: 170, percentage: 6, color: 'bg-orange-500' }
    ]);
});

app.get('/api/onboarding/profile', (req, res) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ error: 'No token provided' });

    const token = authHeader.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'Invalid token' });

    if (token.startsWith('instructor_token_')) {
        const id = token.replace('instructor_token_', '');
        db.query('SELECT * FROM instructors WHERE id = ?', [id], (err, results) => {
            if (err) return res.status(500).json({ error: 'Database error' });
            if (results.length === 0) return res.status(404).json({ error: 'User not found' });
            const user = results[0];
            res.json({
                id: user.id,
                _id: user.id,
                name: user.name,
                email: user.email,
                role: 'influencer',
                isOnboarded: true
            });
        });
    } else if (token.startsWith('learner_token_')) {
        const id = token.replace('learner_token_', '');
        db.query('SELECT * FROM participants WHERE id = ?', [id], (err, results) => {
            if (err) return res.status(500).json({ error: 'Database error' });
            if (results.length === 0) return res.status(404).json({ error: 'User not found' });
            const user = results[0];
            res.json({
                id: user.id,
                _id: user.id,
                name: user.name,
                email: user.email,
                role: 'company',
                isOnboarded: true
            });
        });
    } else {
        res.status(401).json({ error: 'Invalid token' });
    }
});

// --- Enrollment & Progress Routes ---

// Helper to get user ID from token
const getUserIdFromToken = (req) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) return null;
    const token = authHeader.split(' ')[1];
    if (!token || !token.startsWith('learner_token_')) return null;
    return token.replace('learner_token_', '');
};

// 1. Get Enrollments for current learner
app.get('/api/enrollments/user', (req, res) => {
    const userId = getUserIdFromToken(req);
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });

    const query = `
        SELECT e.*, c.title, c.author, c.tags, c.duration, c.video_link
        FROM enrollments e
        JOIN courses c ON e.course_id = c.id
        WHERE e.participant_id = ?
    `;

    db.query(query, [userId], (err, results) => {
        if (err) {
            console.error('Error fetching enrollments:', err);
            return res.status(500).json({ error: 'Database error' });
        }

        const mappedResults = results.map(r => ({
            ...r,
            tags: typeof r.tags === 'string' ? JSON.parse(r.tags) : r.tags
        }));
        res.json(mappedResults);
    });
});

// 2. Mark Course as Completed/In-Progress
app.post('/api/enrollments/update', (req, res) => {
    const userId = getUserIdFromToken(req);
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });

    const { courseId, status, progress } = req.body;

    // Check if enrollment exists
    const checkQuery = 'SELECT id FROM enrollments WHERE participant_id = ? AND course_id = ?';
    db.query(checkQuery, [userId, courseId], (err, results) => {
        if (err) return res.status(500).json({ error: 'Database error' });

        if (results.length > 0) {
            // Update
            let updateQuery = 'UPDATE enrollments SET status = ?, progress = ?';
            const params = [status, progress];

            if (status === 'completed') {
                updateQuery += ', completed_at = NOW()';
            }

            updateQuery += ' WHERE participant_id = ? AND course_id = ?';
            params.push(userId, courseId);

            db.query(updateQuery, params, (err) => {
                if (err) return res.status(500).json({ error: 'Database error' });
                res.json({ success: true, message: 'Progress updated' });
            });
        } else {
            // Create
            const insertQuery = 'INSERT INTO enrollments (participant_id, course_id, status, progress, enrolled_at) VALUES (?, ?, ?, ?, NOW())';
            db.query(insertQuery, [userId, courseId, status, progress], (err) => {
                if (err) return res.status(500).json({ error: 'Database error' });
                res.status(201).json({ success: true, message: 'Enrolled and progress started' });
            });
        }
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

