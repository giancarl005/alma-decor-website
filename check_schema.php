<?php
require_once 'app/config.php';
$stmt = $pdo->query("DESCRIBE produse");
echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
?>
