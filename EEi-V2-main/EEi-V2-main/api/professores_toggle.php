<?php
header('Content-Type: application/json; charset=utf-8');
include 'db_config.php';

$input = json_decode(file_get_contents('php://input'), true);
$usuario_id = $input['usuario_id'] ?? null;
$setAtivo = isset($input['ativo']) ? (int)$input['ativo'] : null;

if (!$usuario_id || ($setAtivo !== 0 && $setAtivo !== 1 && $setAtivo !== null)) {
    http_response_code(400);
    echo json_encode(['error'=>'usuario_id e ativo (0 ou 1) são necessários']);
    exit;
}

// se ativo não fornecido, invertemos
if ($setAtivo === null) {
    $stmt = $conn->prepare("SELECT ativo FROM usuarios WHERE id = ?");
    $stmt->bind_param('i', $usuario_id);
    $stmt->execute();
    $stmt->bind_result($cur);
    if (!$stmt->fetch()) { http_response_code(404); echo json_encode(['error'=>'Usuario não encontrado']); exit; }
    $stmt->close();
    $setAtivo = $cur ? 0 : 1;
}

$stmt = $conn->prepare("UPDATE usuarios SET ativo = ? WHERE id = ?");
$stmt->bind_param('ii', $setAtivo, $usuario_id);
if (!$stmt->execute()) {
    http_response_code(500);
    echo json_encode(['error'=>'Erro ao atualizar ativo']);
    exit;
}
echo json_encode(['success'=>true, 'ativo'=>$setAtivo]);
