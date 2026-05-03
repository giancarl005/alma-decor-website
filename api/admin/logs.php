<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

require_once '../../app/config.php';

try {
    $stmt = $pdo->query("SELECT * FROM log_import ORDER BY created_at DESC LIMIT 5");
    echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
} catch (Exception $e) {
    echo json_encode([]);
}
