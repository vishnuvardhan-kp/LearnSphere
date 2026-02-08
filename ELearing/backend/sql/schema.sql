-- Create database (if needed)
CREATE DATABASE IF NOT EXISTS elearning_db;
USE elearning_db;

-- Courses Table
CREATE TABLE IF NOT EXISTS courses (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    tags JSON, -- Use JSON type for array of strings, or create a separate tags table
    views INT DEFAULT 0,
    lessons INT DEFAULT 0,
    duration VARCHAR(50),
    status ENUM('published', 'draft', 'archived', 'yet-to-start', 'in-progress', 'completed') DEFAULT 'draft',
    last_updated DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    author VARCHAR(255),
    video_link VARCHAR(255),
    modules JSON, -- Store nested modules and lessons structure
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Instructors Table
CREATE TABLE IF NOT EXISTS instructors (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(100) DEFAULT 'Instructor',
    specialization VARCHAR(255),
    courses INT DEFAULT 0,
    students INT DEFAULT 0,
    rating DECIMAL(2,1) DEFAULT 0.0,
    status ENUM('active', 'inactive') DEFAULT 'active',
    join_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Participants (Students) Table
CREATE TABLE IF NOT EXISTS participants (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE,
    current_course_id INT,
    progress INT DEFAULT 0, -- percentage
    status ENUM('yet-to-start', 'in-progress', 'completed') DEFAULT 'yet-to-start',
    FOREIGN KEY (current_course_id) REFERENCES courses(id) ON DELETE SET NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Activities Table (Recent Activity)
CREATE TABLE IF NOT EXISTS activities (
    id INT AUTO_INCREMENT PRIMARY KEY,
    text VARCHAR(255) NOT NULL,
    time_stamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    type ENUM('enrollment', 'completion', 'comment', 'course', 'system') NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- View Data (Analytics - Daily Views/Enrollments)
CREATE TABLE IF NOT EXISTS analytics_daily (
    id INT AUTO_INCREMENT PRIMARY KEY,
    date DATE NOT NULL,
    views INT DEFAULT 0,
    enrolments INT DEFAULT 0,
    UNIQUE KEY unique_date (date)
);

-- Course Performance Stats
CREATE TABLE IF NOT EXISTS course_performance (
    id INT AUTO_INCREMENT PRIMARY KEY,
    course_id INT NOT NULL,
    students_count INT DEFAULT 0,
    completions_count INT DEFAULT 0,
    FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE
);
