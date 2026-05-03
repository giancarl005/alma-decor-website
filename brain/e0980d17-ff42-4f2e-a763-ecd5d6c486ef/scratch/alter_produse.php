<?php
require_once 'app/config.php';
try {
    $pdo->exec("ALTER TABLE produse ADD COLUMN primary_image varchar(500) DEFAULT NULL AFTER brand");
    echo "Coloana adaugata cu succes!";
} catch (Exception $e) {
    echo "Eroare: " . $e->getMessage();
}
