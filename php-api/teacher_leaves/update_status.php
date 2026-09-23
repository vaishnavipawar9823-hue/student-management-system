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

$id = isset($data["id"]) ? (int)$data["id"] : 0;
$status = trim($data["status"] ?? "");

if ($id <= 0 || !in_array($status, ["Pending", "Approved", "Rejected"], true)) {
    echo json_encode([
        "status" => 400,
        "message" => "Invalid leave request."
    ]);
    exit();
}

$stmt = $conn->prepare("
    UPDATE teacher_leaves
    SET status = ?
    WHERE id = ?
");

$stmt->bind_param("si", $status, $id);

if ($stmt->execute()) {

    echo json_encode([
        "status" => 200,
        "message" => "Leave status updated successfully."
    ]);

} else {

    echo json_encode([
        "status" => 500,
        "message" => "Unable to update leave status."
    ]);
}

$stmt->close();
$conn->close();

?>