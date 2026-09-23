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

$id = $data["id"] ?? "";
$teacher_name = trim($data["teacher_name"] ?? "");
$email = trim($data["email"] ?? "");
$phone = trim($data["phone"] ?? "");
$department_id = $data["department_id"] ?? "";
$subject = trim($data["subject"] ?? "");
$experience = $data["experience"] ?? 0;
$gender = trim($data["gender"] ?? "");
$salary = $data["salary"] ?? 0;

if (
    $id === "" ||
    $teacher_name === "" ||
    $email === "" ||
    $department_id === "" ||
    $subject === ""
) {
    echo json_encode([
        "status" => 400,
        "message" => "Required teacher information is missing."
    ]);
    exit();
}

if (!is_numeric($salary) || $salary < 0) {
    echo json_encode([
        "status" => 400,
        "message" => "Salary must be a valid positive number."
    ]);
    exit();
}

$stmt = $conn->prepare("
    UPDATE teachers
    SET
        teacher_name = ?,
        email = ?,
        phone = ?,
        department_id = ?,
        subject = ?,
        experience = ?,
        gender = ?,
        salary = ?
    WHERE id = ?
");

$stmt->bind_param(
    "sssisdsdi",
    $teacher_name,
    $email,
    $phone,
    $department_id,
    $subject,
    $experience,
    $gender,
    $salary,
    $id
);

if ($stmt->execute()) {

    if ($stmt->affected_rows >= 0) {

        echo json_encode([
            "status" => 200,
            "message" => "Teacher updated successfully."
        ]);

    } else {

        echo json_encode([
            "status" => 500,
            "message" => "Unable to update teacher."
        ]);
    }

} else {

    echo json_encode([
        "status" => 500,
        "message" => $stmt->error
    ]);
}

$stmt->close();
$conn->close();

?>