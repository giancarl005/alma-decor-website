<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit;
}

require_once '../app/config.php';

try {
    if ($_SERVER['REQUEST_METHOD'] === 'GET') {
        $stmt = $pdo->query("SELECT setting_key, setting_value FROM settings");
        $settings = $stmt->fetchAll(PDO::FETCH_KEY_PAIR);
        
        echo json_encode(['status' => 'success', 'data' => $settings]);
    } 
    elseif ($_SERVER['REQUEST_METHOD'] === 'POST') {
        // Simple auth check (in a real app, this would be more robust)
        $data = json_decode(file_get_contents('php://input'), true);
        
        if (!$data || !isset($data['settings'])) {
            throw new Exception('Date invalide');
        }

        $pdo->beginTransaction();
        $stmt = $pdo->prepare("INSERT INTO settings (setting_key, setting_value) VALUES (?, ?) ON DUPLICATE KEY UPDATE setting_value = VALUES(setting_value)");
        
        foreach ($data['settings'] as $key => $value) {
            $stmt->execute([$key, $value]);
        }
        
        $pdo->commit();
        echo json_encode(['status' => 'success', 'message' => 'Setări salvate cu succes']);
    }

} catch (Exception $e) {
    if ($pdo->inTransaction()) $pdo->rollBack();
    http_response_code(500);
    echo json_encode(['status' => 'error', 'message' => $e->getMessage()]);
}
