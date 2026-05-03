<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

$target_dir = "../../uploads/products/";

if (!file_exists($target_dir)) {
    mkdir($target_dir, 0777, true);
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (!isset($_FILES['file'])) {
        http_response_code(400);
        echo json_encode(['status' => 'error', 'message' => 'Niciun fișier primit']);
        exit;
    }

    $file = $_FILES['file'];
    $ext = pathinfo($file['name'], PATHINFO_EXTENSION);
    $filename = uniqid() . '.' . $ext;
    $target_file = $target_dir . $filename;

    if (move_uploaded_file($file['tmp_name'], $target_file)) {
        // Returnăm URL-ul relativ pentru a fi salvat în baza de date
        $public_url = '/uploads/products/' . $filename;
        echo json_encode(['status' => 'success', 'url' => $public_url]);
    } else {
        http_response_code(500);
        echo json_encode(['status' => 'error', 'message' => 'Eroare la salvarea fișierului']);
    }
} else {
    http_response_code(405);
    echo json_encode(['status' => 'error', 'message' => 'Metodă nepermisă']);
}
