<?php
require_once 'app/config.php';
try {
    $pdo->exec("SET FOREIGN_KEY_CHECKS = 0;");
    $stmt = $pdo->query("SHOW TABLES");
    $tables = $stmt->fetchAll(PDO::FETCH_COLUMN);
    foreach ($tables as $table) {
        $pdo->exec("DROP TABLE IF EXISTS `$table` CASCADE");
    }
    $pdo->exec("SET FOREIGN_KEY_CHECKS = 1;");
    
    $schema = file_get_contents('schema.sql');
    $pdo->exec($schema);
    
    $seed = file_get_contents('seed.sql');
    $pdo->exec($seed);
    echo "Baza de date a fost resetata si populata cu succes!";
} catch (Exception $e) {
    echo "Eroare: " . $e->getMessage();
}
