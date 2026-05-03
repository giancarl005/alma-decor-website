<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

require_once '../../app/config.php';

try {
    // Count pending reviews
    $stmtReviews = $pdo->query("SELECT COUNT(*) FROM produs_recenzii WHERE is_approved = 0");
    $pending_reviews = $stmtReviews->fetchColumn();

    // Count pending orders
    $stmtOrders = $pdo->query("SELECT COUNT(*) FROM comenzi WHERE status = 'pending'");
    $pending_orders = $stmtOrders->fetchColumn();

    echo json_encode([
        'status' => 'success', 
        'data' => [
            'pending_reviews' => (int)$pending_reviews,
            'pending_orders' => (int)$pending_orders
        ]
    ]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['status' => 'error', 'message' => $e->getMessage()]);
}
?>
