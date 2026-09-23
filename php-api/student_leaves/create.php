<?php

header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Content-Type: application/json");

if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
    http_response_code(200);
    exit;
}

require_once "../config/db.php";

$data = json_decode(file_get_contents("php://input"), true);

$student_id = $data["student_id"] ?? "";
$leave_type = trim($data["leave_type"] ?? "");
$start_date = $data["start_date"] ?? "";
$end_date = $data["end_date"] ?? "";
$reason = trim($data["reason"] ?? "");

if (
    empty($student_id) ||
    empty($leave_type) ||
    empty($start_date) ||
    empty($end_date)
) {
    echo json_encode([
        "status" => 400,
        "message" => "Please fill all required leave details."
    ]);
    exit;
}

if ($end_date < $start_date) {
    echo json_encode([
        "status" => 400,
        "message" => "End date cannot be before start date."
    ]);
    exit;
}

$stmt = $conn->prepare("
    INSERT INTO student_leaves
    (student_id, leave_type, start_date, end_date, reason)
    VALUES (?, ?, ?, ?, ?)
");

$stmt->bind_param(
    "issss",
    $student_id,
    $leave_type,
    $start_date,
    $end_date,
    $reason
);

if ($stmt->execute()) {
    echo json_encode([
        "status" => 200,
        "message" => "Student leave applied successfully."
    ]);
} else {
    echo json_encode([
        "status" => 500,
        "message" => "Unable to apply student leave."
    ]);
}

$stmt->close();
$conn->close();
?>