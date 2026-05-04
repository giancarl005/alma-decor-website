<?php
require_once __DIR__ . '/app/config.php';

$user = 'admin@almadecor.ro';
$pass = 'admin123';
$hash = password_hash($pass, PASSWORD_DEFAULT);

try {
    // Verificăm dacă există utilizatorul
    $stmt = $pdo->prepare("SELECT id FROM admin_users WHERE username = ?");
    $stmt->execute([$user]);
    $exists = $stmt->fetch();

    if ($exists) {
        // Dacă există, actualizăm doar parola
        $stmt = $pdo->prepare("UPDATE admin_users SET password_hash = ? WHERE username = ?");
        $stmt->execute([$hash, $user]);
        echo "SUCCES: Parola pentru $user a fost resetata la: $pass";
    } else {
        // Dacă nu există, îl creăm doar cu username și password_hash
        $stmt = $pdo->prepare("INSERT INTO admin_users (username, password_hash) VALUES (?, ?)");
        $stmt->execute([$user, $hash]);
        echo "SUCCES: Utilizator nou creat. Parola: $pass";
    }
} catch (Exception $e) {
    echo "EROARE: " . $e->getMessage();
}
