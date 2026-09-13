<?php

require_once "../middleware/auth.php";
require_once "../config/db.php";

header("Content-Type: application/json");

$sql = "SELECT 
            id,
            name,
            email,
            phone,
            course,
            age,
            gender,
            address,
            profile_image,
            created_at
        FROM students
        ORDER BY id DESC";

$result = $conn->query($sql);

$students = [];

if ($result) {

    while ($row = $result->fetch_assoc()) {
        $students[] = $row;
    }

    echo json_encode([
        "status" => 200,
        "message" => "Students fetched successfully",
        "data" => $students
    ]);

} else {

    echo json_encode([
        "status" => 500,
        "message" => "Failed to fetch students"
    ]);
}

$conn->close();

?>