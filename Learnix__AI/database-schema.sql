-- ================================================
-- Learnix AI - MySQL Database Schema
-- ================================================

-- Create Database
CREATE DATABASE IF NOT EXISTS learnix_ai;
USE learnix_ai;

-- ================================================
-- Table: users
-- Stores user account information
-- ================================================
CREATE TABLE users (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ================================================
-- Table: files
-- Stores uploaded study material files
-- ================================================
CREATE TABLE files (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    file_name VARCHAR(255) NOT NULL,
    file_path VARCHAR(500) NOT NULL,
    file_size BIGINT NOT NULL,
    file_type VARCHAR(50),
    content TEXT,
    upload_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ================================================
-- Table: quiz
-- Stores quiz results and scores
-- ================================================
CREATE TABLE quiz (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    file_id BIGINT,
    score INT NOT NULL,
    total_questions INT NOT NULL,
    file_name VARCHAR(255),
    completed_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (file_id) REFERENCES files(id) ON DELETE SET NULL,
    INDEX idx_user_id (user_id),
    INDEX idx_completed_date (completed_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ================================================
-- Table: study_plans
-- Stores generated study plans
-- ================================================
CREATE TABLE study_plans (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    exam_date DATE NOT NULL,
    subjects TEXT NOT NULL,
    plan_content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ================================================
-- Table: chat_history
-- Stores chatbot conversation history
-- ================================================
CREATE TABLE chat_history (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    message TEXT NOT NULL,
    response TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ================================================
-- Sample Data (Optional - for testing)
-- ================================================

-- Insert sample user (password: password123)
INSERT INTO users (name, email, password) VALUES 
('John Doe', 'john@example.com', '$2a$10$dummyhashedpassword');

-- Note: In production, passwords should be properly hashed using BCrypt

-- ================================================
-- Views for Analytics
-- ================================================

-- View: User Statistics
CREATE VIEW user_statistics AS
SELECT 
    u.id as user_id,
    u.name,
    u.email,
    COUNT(DISTINCT f.id) as total_files,
    COUNT(DISTINCT q.id) as total_quizzes,
    AVG(q.score / q.total_questions * 100) as average_score,
    MAX(q.completed_date) as last_quiz_date
FROM users u
LEFT JOIN files f ON u.id = f.user_id
LEFT JOIN quiz q ON u.id = q.user_id
GROUP BY u.id, u.name, u.email;

-- ================================================
-- Stored Procedures
-- ================================================

-- Procedure: Get User Dashboard Stats
DELIMITER //
CREATE PROCEDURE GetUserDashboardStats(IN userId BIGINT)
BEGIN
    SELECT 
        (SELECT COUNT(*) FROM files WHERE user_id = userId) as total_notes,
        (SELECT COUNT(*) FROM quiz WHERE user_id = userId) as total_quizzes,
        (SELECT ROUND(AVG(score / total_questions * 100)) 
         FROM quiz WHERE user_id = userId) as average_score;
END //
DELIMITER ;

-- Procedure: Delete User Account and All Data
DELIMITER //
CREATE PROCEDURE DeleteUserAccount(IN userId BIGINT)
BEGIN
    -- Files and quizzes will be deleted automatically due to CASCADE
    DELETE FROM users WHERE id = userId;
END //
DELIMITER ;

-- ================================================
-- Indexes for Performance
-- ================================================

-- Additional indexes for better query performance
ALTER TABLE files ADD INDEX idx_upload_date (upload_date);
ALTER TABLE quiz ADD INDEX idx_score (score);

-- ================================================
-- Database Configuration
-- ================================================

-- Set timezone
SET time_zone = '+00:00';

-- ================================================
-- End of Schema
-- ================================================
