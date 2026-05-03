<?php
require_once 'app/config.php';
$sql = "SELECT c.id, c.name, c.slug, c.parent_id,
        (SELECT p.primary_image FROM produse p 
         WHERE p.category_id = c.id 
         OR p.category_id IN (SELECT id FROM categorii WHERE parent_id = c.id)
         LIMIT 1) as representative_image
        FROM categorii c 
        WHERE c.slug = 'profile-decorative-interior'";
$stmt = $pdo->query($sql);
echo json_encode($stmt->fetch(PDO::FETCH_ASSOC));
?>
