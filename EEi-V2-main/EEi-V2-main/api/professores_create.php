<?php
header('Content-Type: application/json; charset=utf-8');
include 'db_config.php';

// Espera JSON no body
$input = json_decode(file_get_contents('php://input'), true);

$email = trim($input['email'] ?? '');
$senha = $input['senha'] ?? '';
$nome = trim($input['nome_completo'] ?? '');
$codigo = trim($input['codigo'] ?? '');
$turno = trim($input['turno'] ?? null);
$especialidade = trim($input['especialidade'] ?? null);

if (!$email || !$senha || !$nome) {
    http_response_code(400);
    echo json_encode(['error'=>'email, senha e nome_completo são obrigatórios']);
    exit;
}

// checa email duplicado
$stmt = $conn->prepare("SELECT id FROM usuarios WHERE email = ?");
$stmt->bind_param('s',$email);
$stmt->execute();
$stmt->store_result();
if ($stmt->num_rows > 0) {
    http_response_code(409);
    echo json_encode(['error'=>'Email já cadastrado']);
    exit;
}
$stmt->close();

$conn->begin_transaction();

try {
    $senha_hash = password_hash($senha, PASSWORD_DEFAULT);
    // Insere na tabela usuarios
    $stmt = $conn->prepare("INSERT INTO usuarios (email, senha_hash, papel, nome_completo, ativo) VALUES (?, ?, 'professor', ?, 1)");
    $stmt->bind_param('sss', $email, $senha_hash, $nome);
    if (!$stmt->execute()) throw new Exception('Erro ao inserir usuario: '.$stmt->error);
    $usuario_id = $stmt->insert_id;
    $stmt->close();

    // Insere na tabela professores
    $stmt = $conn->prepare("INSERT INTO professores (usuario_id, codigo, turno, especialidade) VALUES (?, ?, ?, ?)");
    $stmt->bind_param('isss', $usuario_id, $codigo, $turno, $especialidade);
    if (!$stmt->execute()) throw new Exception('Erro ao inserir professor: '.$stmt->error);
    $professor_id = $stmt->insert_id;
    $stmt->close();

    $conn->commit();

    // Retorna o novo professor
    echo json_encode(['success'=>true, 'professor'=>[
        'professor_id'=>$professor_id,
        'usuario_id'=>$usuario_id,
        'email'=>$email,
        'nome_completo'=>$nome,
        'codigo'=>$codigo,
        'turno'=>$turno,
        'especialidade'=>$especialidade
    ]], JSON_UNESCAPED_UNICODE);

} catch (Exception $e) {
    $conn->rollback();
    http_response_code(500);
    echo json_encode(['error'=>$e->getMessage()]);
}
