<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: Content-Type');
header('Access-Control-Allow-Methods: GET, OPTIONS');

require_once __DIR__ . '/../../app/config.php';

try {
    // 1. Vânzări Lună (Current Month)
    $stmt = $pdo->prepare("SELECT SUM(total) as total_sales FROM comenzi WHERE status != 'cancelled' AND MONTH(created_at) = MONTH(CURRENT_DATE()) AND YEAR(created_at) = YEAR(CURRENT_DATE())");
    $stmt->execute();
    $sales = $stmt->fetch();
    $totalSales = $sales['total_sales'] ?? 0;

    // 2. Comenzi Noi (Pending)
    $stmt = $pdo->prepare("SELECT COUNT(*) as new_orders FROM comenzi WHERE status = 'pending'");
    $stmt->execute();
    $newOrders = $stmt->fetch()['new_orders'] ?? 0;

    // 3. Produse Active (Counting all for now)
    $stmt = $pdo->prepare("SELECT COUNT(*) as active_products FROM produse");
    $stmt->execute();
    $activeProducts = $stmt->fetch()['active_products'] ?? 0;

    // 4. Conversion Rate (Dummy logic for now: Orders / Products * 10 - or just a reasonable random-ish but stable number based on real orders)
    // Real conversion would be Orders / Sessions.
    $convRate = "3.2%"; // Keeping it same as design or slightly varied

    echo json_encode([
        'status' => 'success',
        'data' => [
            'totalSales' => number_format($totalSales, 0, ',', '.') . ' RON',
            'newOrders' => (string)$newOrders,
            'activeProducts' => (string)$activeProducts,
            'conversionRate' => $convRate
        ]
    ]);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['status' => 'error', 'message' => $e->getMessage()]);
}
