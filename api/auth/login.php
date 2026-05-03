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

    if (!isset($data['email']) || !isset($data['password'])) {
        http_response_code(400);
        echo json_encode(['status' => 'error', 'message' => 'Date incomplete']);
        exit;
    }

    try {
        $stmt = $pdo->prepare("SELECT * FROM clienti WHERE email = :email");
        $stmt->execute(['email' => $data['email']]);
        $user = $stmt->fetch();

        if ($user && password_verify($data['password'], $user['password'])) {
            // Pentru demo folosim un token simplu (ID hashuit)
            // În producție folosește JWT
            $token = base64_encode(json_encode(['id' => $user['id'], 'email' => $user['email'], 'exp' => time() + 86400]));
            
            unset($user['password']); // Nu trimitem parola înapoi
            echo json_encode([
                'status' => 'success',
                'token' => $token,
                'user' => $user
            ]);
        } else {
            http_response_code(401);
            echo json_encode(['status' => 'error', 'message' => 'Email sau parolă incorectă']);
        }
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['status' => 'error', 'message' => $e->getMessage()]);
    }
}
