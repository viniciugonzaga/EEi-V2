<?php
header('Content-Type: application/json; charset=utf-8');
include 'db_config.php';

$input = json_decode(file_get_contents('php://input'), true);

// Pode receber professor_id ou usuario_id
$professor_id = $input['professor_id'] ?? null;
$usuario_id = $input['usuario_id'] ?? null;

$email = isset($input['email']) ? trim($input['email']) : null;
$nome = isset($input['nome_completo']) ? trim($input['nome_completo']) : null;
$senha = $input['senha'] ?? null;
$codigo = isset($input['codigo']) ? trim($input['codigo']) : null;
$turno = isset($input['turno']) ? trim($input['turno']) : null;
$especialidade = isset($input['especialidade']) ? trim($input['especialidade']) : null;

if (!$professor_id && !$usuario_id) {
    http_response_code(400);
    echo json_encode(['error'=>'professor_id ou usuario_id necessário']);
    exit;
}

// Pega usuario_id se recebemos professor_id
if (!$usuario_id) {
    $stmt = $conn->prepare("SELECT usuario_id FROM professores WHERE id = ?");
    $stmt->bind_param('i', $professor_id);
    $stmt->execute();
    $stmt->bind_result($u);
    if (!$stmt->fetch()) {
        http_response_code(404);
        echo json_encode(['error'=>'Professor não encontrado']);
        exit;
    }
    $usuario_id = $u;
    $stmt->close();
}

$conn->begin_transaction();

try {
    // Atualiza usuarios se necessário
    if ($email !== null || $nome !== null || $senha !== null) {
        $sets = [];
        $types = '';
        $vals = [];
        if ($email !== null) {
            // checa duplicidade de email (outro usuario)
            $stmt = $conn->prepare("SELECT id FROM usuarios WHERE email = ? AND id <> ?");
            $stmt->bind_param('si', $email, $usuario_id);
            $stmt->execute();
            $stmt->store_result();
            if ($stmt->num_rows > 0) { throw new Exception('Email já usado por outro usuário'); }
            $stmt->close();

            $sets[] = "email = ?";
            $types .= 's';
            $vals[] = $email;
        }
        if ($nome !== null) {
            $sets[] = "nome_completo = ?";
            $types .= 's';
            $vals[] = $nome;
        }
        if ($senha !== null && $senha !== '') {
            $senha_hash = password_hash($senha, PASSWORD_DEFAULT);
            $sets[] = "senha_hash = ?";
            $types .= 's';
            $vals[] = $senha_hash;
        }
        if (count($sets)>0) {
            $sql = "UPDATE usuarios SET ".implode(', ', $sets)." WHERE id = ?";
            $types .= 'i';
            $vals[] = $usuario_id;
            $stmt = $conn->prepare($sql);
            $stmt->bind_param($types, ...$vals);
            if (!$stmt->execute()) throw new Exception('Erro ao atualizar usuario: '.$stmt->error);
            $stmt->close();
        }
    }

    // Atualiza tabela professores
    if ($codigo !== null || $turno !== null || $especialidade !== null) {
        $sets = [];
        $types = '';
        $vals = [];
        if ($codigo !== null) { $sets[] = "codigo = ?"; $types.='s'; $vals[]=$codigo; }
        if ($turno !== null) { $sets[] = "turno = ?"; $types.='s'; $vals[]=$turno; }
        if ($especialidade !== null) { $sets[] = "especialidade = ?"; $types.='s'; $vals[]=$especialidade; }
        if (count($sets)>0) {
            $sql = "UPDATE professores SET ".implode(', ', $sets)." WHERE usuario_id = ?";
            $types .= 'i';
            $vals[] = $usuario_id;
            $stmt = $conn->prepare($sql);
            $stmt->bind_param($types, ...$vals);
            if (!$stmt->execute()) throw new Exception('Erro ao atualizar professor: '.$stmt->error);
            $stmt->close();
        }
    }

    $conn->commit();
    echo json_encode(['success'=>true], JSON_UNESCAPED_UNICODE);

} catch (Exception $e) {
    $conn->rollback();
    http_response_code(500);
    echo json_encode(['error'=>$e->getMessage()]);
}
