<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: Content-Type');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');

require_once __DIR__ . '/../../app/config.php';

$method = $_SERVER['REQUEST_METHOD'];

try {
    switch ($method) {
        case 'GET':
            $id = $_GET['id'] ?? null;
            if ($id) {
                // Get single order with products
                $stmt = $pdo->prepare("SELECT * FROM comenzi WHERE id = :id");
                $stmt->execute(['id' => $id]);
                $order = $stmt->fetch();
                
                if ($order) {
                    $stmtItems = $pdo->prepare("SELECT cp.*, p.name as product_name, p.sku FROM comanda_produse cp LEFT JOIN produse p ON cp.product_id = p.id WHERE cp.order_id = :order_id");
                    $stmtItems->execute(['order_id' => $id]);
                    $order['items'] = $stmtItems->fetchAll();
                    $order['secure_hash'] = substr(md5($order['id'] . $order['customer_email']), 0, 10);
                }
                
                echo json_encode($order);
            } else {
                // List all orders
                $stmt = $pdo->query("SELECT * FROM comenzi ORDER BY created_at DESC");
                $orders = $stmt->fetchAll();
                foreach($orders as &$ord) {
                    $ord['secure_hash'] = substr(md5($ord['id'] . $ord['customer_email']), 0, 10);
                }
                echo json_encode($orders);
            }
            break;

        case 'PUT':
            // Update order details
            $data = json_decode(file_get_contents('php://input'), true);
            $stmt = $pdo->prepare("UPDATE comenzi SET 
                status = :status, 
                customer_name = :nume,
                customer_email = :email,
                customer_phone = :telefon,
                shipping_address = :adresa,
                shipping_city = :oras,
                shipping_county = :judet,
                shipping_cost = :shipping,
                subtotal = :subtotal,
                total = :total
                WHERE id = :id");
            
            $stmt->execute([
                'status' => $data['status'],
                'nume' => $data['customer_name'],
                'email' => $data['customer_email'],
                'telefon' => $data['customer_phone'],
                'adresa' => $data['shipping_address'],
                'oras' => $data['shipping_city'],
                'judet' => $data['shipping_county'],
                'shipping' => $data['shipping_cost'],
                'subtotal' => $data['subtotal'],
                'total' => $data['total'],
                'id' => $data['id']
            ]);
            echo json_encode(['status' => 'success']);
            break;

        case 'DELETE':
            $id = $_GET['id'] ?? null;
            if ($id) {
                $pdo->beginTransaction();
                $pdo->prepare("DELETE FROM comanda_produse WHERE order_id = ?")->execute([$id]);
                $pdo->prepare("DELETE FROM comenzi WHERE id = ?")->execute([$id]);
                $pdo->commit();
                echo json_encode(['status' => 'success']);
            } else {
                http_response_code(400);
                echo json_encode(['status' => 'error', 'message' => 'ID lipsă']);
            }
            break;
            http_response_code(200);
            break;

        default:
            http_response_code(405);
            break;
    }
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['status' => 'error', 'message' => $e->getMessage()]);
}
