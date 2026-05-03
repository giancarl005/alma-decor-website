<?php
require_once 'app/config.php';
$stmt = $pdo->query("DESCRIBE settings");
print_r($stmt->fetchAll());
