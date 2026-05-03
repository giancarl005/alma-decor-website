<?php
require_once 'app/config.php';
$stmt = $pdo->query("DESCRIBE produs_imagini");
print_r($stmt->fetchAll(PDO::FETCH_ASSOC));
