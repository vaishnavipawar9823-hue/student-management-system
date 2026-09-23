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
            attendance.id,
            attendance.student_id,
            students.name AS student_name,
            students.course,
            attendance.attendance_date,
            attendance.status,
            attendance.created_at
        FROM attendance
        INNER JOIN students
            ON attendance.student_id = students.id
        WHERE attendance.attendance_date = ?
        ORDER BY students.id ASC
    ");

    $stmt->bind_param("s", $date);

    $stmt->execute();

    $result = $stmt->get_result();

} else {

    $sql = "
        SELECT
            attendance.id,
            attendance.student_id,
            students.name AS student_name,
            students.course,
            attendance.attendance_date,
            attendance.status,
            attendance.created_at
        FROM attendance
        INNER JOIN students
            ON attendance.student_id = students.id
        ORDER BY attendance.attendance_date DESC, attendance.id DESC
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
        "message" => "Unable to fetch attendance."
    ]);
}

if (isset($stmt)) {
    $stmt->close();
}

$conn->close();

?>