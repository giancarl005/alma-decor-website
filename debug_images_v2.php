<?php
require_once 'app/config.php';
$slug = 'profile-decorative-interior';

// Get current category ID
$stmt = $pdo->prepare("SELECT id, name, slug, image FROM categorii WHERE slug = ?");
$stmt->execute([$slug]);
$cat = $stmt->fetch();
$id = $cat['id'];

$sql = "SELECT c.id, c.name, c.slug, c.image, c.parent_id,
        (SELECT p.primary_image FROM produse p 
         WHERE (p.category_id = c.id 
         OR p.category_id IN (SELECT id FROM categorii WHERE parent_id = c.id)
         OR p.category_id IN (SELECT id FROM categorii WHERE parent_id IN (SELECT id FROM categorii WHERE parent_id = c.id)))
         AND p.primary_image IS NOT NULL AND p.primary_image != ''
         LIMIT 1) as representative_image
        FROM categorii c 
        WHERE c.id = ?";
$stmt = $pdo->prepare($sql);
$stmt->execute([$id]);
$result = $stmt->fetch();

header('Content-Type: application/json');
echo json_encode($result);
?>
