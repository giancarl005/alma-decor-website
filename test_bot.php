<?php
require_once 'app/config.php';
$stmt = $pdo->query('SELECT slug, name FROM produse LIMIT 1');
$product = $stmt->fetch();
if (!$product) die("Nu exista produse in DB.");

$url = SITE_URL . '/produs/' . $product['slug'];
echo "Testing URL: $url\n";
echo "Product Name: {$product['name']}\n";

// Simulating a bot that doesn't run JS
$ch = curl_init($url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
$html = curl_exec($ch);
curl_close($ch);

if (strpos($html, $product['name']) !== false) {
    echo "SUCCESS: Content is in the initial HTML!\n";
} else {
    echo "FAILURE: Content is NOT in the initial HTML. Robots see an empty page.\n";
}

// Show a snippet of what the robot sees
echo "\n--- SNIPPET OF HTML ---\n";
echo substr($html, 0, 500) . "...\n";
