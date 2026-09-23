<?php

header("Content-Type: application/json");
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
    http_response_code(200);
    exit();
}

require_once "../config/db.php";

$sql = "SELECT * FROM departments ORDER BY id DESC";

$result = $conn->query($sql);

if ($result) {

    $departments = [];

    while ($row = $result->fetch_assoc()) {
        $departments[] = $row;
    }

    echo json_encode([
        "status" => 200,
        "data" => $departments
    ]);

} else {

    echo json_encode([
        "status" => 500,
        "message" => "Unable to fetch departments."
    ]);
}

$conn->close();

?>