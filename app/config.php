<?php
/**
 * Alma Decor - Configuration File
 */

// Database Configuration
define('DB_HOST', 'localhost');
define('DB_NAME', 'almadeco_alma_decor');
define('DB_USER', 'almadeco_admin_alma');
define('DB_PASS', 'GCJ@8t&Z*2XooWeh');
define('DB_CHARSET', 'utf8mb4');

// App Configuration
define('SITE_URL', 'https://almadecor.ro');
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
