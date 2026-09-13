<?php

require_once "../middleware/auth.php";
require_once "../config/db.php";

header("Content-Type: application/json");

$id = $_POST["id"] ?? "";
$name = trim($_POST["name"] ?? "");
$email = trim($_POST["email"] ?? "");
$phone = trim($_POST["phone"] ?? "");
$course = trim($_POST["course"] ?? "");
$age = $_POST["age"] ?? "";
$gender = trim($_POST["gender"] ?? "");
$address = trim($_POST["address"] ?? "");

if (
    $id === "" ||
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
    "SELECT id FROM students WHERE email = ? AND id != ?"
);
$check->bind_param("si", $email, $id);
$check->execute();

$result = $check->get_result();

if ($result->num_rows > 0) {
    echo json_encode([
        "status" => 400,
        "message" => "Email already belongs to another student"
    ]);
    exit;
}

// Get current image
$currentImage = null;

$getImage = $conn->prepare(
    "SELECT profile_image FROM students WHERE id = ?"
);
$getImage->bind_param("i", $id);
$getImage->execute();

$imageResult = $getImage->get_result();

if ($imageResult->num_rows > 0) {
    $student = $imageResult->fetch_assoc();
    $currentImage = $student["profile_image"];
}

$getImage->close();

// Upload new image if selected
$profileImage = $currentImage;

if (
    isset($_FILES["profile_image"]) &&
    $_FILES["profile_image"]["error"] === 0
) {
    $uploadDir = "../uploads/";

    $fileName = time() . "_" . basename(
        $_FILES["profile_image"]["name"]
    );

    $targetPath = $uploadDir . $fileName;

    if (move_uploaded_file(
        $_FILES["profile_image"]["tmp_name"],
        $targetPath
    )) {
        $profileImage = $fileName;
    }
}

// Update student
$stmt = $conn->prepare(
    "UPDATE students
     SET name = ?,
         email = ?,
         phone = ?,
         course = ?,
         age = ?,
         gender = ?,
         address = ?,
         profile_image = ?
     WHERE id = ?"
);

$stmt->bind_param(
    "ssssisssi",
    $name,
    $email,
    $phone,
    $course,
    $age,
    $gender,
    $address,
    $profileImage,
    $id
);

if ($stmt->execute()) {

    echo json_encode([
        "status" => 200,
        "message" => "Student updated successfully",
        "data" => [
            "id" => $id,
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
        "message" => "Failed to update student"
    ]);
}

$stmt->close();
$check->close();
$conn->close();

?>