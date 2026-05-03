<?php
require_once 'app/config.php';
try {
    $pdo->exec("UPDATE blog_authors SET image = 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200' WHERE name = 'LauraDusca'");
    echo 'Done';
} catch (Exception $e) {
    echo $e->getMessage();
}
?>
