<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

require_once '../app/config.php';

try {
    $sql = "SELECT c.id, c.name, c.slug, c.image, c.parent_id,
            (SELECT p.primary_image FROM produse p 
             INNER JOIN categorii sub ON p.category_id = sub.id
             WHERE (sub.id = c.id OR sub.parent_id = c.id OR sub.parent_id IN (SELECT id FROM categorii WHERE parent_id = c.id))
             AND p.primary_image IS NOT NULL AND p.primary_image != ''
             LIMIT 1) as representative_image
            FROM categorii c 
            WHERE c.is_active = 1 
            ORDER BY c.sort_order ASC";
    $stmt = $pdo->prepare($sql);
    $stmt->execute();
    $categorii = $stmt->fetchAll();

    echo json_encode([
        'status' => 'success',
        'data' => $categorii
    ]);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'status' => 'error',
        'message' => $e->getMessage()
    ]);
}
