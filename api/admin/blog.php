<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

require_once '../../app/config.php';

$method = $_SERVER['REQUEST_METHOD'];

// Helper pentru slug
function createSlug($str) {
    $str = strtolower($str);
    $str = preg_replace('/[^a-z0-9\-]/', '-', $str);
    $str = preg_replace('/-+/', '-', $str);
    return trim($str, '-');
}

switch($method) {
    case 'GET':
        if (isset($_GET['id'])) {
            $stmt = $pdo->prepare("SELECT * FROM articole_blog WHERE id = ?");
            $stmt->execute([$_GET['id']]);
            $post = $stmt->fetch(PDO::FETCH_ASSOC);
            if ($post && $post['faq_json']) {
                $post['faq_json'] = json_decode($post['faq_json'], true);
            }
            echo json_encode($post);
        } else {
            $stmt = $pdo->query("SELECT id, title, slug, is_published, author, category, created_at FROM articole_blog ORDER BY created_at DESC");
            echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
        }
        break;

    case 'POST':
        $data = json_decode(file_get_contents('php://input'), true);
        if (empty($data['title'])) {
            echo json_encode(['status' => 'error', 'message' => 'Titlu lipsă']);
            exit;
        }
        
        $slug = !empty($data['slug']) ? $data['slug'] : createSlug($data['title']);
        $faq_json = isset($data['faq_json']) && is_array($data['faq_json']) ? json_encode($data['faq_json']) : null;
        
        $stmt = $pdo->prepare("INSERT INTO articole_blog (title, slug, excerpt, content, featured_image, author, category, meta_title, meta_description, faq_json, schema_type, is_published) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
        $stmt->execute([
            $data['title'],
            $slug,
            $data['excerpt'] ?? '',
            $data['content'] ?? '',
            $data['featured_image'] ?? '',
            $data['author'] ?? 'Admin',
            $data['category'] ?? 'General',
            $data['meta_title'] ?? '',
            $data['meta_description'] ?? '',
            $faq_json,
            $data['schema_type'] ?? 'Article',
            $data['is_published'] ?? 0
        ]);
        echo json_encode(['status' => 'success', 'id' => $pdo->lastInsertId()]);
        break;

    case 'PUT':
        $data = json_decode(file_get_contents('php://input'), true);
        if (empty($data['id'])) {
            echo json_encode(['status' => 'error', 'message' => 'ID lipsă']);
            exit;
        }
        
        $slug = !empty($data['slug']) ? $data['slug'] : createSlug($data['title']);
        $faq_json = isset($data['faq_json']) && is_array($data['faq_json']) ? json_encode($data['faq_json']) : null;
        
        $stmt = $pdo->prepare("UPDATE articole_blog SET title=?, slug=?, excerpt=?, content=?, featured_image=?, author=?, category=?, meta_title=?, meta_description=?, faq_json=?, schema_type=?, is_published=? WHERE id=?");
        $stmt->execute([
            $data['title'],
            $slug,
            $data['excerpt'] ?? '',
            $data['content'] ?? '',
            $data['featured_image'] ?? '',
            $data['author'] ?? 'Admin',
            $data['category'] ?? 'General',
            $data['meta_title'] ?? '',
            $data['meta_description'] ?? '',
            $faq_json,
            $data['schema_type'] ?? 'Article',
            $data['is_published'] ?? 0,
            $data['id']
        ]);
        echo json_encode(['status' => 'success']);
        break;

    case 'DELETE':
        $id = $_GET['id'];
        $stmt = $pdo->prepare("DELETE FROM articole_blog WHERE id = ?");
        $stmt->execute([$id]);
        echo json_encode(['status' => 'success']);
        break;
}
