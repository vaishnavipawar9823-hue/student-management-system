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

$date = $_GET["date"] ?? "";

if ($date !== "") {

    $stmt = $conn->prepare("
        SELECT
            ta.id,
            ta.teacher_id,
            t.teacher_name,
            t.email,
            t.department_id,
            d.department_name,
            ta.attendance_date,
            ta.status,
            ta.created_at
        FROM teacher_attendance ta
        INNER JOIN teachers t
            ON ta.teacher_id = t.id
        INNER JOIN departments d
            ON t.department_id = d.id
        WHERE ta.attendance_date = ?
        ORDER BY t.id ASC
    ");

    $stmt->bind_param("s", $date);
    $stmt->execute();

    $result = $stmt->get_result();

} else {

    $sql = "
        SELECT
            ta.id,
            ta.teacher_id,
            t.teacher_name,
            t.email,
            t.department_id,
            d.department_name,
            ta.attendance_date,
            ta.status,
            ta.created_at
        FROM teacher_attendance ta
        INNER JOIN teachers t
            ON ta.teacher_id = t.id
        INNER JOIN departments d
            ON t.department_id = d.id
        ORDER BY ta.attendance_date DESC, ta.id DESC
    ";

    $result = $conn->query($sql);
}

if ($result) {

    $attendance = [];

    while ($row = $result->fetch_assoc()) {
        $attendance[] = $row;
    }

    echo json_encode([
        "status" => 200,
        "data" => $attendance
    ]);

} else {

    echo json_encode([
        "status" => 500,
        "message" => "Unable to fetch teacher attendance."
    ]);
}

if (isset($stmt)) {
    $stmt->close();
}

$conn->close();

?>