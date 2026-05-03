<?php
require_once '../../app/config.php';
require_once '../fpdf/fpdf.php';

// Verificăm dacă primim id-ul comenzii
$order_id = isset($_GET['id']) ? (int)$_GET['id'] : 0;

if (!$order_id) {
    die("ID Comandă lipsă.");
}

// 1. Preluăm datele comenzii
$stmtOrder = $pdo->prepare("SELECT * FROM comenzi WHERE id = ?");
$stmtOrder->execute([$order_id]);
$order = $stmtOrder->fetch();

if (!$order) {
    die("Comanda nu a fost găsită.");
}

// 2. Preluăm produsele
$stmtItems = $pdo->prepare("SELECT * FROM comanda_produse WHERE order_id = ?");
$stmtItems->execute([$order_id]);
$items = $stmtItems->fetchAll();

// Extindere FPDF pentru a asigura suport UTF-8 de bază (iconv) 
// FPDF standard suportă doar ISO-8859-1 (Latin1) fără fonturi speciale.
function decode_utf8($string) {
    return iconv('UTF-8', 'windows-1250//TRANSLIT', $string);
}

class PDF extends FPDF {
    function Header() {
        // Logo-ul se poate adauga aici cu $this->Image()
        $this->SetFont('Arial', 'B', 20);
        $this->SetTextColor(20, 20, 20);
        $this->Cell(100, 10, decode_utf8('ALMA DECOR'), 0, 0, 'L');
        
        $this->SetFont('Arial', 'B', 16);
        $this->SetTextColor(100, 100, 100);
        $this->Cell(90, 10, decode_utf8('FACTURA PROFORMA'), 0, 1, 'R');
        $this->Ln(5);
        $this->Line(10, 25, 200, 25);
        $this->Ln(5);
    }

    function Footer() {
        $this->SetY(-25);
        $this->SetFont('Arial', 'I', 8);
        $this->SetTextColor(128, 128, 128);
        $this->Cell(0, 5, decode_utf8('Pagina ') . $this->PageNo() . ' / {nb}', 0, 1, 'C');
        $this->Cell(0, 5, decode_utf8('Document emis generat automat prin sistemul intern Alma Decor. Plata reprezinta acceptarea ofertei.'), 0, 1, 'C');
    }
}

$pdf = new PDF();
$pdf->AliasNbPages();
$pdf->AddPage();

// Informații Factură
$pdf->SetFont('Arial', 'B', 10);
$pdf->SetTextColor(0, 0, 0);
$pdf->Cell(40, 6, decode_utf8('Seria / Numar:'), 0, 0);
$pdf->SetFont('Arial', '', 10);
$pdf->Cell(60, 6, decode_utf8('AD - ' . $order['id']), 0, 1);

$pdf->SetFont('Arial', 'B', 10);
$pdf->Cell(40, 6, decode_utf8('Data emiterii:'), 0, 0);
$pdf->SetFont('Arial', '', 10);
$pdf->Cell(60, 6, date('d.m.Y'), 0, 1);

$pdf->SetFont('Arial', 'B', 10);
$pdf->Cell(40, 6, decode_utf8('Cota TVA:'), 0, 0);
$pdf->SetFont('Arial', '', 10);
$pdf->Cell(60, 6, decode_utf8('19% (Inclus)'), 0, 1);

$pdf->Ln(10);

// Furnizor și Client (Tabele side-by-side)
$y_start = $pdf->GetY();

// Furnizor
$pdf->SetFont('Arial', 'B', 11);
$pdf->SetFillColor(240, 240, 240);
$pdf->Cell(90, 8, decode_utf8('  FURNIZOR'), 0, 1, 'L', true);
$pdf->SetFont('Arial', 'B', 10);
$pdf->Cell(90, 6, decode_utf8('ALMA DECOR S.R.L.'), 0, 1);
$pdf->SetFont('Arial', '', 9);
$pdf->Cell(90, 5, decode_utf8('CUI: RO12345678'), 0, 1);
$pdf->Cell(90, 5, decode_utf8('Reg. Com.: J40/0000/2020'), 0, 1);
$pdf->Cell(90, 5, decode_utf8('Sediu: Str. Exemplu Nr. 1, Bucuresti'), 0, 1);
$pdf->Cell(90, 5, decode_utf8('Banca: Banca Transilvania'), 0, 1);
$pdf->SetFont('Arial', 'B', 9);
$pdf->Cell(90, 5, decode_utf8('IBAN: RO12 BTRL 0000 0000 0000 0000'), 0, 1);
$pdf->SetFont('Arial', '', 9);
$pdf->Cell(90, 5, decode_utf8('Email: contact@almadecor.ro'), 0, 1);

$y_end = $pdf->GetY();

// Client
$pdf->SetXY(110, $y_start);
$pdf->SetFont('Arial', 'B', 11);
$pdf->SetFillColor(240, 240, 240);
$pdf->Cell(90, 8, decode_utf8('  CLIENT'), 0, 1, 'L', true);
$pdf->SetX(110);

if (!empty($order['company_name'])) {
    $pdf->SetFont('Arial', 'B', 10);
    $pdf->Cell(90, 6, decode_utf8($order['company_name']), 0, 1);
    $pdf->SetX(110);
    $pdf->SetFont('Arial', '', 9);
    $pdf->Cell(90, 5, decode_utf8('CUI: ' . $order['cui']), 0, 1);
    $pdf->SetX(110);
    $pdf->Cell(90, 5, decode_utf8('Reg. Com.: ' . $order['reg_com']), 0, 1);
    $pdf->SetX(110);
    $pdf->Cell(90, 5, decode_utf8('Reprezentant: ' . $order['customer_name']), 0, 1);
} else {
    $pdf->SetFont('Arial', 'B', 10);
    $pdf->Cell(90, 6, decode_utf8($order['customer_name']), 0, 1);
}

