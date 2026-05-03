<?php
require_once 'app/config.php';

try {
    $pdo->exec("ALTER TABLE produse ADD COLUMN IF NOT EXISTS primary_image TEXT AFTER brand");
    $pdo->exec("ALTER TABLE produse ADD COLUMN IF NOT EXISTS secondary_images LONGTEXT AFTER primary_image");
    echo "Succes: Coloanele pentru imagini au fost adăugate.";
} catch (Exception $e) {
    echo "Eroare: " . $e->getMessage();
}
