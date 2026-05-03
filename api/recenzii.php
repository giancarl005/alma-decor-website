<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit;
}

require_once '../app/config.php';

try {
    // Create table if not exists
    $pdo->exec("CREATE TABLE IF NOT EXISTS produs_recenzii (
        id INT AUTO_INCREMENT PRIMARY KEY,
        product_id INT NOT NULL,
        nume VARCHAR(255) NOT NULL,
        rating INT NOT NULL,
        comentariu TEXT NOT NULL,
        imagini TEXT,
        is_approved TINYINT(1) DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        INDEX (product_id)
    )");

    // Safety check: Add 'imagini' column if it doesn't exist (in case table was created earlier without it)
    $stmt = $pdo->query("SHOW COLUMNS FROM produs_recenzii LIKE 'imagini'");
    if (!$stmt->fetch()) {
        $pdo->exec("ALTER TABLE produs_recenzii ADD COLUMN imagini TEXT AFTER comentariu");
    }

    // Ensure upload directory exists
    $uploadDir = '../uploads/recenzii/';
    if (!is_dir($uploadDir)) {
        mkdir($uploadDir, 0777, true);
    }

    if ($_SERVER['REQUEST_METHOD'] === 'GET') {
        $product_id = isset($_GET['product_id']) ? (int)$_GET['product_id'] : null;
        
        if (!$product_id) {
            throw new Exception('Product ID is required');
        }

        $stmt = $pdo->prepare("SELECT * FROM produs_recenzii WHERE product_id = ? AND is_approved = 1 ORDER BY created_at DESC");
        $stmt->execute([$product_id]);
        $recenzii = $stmt->fetchAll();

        // Decode images JSON
        foreach ($recenzii as &$r) {
            $r['imagini'] = $r['imagini'] ? json_decode($r['imagini'], true) : [];
        }

        echo json_encode(['status' => 'success', 'data' => $recenzii]);
    } 
    elseif ($_SERVER['REQUEST_METHOD'] === 'POST') {
        // Handle multipart/form-data
        $product_id = isset($_POST['product_id']) ? (int)$_POST['product_id'] : null;
        $nume = isset($_POST['nume']) ? $_POST['nume'] : null;
        $rating = isset($_POST['rating']) ? (int)$_POST['rating'] : null;
        $comentariu = isset($_POST['comentariu']) ? $_POST['comentariu'] : null;
        
        if (!$product_id || !$nume || !$rating || !$comentariu) {
            throw new Exception('Date incomplete');
        }

        $uploadedImages = [];
        if (isset($_FILES['images'])) {
            $files = $_FILES['images'];
            for ($i = 0; $i < count($files['name']); $i++) {
                if ($files['error'][$i] === 0) {
                    $ext = pathinfo($files['name'][$i], PATHINFO_EXTENSION);
                    $filename = uniqid('rev_') . '.' . $ext;
                    $targetPath = $uploadDir . $filename;
                    
                    if (move_uploaded_file($files['tmp_name'][$i], $targetPath)) {
                        $uploadedImages[] = '/uploads/recenzii/' . $filename;
                    }
                }
            }
        }

        $stmt = $pdo->prepare("INSERT INTO produs_recenzii (product_id, nume, rating, comentariu, imagini, is_approved) VALUES (?, ?, ?, ?, ?, 0)");
        $stmt->execute([
            $product_id,
            htmlspecialchars($nume),
            $rating,
            htmlspecialchars($comentariu),
            json_encode($uploadedImages)
        ]);

        echo json_encode(['status' => 'success', 'message' => 'Recenzia a fost trimisă cu succes']);
    }

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['status' => 'error', 'message' => $e->getMessage()]);
}
