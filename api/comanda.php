<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: Content-Type');
header('Access-Control-Allow-Methods: POST');

require_once '../app/config.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $input = json_decode(file_get_contents('php://input'), true);

    if (!$input) {
        http_response_code(400);
        echo json_encode(['status' => 'error', 'message' => 'Date invalide']);
        exit;
    }

    try {
        $pdo->beginTransaction();

        // 1. Insert Order
        $orderNumber = 'AD-' . date('Ymd') . '-' . mt_rand(100, 999);
        $sqlOrder = "INSERT INTO comenzi (order_number, customer_id, customer_name, customer_email, customer_phone, company_name, cui, reg_com, shipping_address, shipping_city, shipping_county, billing_address, billing_city, billing_county, shipping_method, subtotal, total, payment_method, notes, status) 
                     VALUES (:order_number, :customer_id, :nume, :email, :telefon, :company_name, :cui, :reg_com, :adresa, :oras, :judet, :billing_address, :billing_city, :billing_county, :method, :subtotal, :total, :plata, :notes, 'pending')";
        
        $stmtOrder = $pdo->prepare($sqlOrder);
        $stmtOrder->execute([
            'order_number' => $orderNumber,
            'customer_id' => $input['customer_id'] ?? null,
            'nume' => $input['customer']['firstName'] . ' ' . $input['customer']['lastName'],
            'email' => $input['customer']['email'],
            'telefon' => $input['customer']['phone'],
            'company_name' => $input['customer']['companyName'] ?? null,
            'cui' => $input['customer']['cui'] ?? null,
            'reg_com' => $input['customer']['regCom'] ?? null,
            'adresa' => $input['shipping']['address'],
            'oras' => $input['shipping']['city'],
            'judet' => $input['shipping']['county'],
            'billing_address' => $input['billing']['address'] ?? null,
            'billing_city' => $input['billing']['city'] ?? null,
            'billing_county' => $input['billing']['county'] ?? null,
            'method' => $input['shipping']['method'] ?? 'delivery',
            'subtotal' => $input['total'],
            'total' => $input['total'], 
            'plata' => 'transfer',
            'notes' => $input['notes'] ?? ''
        ]);

        $orderId = $pdo->lastInsertId();

        // 2. Insert Order Items and Update Stock
        $sqlItem = "INSERT INTO comanda_produse (order_id, product_id, product_name, quantity, price, variation_id) 
                    VALUES (:order_id, :product_id, :product_name, :quantity, :price, :variation_id)";
        $stmtItem = $pdo->prepare($sqlItem);

        $sqlStock = "UPDATE produse SET stock = stock - :quantity WHERE id = :product_id AND stock >= :quantity";
        $stmtStock = $pdo->prepare($sqlStock);

        foreach ($input['items'] as $item) {
            // Verificare stoc
            $stmtCheck = $pdo->prepare("SELECT stock, name FROM produse WHERE id = ?");
            $stmtCheck->execute([$item['id']]);
            $produsDb = $stmtCheck->fetch();
            
            if (!$produsDb) {
                throw new Exception("Produsul " . $item['name'] . " nu mai există în baza de date.");
            }
            if ($produsDb['stock'] < $item['quantity']) {
                throw new Exception("Stoc insuficient pentru produsul: " . $produsDb['name'] . ". Stoc disponibil: " . $produsDb['stock']);
            }

            // Scade stocul
            $stmtStock->execute([
                'quantity' => $item['quantity'],
                'product_id' => $item['id']
            ]);

            if ($stmtStock->rowCount() === 0) {
                throw new Exception("Eroare la rezervarea stocului pentru produsul: " . $produsDb['name']);
            }

            $stmtItem->execute([
                'order_id' => $orderId,
                'product_id' => $item['id'],
                'product_name' => $item['name'],
                'quantity' => $item['quantity'],
                'price' => $item['sale_price'] ?: $item['price'],
                'variation_id' => $item['variation_id'] ?? null
            ]);
        }

        $pdo->commit();

        echo json_encode([
            'status' => 'success',
            'order_id' => $orderId,
            'message' => 'Comanda a fost plasată cu succes'
        ]);

    } catch (Exception $e) {
        $pdo->rollBack();
        http_response_code(500);
        echo json_encode(['status' => 'error', 'message' => $e->getMessage()]);
    }
} else {
    http_response_code(405);
    echo json_encode(['status' => 'error', 'message' => 'Metodă nepermisă']);
}
