<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit;
}

// In a real app, verify admin auth token here!

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method Not Allowed']);
    exit;
}

if (!isset($_FILES['file']) || $_FILES['file']['error'] !== UPLOAD_ERR_OK) {
    echo json_encode(['error' => 'Eroare la încărcarea fișierului']);
    exit;
}

$file = $_FILES['file'];
$fileName = $file['name'];
$fileTmpName = $file['tmp_name'];
$fileSize = $file['size'];
$fileError = $file['error'];
$fileType = $file['type'];

// Check file size (max 5MB)
if ($fileSize > 5 * 1024 * 1024) {
    echo json_encode(['error' => 'Fișierul depășește limita de 5MB.']);
    exit;
}

// Check allowed extensions
$fileExt = explode('.', $fileName);
$fileActualExt = strtolower(end($fileExt));
$allowed = array('jpg', 'jpeg', 'png', 'webp', 'gif');

if (!in_array($fileActualExt, $allowed)) {
    echo json_encode(['error' => 'Tip de fișier nepermis. Doar imagini sunt acceptate.']);
    exit;
}

// Create unique filename
$fileNameNew = uniqid('blog_', true) . "." . $fileActualExt;

// Ensure upload directory exists
$uploadDir = '../../uploads/blog/';
if (!is_dir($uploadDir)) {
    mkdir($uploadDir, 0777, true);
}

$fileDestination = $uploadDir . $fileNameNew;

if (move_uploaded_file($fileTmpName, $fileDestination)) {
    // Return absolute URL for frontend and admin usage
    // Determine the base URL dynamically or use the hardcoded one
    $baseUrl = 'http://127.0.0.1/Alma%20Decor%20Website';
    $absoluteUrl = $baseUrl . '/uploads/blog/' . $fileNameNew;
    
    // TinyMCE expects { "location": "folder/sub-folder/new-location.png" }
    echo json_encode([
        'status' => 'success',
        'url' => $absoluteUrl,
        'location' => $absoluteUrl // Used by TinyMCE
    ]);
} else {
    echo json_encode(['error' => 'Eroare la salvarea pe server.']);
}
?>
