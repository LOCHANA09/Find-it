CREATE DATABASE IF NOT EXISTS findit_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE findit_db;
CREATE TABLE IF NOT EXISTS items (
 id INT AUTO_INCREMENT PRIMARY KEY,
 item_name VARCHAR(120) NOT NULL,
 item_type ENUM('Lost','Found') NOT NULL,
 category VARCHAR(60) NOT NULL,
 description TEXT NOT NULL,
 location VARCHAR(180) NOT NULL,
 contact_name VARCHAR(100) NOT NULL,
 contact_email VARCHAR(190) NOT NULL,
 item_date DATE NULL,
 status ENUM('Open','Resolved') NOT NULL DEFAULT 'Open',
 created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
 INDEX idx_item_type (item_type), INDEX idx_category (category), INDEX idx_status (status)
);
INSERT INTO items (item_name,item_type,category,description,location,contact_name,contact_email,item_date,status) VALUES
('Blue water bottle','Lost','Accessories','Blue reusable bottle with a small sticker.','College library','Demo User','demo@example.com','2026-09-15','Open'),
('Black umbrella','Found','Accessories','Black folding umbrella left near the main entrance.','Main entrance','Demo User','demo@example.com','2026-09-18','Open'),
('Student notebook','Lost','Books & Notes','Notebook with a green cover.','ECE block','Demo User','demo@example.com','2026-09-20','Open');
