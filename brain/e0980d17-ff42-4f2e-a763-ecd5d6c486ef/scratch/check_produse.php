<?php
require_once 'app/config.php';
$stmt = $pdo->query("DESCRIBE produse");
print_r($stmt->fetchAll(PDO::FETCH_COLUMN));