$pdf->SetX(110);
$pdf->SetFont('Arial', '', 9);
$adresaFacturare = $order['billing_address'] ? $order['billing_address'] : $order['shipping_address'];
$orasFacturare = $order['billing_city'] ? $order['billing_city'] : $order['shipping_city'];
$judetFacturare = $order['billing_county'] ? $order['billing_county'] : $order['shipping_county'];

// MultiCell pentru adresa, deoarece poate fi mai lunga
$x_adresa = $pdf->GetX();
$y_adresa = $pdf->GetY();
$pdf->MultiCell(90, 5, decode_utf8('Adresa: ' . $adresaFacturare . ', ' . $orasFacturare . ', ' . $judetFacturare), 0, 'L');
$pdf->SetX(110);
$pdf->Cell(90, 5, decode_utf8('Telefon: ' . $order['customer_phone']), 0, 1);
$pdf->SetX(110);
$pdf->Cell(90, 5, decode_utf8('Email: ' . $order['customer_email']), 0, 1);

// Aliniem Y sub cele 2 casute
$pdf->SetY(max($y_end, $pdf->GetY()) + 10);

// Tabel Produse
$pdf->SetFont('Arial', 'B', 9);
$pdf->SetFillColor(50, 50, 50);
$pdf->SetTextColor(255, 255, 255);
$pdf->Cell(10, 8, decode_utf8('Nr.'), 1, 0, 'C', true);
$pdf->Cell(100, 8, decode_utf8('Denumire Produs / Serviciu'), 1, 0, 'L', true);
$pdf->Cell(20, 8, decode_utf8('U.M.'), 1, 0, 'C', true);
$pdf->Cell(20, 8, decode_utf8('Cant.'), 1, 0, 'C', true);
$pdf->Cell(20, 8, decode_utf8('Pret (Lei)'), 1, 0, 'R', true);
$pdf->Cell(20, 8, decode_utf8('Total (Lei)'), 1, 1, 'R', true);

$pdf->SetFont('Arial', '', 9);
$pdf->SetTextColor(0, 0, 0);

$i = 1;
foreach ($items as $item) {
    $pdf->Cell(10, 8, $i++, 1, 0, 'C');
    
    // Numele produsului poate fi lung, ar trebui sa-l taiem la 100 char sau sa folosim Multicell. 
    // FPDF simplu nu suporta cell auto-wrap cu border usor decat daca extindem clasa. Vom taia stringul.
    $nume = strlen($item['product_name']) > 55 ? substr($item['product_name'], 0, 52) . '...' : $item['product_name'];
    $pdf->Cell(100, 8, decode_utf8($nume), 1, 0, 'L');
    
    $pdf->Cell(20, 8, decode_utf8('Buc'), 1, 0, 'C');
    $pdf->Cell(20, 8, $item['quantity'], 1, 0, 'C');
    $pdf->Cell(20, 8, number_format($item['price'], 2, '.', ''), 1, 0, 'R');
    $pdf->Cell(20, 8, number_format($item['price'] * $item['quantity'], 2, '.', ''), 1, 1, 'R');
}

// Rând pentru Transport
if (isset($order['shipping_cost']) && $order['shipping_cost'] > 0) {
    $pdf->Cell(10, 8, $i++, 1, 0, 'C');
    $pdf->Cell(100, 8, decode_utf8('Servicii Transport'), 1, 0, 'L');
    $pdf->Cell(20, 8, decode_utf8('Srv'), 1, 0, 'C');
    $pdf->Cell(20, 8, '1', 1, 0, 'C');
    $pdf->Cell(20, 8, number_format($order['shipping_cost'], 2, '.', ''), 1, 0, 'R');
    $pdf->Cell(20, 8, number_format($order['shipping_cost'], 2, '.', ''), 1, 1, 'R');
}

// Total
$pdf->SetFont('Arial', 'B', 10);
$pdf->Cell(150, 8, decode_utf8('TOTAL DE PLATA (RON, TVA Inclus): '), 1, 0, 'R');
$pdf->Cell(40, 8, number_format($order['total'], 2, '.', '') . ' Lei', 1, 1, 'R');

$pdf->Ln(15);
$pdf->SetFont('Arial', '', 9);
$pdf->MultiCell(190, 5, decode_utf8("Prezenta factura proforma tine loc de contract. Va rugam sa mentionati numarul comenzii (AD-" . $order['id'] . ") in detaliile platii.\n\nProdusele raman in proprietatea Alma Decor pana la incasarea integrala a sumei.\nLivrarea se va efectua doar dupa confirmarea platii."));

$pdfContent = $pdf->Output('S');
// Generăm un hash securizat din id și email pentru a nu putea fi ghicit
$secure_hash = substr(md5($order['id'] . $order['customer_email']), 0, 10);
$filename = 'Proforma_AD_' . $order['id'] . '_' . $secure_hash . '.pdf';
$filepath = __DIR__ . '/../uploads/proforme/' . $filename;
file_put_contents($filepath, $pdfContent);

if (!isset($_GET['save_only'])) {
    header('Content-Type: application/pdf');
    header('Content-Disposition: inline; filename="' . $filename . '"');
    header('Cache-Control: private, max-age=0, must-revalidate');
    header('Pragma: public');
    echo $pdfContent;
}
?>
