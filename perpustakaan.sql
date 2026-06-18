-- Create Database
CREATE DATABASE IF NOT EXISTS perpustakaan;
USE perpustakaan;

-- Table: users
CREATE TABLE IF NOT EXISTS users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    nama_lengkap VARCHAR(100) NOT NULL,
    role ENUM('admin', 'siswa') DEFAULT 'siswa',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_username (username),
    INDEX idx_role (role)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Table: buku
CREATE TABLE IF NOT EXISTS buku (
    id INT PRIMARY KEY AUTO_INCREMENT,
    judul VARCHAR(200) NOT NULL,
    penulis VARCHAR(100) NOT NULL,
    penerbit VARCHAR(100),
    tahun_terbit YEAR,
    genre VARCHAR(50) NOT NULL,
    rating DECIMAL(3,2) DEFAULT 0,
    cover VARCHAR(255),
    stok INT DEFAULT 1,
    deskripsi TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_judul (judul),
    INDEX idx_genre (genre),
    INDEX idx_rating (rating),
    FULLTEXT idx_search (judul, penulis, deskripsi)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Table: favorit
CREATE TABLE IF NOT EXISTS favorit (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    buku_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (buku_id) REFERENCES buku(id) ON DELETE CASCADE,
    UNIQUE KEY unique_favorit (user_id, buku_id),
    INDEX idx_user (user_id),
    INDEX idx_buku (buku_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Table: komentar
CREATE TABLE IF NOT EXISTS komentar (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    buku_id INT NOT NULL,
    komentar TEXT NOT NULL,
    rating INT CHECK (rating >= 1 AND rating <= 5),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (buku_id) REFERENCES buku(id) ON DELETE CASCADE,
    INDEX idx_user (user_id),
    INDEX idx_buku (buku_id),
    INDEX idx_rating (rating)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Insert Sample Data
INSERT INTO users (username, password, nama_lengkap, role) VALUES
('admin', '$2a$10$YourHashedPasswordHere', 'Administrator', 'admin'),
('siswa1', '$2a$10$YourHashedPasswordHere', 'Budi Santoso', 'siswa'),
('siswa2', '$2a$10$YourHashedPasswordHere', 'Ani Wijaya', 'siswa');

-- Note: Use bcrypt to hash passwords. For testing, you can use:
-- password: admin123 -> hash: $2a$10$N9qo8uLOickgx2ZMRZoMy.Mr/.Zwp2Vf5J5tZtG5P5Z5Z5Z5Z5Z5
-- Or use MD5 for simplicity (not recommended for production)

INSERT INTO buku (judul, penulis, penerbit, tahun_terbit, genre, rating, cover, stok, deskripsi) VALUES
('Atomic Habits', 'James Clear', 'Penguin', 2018, 'Self Improvement', 4.8, NULL, 5, 'Buku tentang kebiasaan kecil yang membawa perubahan besar'),
('Harry Potter and the Sorcerer\'s Stone', 'J.K. Rowling', 'Bloomsbury', 1997, 'Fantasy', 4.9, NULL, 3, 'Petualangan Harry Potter di dunia sihir'),
('Sapiens', 'Yuval Noah Harari', 'Harper', 2015, 'History', 4.6, NULL, 4, 'Sejarah singkat umat manusia'),
('The Psychology of Money', 'Morgan Housel', 'Harriman House', 2020, 'Finance', 4.7, NULL, 6, 'Pelajaran tentang kekayaan, keserakahan, dan kebahagiaan'),
('Clean Code', 'Robert C. Martin', 'Prentice Hall', 2008, 'Technology', 4.8, NULL, 2, 'Panduan menulis kode yang bersih dan terstruktur'),
('The Alchemist', 'Paulo Coelho', 'HarperOne', 1988, 'Fiksi', 4.5, NULL, 7, 'Kisah tentang mengikuti mimpi dan takdir'),
('Think and Grow Rich', 'Napoleon Hill', 'Penguin', 1937, 'Self Improvement', 4.4, NULL, 3, 'Prinsip-prinsip kesuksesan dan kekayaan'),
('The Art of War', 'Sun Tzu', 'Penguin', 500, 'History', 4.3, NULL, 5, 'Strategi perang kuno yang aplikatif');

INSERT INTO favorit (user_id, buku_id) VALUES
(2, 1),
(2, 3),
(2, 5),
(3, 1),
(3, 4);

INSERT INTO komentar (user_id, buku_id, komentar, rating) VALUES
(2, 1, 'Buku yang sangat menginspirasi!', 5),
(2, 3, 'Sangat informatif dan menarik', 4),
(3, 1, 'Recommended untuk semua orang', 5),
(3, 4, 'Membuka wawasan tentang keuangan', 4);