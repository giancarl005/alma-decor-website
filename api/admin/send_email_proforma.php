<?php
header('Content-Type: application/json');
require_once __DIR__ . '/../../app/config.php';

$input = json_decode(file_get_contents('php://input'), true);
$order_id = isset($input['order_id']) ? (int)$input['order_id'] : 0;

if (!$order_id) {
    echo json_encode(['status' => 'error', 'message' => 'ID Comanda lipsa']);
    exit;
}

try {
    $stmt = $pdo->prepare("SELECT customer_email, customer_name, id FROM comenzi WHERE id = ?");
    $stmt->execute([$order_id]);
    $order = $stmt->fetch();

    if (!$order) {
        throw new Exception("Comanda nu a fost gasita.");
    }

    $secure_hash = substr(md5($order['id'] . $order['customer_email']), 0, 10);
    $filename = 'Proforma_AD_' . $order['id'] . '_' . $secure_hash . '.pdf';
    $filepath = __DIR__ . '/../uploads/proforme/' . $filename;

    // Generăm fisierul dacă nu există
    if (!file_exists($filepath)) {
        $_GET['id'] = $order_id;
        $_GET['save_only'] = 1;
        require 'generate_proforma.php'; 
    }

    $link = SITE_URL . '/api/uploads/proforme/' . $filename;
    
    $to = $order['customer_email'];
    $subject = "Factura Proforma Alma Decor - Comanda #" . $order['id'];
    
    $message = "
    <html>
    <head>
      <title>Factura Proforma Alma Decor</title>
    </head>
    <body style='font-family: sans-serif; line-height: 1.6; color: #333;'>
      <h2>Salut, " . htmlspecialchars($order['customer_name']) . "!</h2>
      <p>Iti multumim pentru comanda plasata pe <strong>Alma Decor</strong>.</p>
      <p>Am generat Factura Proforma pentru comanda cu numarul <strong>AD-" . $order['id'] . "</strong>.</p>
      <p>Poti accesa si descarca factura in format PDF apasand pe butonul de mai jos:</p>
      <p style='margin: 30px 0;'>
        <a href='" . $link . "' style='background-color: #f59e0b; color: #fff; padding: 12px 24px; text-decoration: none; font-weight: bold; border-radius: 4px;'>Descarca Proforma PDF</a>
      </p>
      <p>Dupa efectuarea platii (cu specificarea numarului comenzii la detalii), comanda ta va intra imediat in procesare.</p>
      <p>Daca ai intrebari, ne poti raspunde direct la acest email.</p>
      <br>
      <p>Cu drag,<br>Echipa Alma Decor</p>
    </body>
    </html>
    ";

    $headers = "MIME-Version: 1.0" . "\r\n";
    $headers .= "Content-type:text/html;charset=UTF-8" . "\r\n";
    $headers .= "From: " . ADMIN_EMAIL . "\r\n";
    $headers .= "Reply-To: " . ADMIN_EMAIL . "\r\n";

    if (mail($to, $subject, $message, $headers)) {
        // Actualizam statusul comenzii
        $pdo->prepare("UPDATE comenzi SET status = 'proforma_sent' WHERE id = ?")->execute([$order_id]);
        
        echo json_encode(['status' => 'success', 'message' => 'Email trimis cu succes']);
    } else {
        throw new Exception("Nu am putut expedia emailul (functia mail a returnat false). Verificati setarile serverului.");
    }

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['status' => 'error', 'message' => $e->getMessage()]);
}
?>
