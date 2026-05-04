<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit;
}

require_once __DIR__ . '/../../app/config.php';

// Simple auth check - simplified for this environment
// In a real app, you'd check a JWT or session here

try {
    if ($_SERVER['REQUEST_METHOD'] === 'GET') {
        $stmt = $pdo->query("
            SELECT r.*, p.name as product_name 
            FROM produs_recenzii r 
            JOIN produse p ON r.product_id = p.id 
            ORDER BY r.created_at DESC
        ");
        $recenzii = $stmt->fetchAll();

        foreach ($recenzii as &$r) {
            $r['imagini'] = $r['imagini'] ? json_decode($r['imagini'], true) : [];
        }

        echo json_encode(['status' => 'success', 'data' => $recenzii]);
    } 
    elseif ($_SERVER['REQUEST_METHOD'] === 'POST') {
        $data = json_decode(file_get_contents('php://input'), true);
        
        if (!$data || !isset($data['action']) || !isset($data['id'])) {
            throw new Exception('Date incomplete');
        }

        $id = (int)$data['id'];

        if ($data['action'] === 'approve') {
            $stmt = $pdo->prepare("UPDATE produs_recenzii SET is_approved = 1 WHERE id = ?");
            $stmt->execute([$id]);
            echo json_encode(['status' => 'success', 'message' => 'Recenzie aprobată']);
        } 
        elseif ($data['action'] === 'delete') {
            $stmt = $pdo->prepare("DELETE FROM produs_recenzii WHERE id = ?");
            $stmt->execute([$id]);
            echo json_encode(['status' => 'success', 'message' => 'Recenzie ștearsă']);
        }
        elseif ($data['action'] === 'unapprove') {
            $stmt = $pdo->prepare("UPDATE produs_recenzii SET is_approved = 0 WHERE id = ?");
            $stmt->execute([$id]);
            echo json_encode(['status' => 'success', 'message' => 'Aprobare retrasă']);
        }
        elseif ($data['action'] === 'update') {
            if (!isset($data['nume']) || !isset($data['rating']) || !isset($data['comentariu'])) {
                throw new Exception('Date incomplete pentru actualizare');
            }
            $stmt = $pdo->prepare("UPDATE produs_recenzii SET nume = ?, rating = ?, comentariu = ? WHERE id = ?");
            $stmt->execute([$data['nume'], (int)$data['rating'], $data['comentariu'], $id]);
            echo json_encode(['status' => 'success', 'message' => 'Recenzie actualizată']);
        }
        else {
            throw new Exception('Acțiune necunoscută');
        }
    }

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['status' => 'error', 'message' => $e->getMessage()]);
}
