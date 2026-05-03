<?php
require_once 'app/config.php';

try {
    $sql = "CREATE TABLE IF NOT EXISTS clienti (
        id INT AUTO_INCREMENT PRIMARY KEY,
        nume VARCHAR(100) NOT NULL,
        email VARCHAR(100) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        telefon VARCHAR(20),
        adresa TEXT,
        oras VARCHAR(50),
        judet VARCHAR(50),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )";
    $pdo->exec($sql);
    echo "Succes: Tabela 'clienti' a fost creată.";
} catch (Exception $e) {
    echo "Eroare: " . $e->getMessage();
}
