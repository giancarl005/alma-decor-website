<?php
$dir = 'c:/laragon/www/Alma Decor Website/api/admin/';
$files = glob($dir . '*.php');

foreach ($files as $file) {
    $content = file_get_contents($file);
    
    // Inlocuim Origin
    $content = str_replace('Access-Control-Allow-Origin: http://localhost:3001', 'Access-Control-Allow-Origin: *', $content);
    
    // Inlocuim Config
    $content = str_replace("require_once 'config.php'", "require_once __DIR__ . '/../../app/config.php'", $content);
    
    file_put_contents($file, $content);
    echo "Reparat: " . basename($file) . "\n";
}
echo "GATA!";
