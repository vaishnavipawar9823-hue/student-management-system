<?php

require_once "../middleware/auth.php";

echo json_encode([
    "status" => 200,
    "message" => "Authentication successful",
    "data" => [
        "id" => $_SESSION["user_id"],
        "name" => $_SESSION["user_name"],
        "email" => $_SESSION["user_email"],
        "role" => $_SESSION["user_role"]
    ]
]);

?>