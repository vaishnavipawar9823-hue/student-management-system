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

$sql = "
    SELECT
        t.id,
        t.teacher_name,
        t.email,
        t.phone,
        t.department_id,
        d.department_name,
        t.subject,
        t.experience,
        t.gender,
        t.salary,
        t.created_at
    FROM teachers t
    INNER JOIN departments d
        ON t.department_id = d.id
    ORDER BY t.id DESC
";

$result = $conn->query($sql);

if ($result) {

    $teachers = [];

    while ($row = $result->fetch_assoc()) {
        $teachers[] = $row;
    }

    echo json_encode([
        "status" => 200,
        "data" => $teachers
    ]);

} else {

    echo json_encode([
        "status" => 500,
        "message" => "Unable to load teachers."
    ]);
}

$conn->close();

?>