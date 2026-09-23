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

try {

    // -------------------------
    // CHECK TEACHER ID
    // -------------------------
    $teacher_id = $_POST["teacher_id"] ?? "";

    if ($teacher_id === "") {
        echo json_encode([
            "status" => 400,
            "message" => "Teacher ID is required."
        ]);
        exit();
    }

    // -------------------------
    // CHECK DOCUMENT NAME
    // -------------------------
    $document_name = trim($_POST["document_name"] ?? "");

    if ($document_name === "") {
        echo json_encode([
            "status" => 400,
            "message" => "Document name is required."
        ]);
        exit();
    }

    // -------------------------
    // CHECK FILE
    // -------------------------
    if (!isset($_FILES["document"])) {
        echo json_encode([
            "status" => 400,
            "message" => "No file was received by PHP."
        ]);
        exit();
    }

    $file = $_FILES["document"];

    if ($file["error"] !== UPLOAD_ERR_OK) {
        echo json_encode([
            "status" => 400,
            "message" => "File upload error code: " . $file["error"]
        ]);
        exit();
    }

    // -------------------------
    // FILE SIZE
    // -------------------------
    if ($file["size"] > 5 * 1024 * 1024) {
        echo json_encode([
            "status" => 400,
            "message" => "File size must be less than 5 MB."
        ]);
        exit();
    }

    // -------------------------
    // FILE EXTENSION
    // -------------------------
    $allowedExtensions = [
        "pdf",
        "jpg",
        "jpeg",
        "png",
        "doc",
        "docx"
    ];

    $originalName = $file["name"];

    $extension = strtolower(
        pathinfo($originalName, PATHINFO_EXTENSION)
    );

    if (!in_array($extension, $allowedExtensions)) {
        echo json_encode([
            "status" => 400,
            "message" => "Invalid file type."
        ]);
        exit();
    }

    // -------------------------
    // DOCUMENT TYPE
    // -------------------------
    $documentType = trim(
        $_POST["document_type"] ?? "Other"
    );

    // -------------------------
    // CHECK TEACHER
    // -------------------------
    $teacherCheck = $conn->prepare(
        "SELECT id FROM teachers WHERE id = ?"
    );

    if (!$teacherCheck) {
        throw new Exception(
            "Teacher query error: " . $conn->error
        );
    }

    $teacherCheck->bind_param(
        "i",
        $teacher_id
    );

    $teacherCheck->execute();

    $teacherResult =
        $teacherCheck->get_result();

    if ($teacherResult->num_rows === 0) {

        $teacherCheck->close();

        echo json_encode([
            "status" => 404,
            "message" => "Teacher not found."
        ]);

        exit();
    }

    $teacherCheck->close();

    // -------------------------
    // UPLOAD DIRECTORY
    // -------------------------
    $uploadDirectory =
        __DIR__ . DIRECTORY_SEPARATOR . "uploads" . DIRECTORY_SEPARATOR;

    if (!is_dir($uploadDirectory)) {

        if (!mkdir($uploadDirectory, 0777, true)) {
            throw new Exception(
                "Could not create uploads folder."
            );
        }
    }

    // -------------------------
    // CREATE FILE NAME
    // -------------------------
    $newFileName =
        "teacher_" .
        $teacher_id .
        "_" .
        time() .
        "_" .
        uniqid() .
        "." .
        $extension;

    $targetPath =
        $uploadDirectory .
        $newFileName;

    // -------------------------
    // MOVE FILE
    // -------------------------
    if (!move_uploaded_file(
        $file["tmp_name"],
        $targetPath
    )) {

        echo json_encode([
            "status" => 500,
            "message" =>
                "PHP received the file but could not save it to the uploads folder."
        ]);

        exit();
    }

    // -------------------------
    // DATABASE FILE PATH
    // -------------------------
    $filePath =
        "teacher_documents/uploads/" .
        $newFileName;

    // -------------------------
    // INSERT DATABASE RECORD
    // -------------------------
    $stmt = $conn->prepare("
        INSERT INTO teacher_documents
        (
            teacher_id,
            document_name,
            document_type,
            file_path
        )
        VALUES (?, ?, ?, ?)
    ");

    if (!$stmt) {

        if (file_exists($targetPath)) {
            unlink($targetPath);
        }

        throw new Exception(
            "Document query error: " . $conn->error
        );
    }

    $stmt->bind_param(
        "isss",
        $teacher_id,
        $document_name,
        $documentType,
        $filePath
    );

    if (!$stmt->execute()) {

        if (file_exists($targetPath)) {
            unlink($targetPath);
        }

        echo json_encode([
            "status" => 500,
            "message" =>
                "Database insert failed: " .
                $stmt->error
        ]);

        $stmt->close();
        $conn->close();

        exit();
    }

    // -------------------------
    // SUCCESS
    // -------------------------
    echo json_encode([
        "status" => 200,
        "message" => "Document uploaded successfully.",
        "data" => [
            "id" => $stmt->insert_id,
            "teacher_id" => $teacher_id,
            "document_name" => $document_name,
            "document_type" => $documentType,
            "file_path" => $filePath
        ]
    ]);

    $stmt->close();
    $conn->close();

} catch (Exception $e) {

    echo json_encode([
        "status" => 500,
        "message" => $e->getMessage()
    ]);
}
?>