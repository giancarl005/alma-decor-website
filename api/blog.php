<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

require_once '../app/config.php';

$slug = isset($_GET['slug']) ? $_GET['slug'] : null;

try {
    if ($slug) {
        $stmt = $pdo->prepare("SELECT * FROM articole_blog WHERE slug = :slug AND is_published = 1");
        $stmt->execute(['slug' => $slug]);
        $post = $stmt->fetch(PDO::FETCH_ASSOC);
        
        if ($post) {
            // Fix images paths
            if ($post['featured_image'] && !preg_match('~^(?:https?://|/)~i', $post['featured_image'])) {
                $post['featured_image'] = '/' . $post['featured_image'];
            }
            if ($post['faq_json']) {
                $post['faq_json'] = json_decode($post['faq_json'], true);
            }
            
            // Calculate reading time
            $wordCount = str_word_count(strip_tags($post['content'] ?? ''));
            $post['reading_time'] = max(1, ceil($wordCount / 220));
            
            echo json_encode(['status' => 'success', 'data' => $post]);
        } else {
            http_response_code(404);
            echo json_encode(['status' => 'error', 'message' => 'Articolul nu a fost găsit']);
        }
    } else {
        $page = isset($_GET['page']) ? (int)$_GET['page'] : 1;
        $limit = isset($_GET['limit']) ? (int)$_GET['limit'] : 12;
        $offset = ($page - 1) * $limit;

        $stmtCount = $pdo->query("SELECT COUNT(*) FROM articole_blog WHERE is_published = 1");
        $total = $stmtCount->fetchColumn();
        
        $stmt = $pdo->prepare("SELECT id, title, slug, excerpt, content, featured_image, author, created_at FROM articole_blog WHERE is_published = 1 ORDER BY created_at DESC LIMIT :limit OFFSET :offset");
        $stmt->bindValue(':limit', $limit, PDO::PARAM_INT);
        $stmt->bindValue(':offset', $offset, PDO::PARAM_INT);
        $stmt->execute();
        $posts = $stmt->fetchAll(PDO::FETCH_ASSOC);

        foreach ($posts as &$post) {
            if ($post['featured_image'] && !preg_match('~^(?:https?://|/)~i', $post['featured_image'])) {
                $post['featured_image'] = '/' . $post['featured_image'];
            }
            
            // Calculate reading time based on 220 WPM
            $wordCount = str_word_count(strip_tags($post['content'] ?? ''));
            $post['reading_time'] = max(1, ceil($wordCount / 220));
            
            // Remove content to save bandwidth since it's only needed for single view
            unset($post['content']);
        }

        echo json_encode([
            'status' => 'success',
            'data' => $posts,
            'pagination' => [
                'total' => (int)$total,
                'page' => $page,
                'limit' => $limit,
                'total_pages' => ceil($total / $limit)
            ]
        ]);
    }
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['status' => 'error', 'message' => $e->getMessage()]);
}
?>
