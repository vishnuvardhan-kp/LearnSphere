-- =========================================================
-- LearnSphere eLearning Platform
-- PostgreSQL 16 Schema (UPDATED)
-- =========================================================

-- -------------------------
-- USERS
-- -------------------------
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role VARCHAR(20) NOT NULL CHECK (role IN ('ADMIN','INSTRUCTOR','LEARNER')),
    avatar_url TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- -------------------------
-- COURSES
-- -------------------------
CREATE TABLE IF NOT EXISTS courses (
    id SERIAL PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    short_description TEXT,
    description TEXT,
    image_url TEXT,
    website_url TEXT,
    visibility VARCHAR(20) CHECK (visibility IN ('EVERYONE','SIGNED_IN')),
    access_rule VARCHAR(20) CHECK (access_rule IN ('OPEN','INVITE','PAYMENT')),
    price NUMERIC(10,2),
    is_published BOOLEAN DEFAULT FALSE,
    course_admin_id INT REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- -------------------------
-- COURSE TAGS
-- -------------------------
CREATE TABLE IF NOT EXISTS course_tags (
    id SERIAL PRIMARY KEY,
    course_id INT REFERENCES courses(id) ON DELETE CASCADE,
    tag VARCHAR(50) NOT NULL
);

-- -------------------------
-- COURSE INSTRUCTORS (MULTI-INSTRUCTOR SUPPORT)
-- -------------------------
CREATE TABLE IF NOT EXISTS course_instructors (
    course_id INT REFERENCES courses(id) ON DELETE CASCADE,
    instructor_id INT REFERENCES users(id) ON DELETE CASCADE,
    PRIMARY KEY (course_id, instructor_id)
);

-- -------------------------
-- LESSONS
-- -------------------------
CREATE TABLE IF NOT EXISTS lessons (
    id SERIAL PRIMARY KEY,
    course_id INT REFERENCES courses(id) ON DELETE CASCADE,
    title VARCHAR(200) NOT NULL,
    type VARCHAR(20) NOT NULL CHECK (type IN ('VIDEO','DOCUMENT','IMAGE','QUIZ')),
    content_url TEXT,
    duration_minutes INT,
    allow_download BOOLEAN DEFAULT FALSE,
    lesson_order INT,
    quiz_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- -------------------------
-- LESSON ATTACHMENTS
-- -------------------------
CREATE TABLE IF NOT EXISTS lesson_attachments (
    id SERIAL PRIMARY KEY,
    lesson_id INT REFERENCES lessons(id) ON DELETE CASCADE,
    type VARCHAR(10) CHECK (type IN ('FILE','LINK')),
    title VARCHAR(100),
    resource_url TEXT
);

-- -------------------------
-- COURSE ENROLLMENTS
-- -------------------------
CREATE TABLE IF NOT EXISTS course_enrollments (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    course_id INT REFERENCES courses(id) ON DELETE CASCADE,
    enrolled_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(20)
        CHECK (status IN ('INVITED','ENROLLED','IN_PROGRESS','COMPLETED')),
    UNIQUE (user_id, course_id)
);

-- -------------------------
-- LESSON PROGRESS
-- -------------------------
CREATE TABLE IF NOT EXISTS lesson_progress (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    lesson_id INT REFERENCES lessons(id) ON DELETE CASCADE,
    is_completed BOOLEAN DEFAULT FALSE,
    time_spent_minutes INT DEFAULT 0,
    completed_at TIMESTAMP,
    UNIQUE (user_id, lesson_id)
);

-- -------------------------
-- COURSE PROGRESS (REPORTING)
-- -------------------------
CREATE TABLE IF NOT EXISTS course_progress (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    course_id INT REFERENCES courses(id) ON DELETE CASCADE,
    completion_percentage NUMERIC(5,2) DEFAULT 0,
    status VARCHAR(20)
        CHECK (status IN ('YET_TO_START','IN_PROGRESS','COMPLETED')),
    start_date TIMESTAMP,
    completed_date TIMESTAMP,
    UNIQUE (user_id, course_id)
);

-- -------------------------
-- QUIZZES
-- -------------------------
CREATE TABLE IF NOT EXISTS quizzes (
    id SERIAL PRIMARY KEY,
    course_id INT REFERENCES courses(id) ON DELETE CASCADE,
    title VARCHAR(200),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- -------------------------
-- QUIZ QUESTIONS
-- -------------------------
CREATE TABLE IF NOT EXISTS quiz_questions (
    id SERIAL PRIMARY KEY,
    quiz_id INT REFERENCES quizzes(id) ON DELETE CASCADE,
    question_text TEXT NOT NULL
);

-- -------------------------
-- QUIZ OPTIONS
-- -------------------------
CREATE TABLE IF NOT EXISTS quiz_options (
    id SERIAL PRIMARY KEY,
    question_id INT REFERENCES quiz_questions(id) ON DELETE CASCADE,
    option_text TEXT NOT NULL,
    is_correct BOOLEAN DEFAULT FALSE
);

-- -------------------------
-- QUIZ ATTEMPTS
-- -------------------------
CREATE TABLE IF NOT EXISTS quiz_attempts (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    quiz_id INT REFERENCES quizzes(id) ON DELETE CASCADE,
    attempt_number INT NOT NULL,
    score INT,
    attempted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- -------------------------
-- QUIZ ANSWERS (TRACK USER SELECTIONS)
-- -------------------------
CREATE TABLE IF NOT EXISTS quiz_answers (
    id SERIAL PRIMARY KEY,
    attempt_id INT REFERENCES quiz_attempts(id) ON DELETE CASCADE,
    question_id INT REFERENCES quiz_questions(id),
    option_id INT REFERENCES quiz_options(id),
    is_correct BOOLEAN
);

-- -------------------------
-- QUIZ REWARDS (ATTEMPT-BASED POINTS)
-- -------------------------
CREATE TABLE IF NOT EXISTS quiz_rewards (
    id SERIAL PRIMARY KEY,
    quiz_id INT REFERENCES quizzes(id) ON DELETE CASCADE,
    attempt_number INT NOT NULL,
    points INT NOT NULL
);

-- -------------------------
-- USER POINTS
-- -------------------------
CREATE TABLE IF NOT EXISTS user_points (
    user_id INT PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    total_points INT DEFAULT 0
);

-- -------------------------
-- BADGES
-- -------------------------
CREATE TABLE IF NOT EXISTS badges (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    min_points INT NOT NULL
);

-- -------------------------
-- USER BADGES
-- -------------------------
CREATE TABLE IF NOT EXISTS user_badges (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    badge_id INT REFERENCES badges(id),
    earned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- -------------------------
-- COURSE REVIEWS
-- -------------------------
CREATE TABLE IF NOT EXISTS course_reviews (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    course_id INT REFERENCES courses(id) ON DELETE CASCADE,
    rating INT CHECK (rating BETWEEN 1 AND 5),
    review_text TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (user_id, course_id)
);

-- -------------------------
-- COURSE INVITATIONS
-- -------------------------
CREATE TABLE IF NOT EXISTS course_invitations (
    id SERIAL PRIMARY KEY,
    course_id INT REFERENCES courses(id) ON DELETE CASCADE,
    email VARCHAR(150) NOT NULL,
    status VARCHAR(20) CHECK (status IN ('PENDING','ACCEPTED')),
    invited_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- -------------------------
-- PAYMENTS
-- -------------------------
CREATE TABLE IF NOT EXISTS payments (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id),
    course_id INT REFERENCES courses(id),
    amount NUMERIC(10,2),
    payment_status VARCHAR(20)
        CHECK (payment_status IN ('PENDING','SUCCESS','FAILED')),
    provider VARCHAR(50),
    payment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- -------------------------
-- INDEXES (PERFORMANCE)
-- -------------------------
CREATE INDEX IF NOT EXISTS idx_courses_published ON courses(is_published);
CREATE INDEX IF NOT EXISTS idx_lessons_course ON lessons(course_id);
CREATE INDEX IF NOT EXISTS idx_course_progress_user ON course_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_quiz_attempts_user ON quiz_attempts(user_id);
