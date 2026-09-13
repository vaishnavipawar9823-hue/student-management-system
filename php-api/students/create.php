<?php

require_once "../middleware/auth.php";
require_once "../config/db.php";

header("Content-Type: application/json");

$name = trim($_POST["name"] ?? "");
$email = trim($_POST["email"] ?? "");
$phone = trim($_POST["phone"] ?? "");
$course = trim($_POST["course"] ?? "");
$age = $_POST["age"] ?? "";
$gender = trim($_POST["gender"] ?? "");
$address = trim($_POST["address"] ?? "");

if (
    $name === "" ||
    $email === "" ||
    $phone === "" ||
    $course === "" ||
    $age === "" ||
    $gender === "" ||
    $address === ""
) {
    echo json_encode([
        "status" => 400,
        "message" => "All student fields are required"
    ]);
    exit;
}

// Check duplicate email
$check = $conn->prepare(
    "SELECT id FROM students WHERE email = ?"
);
$check->bind_param("s", $email);
$check->execute();

$result = $check->get_result();

if ($result->num_rows > 0) {
    echo json_encode([
        "status" => 400,
        "message" => "Student email already exists"
    ]);
    exit;
}

// Image upload
$profileImage = null;

if (isset($_FILES["profile_image"]) && $_FILES["profile_image"]["error"] === 0) {

    $uploadDir = "../uploads/";

    $fileName = time() . "_" . basename($_FILES["profile_image"]["name"]);

    $targetPath = $uploadDir . $fileName;

    if (move_uploaded_file($_FILES["profile_image"]["tmp_name"], $targetPath)) {
        $profileImage = $fileName;
    }
}

// Insert student
$stmt = $conn->prepare(
    "INSERT INTO students
    (name, email, phone, course, age, gender, address, profile_image)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)"
);

$stmt->bind_param(
    "ssssisss",
    $name,
    $email,
    $phone,
    $course,
    $age,
    $gender,
    $address,
    $profileImage
);

if ($stmt->execute()) {

    echo json_encode([
        "status" => 201,
        "message" => "Student created successfully",
        "data" => [
            "id" => $stmt->insert_id,
            "name" => $name,
            "email" => $email,
            "phone" => $phone,
            "course" => $course,
            "age" => $age,
            "gender" => $gender,
            "address" => $address,
            "profile_image" => $profileImage
        ]
    ]);

} else {

    echo json_encode([
        "status" => 500,
        "message" => "Failed to create student"
    ]);
}

$stmt->close();
$check->close();
$conn->close();

?>