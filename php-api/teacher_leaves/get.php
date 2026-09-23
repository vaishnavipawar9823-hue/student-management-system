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

$teacher_id = isset($_GET["teacher_id"])
    ? (int)$_GET["teacher_id"]
    : 0;

if ($teacher_id > 0) {

    $stmt = $conn->prepare("
        SELECT
            teacher_leaves.id,
            teacher_leaves.teacher_id,
            teachers.teacher_name,
            teacher_leaves.leave_type,
            teacher_leaves.start_date,
            teacher_leaves.end_date,
            teacher_leaves.reason,
            teacher_leaves.status,
            teacher_leaves.applied_at
        FROM teacher_leaves
        INNER JOIN teachers
            ON teacher_leaves.teacher_id = teachers.id
        WHERE teacher_leaves.teacher_id = ?
        ORDER BY teacher_leaves.start_date DESC,
                 teacher_leaves.id DESC
    ");

    $stmt->bind_param("i", $teacher_id);
    $stmt->execute();

    $result = $stmt->get_result();

} else {

    $sql = "
        SELECT
            teacher_leaves.id,
            teacher_leaves.teacher_id,
            teachers.teacher_name,
            teacher_leaves.leave_type,
            teacher_leaves.start_date,
            teacher_leaves.end_date,
            teacher_leaves.reason,
            teacher_leaves.status,
            teacher_leaves.applied_at
        FROM teacher_leaves
        INNER JOIN teachers
            ON teacher_leaves.teacher_id = teachers.id
        ORDER BY teacher_leaves.start_date DESC,
                 teacher_leaves.id DESC
    ";

    $result = $conn->query($sql);
}

if ($result) {

    $leaves = [];

    while ($row = $result->fetch_assoc()) {
        $leaves[] = $row;
    }

    echo json_encode([
        "status" => 200,
        "data" => $leaves
    ]);

} else {

    echo json_encode([
        "status" => 500,
        "message" => "Unable to fetch leaves."
    ]);
}

if (isset($stmt)) {
    $stmt->close();
}

$conn->close();

?>