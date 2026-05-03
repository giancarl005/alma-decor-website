<?php
require_once 'app/config.php';

try {
    $sql = "CREATE TABLE IF NOT EXISTS log_import (
        id INT AUTO_INCREMENT PRIMARY KEY,
        source_name VARCHAR(255),
        added_count INT DEFAULT 0,
        updated_count INT DEFAULT 0,
        errors_count INT DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )";
    $pdo->exec($sql);
    echo "Tabelul log_import a fost creat cu succes.";
} catch (Exception $e) {
    echo "Eroare: " . $e->getMessage();
}
