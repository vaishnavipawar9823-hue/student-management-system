<?php

header("Content-Type: application/json");
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Methods: DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
    http_response_code(200);
    exit();
}

require_once "../config/db.php";

$data = json_decode(file_get_contents("php://input"), true);

$id = intval($data["id"] ?? 0);

if ($id <= 0) {
    echo json_encode([
        "status" => 400,
        "message" => "Valid teacher ID is required."
    ]);
    exit();
}

$stmt = $conn->prepare(
    "DELETE FROM teachers WHERE id = ?"
);

$stmt->bind_param("i", $id);

if ($stmt->execute()) {

    if ($stmt->affected_rows > 0) {
        echo json_encode([
            "status" => 200,
            "message" => "Teacher deleted successfully."
        ]);
    } else {
        echo json_encode([
            "status" => 404,
            "message" => "Teacher not found."
        ]);
    }

} else {

    echo json_encode([
        "status" => 500,
        "message" => "Unable to delete teacher."
    ]);
}

$stmt->close();
$conn->close();

?>