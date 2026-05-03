<?php
require_once 'app/config.php';
try {
    $pdo->exec("ALTER TABLE categorii ADD COLUMN description_top LONGTEXT AFTER description");
    $pdo->exec("ALTER TABLE categorii ADD COLUMN description_bottom LONGTEXT AFTER description_top");
    echo "Columns added successfully";
} catch (Exception $e) {
    echo "Error: " . $e->getMessage();
}
?>
