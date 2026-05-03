<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

require_once '../../app/config.php';

$method = $_SERVER['REQUEST_METHOD'];

switch($method) {
    case 'GET':
        $stmt = $pdo->query("SELECT * FROM settings WHERE setting_key LIKE 'pixel_%'");
        $pixels = [];
        foreach($stmt->fetchAll(PDO::FETCH_ASSOC) as $row) {
            $pixels[$row['setting_key']] = $row['setting_value'];
        }
        echo json_encode($pixels);
        break;

    case 'POST':
        $data = json_decode(file_get_contents('php://input'), true);
        
        $pdo->beginTransaction();
        try {
            foreach($data as $key => $value) {
                $stmt = $pdo->prepare("INSERT INTO settings (setting_key, setting_value) VALUES (?, ?) 
                                        ON DUPLICATE KEY UPDATE setting_value = VALUES(setting_value)");
                $stmt->execute([$key, $value]);
            }
            $pdo->commit();
            echo json_encode(['status' => 'success']);
        } catch (Exception $e) {
            $pdo->rollBack();
            echo json_encode(['status' => 'error', 'message' => $e->getMessage()]);
        }
        break;
}
