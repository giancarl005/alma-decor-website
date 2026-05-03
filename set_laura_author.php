<?php
require_once 'app/config.php';
try {
    // Let's find the exact name of the author that looks like Laura
    $stmt = $pdo->query("SELECT name FROM blog_authors WHERE name LIKE '%Laura%' AND name != 'LauraDusca' LIMIT 1");
    $author = $stmt->fetchColumn();

    if ($author) {
        $pdo->prepare("UPDATE articole_blog SET author = :author")->execute(['author' => $author]);
        
        // Also delete the dummy one I made
        $pdo->exec("DELETE FROM blog_authors WHERE name = 'LauraDusca'");
        
        echo "Succes! Toate articolele au fost setate la autorul: " . $author;
    } else {
        // Fallback to exact string if search fails
        $pdo->prepare("UPDATE articole_blog SET author = 'Laura Dușca'")->execute();
        $pdo->exec("DELETE FROM blog_authors WHERE name = 'LauraDusca'");
        echo "Succes! Autorul a fost setat la 'Laura Dușca'.";
    }
} catch (Exception $e) {
    echo "Eroare: " . $e->getMessage();
}
?>
