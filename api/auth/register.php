<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: Content-Type');
header('Access-Control-Allow-Methods: POST, OPTIONS');

require_once '../../app/config.php';

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);

    if (!isset($data['email']) || !isset($data['password']) || !isset($data['nume'])) {
        http_response_code(400);
        echo json_encode(['status' => 'error', 'message' => 'Date incomplete']);
        exit;
    }

    $password = password_hash($data['password'], PASSWORD_DEFAULT);

    try {
        $stmt = $pdo->prepare("INSERT INTO clienti (nume, email, password, telefon) VALUES (:nume, :email, :password, :telefon)");
        $stmt->execute([
            'nume' => $data['nume'],
            'email' => $data['email'],
            'password' => $password,
            'telefon' => $data['telefon'] ?? null
        ]);
        echo json_encode(['status' => 'success', 'message' => 'Cont creat cu succes']);
    } catch (Exception $e) {
        http_response_code(500);
        if (strpos($e->getMessage(), 'Duplicate entry') !== false) {
            echo json_encode(['status' => 'error', 'message' => 'Acest email este deja înregistrat']);
        } else {
            echo json_encode(['status' => 'error', 'message' => $e->getMessage()]);
        }
    }
}
