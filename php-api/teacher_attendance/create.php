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

$teacher_id = $data["teacher_id"] ?? "";
$attendance_date = $data["attendance_date"] ?? "";
$status = $data["status"] ?? "";

if ($teacher_id === "" || $attendance_date === "" || $status === "") {
    echo json_encode([
        "status" => 400,
        "message" => "Teacher, date and status are required."
    ]);
    exit();
}

$allowed_status = ["Present", "Absent", "Late"];

if (!in_array($status, $allowed_status)) {
    echo json_encode([
        "status" => 400,
        "message" => "Invalid attendance status."
    ]);
    exit();
}

/* Check whether attendance already exists */
$check = $conn->prepare("
    SELECT id
    FROM teacher_attendance
    WHERE teacher_id = ?
    AND attendance_date = ?
");

$check->bind_param(
    "is",
    $teacher_id,
    $attendance_date
);

$check->execute();

$result = $check->get_result();

if ($result->num_rows > 0) {

    $row = $result->fetch_assoc();
    $attendance_id = $row["id"];

    /* Update existing attendance */
    $update = $conn->prepare("
        UPDATE teacher_attendance
        SET status = ?
        WHERE id = ?
    ");

    $update->bind_param(
        "si",
        $status,
        $attendance_id
    );

    if ($update->execute()) {

        echo json_encode([
            "status" => 200,
            "message" => "Teacher attendance updated successfully."
        ]);

    } else {

        echo json_encode([
            "status" => 500,
            "message" => "Failed to update attendance."
        ]);
    }

    $update->close();

} else {

    /* Insert new attendance */
    $insert = $conn->prepare("
        INSERT INTO teacher_attendance
        (teacher_id, attendance_date, status)
        VALUES (?, ?, ?)
    ");

    $insert->bind_param(
        "iss",
        $teacher_id,
        $attendance_date,
        $status
    );

    if ($insert->execute()) {

        echo json_encode([
            "status" => 200,
            "message" => "Teacher attendance marked successfully."
        ]);

    } else {

        echo json_encode([
            "status" => 500,
            "message" => "Failed to mark attendance."
        ]);
    }

    $insert->close();
}

$check->close();
$conn->close();

?>