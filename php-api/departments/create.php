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

$department_name = trim($data["department_name"] ?? "");
$head_of_department = trim($data["head_of_department"] ?? "");
$description = trim($data["description"] ?? "");

if ($department_name === "" || $head_of_department === "") {
    echo json_encode([
        "status" => 400,
        "message" => "Department name and head of department are required."
    ]);
    exit();
}

$stmt = $conn->prepare(
    "INSERT INTO departments
    (department_name, head_of_department, description)
    VALUES (?, ?, ?)"
);

$stmt->bind_param(
    "sss",
    $department_name,
    $head_of_department,
    $description
);

if ($stmt->execute()) {

    echo json_encode([
        "status" => 200,
        "message" => "Department added successfully.",
        "data" => [
            "id" => $stmt->insert_id,
            "department_name" => $department_name,
            "head_of_department" => $head_of_department,
            "description" => $description
        ]
    ]);

} else {

    echo json_encode([
        "status" => 500,
        "message" => "Unable to add department."
    ]);
}

$stmt->close();
$conn->close();

?>