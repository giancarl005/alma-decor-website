<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

require_once __DIR__ . '/../../app/config.php';

$method = $_SERVER['REQUEST_METHOD'];

switch($method) {
    case 'GET':
        $stmt = $pdo->query("SELECT * FROM email_templates ORDER BY template_key ASC");
        echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
        break;

    case 'POST':
        $data = json_decode(file_get_contents('php://input'), true);
        if (!$data['template_key']) die(json_encode(['status' => 'error', 'message' => 'Cheie template lipsă']));
        
        $stmt = $pdo->prepare("INSERT INTO email_templates (template_key, subject, body_html) 
                                VALUES (?, ?, ?) 
                                ON DUPLICATE KEY UPDATE 
                                subject = VALUES(subject), 
                                body_html = VALUES(body_html)");
        $stmt->execute([
            $data['template_key'],
            $data['subject'] ?? '',
            $data['body_html'] ?? ''
        ]);
        echo json_encode(['status' => 'success']);
        break;
}
