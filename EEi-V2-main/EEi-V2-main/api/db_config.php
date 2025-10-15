<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

$servername = "localhost";
$username = "root";
$password = "";
$dbname = "pequenos_sonhos";

$conn = new mysqli($servername, $username, $password, $dbname);
if ($conn->connect_error) {
error_log("DB connect error: " . $conn->connect_error);
 http_response_code(500);
 echo json_encode(['error' => 'Erro DB']);
 exit;
}
