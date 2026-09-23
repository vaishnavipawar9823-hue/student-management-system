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

$teacher_id = isset($data["teacher_id"]) ? (int)$data["teacher_id"] : 0;
$leave_type = trim($data["leave_type"] ?? "");
$start_date = trim($data["start_date"] ?? "");
$end_date = trim($data["end_date"] ?? "");
$reason = trim($data["reason"] ?? "");

if (
    $teacher_id <= 0 ||
    $leave_type === "" ||
    $start_date === "" ||
    $end_date === ""
) {
    echo json_encode([
        "status" => 400,
        "message" => "Please fill all required leave details."
    ]);
    exit();
}

if ($end_date < $start_date) {
    echo json_encode([
        "status" => 400,
        "message" => "End date cannot be before start date."
    ]);
    exit();
}

/*
|--------------------------------------------------------------------------
| Check teacher exists
|--------------------------------------------------------------------------
*/

$teacherStmt = $conn->prepare("
    SELECT id
    FROM teachers
    WHERE id = ?
    LIMIT 1
");

$teacherStmt->bind_param("i", $teacher_id);
$teacherStmt->execute();

$teacherResult = $teacherStmt->get_result();

if ($teacherResult->num_rows === 0) {
    echo json_encode([
        "status" => 404,
        "message" => "Teacher not found."
    ]);
    exit();
}

$teacherStmt->close();

/*
|--------------------------------------------------------------------------
| Create leave request
|--------------------------------------------------------------------------
*/

$stmt = $conn->prepare("
    INSERT INTO teacher_leaves
    (
        teacher_id,
        leave_type,
        start_date,
        end_date,
        reason
    )
    VALUES (?, ?, ?, ?, ?)
");

$stmt->bind_param(
    "issss",
    $teacher_id,
    $leave_type,
    $start_date,
    $end_date,
    $reason
);

if ($stmt->execute()) {

    echo json_encode([
        "status" => 200,
        "message" => "Leave applied successfully!",
        "data" => [
            "id" => $stmt->insert_id,
            "teacher_id" => $teacher_id,
            "leave_type" => $leave_type,
            "start_date" => $start_date,
            "end_date" => $end_date,
            "reason" => $reason,
            "status" => "Pending"
        ]
    ]);

} else {

    echo json_encode([
        "status" => 500,
        "message" => "Unable to apply leave."
    ]);
}

$stmt->close();
$conn->close();

?>