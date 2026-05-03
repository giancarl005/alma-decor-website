<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Access-Control-Allow-Methods: GET, OPTIONS');

require_once '../../app/config.php';

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// În loc de JWT real pentru demo, decodăm token-ul simplu trimis
$headers = apache_request_headers();
$authHeader = $headers['Authorization'] ?? $headers['authorization'] ?? '';

if (!$authHeader || strpos($authHeader, 'Bearer ') !== 0) {
    http_response_code(401);
    echo json_encode(['status' => 'error', 'message' => 'Neautorizat']);
    exit;
}

$token = str_replace('Bearer ', '', $authHeader);
$decoded = json_decode(base64_decode($token), true);

if (!$decoded || !isset($decoded['id'])) {
    http_response_code(401);
    echo json_encode(['status' => 'error', 'message' => 'Token invalid']);
    exit;
}

$userId = $decoded['id'];

try {
    // 1. Get Profile
    $stmt = $pdo->prepare("SELECT id, nume, email, telefon, adresa, oras, judet, created_at FROM clienti WHERE id = :id");
    $stmt->execute(['id' => $userId]);
    $user = $stmt->fetch();

    if (!$user) {
        http_response_code(404);
        echo json_encode(['status' => 'error', 'message' => 'Utilizator inexistent']);
        exit;
    }

    // 2. Get Orders
    $stmtOrders = $pdo->prepare("SELECT * FROM comenzi WHERE email_client = :email ORDER BY created_at DESC");
    $stmtOrders->execute(['email' => $user['email']]);
    $orders = $stmtOrders->fetchAll();

    echo json_encode([
        'status' => 'success',
        'user' => $user,
        'orders' => $orders
    ]);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['status' => 'error', 'message' => $e->getMessage()]);
}
