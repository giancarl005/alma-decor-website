<?php
require_once __DIR__ . '/../../app/config.php';

$user = 'admin@almadecor.ro';
$pass = 'AlmaDecor2024!';
$hash = password_hash($pass, PASSWORD_DEFAULT);

try {
    // Verificam daca exista deja
    $stmt = $pdo->prepare("SELECT id FROM admin_users WHERE username = ?");
    $stmt->execute([$user]);
    $exists = $stmt->fetch();

    if ($exists) {
        $stmt = $pdo->prepare("UPDATE admin_users SET password_hash = ? WHERE username = ?");
        $stmt->execute([$hash, $user]);
        echo "Utilizator existent actualizat cu succes!";
    } else {
        $stmt = $pdo->prepare("INSERT INTO admin_users (username, password_hash, nume) VALUES (?, ?, 'Administrator')");
        $stmt->execute([$user, $hash]);
        echo "Utilizator nou creat cu succes!";
    }
} catch (Exception $e) {
    echo "Eroare: " . $e->getMessage();
}
