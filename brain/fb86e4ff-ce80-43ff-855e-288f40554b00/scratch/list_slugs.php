<?php
try {
    $db = new PDO('mysql:host=localhost;dbname=alma_decor', 'root', '');
    $stmt = $db->query('SELECT slug FROM produse LIMIT 5');
    while($row = $stmt->fetch()) {
        echo $row['slug'] . "\n";
    }
} catch (Exception $e) {
    echo "Error: " . $e->getMessage();
}
