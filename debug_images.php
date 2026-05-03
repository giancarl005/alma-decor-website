<?php
require_once 'app/config.php';
$slug = 'profile-decorative-interior';

// Get current category ID
$stmt = $pdo->prepare("SELECT id FROM categorii WHERE slug = ?");
$stmt->execute([$slug]);
$cat = $stmt->fetch();
$id = $cat['id'];

echo "Category ID: $id\n";

// Find children
$stmt = $pdo->prepare("SELECT id, name FROM categorii WHERE parent_id = ?");
$stmt->execute([$id]);
$children = $stmt->fetchAll();
$childIds = array_column($children, 'id');

echo "Children IDs: " . implode(',', $childIds) . "\n";

// Find grandchildren
if (!empty($childIds)) {
    $placeholders = str_repeat('?,', count($childIds) - 1) . '?';
    $stmt = $pdo->prepare("SELECT id, name FROM categorii WHERE parent_id IN ($placeholders)");
    $stmt->execute($childIds);
    $grandchildren = $stmt->fetchAll();
    $grandchildIds = array_column($grandchildren, 'id');
    echo "Grandchildren IDs: " . implode(',', $grandchildIds) . "\n";
}

// Check for products in any of these
$allIds = array_merge([$id], $childIds, $grandchildIds ?? []);
if (!empty($allIds)) {
    $placeholders = str_repeat('?,', count($allIds) - 1) . '?';
    $stmt = $pdo->prepare("SELECT p.id, p.name, p.primary_image FROM produse p WHERE p.category_id IN ($placeholders) AND p.primary_image IS NOT NULL AND p.primary_image != '' LIMIT 1");
    $stmt->execute($allIds);
    $prod = $stmt->fetch();
    echo "Found Product: " . json_encode($prod) . "\n";
}
?>
