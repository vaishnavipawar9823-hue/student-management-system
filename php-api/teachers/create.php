<?php

header("Content-Type: application/json");
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
    http_response_code(200);
    exit();
}

require_once "../config/db.php";

$data = json_decode(file_get_contents("php://input"), true);

$teacher_name = trim($data["teacher_name"] ?? "");
$email = trim($data["email"] ?? "");
$phone = trim($data["phone"] ?? "");
$department_id = $data["department_id"] ?? "";
$subject = trim($data["subject"] ?? "");
$experience = $data["experience"] ?? 0;
$gender = trim($data["gender"] ?? "");
$salary = $data["salary"] ?? 0;

if (
    $teacher_name === "" ||
    $email === "" ||
    $department_id === "" ||
    $subject === ""
) {
    echo json_encode([
        "status" => 400,
        "message" => "Teacher name, email, department and subject are required."
    ]);
    exit();
}

if (!is_numeric($salary) || $salary < 0) {
    echo json_encode([
        "status" => 400,
        "message" => "Salary must be a valid number."
    ]);
    exit();
}

$stmt = $conn->prepare("
    INSERT INTO teachers
    (
        teacher_name,
        email,
        phone,
        department_id,
        subject,
        experience,
        gender,
        salary
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
");

$stmt->bind_param(
    "sssisdsd",
    $teacher_name,
    $email,
    $phone,
    $department_id,
    $subject,
    $experience,
    $gender,
    $salary
);

if ($stmt->execute()) {

    echo json_encode([
        "status" => 200,
        "message" => "Teacher added successfully.",
        "id" => $stmt->insert_id
    ]);

} else {

    echo json_encode([
        "status" => 500,
        "message" => $stmt->error
    ]);
}

$stmt->close();
$conn->close();

?>