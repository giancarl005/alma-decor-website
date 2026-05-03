<?php
require_once 'app/config.php';

try {
    // 1. Create table
    $sql = "CREATE TABLE IF NOT EXISTS clienti (
        id INT AUTO_INCREMENT PRIMARY KEY,
        nume VARCHAR(100) NOT NULL,
        email VARCHAR(100) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        telefon VARCHAR(20),
        adresa TEXT,
        oras VARCHAR(50),
        judet VARCHAR(50),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )";
    $pdo->exec($sql);

    // 2. Create test user
    $nume = "Utilizator Test";
    $email = "test@almadecor.ro";
    $password = password_hash("parola123", PASSWORD_DEFAULT);

    $stmt = $pdo->prepare("INSERT IGNORE INTO clienti (nume, email, password) VALUES (:nume, :email, :password)");
    $stmt->execute([
        'nume' => $nume,
        'email' => $email,
        'password' => $password
    ]);

    echo "<h1>Succes!</h1>";
    echo "<p>Tabela a fost creată și contul de test a fost generat.</p>";
    echo "<ul>";
    echo "<li><strong>Email:</strong> $email</li>";
    echo "<li><strong>Parolă:</strong> parola123</li>";
    echo "</ul>";
    echo "<p><a href='http://localhost:3000/cont/login'>Mergi la Login</a></p>";

} catch (Exception $e) {
    echo "<h1>Eroare</h1>";
    echo "<p>" . $e->getMessage() . "</p>";
}
