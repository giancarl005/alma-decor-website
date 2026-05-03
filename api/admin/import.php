<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

require_once '../../app/config.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $input = json_decode(file_get_contents('php://input'), true);
    
    if (!isset($input['data']) || !isset($input['mapping'])) {
        echo json_encode(['status' => 'error', 'message' => 'Date insuficiente pentru import']);
        exit;
    }

    $data = $input['data'];
    $mapping = $input['mapping']; // Ex: { 'name': 'col_0', 'price': 'col_2' }
    $markup = floatval($input['markup'] ?? 0);
    
    $added = 0;
    $updated = 0;
    $errors = 0;

    $pdo->beginTransaction();

    try {
        foreach ($data as $row) {
            $name = $row[$mapping['name']] ?? '';
            if (!$name) continue;

            $sku = $row[$mapping['sku']] ?? ('AD-IMPORT-' . uniqid());
            $price = floatval($row[$mapping['price']] ?? 0);
            if ($markup > 0) $price = $price * (1 + $markup / 100);

            $short_desc = $row[$mapping['short_description']] ?? '';
            $desc = $row[$mapping['description']] ?? '';
            $brand = $row[$mapping['brand']] ?? 'Import';
            $image = $row[$mapping['image']] ?? '';
            $gallery_str = $row[$mapping['gallery']] ?? '';
            $secondary_images = [];
            if ($gallery_str) {
                $secondary_images = array_map('trim', preg_split('/[,;]/', $gallery_str));
            }

            $cat_id = intval($input['category_id'] ?? 1);
            $slug = strtolower(trim(preg_replace('/[^A-Za-z0-9-]+/', '-', $name)));

            // Check if exists
            $stmt = $pdo->prepare("SELECT id FROM produse WHERE sku = :sku");
            $stmt->execute(['sku' => $sku]);
            $existing = $stmt->fetch();

            if ($existing) {
                $sql = "UPDATE produse SET 
                        name = :name, 
                        price = :price, 
                        category_id = :cat_id,
                        short_description = :short_desc,
                        description = :desc,
                        brand = :brand,
                        primary_image = :image,
                        secondary_images = :gallery 
                        WHERE id = :id";
                $pdo->prepare($sql)->execute([
                    'name' => $name,
                    'price' => $price,
                    'cat_id' => $cat_id,
                    'short_desc' => $short_desc,
                    'desc' => $desc,
                    'brand' => $brand,
                    'image' => $image,
                    'gallery' => json_encode($secondary_images),
                    'id' => $existing['id']
                ]);
                $updated++;
            } else {
                $sql = "INSERT INTO produse (category_id, sku, name, slug, price, short_description, description, brand, primary_image, secondary_images, is_active) 
                        VALUES (:cat_id, :sku, :name, :slug, :price, :short_desc, :desc, :brand, :image, :gallery, 1)";
                $pdo->prepare($sql)->execute([
                    'cat_id' => $cat_id,
                    'sku' => $sku,
                    'name' => $name,
                    'slug' => $slug,
                    'price' => $price,
                    'short_desc' => $short_desc,
                    'desc' => $desc,
                    'brand' => $brand,
                    'image' => $image,
                    'gallery' => json_encode($secondary_images)
                ]);
                $added++;
            }
        }
        $pdo->commit();

        // 3. Save Log
        try {
            $stmtLog = $pdo->prepare("INSERT INTO log_import (source_name, added_count, updated_count, errors_count) VALUES (?, ?, ?, ?)");
            $stmtLog->execute(['Import Manual', $added, $updated, $errors]);
        } catch (Exception $e) {
            // Log table might not exist, ignore for now to not break import
        }

        echo json_encode([
            'status' => 'success', 
            'added' => $added, 
            'updated' => $updated, 
            'errors' => $errors
        ]);
    } catch (Exception $e) {
        $pdo->rollBack();
        echo json_encode(['status' => 'error', 'message' => $e->getMessage()]);
    }
} else {
    http_response_code(405);
}
