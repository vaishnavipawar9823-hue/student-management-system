<?php

header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json");

require_once "../config/db.php";

$student_id = $_GET["student_id"] ?? "";

if (!empty($student_id)) {

    $stmt = $conn->prepare("
        SELECT
            sl.id,
            sl.student_id,
            s.name AS student_name,
            s.course,
            sl.leave_type,
            sl.start_date,
            sl.end_date,
            sl.reason,
            sl.status,
            sl.applied_at
        FROM student_leaves sl
        INNER JOIN students s
            ON sl.student_id = s.id
        WHERE sl.student_id = ?
        ORDER BY sl.id DESC
    ");

    $stmt->bind_param("i", $student_id);
    $stmt->execute();

    $result = $stmt->get_result();

} else {

    $result = $conn->query("
        SELECT
            sl.id,
            sl.student_id,
            s.name AS student_name,
            s.course,
            sl.leave_type,
            sl.start_date,
            sl.end_date,
            sl.reason,
            sl.status,
            sl.applied_at
        FROM student_leaves sl
        INNER JOIN students s
            ON sl.student_id = s.id
        ORDER BY sl.id DESC
    ");
}

$data = [];

while ($row = $result->fetch_assoc()) {
    $data[] = $row;
}

if (count($data) > 0) {

    echo json_encode([
        "status" => 200,
        "data" => $data
    ]);

} else {

    echo json_encode([
        "status" => 400,
        "message" => "No student leave records found.",
        "data" => []
    ]);
}

$conn->close();
?>