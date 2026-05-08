
CREATE DATABASE IF NOT EXISTS lapordesa_db;
USE lapordesa_db;

-- Tabel Users
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('masyarakat', 'admin') DEFAULT 'masyarakat',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_email (email),
    INDEX idx_role (role)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabel Reports (Laporan/Pengaduan)
CREATE TABLE reports (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    description LONGTEXT NOT NULL,
    category VARCHAR(100) NOT NULL,
    image_path VARCHAR(255),
    status ENUM('menunggu', 'diproses', 'selesai') DEFAULT 'menunggu',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_status (status),
    INDEX idx_created_at (created_at),
    INDEX idx_category (category)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- Insert Dummy Admin Account
-- ============================================
-- Email: admin@lapordesa.com
-- Password: password (hashed with bcryptjs)
INSERT INTO users (name, email, password, role) VALUES 
('Admin LaporDesa Cloud', 'admin@lapordesa.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin');

-- ============================================
-- Insert Sample Users
-- ============================================
INSERT INTO users (name, email, password, role) VALUES 
('Budi Masyarakat', 'budi@example.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'masyarakat'),
('Siti Warga', 'siti@example.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'masyarakat');

-- ============================================
-- Insert Sample Reports
-- ============================================
INSERT INTO reports (user_id, title, description, category, status) VALUES 
(2, 'Jalan Rusak di Jl. Masjid', 'Jalan di depan masjid raya mengalami kerusakan berat yang dapat membahayakan keselamatan pengguna jalan, terutama pada musim hujan. Perlu segera dilakukan perbaikan atau penggantian aspal.', 'Infrastruktur', 'menunggu'),
(2, 'Lampu Jalan Tidak Menyala', 'Beberapa lampu jalan di daerah sekitar pasar malam tidak menyala dalam beberapa hari terakhir. Hal ini membuat area menjadi gelap dan kurang aman bagi pejalan kaki.', 'Infrastruktur', 'diproses'),
(3, 'Sampah Menumpuk di Selokan', 'Di desa kami, selokan air banyak tersumbat sampah plastik dan daun-daunan. Perlu pembersihan secara berkala dan edukasi masyarakat tentang pembuangan sampah yang benar.', 'Kebersihan', 'selesai'),
(2, 'Faskes Desa Kekurangan Obat', 'Puskesmas desa kami kekurangan beberapa jenis obat penting seperti antibiotik dan penurun panas. Pasien terpaksa membeli di apotek swasta dengan harga lebih mahal.', 'Kesehatan', 'menunggu');

-- ============================================
-- Verifikasi Data
-- ============================================
SELECT COUNT(*) as total_users FROM users;
SELECT COUNT(*) as total_reports FROM reports;

-- ============================================
-- Catatan Penting:
-- ============================================
-- 1. Password hash di atas adalah untuk password "password"
-- 2. Untuk test, gunakan email: admin@lapordesa.com, password: password
-- 3. Atau email: budi@example.com, password: password
-- 4. Untuk menggenerate hash password baru, gunakan bcryptjs
-- 5. Jangan lupa ubah JWT_SECRET di file .env untuk production
