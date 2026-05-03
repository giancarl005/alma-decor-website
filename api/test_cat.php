<?php
header('Content-Type: application/json');
require_once '../app/config.php';
$stmt = $pdo->query('SELECT id, name, parent_id, is_active FROM categorii');
echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
