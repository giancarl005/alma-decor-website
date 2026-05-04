<?php
/**
 * Alma Decor - Configuration File
 */

// Database Configuration
$http_host = $_SERVER['HTTP_HOST'] ?? '';
$is_local = (strpos($http_host, 'localhost') !== false || strpos($http_host, '127.0.0.1') !== false || php_sapi_name() === 'cli');

if (strpos($http_host, 'almadecor.ro') !== false) {
    define('DB_HOST', 'localhost');
    define('DB_NAME', 'almadeco_alma_decor');
    define('DB_USER', 'almadeco_admin_alma');
    define('DB_PASS', 'GCJ@8t&Z*2XooWeh');
} else {
    define('DB_HOST', 'localhost');
    define('DB_NAME', 'alma_decor');
    define('DB_USER', 'root');
    define('DB_PASS', ''); // Parola goală pentru Laragon implicit
}
define('DB_CHARSET', 'utf8mb4');

// App Configuration
$protocol = (isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on') ? "https" : "http";
$host = $_SERVER['HTTP_HOST'];
$script_name = $_SERVER['SCRIPT_NAME'];
$base_dir = str_replace('index.php', '', $script_name);
define('SITE_URL', "$protocol://$host" . rtrim($base_dir, '/'));

define('ADMIN_EMAIL', 'admin@almadecor.ro');

// Database Connection (PDO)
try {
    if (!isset($pdo)) {
        $dsn = "mysql:host=" . DB_HOST . ";dbname=" . DB_NAME . ";charset=" . DB_CHARSET;
        $options = [
            PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES   => false,
        ];
        $pdo = new PDO($dsn, DB_USER, DB_PASS, $options);
    }
} catch (\PDOException $e) {
    // Trimitem JSON in caz de eroare, pentru a nu strica interfata
    header('Content-Type: application/json');
    die(json_encode(['status' => 'error', 'message' => 'Eroare Conexiune DB: ' . $e->getMessage()]));
}
