<?php

require_once "../middleware/auth.php";
require_once "../config/db.php";

header("Content-Type: application/json");

// Get JSON data
$data = json_decode(file_get_contents("php://input"), true);

$id = $data["id"] ?? "";

// Validate ID
if ($id === "") {
    echo json_encode([
        "status" => 400,
        "message" => "Student ID is required"
    ]);
    exit;
}

// Delete student
$stmt = $conn->prepare(
    "DELETE FROM students WHERE id = ?"
);

$stmt->bind_param("i", $id);

if ($stmt->execute()) {

    if ($stmt->affected_rows > 0) {

        echo json_encode([
            "status" => 200,
            "message" => "Student deleted successfully"
        ]);

    } else {

        echo json_encode([
            "status" => 404,
            "message" => "Student not found"
        ]);
    }

} else {

    echo json_encode([
        "status" => 500,
        "message" => "Failed to delete student"
    ]);
}

$stmt->close();
$conn->close();

?>