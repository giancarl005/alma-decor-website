<?php
require_once 'app/config.php';
try {
    $pdo->exec("ALTER TABLE articole_blog ADD COLUMN category VARCHAR(100) DEFAULT 'General'");
    echo 'Done';
} catch (Exception $e) {
    echo $e->getMessage();
}
?>
