<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

require_once __DIR__ . '/../../app/config.php';

$method = $_SERVER['REQUEST_METHOD'];

try {
    if ($method === 'GET') {
        $stmt = $pdo->query("SELECT * FROM blog_authors ORDER BY name ASC");
        $authors = $stmt->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode(['status' => 'success', 'data' => $authors]);
    } 
    elseif ($method === 'POST') {
        $data = json_decode(file_get_contents('php://input'), true);
        
        $stmt = $pdo->prepare("INSERT INTO blog_authors (name, image, description, is_verified, stat_1_label, stat_1_value, stat_2_label, stat_2_value, stat_3_label, stat_3_value) VALUES (:name, :image, :description, :is_verified, :stat_1_label, :stat_1_value, :stat_2_label, :stat_2_value, :stat_3_label, :stat_3_value)");
        
        $stmt->execute([
            'name' => $data['name'],
            'image' => $data['image'] ?? null,
            'description' => $data['description'] ?? null,
            'is_verified' => $data['is_verified'] ?? 0,
            'stat_1_label' => $data['stat_1_label'] ?? null,
            'stat_1_value' => $data['stat_1_value'] ?? null,
            'stat_2_label' => $data['stat_2_label'] ?? null,
            'stat_2_value' => $data['stat_2_value'] ?? null,
            'stat_3_label' => $data['stat_3_label'] ?? null,
            'stat_3_value' => $data['stat_3_value'] ?? null
        ]);
        
        echo json_encode(['status' => 'success', 'message' => 'Autor adăugat cu succes', 'id' => $pdo->lastInsertId()]);
    }
    elseif ($method === 'PUT') {
        $data = json_decode(file_get_contents('php://input'), true);
        
        $stmt = $pdo->prepare("UPDATE blog_authors SET name = :name, image = :image, description = :description, is_verified = :is_verified, stat_1_label = :stat_1_label, stat_1_value = :stat_1_value, stat_2_label = :stat_2_label, stat_2_value = :stat_2_value, stat_3_label = :stat_3_label, stat_3_value = :stat_3_value WHERE id = :id");
        
        $stmt->execute([
            'id' => $data['id'],
            'name' => $data['name'],
            'image' => $data['image'] ?? null,
            'description' => $data['description'] ?? null,
            'is_verified' => $data['is_verified'] ?? 0,
            'stat_1_label' => $data['stat_1_label'] ?? null,
            'stat_1_value' => $data['stat_1_value'] ?? null,
            'stat_2_label' => $data['stat_2_label'] ?? null,
            'stat_2_value' => $data['stat_2_value'] ?? null,
            'stat_3_label' => $data['stat_3_label'] ?? null,
            'stat_3_value' => $data['stat_3_value'] ?? null
        ]);
        
        echo json_encode(['status' => 'success', 'message' => 'Autor actualizat cu succes']);
    }
    elseif ($method === 'DELETE') {
        $id = $_GET['id'] ?? null;
        if ($id) {
            $stmt = $pdo->prepare("DELETE FROM blog_authors WHERE id = :id");
            $stmt->execute(['id' => $id]);
            echo json_encode(['status' => 'success', 'message' => 'Autor șters cu succes']);
        } else {
            throw new Exception("ID lipsă");
        }
    }
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['status' => 'error', 'message' => $e->getMessage()]);
}
?>
