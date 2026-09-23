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

// Read JSON body
$data = json_decode(file_get_contents("php://input"), true);

$student_id = $data["student_id"] ?? "";
$attendance_date = $data["attendance_date"] ?? "";
$status = $data["status"] ?? "";

// Validate required fields
if (
    $student_id === "" ||
    $attendance_date === "" ||
    $status === ""
) {
    echo json_encode([
        "status" => 400,
        "message" => "Student, date and status are required."
    ]);
    exit();
}

// Validate status
$allowedStatuses = [
    "Present",
    "Absent",
    "Late"
];

if (!in_array($status, $allowedStatuses, true)) {
    echo json_encode([
        "status" => 400,
        "message" => "Invalid attendance status."
    ]);
    exit();
}

// Check student exists
$studentCheck = $conn->prepare(
    "SELECT id FROM students WHERE id = ?"
);

if (!$studentCheck) {
    echo json_encode([
        "status" => 500,
        "message" => "Student check query failed: " . $conn->error
    ]);
    exit();
}

$studentCheck->bind_param(
    "i",
    $student_id
);

$studentCheck->execute();

$studentResult = $studentCheck->get_result();

if ($studentResult->num_rows === 0) {

    echo json_encode([
        "status" => 404,
        "message" => "Student not found."
    ]);

    $studentCheck->close();
    $conn->close();
    exit();
}

$studentCheck->close();

// Check whether attendance already exists
$check = $conn->prepare("
    SELECT id
    FROM attendance
    WHERE student_id = ?
    AND attendance_date = ?
");

if (!$check) {
    echo json_encode([
        "status" => 500,
        "message" => "Attendance check query failed: " . $conn->error
    ]);
    exit();
}

$check->bind_param(
    "is",
    $student_id,
    $attendance_date
);

$check->execute();

$result = $check->get_result();

if ($result->num_rows > 0) {

    // Existing record → update
    $row = $result->fetch_assoc();

    $attendance_id = $row["id"];

    $update = $conn->prepare("
        UPDATE attendance
        SET status = ?
        WHERE id = ?
    ");

    if (!$update) {
        echo json_encode([
            "status" => 500,
            "message" => "Attendance update query failed: " . $conn->error
        ]);

        $check->close();
        $conn->close();
        exit();
    }

    $update->bind_param(
        "si",
        $status,
        $attendance_id
    );

    if ($update->execute()) {

        echo json_encode([
            "status" => 200,
            "message" => "Attendance updated successfully."
        ]);

    } else {

        echo json_encode([
            "status" => 500,
            "message" => "Unable to update attendance: " . $update->error
        ]);
    }

    $update->close();

} else {

    // No record → insert
    $insert = $conn->prepare("
        INSERT INTO attendance
        (
            student_id,
            attendance_date,
            status
        )
        VALUES (?, ?, ?)
    ");

    if (!$insert) {
        echo json_encode([
            "status" => 500,
            "message" => "Attendance insert query failed: " . $conn->error
        ]);

        $check->close();
        $conn->close();
        exit();
    }

    $insert->bind_param(
        "iss",
        $student_id,
        $attendance_date,
        $status
    );

    if ($insert->execute()) {

        echo json_encode([
            "status" => 200,
            "message" => "Attendance saved successfully."
        ]);

    } else {

        echo json_encode([
            "status" => 500,
            "message" => "Unable to save attendance: " . $insert->error
        ]);
    }

    $insert->close();
}

$check->close();
$conn->close();

?>