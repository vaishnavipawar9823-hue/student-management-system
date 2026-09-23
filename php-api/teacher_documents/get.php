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

$teacher_id = $_GET["teacher_id"] ?? "";

if ($teacher_id === "") {
    echo json_encode([
        "status" => 400,
        "message" => "Teacher ID is required."
    ]);
    exit();
}

$stmt = $conn->prepare("
    SELECT
        id,
        teacher_id,
        document_name,
        document_type,
        file_path,
        uploaded_at
    FROM teacher_documents
    WHERE teacher_id = ?
    ORDER BY uploaded_at DESC
");

$stmt->bind_param("i", $teacher_id);
$stmt->execute();

$result = $stmt->get_result();

$documents = [];

while ($row = $result->fetch_assoc()) {
    $documents[] = $row;
}

echo json_encode([
    "status" => 200,
    "data" => $documents
]);

$stmt->close();
$conn->close();

?>