<?php

header("Content-Type: application/json");
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
    http_response_code(200);
    exit();
}

require_once "../config/db.php";

$id = $_GET["id"] ?? "";

if ($id === "") {
    echo json_encode([
        "status" => 400,
        "message" => "Teacher ID is required."
    ]);
    exit();
}

$stmt = $conn->prepare("
    SELECT
        t.id,
        t.teacher_name,
        t.email,
        t.phone,
        t.department_id,
        d.department_name,
        t.subject,
        t.experience,
        t.salary,
        t.gender,
        t.created_at
    FROM teachers t
    INNER JOIN departments d
        ON t.department_id = d.id
    WHERE t.id = ?
");

$stmt->bind_param("i", $id);
$stmt->execute();

$result = $stmt->get_result();

if ($result->num_rows > 0) {

    $teacher = $result->fetch_assoc();

    echo json_encode([
        "status" => 200,
        "data" => $teacher
    ]);

} else {

    echo json_encode([
        "status" => 404,
        "message" => "Teacher not found."
    ]);
}

$stmt->close();
$conn->close();

?>