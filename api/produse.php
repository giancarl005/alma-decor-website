<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

require_once '../app/config.php';

// Clear any accidental output/warnings to ensure clean JSON
ob_start();
if (ob_get_length()) ob_clean();

try {
    $slug = isset($_GET['slug']) ? $_GET['slug'] : null;
    $category_slug = isset($_GET['categorie']) ? $_GET['categorie'] : null;
    $min_price = isset($_GET['min_price']) ? (float)$_GET['min_price'] : null;
    $max_price = isset($_GET['max_price']) ? (float)$_GET['max_price'] : null;
    $sort = isset($_GET['sort']) ? $_GET['sort'] : 'newest';
    $ids = isset($_GET['ids']) ? $_GET['ids'] : null;
    $slugs = isset($_GET['slugs']) ? $_GET['slugs'] : null;
    $q = isset($_GET['q']) ? $_GET['q'] : null;
    $in_stock = isset($_GET['in_stock']) ? (int)$_GET['in_stock'] : null;

    if ($slug) {
        $stmt = $pdo->prepare("SELECT p.*, c.name as category_name, c.slug as category_slug, c.parent_id as category_parent_id,
            pc.name as parent_category_name, pc.slug as parent_category_slug,
            (SELECT AVG(rating) FROM produs_recenzii WHERE product_id = p.id AND is_approved = 1) as avg_rating,
            (SELECT COUNT(*) FROM produs_recenzii WHERE product_id = p.id AND is_approved = 1) as reviews_count
            FROM produse p 
            LEFT JOIN categorii c ON p.category_id = c.id 
            LEFT JOIN categorii pc ON c.parent_id = pc.id
            WHERE p.slug = :slug AND p.is_active = 1");
        $stmt->execute(['slug' => $slug]);
        $produs = $stmt->fetch();
        
        if ($produs) {
            // Get gallery images
            $stmt = $pdo->prepare("SELECT url FROM produs_imagini WHERE product_id = :id ORDER BY sort_order ASC");
            $stmt->execute(['id' => $produs['id']]);
            $gallery = $stmt->fetchAll(PDO::FETCH_COLUMN); // Index 0 of the SELECT result is 'url'
            
            // Get variations
            $stmt = $pdo->prepare("SELECT * FROM produs_variatii WHERE product_id = :id AND is_active = 1 ORDER BY sort_order ASC");
            $stmt->execute(['id' => $produs['id']]);
            $produs['variations'] = $stmt->fetchAll();

            // Get specifications
            $stmt = $pdo->prepare("SELECT field_name as label, field_value as value FROM produs_campuri_custom WHERE product_id = :id");
            $stmt->execute(['id' => $produs['id']]);
            $produs['specs'] = $stmt->fetchAll();
            
            // Fix URLs to have leading slash
            if ($produs['primary_image'] && !preg_match('~^(?:https?://|/)~i', $produs['primary_image'])) {
                $produs['primary_image'] = '/' . $produs['primary_image'];
            }
            $produs['gallery'] = array_map(function($url) {
                return !preg_match('~^(?:https?://|/)~i', $url) ? '/' . $url : $url;
            }, $gallery);

            echo json_encode(['status' => 'success', 'data' => $produs]);
        } else {
            http_response_code(404);
            echo json_encode(['status' => 'error', 'message' => 'Produsul nu a fost găsit']);
        }
        exit;
    }

    $limit = isset($_GET['limit']) ? (int)$_GET['limit'] : 9;
    $page = isset($_GET['page']) ? (int)$_GET['page'] : 1;
    $offset = ($page - 1) * $limit;

    // First, count total matching items
    $countSql = "SELECT COUNT(*) FROM produse p LEFT JOIN categorii c ON p.category_id = c.id WHERE p.is_active = 1";
    $countParams = [];

    // ... (apply the same filters to $countSql and $countParams as done below for $sql)
    // To avoid duplication, I'll build the WHERE clause once
    $where = " WHERE p.is_active = 1";
    $params = [];

    if ($ids) {
        $idArray = explode(',', $ids);
        $placeholders = str_repeat('?,', count($idArray) - 1) . '?';
        $where .= " AND p.id IN ($placeholders)";
        foreach($idArray as $id) $params[] = $id;
    }

    if ($slugs) {
        $slugArray = explode(',', $slugs);
        $placeholders = str_repeat('?,', count($slugArray) - 1) . '?';
        $where .= " AND p.slug IN ($placeholders)";
        foreach($slugArray as $s) $params[] = $s;
    }

    if ($category_slug) {
        $where .= " AND (c.slug = ? OR pc.slug = ?)";
        $params[] = $category_slug;
        $params[] = $category_slug;
    }

    if ($q) {
        $where .= " AND (p.name LIKE ? OR p.description LIKE ?)";
        $params[] = "%$q%";
        $params[] = "%$q%";
    }

    if ($in_stock) {
        $where .= " AND p.stock > 0";
    }

    if ($min_price !== null) {
        $where .= " AND (CASE WHEN p.sale_price IS NOT NULL THEN p.sale_price ELSE p.price END) >= ?";
        $params[] = $min_price;
    }

    if ($max_price !== null) {
        $where .= " AND (CASE WHEN p.sale_price IS NOT NULL THEN p.sale_price ELSE p.price END) <= ?";
        $params[] = $max_price;
    }

    // Get total count
    $stmtCount = $pdo->prepare("SELECT COUNT(*) FROM produse p 
                                LEFT JOIN categorii c ON p.category_id = c.id
                                LEFT JOIN categorii pc ON c.parent_id = pc.id" . $where);
    $stmtCount->execute($params);
    $totalProducts = $stmtCount->fetchColumn();
    $totalPages = ceil($totalProducts / $limit);

    // Main Query
    $sql = "SELECT p.*, c.name as category_name, c.slug as category_slug, c.parent_id as category_parent_id,
            pc.name as parent_category_name, pc.slug as parent_category_slug,
            (SELECT AVG(rating) FROM produs_recenzii WHERE product_id = p.id AND is_approved = 1) as avg_rating,
            (SELECT COUNT(*) FROM produs_recenzii WHERE product_id = p.id AND is_approved = 1) as reviews_count
            FROM produse p
            LEFT JOIN categorii c ON p.category_id = c.id
            LEFT JOIN categorii pc ON c.parent_id = pc.id" . $where;

    switch ($sort) {
        case 'price_asc': $sql .= " ORDER BY (CASE WHEN p.sale_price IS NOT NULL THEN p.sale_price ELSE p.price END) ASC"; break;
        case 'price_desc': $sql .= " ORDER BY (CASE WHEN p.sale_price IS NOT NULL THEN p.sale_price ELSE p.price END) DESC"; break;
        case 'name_asc': $sql .= " ORDER BY p.name ASC"; break;
        default: $sql .= " ORDER BY p.id DESC"; break;
    }

    $sql .= " LIMIT $limit OFFSET $offset";

    $stmt = $pdo->prepare($sql);
    $stmt->execute($params);
    $produse = $stmt->fetchAll();

    // Fix URLs to have leading slash
    foreach ($produse as &$p) {
        if ($p['primary_image'] && !preg_match('~^(?:https?://|/)~i', $p['primary_image'])) {
            $p['primary_image'] = '/' . $p['primary_image'];
        }
    }

    echo json_encode([
        'status' => 'success', 
        'count' => count($produse), 
        'total_count' => (int)$totalProducts,
        'total_pages' => $totalPages,
        'current_page' => $page,
        'limit' => $limit,
        'data' => $produse
    ]);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['status' => 'error', 'message' => $e->getMessage()]);
}
