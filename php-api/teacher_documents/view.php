<?php

require_once "../config/db.php";

if (!isset($_GET["id"]) || !is_numeric($_GET["id"])) {
    die("Invalid document ID.");
}

$id = (int) $_GET["id"];

$stmt = $conn->prepare("
    SELECT file_path
    FROM teacher_documents
    WHERE id = ?
    LIMIT 1
");

$stmt->bind_param("i", $id);
$stmt->execute();

$result = $stmt->get_result();

if ($result->num_rows === 0) {
    die("Document not found.");
}

$document = $result->fetch_assoc();

$filePath = $document["file_path"];

/*
|--------------------------------------------------------------------------
| Build URL
|--------------------------------------------------------------------------
| view.php is inside:
| /student-management-api/teacher_documents/
|
| The database stores:
| teacher_documents/uploads/filename.png
*/

$apiBasePath = dirname(dirname($_SERVER["SCRIPT_NAME"]));

$fileUrl = $apiBasePath . "/" . ltrim($filePath, "/");

header("Location: " . $fileUrl);
exit;

?>