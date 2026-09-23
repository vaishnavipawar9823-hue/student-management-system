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

$id = intval($data["id"] ?? 0);
$department_name = trim($data["department_name"] ?? "");
$head_of_department = trim($data["head_of_department"] ?? "");
$description = trim($data["description"] ?? "");

if (
    $id <= 0 ||
    $department_name === "" ||
    $head_of_department === ""
) {
    echo json_encode([
        "status" => 400,
        "message" => "Department ID, name and head of department are required."
    ]);
    exit();
}

$stmt = $conn->prepare(
    "UPDATE departments
     SET department_name = ?,
         head_of_department = ?,
         description = ?
     WHERE id = ?"
);

$stmt->bind_param(
    "sssi",
    $department_name,
    $head_of_department,
    $description,
    $id
);

if ($stmt->execute()) {

    if ($stmt->affected_rows >= 0) {

        echo json_encode([
            "status" => 200,
            "message" => "Department updated successfully."
        ]);

    } else {

        echo json_encode([
            "status" => 500,
            "message" => "Unable to update department."
        ]);
    }

} else {

    echo json_encode([
        "status" => 500,
        "message" => "Unable to update department."
    ]);
}

$stmt->close();
$conn->close();

?>