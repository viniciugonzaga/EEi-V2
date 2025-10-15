<?php
header('Content-Type: application/json; charset=utf-8');
include 'db_config.php';

// Lista professores (join com usuarios)
$sql = "SELECT p.id AS professor_id, p.usuario_id, p.codigo, p.turno, p.especialidade,
               u.email, u.nome_completo, u.ativo, u.criado_em
        FROM professores p
        JOIN usuarios u ON p.usuario_id = u.id
        WHERE u.papel = 'professor'
        ORDER BY u.criado_em DESC";

$res = $conn->query($sql);
if (!$res) {
    http_response_code(500);
    echo json_encode(['error' => 'Erro ao buscar professores.']);
    exit;
}

$rows = [];
while ($r = $res->fetch_assoc()) {
    $rows[] = $r;
}
echo json_encode(['success'=>true, 'professores'=>$rows], JSON_UNESCAPED_UNICODE);
