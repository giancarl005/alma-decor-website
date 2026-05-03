<?php
define('DB_HOST', 'localhost');
define('DB_USER', 'root');
define('DB_PASS', '');

try {
    $pdo = new PDO("mysql:host=" . DB_HOST, DB_USER, DB_PASS);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // 1. Create Database
    $pdo->exec("CREATE DATABASE IF NOT EXISTS alma_decor CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci");
    echo "✅ Baza de date 'alma_decor' a fost creată.<br>";

    // 2. Select Database
    $pdo->exec("USE alma_decor");

    // 3. Create Tables
    $tables = [
        "CREATE TABLE IF NOT EXISTS categorii (
            id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(100) NOT NULL,
            slug VARCHAR(100) NOT NULL UNIQUE,
            image VARCHAR(255),
            description TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )",
        "CREATE TABLE IF NOT EXISTS produse (
            id INT AUTO_INCREMENT PRIMARY KEY,
            category_id INT,
            name VARCHAR(255) NOT NULL,
            slug VARCHAR(255) NOT NULL UNIQUE,
            description TEXT,
            short_description TEXT,
            price DECIMAL(10,2) NOT NULL,
            sale_price DECIMAL(10,2),
            sku VARCHAR(50) UNIQUE,
            brand VARCHAR(100),
            primary_image VARCHAR(255),
            secondary_images LONGTEXT,
            specs LONGTEXT,
            is_active TINYINT(1) DEFAULT 1,
            is_featured TINYINT(1) DEFAULT 0,
            meta_title VARCHAR(255),
            meta_description TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (category_id) REFERENCES categorii(id) ON DELETE SET NULL
        )",
        "CREATE TABLE IF NOT EXISTS comenzi (
            id INT AUTO_INCREMENT PRIMARY KEY,
            nume_client VARCHAR(100) NOT NULL,
            email_client VARCHAR(100) NOT NULL,
            telefon_client VARCHAR(20),
            adresa_livrare TEXT,
            oras VARCHAR(50),
            judet VARCHAR(50),
            total DECIMAL(10,2) NOT NULL,
            metoda_plata VARCHAR(50),
            status ENUM('pending', 'processing', 'completed', 'cancelled') DEFAULT 'pending',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )",
        "CREATE TABLE IF NOT EXISTS clienti (
            id INT AUTO_INCREMENT PRIMARY KEY,
            nume VARCHAR(100) NOT NULL,
            email VARCHAR(100) NOT NULL UNIQUE,
            password VARCHAR(255) NOT NULL,
            telefon VARCHAR(20),
            adresa TEXT,
            oras VARCHAR(50),
            judet VARCHAR(50),
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )",
        "CREATE TABLE IF NOT EXISTS users (
            id INT AUTO_INCREMENT PRIMARY KEY,
            username VARCHAR(50) NOT NULL UNIQUE,
            password VARCHAR(255) NOT NULL,
            nume VARCHAR(100),
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )"
    ];

    foreach ($tables as $sql) {
        $pdo->exec($sql);
    }
    echo "✅ Tabelele au fost create cu succes.<br>";

    // 4. Create Default Admin
    $admin_pass = password_hash("admin123", PASSWORD_DEFAULT);
    $pdo->exec("INSERT IGNORE INTO users (username, password, nume) VALUES ('admin', '$admin_pass', 'Administrator')");
    echo "✅ Cont Admin creat (User: admin / Pass: admin123).<br>";

    // 5. Create Test Customer
    $test_pass = password_hash("parola123", PASSWORD_DEFAULT);
    $pdo->exec("INSERT IGNORE INTO clienti (nume, email, password) VALUES ('Utilizator Test', 'test@almadecor.ro', '$test_pass')");
    echo "✅ Cont Client Test creat (Email: test@almadecor.ro / Pass: parola123).<br>";

    echo "<br>🚀 <strong>Totul este gata!</strong> Acum poți folosi site-ul.";

} catch (Exception $e) {
    echo "❌ Eroare: " . $e->getMessage();
}
