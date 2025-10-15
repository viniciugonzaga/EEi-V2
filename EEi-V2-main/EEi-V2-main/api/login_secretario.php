<?php
ob_start(); 
// Configurações de exibição de erro
ini_set('display_errors', 0); 
ini_set('display_startup_errors', 0);

header("Content-Type: application/json");
require_once "db_config.php"; // Caminho direto na mesma pasta

session_start();

$response = ["success" => false, "message" => "Erro desconhecido."];

// 1. VERIFICA CONEXÃO COM O BANCO DE DADOS
if (!isset($conn) || $conn->connect_error) {
    $response["message"] = "Erro de conexão com o banco de dados.";
    goto end;
}

// 2. CAPTURA E VALIDA DADOS
$email = $_POST["email"] ?? "";
$senha = $_POST["senha"] ?? "";
$codigo = $_POST["codigo"] ?? "";

if (!$email || !$senha || !$codigo) {
    $response["message"] = "Preencha todos os campos.";
    goto end;
}

try {
    // 3. CONSULTA SEGURA (PREPARED STATEMENT)
    $sql = "SELECT u.id AS usuario_id, u.senha, s.codigo 
            FROM usuarios u
            INNER JOIN secretarios s ON u.id = s.usuario_id
            WHERE u.email = ? AND s.codigo = ?";

    $stmt = $conn->prepare($sql);
    $stmt->bind_param("si", $email, $codigo); // s (string) para email, i (integer) para código
    $stmt->execute();
    $result = $stmt->get_result();
    $user = $result->fetch_assoc();

    // 4. VERIFICAÇÃO DE CREDENCIAIS
    if ($user) {
        if ($senha === $user["senha"] || password_verify($senha, $user["senha"])) {
            
            $_SESSION["secretario_id"] = $user["usuario_id"];
            $response["success"] = true;
            $response["message"] = "Login realizado com sucesso!";

        } else {
            $response["message"] = "Senha incorreta.";
        }
    } else {
        $response["message"] = "Email ou código inválidos.";
    }

} catch (Exception $e) {
    error_log("Login Secretário Exception: " . $e->getMessage());
    $response["message"] = "Erro no servidor (código: 500).";
}

end:
// Limpa e descarta qualquer coisa que não seja o JSON
ob_end_clean(); 
echo json_encode($response);

$conn->close();
// REMOVA A TAG DE FECHAMENTO `?>` SE ELA EXISTIR!