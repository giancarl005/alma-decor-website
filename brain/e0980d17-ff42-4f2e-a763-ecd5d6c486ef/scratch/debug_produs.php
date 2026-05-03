<?php
require_once 'app/config.php';
$stmt = $pdo->prepare("SELECT * FROM produse WHERE slug = ?");
$stmt->execute(['plinta-decorativa-alba']);
$prod = $stmt->fetch(PDO::FETCH_ASSOC);
if ($prod) {
    echo "PRODUS GASIT:\n";
    print_r($prod);
    
    // Check gallery
    $stmt = $pdo->prepare("SELECT * FROM produs_imagini WHERE product_id = ?");
    $stmt->execute([$prod['id']]);
    echo "\nGALERIE:\n";
    print_r($stmt->fetchAll(PDO::FETCH_ASSOC));
    
    // Check variations
    $stmt = $pdo->prepare("SELECT * FROM produs_variatii WHERE product_id = ?");
    $stmt->execute([$prod['id']]);
    echo "\nVARIATII:\n";
    print_r($stmt->fetchAll(PDO::FETCH_ASSOC));
} else {
    echo "PRODUS NEGASIT";
}
