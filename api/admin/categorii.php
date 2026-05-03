<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: Content-Type');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');

require_once '../../app/config.php';

$method = $_SERVER['REQUEST_METHOD'];

// Simulare autentificare (în producție verificăm token-ul)
// $token = $_HEADERS['Authorization'] ?? '';

try {
    switch ($method) {
        case 'GET':
            $stmt = $pdo->query("SELECT * FROM categorii ORDER BY sort_order ASC");
            $categorii = $stmt->fetchAll();
            echo json_encode($categorii);
            break;

        case 'POST':
            $data = json_decode(file_get_contents('php://input'), true);
            $sql = "INSERT INTO categorii (name, slug, description, description_top, description_bottom, image, parent_id, sort_order) 
                    VALUES (:name, :slug, :description, :description_top, :description_bottom, :image, :parent_id, :sort_order)";
            $stmt = $pdo->prepare($sql);
            $stmt->execute([
                'name' => $data['name'],
                'slug' => $data['slug'],
                'description' => $data['description'] ?? '',
                'description_top' => $data['description_top'] ?? '',
                'description_bottom' => $data['description_bottom'] ?? '',
                'image' => $data['image'] ?? '',
                'parent_id' => $data['parent_id'] ?: null,
                'sort_order' => $data['sort_order'] ?? 0
            ]);
            echo json_encode(['status' => 'success', 'id' => $pdo->lastInsertId()]);
            break;
 
        case 'PUT':
            $data = json_decode(file_get_contents('php://input'), true);
            $sql = "UPDATE categorii SET 
                    name = :name, 
                    slug = :slug, 
                    description = :description, 
                    description_top = :description_top, 
                    description_bottom = :description_bottom, 
                    image = :image, 
                    parent_id = :parent_id, 
                    sort_order = :sort_order 
                    WHERE id = :id";
            $stmt = $pdo->prepare($sql);
            $stmt->execute([
                'id' => $data['id'],
                'name' => $data['name'],
                'slug' => $data['slug'],
                'description' => $data['description'] ?? '',
                'description_top' => $data['description_top'] ?? '',
                'description_bottom' => $data['description_bottom'] ?? '',
                'image' => $data['image'] ?? '',
                'parent_id' => $data['parent_id'] ?: null,
                'sort_order' => $data['sort_order'] ?? 0
            ]);
            echo json_encode(['status' => 'success']);
            break;

        case 'DELETE':
            $id = $_GET['id'] ?? null;
            if ($id) {
                $stmt = $pdo->prepare("DELETE FROM categorii WHERE id = :id");
                $stmt->execute(['id' => $id]);
                echo json_encode(['status' => 'success']);
            }
            break;
            
        case 'OPTIONS':
            http_response_code(200);
            break;

        default:
            http_response_code(405);
            echo json_encode(['status' => 'error', 'message' => 'Metodă nepermisă']);
            break;
    }
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['status' => 'error', 'message' => $e->getMessage()]);
}
