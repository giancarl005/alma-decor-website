<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

require_once '../../app/config.php';

$method = $_SERVER['REQUEST_METHOD'];

switch($method) {
    case 'GET':
        $stmt = $pdo->query("SELECT * FROM seo_pages ORDER BY page_key ASC");
        echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
        break;

    case 'PUT':
    case 'POST':
        $data = json_decode(file_get_contents('php://input'), true);
        if (!$data['page_key']) die(json_encode(['status' => 'error', 'message' => 'Cheie pagină lipsă']));
        
        $stmt = $pdo->prepare("INSERT INTO seo_pages (page_key, meta_title, meta_description, og_image) 
                                VALUES (?, ?, ?, ?) 
                                ON DUPLICATE KEY UPDATE 
                                meta_title = VALUES(meta_title), 
                                meta_description = VALUES(meta_description), 
                                og_image = VALUES(og_image)");
        $stmt->execute([
            $data['page_key'],
            $data['meta_title'] ?? '',
            $data['meta_description'] ?? '',
            $data['og_image'] ?? ''
        ]);
        echo json_encode(['status' => 'success']);
        break;
}
