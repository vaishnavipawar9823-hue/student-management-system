<?php

session_set_cookie_params([
    "lifetime" => 0,
    "path" => "/",
    "domain" => "localhost",
    "secure" => false,
    "httponly" => true,
    "samesite" => "Lax"
]);

session_start();

header("Content-Type: application/json");
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

require_once "../config/db.php";

// Get JSON data
$data = json_decode(file_get_contents("php://input"), true);

$email = trim($data["email"] ?? "");
$password = $data["password"] ?? "";

// Validate
if ($email === "" || $password === "") {
    echo json_encode([
        "status" => 400,
        "message" => "Email and password are required"
    ]);
    exit;
}

// Find user
$stmt = $conn->prepare(
    "SELECT id, name, email, password, role
     FROM users
     WHERE email = ?"
);

$stmt->bind_param("s", $email);
$stmt->execute();

$result = $stmt->get_result();

if ($result->num_rows === 0) {
    echo json_encode([
        "status" => 401,
        "message" => "Invalid email or password"
    ]);
    exit;
}

$user = $result->fetch_assoc();

// Check password
if (!password_verify($password, $user["password"])) {
    echo json_encode([
        "status" => 401,
        "message" => "Invalid email or password"
    ]);
    exit;
}

$_SESSION["user_id"] = $user["id"];
$_SESSION["user_name"] = $user["name"];
$_SESSION["user_email"] = $user["email"];
$_SESSION["user_role"] = $user["role"];

// Successful login
echo json_encode([
    "status" => 200,
    "message" => "Login successful",
    "data" => [
        "id" => $user["id"],
        "name" => $user["name"],
        "email" => $user["email"],
        "role" => $user["role"]
    ]
]);

$stmt->close();
$conn->close();

?>