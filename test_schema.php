<?php
require "app/config.php";
try {
    $sql = "
    CREATE TABLE IF NOT EXISTS articole_blog (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        slug VARCHAR(255) NOT NULL UNIQUE,
        excerpt TEXT,
        content LONGTEXT,
        featured_image VARCHAR(255),
        author VARCHAR(100) DEFAULT 'Admin',
        meta_title VARCHAR(255),
        meta_description VARCHAR(255),
        faq_json JSON,
        schema_type VARCHAR(50) DEFAULT 'Article',
        is_published TINYINT(1) DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    );
    CREATE TABLE IF NOT EXISTS blog_authors (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL UNIQUE,
        image VARCHAR(255),
        description TEXT,
        is_verified TINYINT(1) DEFAULT 0,
        stat_1_label VARCHAR(50),
        stat_1_value VARCHAR(50),
        stat_2_label VARCHAR(50),
        stat_2_value VARCHAR(50),
        stat_3_label VARCHAR(50),
        stat_3_value VARCHAR(50),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    );
    ";
    
    // Safety check: add new columns if table already existed from before
    $pdo->exec($sql);
    
    try { $pdo->exec("ALTER TABLE articole_blog ADD COLUMN meta_title VARCHAR(255) AFTER author"); } catch (Exception $e) {}
    try { $pdo->exec("ALTER TABLE articole_blog ADD COLUMN meta_description VARCHAR(255) AFTER meta_title"); } catch (Exception $e) {}
    try { $pdo->exec("ALTER TABLE articole_blog ADD COLUMN faq_json JSON AFTER meta_description"); } catch (Exception $e) {}
    try { $pdo->exec("ALTER TABLE articole_blog ADD COLUMN schema_type VARCHAR(50) DEFAULT 'Article' AFTER faq_json"); } catch (Exception $e) {}
    try { $pdo->exec("ALTER TABLE articole_blog ADD COLUMN updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP AFTER created_at"); } catch (Exception $e) {}
    
    echo "Blog table updated successfully!";
} catch (Exception $e) {
    echo "Error: " . $e->getMessage();
}
