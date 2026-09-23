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

$id = $data["id"] ?? "";
$status = $data["status"] ?? "";

$allowedStatus = ["Pending", "Approved", "Rejected"];

if (empty($id) || empty($status)) {
    echo json_encode([
        "status" => 400,
        "message" => "Leave ID and status are required."
    ]);
    exit;
}

if (!in_array($status, $allowedStatus)) {
    echo json_encode([
        "status" => 400,
        "message" => "Invalid leave status."
    ]);
    exit;
}

$stmt = $conn->prepare("
    UPDATE student_leaves
    SET status = ?
    WHERE id = ?
");

$stmt->bind_param(
    "si",
    $status,
    $id
);

if ($stmt->execute()) {

    echo json_encode([
        "status" => 200,
        "message" => "Student leave status updated successfully."
    ]);

} else {

    echo json_encode([
        "status" => 500,
        "message" => "Unable to update student leave status."
    ]);
}

$stmt->close();
$conn->close();
?>