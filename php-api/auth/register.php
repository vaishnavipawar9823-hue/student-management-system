<?php

header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");

require_once "../config/db.php";

// Get JSON data
$data = json_decode(file_get_contents("php://input"), true);

$name = trim($data["name"] ?? "");
$email = trim($data["email"] ?? "");
$password = $data["password"] ?? "";
$role = $data["role"] ?? "student";

// Validate fields
if ($name === "" || $email === "" || $password === "") {
    echo json_encode([
        "status" => 400,
        "message" => "Name, email and password are required"
    ]);
    exit;
}

// Check email
$check = $conn->prepare("SELECT id FROM users WHERE email = ?");
$check->bind_param("s", $email);
$check->execute();
$result = $check->get_result();

if ($result->num_rows > 0) {
    echo json_encode([
        "status" => 400,
        "message" => "Email already registered"
    ]);
    exit;
}

// Hash password
$hashedPassword = password_hash($password, PASSWORD_DEFAULT);

// Insert user
$stmt = $conn->prepare(
    "INSERT INTO users (name, email, password, role)
     VALUES (?, ?, ?, ?)"
);

$stmt->bind_param(
    "ssss",
    $name,
    $email,
    $hashedPassword,
    $role
);

if ($stmt->execute()) {

    echo json_encode([
        "status" => 201,
        "message" => "User registered successfully",
        "data" => [
            "id" => $stmt->insert_id,
            "name" => $name,
            "email" => $email,
            "role" => $role
        ]
    ]);

} else {

    echo json_encode([
        "status" => 500,
        "message" => "Registration failed"
    ]);
}

$stmt->close();
$check->close();
$conn->close();

?>