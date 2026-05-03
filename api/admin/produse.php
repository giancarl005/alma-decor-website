<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: Content-Type');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');

require_once '../../app/config.php';

$method = $_SERVER['REQUEST_METHOD'];

try {
    switch ($method) {
        case 'GET':
            $id = $_GET['id'] ?? null;
            if ($id) {
                // Get single product with details
                $stmt = $pdo->prepare("SELECT * FROM produse WHERE id = :id");
                $stmt->execute(['id' => $id]);
                $product = $stmt->fetch();
                
                // Get gallery images
                $stmt = $pdo->prepare("SELECT * FROM produs_imagini WHERE product_id = :id ORDER BY sort_order ASC");
                $stmt->execute(['id' => $id]);
                $gallery = $stmt->fetchAll();
                
                // Fix URLs to have leading slash
                if ($product['primary_image'] && !preg_match('~^(?:https?://|/)~i', $product['primary_image'])) {
                    $product['primary_image'] = '/' . $product['primary_image'];
                }
                foreach ($gallery as &$img) {
                    if ($img['url'] && !preg_match('~^(?:https?://|/)~i', $img['url'])) {
                        $img['url'] = '/' . $img['url'];
                    }
                }
                
                
                $product['gallery'] = $gallery;

                // Get specifications
                $stmt = $pdo->prepare("SELECT field_name as label, field_value as value FROM produs_campuri_custom WHERE product_id = :id");
                $stmt->execute(['id' => $id]);
                $product['specs'] = $stmt->fetchAll();

                echo json_encode(['status' => 'success', 'data' => $product]);
            } else {
                // List products with pagination
                $limit = isset($_GET['limit']) ? (int)$_GET['limit'] : 100;
                $page = isset($_GET['page']) ? (int)$_GET['page'] : 1;
                $offset = ($page - 1) * $limit;
                
                // Get total count
                $totalProducts = $pdo->query("SELECT COUNT(*) FROM produse")->fetchColumn();
                $totalPages = ceil($totalProducts / $limit);

                $stmt = $pdo->prepare("SELECT p.*, c.name as category_name FROM produse p LEFT JOIN categorii c ON p.category_id = c.id ORDER BY p.id DESC LIMIT :limit OFFSET :offset");
                $stmt->bindValue(':limit', $limit, PDO::PARAM_INT);
                $stmt->bindValue(':offset', $offset, PDO::PARAM_INT);
                $stmt->execute();
                $products = $stmt->fetchAll();
                
                // Fix URLs to have leading slash
                foreach ($products as &$p) {
                    if ($p['primary_image'] && !preg_match('~^(?:https?://|/)~i', $p['primary_image'])) {
                        $p['primary_image'] = '/' . $p['primary_image'];
                    }
                }
                
                echo json_encode([
                    'status' => 'success', 
                    'data' => $products,
                    'total_count' => (int)$totalProducts,
                    'total_pages' => $totalPages,
                    'current_page' => $page,
                    'limit' => $limit
                ]);
            }
            break;

        case 'POST':
            $data = json_decode(file_get_contents('php://input'), true);
            $pdo->beginTransaction();
            
            $sql = "INSERT INTO produse (category_id, sku, name, slug, short_description, description, price, sale_price, stock, stock_status, brand, primary_image, badge, badge_text, meta_title, meta_description, is_active) 
                    VALUES (:category_id, :sku, :name, :slug, :short_description, :description, :price, :sale_price, :stock, :stock_status, :brand, :primary_image, :badge, :badge_text, :meta_title, :meta_description, :is_active)";
            
            $stmt = $pdo->prepare($sql);
            $stmt->execute([
                'category_id' => $data['category_id'],
                'sku' => $data['sku'] ?: 'AD-PROD-' . time(),
                'name' => $data['name'],
                'slug' => $data['slug'],
                'short_description' => $data['short_description'] ?? '',
                'description' => $data['description'] ?? '',
                'price' => $data['price'],
                'sale_price' => $data['sale_price'] ?: null,
                'stock' => $data['stock'] ?? 0,
                'stock_status' => $data['stock_status'] ?? 'in_stoc',
                'brand' => $data['brand'] ?? 'Alma Decor',
                'primary_image' => $data['primary_image'] ?? null,
                'badge' => $data['badge'] ?? null,
                'badge_text' => $data['badge_text'] ?? null,
                'meta_title' => $data['meta_title'] ?? null,
                'meta_description' => $data['meta_description'] ?? null,
                'is_active' => $data['is_active'] ?? 1
            ]);
            
            $productId = $pdo->lastInsertId();
            
            // Save Gallery
            if (isset($data['gallery']) && is_array($data['gallery'])) {
                foreach ($data['gallery'] as $index => $img) {
                    $stmt = $pdo->prepare("INSERT INTO produs_imagini (product_id, url, sort_order) VALUES (?, ?, ?)");
                    $stmt->execute([$productId, $img['url'], $index]);
                }
            }
            
            $pdo->commit();
            echo json_encode(['status' => 'success', 'id' => $productId]);
            break;

        case 'PUT':
            $data = json_decode(file_get_contents('php://input'), true);
            $pdo->beginTransaction();
            
            // Handle bulk category update
            if (isset($data['bulk_update']) && $data['bulk_update'] === true && !empty($data['product_ids']) && isset($data['category_id'])) {
                $ids = $data['product_ids'];
                $categoryId = $data['category_id'];
                $placeholders = implode(',', array_fill(0, count($ids), '?'));
                $stmt = $pdo->prepare("UPDATE produse SET category_id = ? WHERE id IN ($placeholders)");
                $params = array_merge([$categoryId], $ids);
                $stmt->execute($params);
                $pdo->commit();
                echo json_encode(['status' => 'success']);
                exit;
            }
            
            // Extract current product data to preserve fields not sent in request
            $stmt = $pdo->prepare("SELECT * FROM produse WHERE id = ?");
            $stmt->execute([$data['id']]);
            $currentProduct = $stmt->fetch();

            if (!$currentProduct) {
                throw new Exception("Produsul nu a fost găsit");
            }

            $sql = "UPDATE produse SET 
                    category_id = :category_id, 
                    sku = :sku, 
                    name = :name, 
                    slug = :slug, 
                    short_description = :short_description, 
                    description = :description, 
                    price = :price, 
                    sale_price = :sale_price, 
                    stock = :stock, 
                    stock_status = :stock_status,
                    brand = :brand, 
                    primary_image = :primary_image,
                    badge = :badge, 
                    badge_text = :badge_text,
                    meta_title = :meta_title,
                    meta_description = :meta_description,
                    is_active = :is_active
                    WHERE id = :id";
            
            $stmt = $pdo->prepare($sql);
            $stmt->execute([
                'id' => $data['id'],
                'category_id' => $data['category_id'] ?? $currentProduct['category_id'],
                'sku' => $data['sku'] ?? $currentProduct['sku'],
                'name' => $data['name'] ?? $currentProduct['name'],
                'slug' => $data['slug'] ?? $currentProduct['slug'],
                'short_description' => $data['short_description'] ?? $currentProduct['short_description'],
                'description' => $data['description'] ?? $currentProduct['description'],
                'price' => $data['price'] ?? $currentProduct['price'],
                'sale_price' => array_key_exists('sale_price', $data) ? $data['sale_price'] : $currentProduct['sale_price'],
                'stock' => $data['stock'] ?? $currentProduct['stock'],
                'stock_status' => $data['stock_status'] ?? $currentProduct['stock_status'],
                'brand' => $data['brand'] ?? $currentProduct['brand'],
                'primary_image' => $data['primary_image'] ?? $currentProduct['primary_image'],
                'badge' => array_key_exists('badge', $data) ? $data['badge'] : $currentProduct['badge'],
                'badge_text' => array_key_exists('badge_text', $data) ? $data['badge_text'] : $currentProduct['badge_text'],
                'meta_title' => array_key_exists('meta_title', $data) ? $data['meta_title'] : $currentProduct['meta_title'],
                'meta_description' => array_key_exists('meta_description', $data) ? $data['meta_description'] : $currentProduct['meta_description'],
                'is_active' => array_key_exists('is_active', $data) ? (int)$data['is_active'] : (int)$currentProduct['is_active']
            ]);
            
            // Update Gallery only if explicitly provided
            if (isset($data['gallery']) && is_array($data['gallery'])) {
                $stmt = $pdo->prepare("DELETE FROM produs_imagini WHERE product_id = ?");
                $stmt->execute([$data['id']]);
                
                foreach ($data['gallery'] as $index => $img) {
                    $stmt = $pdo->prepare("INSERT INTO produs_imagini (product_id, url, sort_order) VALUES (?, ?, ?)");
                    $url = is_array($img) ? ($img['url'] ?? '') : $img;
                    if ($url) {
                        $stmt->execute([$data['id'], $url, $index]);
                    }
                }
            }

            // Update Specifications only if explicitly provided
            if (isset($data['specs']) && is_array($data['specs'])) {
                $stmt = $pdo->prepare("DELETE FROM produs_campuri_custom WHERE product_id = ?");
                $stmt->execute([$data['id']]);
                
                foreach ($data['specs'] as $spec) {
                    $stmt_spec = $pdo->prepare("INSERT INTO produs_campuri_custom (product_id, field_name, field_value) VALUES (?, ?, ?)");
                    $stmt_spec->execute([$data['id'], $spec['label'], $spec['value']]);
                }
            }
            
            $pdo->commit();
            echo json_encode(['status' => 'success']);
            break;

        case 'DELETE':
            $id = $_GET['id'] ?? null;
            if ($id) {
                $pdo->beginTransaction();
                $pdo->prepare("DELETE FROM produs_imagini WHERE product_id = ?")->execute([$id]);
                $pdo->prepare("DELETE FROM produse WHERE id = ?")->execute([$id]);
                $pdo->commit();
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
    if ($pdo->inTransaction()) $pdo->rollBack();
    http_response_code(500);
    echo json_encode(['status' => 'error', 'message' => $e->getMessage()]);
}
