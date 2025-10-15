<?php
// api.php - versão final compatível com cardapio.js e index.html

ini_set('display_errors', 0);
ini_set('display_startup_errors', 0);
error_reporting(E_ALL & ~E_NOTICE & ~E_STRICT);

header("Content-Type: application/json; charset=UTF-8");

include 'db_config.php';

function json_resp($data, $code = 200) {
    http_response_code($code);
    echo json_encode($data, JSON_UNESCAPED_UNICODE);
    exit;
}

// Detectar rota
$path_info = $_SERVER['PATH_INFO'] ?? '';
$action = $_GET['action'] ?? null;
$request_uri = $_SERVER['REQUEST_URI'] ?? '';

$route = null;
if ($path_info) {
    $route = trim($path_info, "/");
} elseif ($action) {
    $route = $action;
} else {
    $parts = explode('/', parse_url($request_uri, PHP_URL_PATH));
    $route = end($parts);
}

$route = $route ?? '';
$requestMethod = $_SERVER['REQUEST_METHOD'] ?? 'GET';

// =======================================================
// GET /cardapio
// =======================================================
if ($route === 'cardapio' && $requestMethod === 'GET') {
    $sql = "SELECT * FROM cardapios_semanais";
    $result = $conn->query($sql);

    if ($result === false) {
        json_resp(['error' => 'Erro na consulta ao banco.'], 500);
    }

    $cardapioFormatado = [];

    while ($row = $result->fetch_assoc()) {
        $dia = $row['dia_semana'] ?? null;
        $refKey = $row['refeicao'] ?? null; // manha / almoco / tarde

        if (!$dia || !$refKey) continue;

        if (!isset($cardapioFormatado[$dia])) {
            $cardapioFormatado[$dia] = [];
        }

        $cardapioFormatado[$dia][$refKey] = [
            "opcoes" => [
                ["content" => $row['opcao1_nome'], "photo" => $row['opcao1_foto'], "nutri" => $row['opcao1_nutri']],
                ["content" => $row['opcao2_nome'], "photo" => $row['opcao2_foto'], "nutri" => $row['opcao2_nutri']],
                ["content" => $row['opcao3_nome'], "photo" => $row['opcao3_foto'], "nutri" => $row['opcao3_nutri']],
                ["content" => $row['opcao4_nome'], "photo" => $row['opcao4_foto'], "nutri" => $row['opcao4_nutri']]
            ]
        ];
    }

    json_resp($cardapioFormatado);
}

// =======================================================
// POST /cardapio
// =======================================================
else if ($route === 'cardapio' && $requestMethod === 'POST') {
    $raw = file_get_contents('php://input');
    $formData = json_decode($raw, true);

    if (!is_array($formData)) {
        json_resp(['error' => 'JSON inválido ou corpo vazio.'], 400);
    }

    $dias = ["segunda", "terca", "quarta", "quinta", "sexta"];
    $refeicoes = ["manha", "almoco", "tarde"]; // compatível com front

    if (!$conn->begin_transaction()) {
        json_resp(['error' => 'Erro ao iniciar transação.'], 500);
    }

    try {
        $conn->query('DELETE FROM cardapios_semanais');

        $stmt = $conn->prepare("
            INSERT INTO cardapios_semanais 
            (dia_semana, refeicao, opcao1_nome, opcao1_foto, opcao1_nutri,
            opcao2_nome, opcao2_foto, opcao2_nutri,
            opcao3_nome, opcao3_foto, opcao3_nutri,
            opcao4_nome, opcao4_foto, opcao4_nutri)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ");

        $stmt->bind_param("ssssssssssssss",
            $dia_bind, $ref_bind,
            $op1_nome, $op1_foto, $op1_nutri,
            $op2_nome, $op2_foto, $op2_nutri,
            $op3_nome, $op3_foto, $op3_nutri,
            $op4_nome, $op4_foto, $op4_nutri
        );

        foreach ($dias as $dia_bind) {
            foreach ($refeicoes as $ref_bind) {
                $base = "{$dia_bind}-{$ref_bind}";

                $op1_nome = $formData["{$base}-op1"] ?? null;
                $op1_foto = $formData["{$base}-foto1"] ?? null;
                $op1_nutri = $formData["{$base}-nutri1"] ?? null;

                $op2_nome = $formData["{$base}-op2"] ?? null;
                $op2_foto = $formData["{$base}-foto2"] ?? null;
                $op2_nutri = $formData["{$base}-nutri2"] ?? null;

                $op3_nome = $formData["{$base}-op3"] ?? null;
                $op3_foto = $formData["{$base}-foto3"] ?? null;
                $op3_nutri = $formData["{$base}-nutri3"] ?? null;

                $op4_nome = $formData["{$base}-op4"] ?? null;
                $op4_foto = $formData["{$base}-foto4"] ?? null;
                $op4_nutri = $formData["{$base}-nutri4"] ?? null;

                $stmt->execute();
            }
        }

        $conn->commit();
        json_resp(['message' => 'Cardápio atualizado com sucesso!'], 200);

    } catch (Exception $e) {
        $conn->rollback();
        json_resp(['error' => 'Erro ao salvar o cardápio: ' . $e->getMessage()], 500);
    }
}
// =======================================================
// login-secretario
// =======================================================
else if ($route === 'login-secretario' && $requestMethod === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);
    $email = $data['email'] ?? null;
    $senha = $data['senha'] ?? null;
    $codigo = $data['codigo'] ?? null;

    $sql = "SELECT s.* FROM secretarios s
            JOIN usuarios u ON s.usuario_id = u.id
            WHERE u.email = ? AND u.senha_hash = ? AND s.codigo = ?";

    $stmt = $conn->prepare($sql);
    $stmt->bind_param("ssi", $email, $senha, $codigo);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result && $result->num_rows > 0) {
        json_resp(["message" => "Login bem-sucedido."]);
    } else {
        json_resp(["error" => "Credenciais inválidas."], 401);
    }
}




// =======================================================
// rota não encontrada
// =======================================================
json_resp(['error' => 'Rota não encontrada: ' . $route], 404);
