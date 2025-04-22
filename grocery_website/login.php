<?php
session_start();

$conn = new mysqli("localhost:3307", "webuser", "1234", "grocery_store");

if ($conn->connect_error) {
    echo json_encode(["success" => false, "error" => "Database connection failed"]);
    exit;
}

$data = json_decode(file_get_contents("php://input"), true);

file_put_contents("debug_log.txt", print_r($data, true));

$email = $data['email'] ?? null;
$password = $data['password'] ?? null;

if (!$email || !$password) {
    echo json_encode(["success" => false, "error" => "Missing email or password"]);
    exit;
}

// Also fetch userID now
$stmt = $conn->prepare("SELECT userID, fullName, password FROM users WHERE email = ?");
$stmt->bind_param("s", $email);
$stmt->execute();
$result = $stmt->get_result();

if ($row = $result->fetch_assoc()) {
    if ($password === $row['password']) { // NOTE: for production, use password_hash & verify!
        $_SESSION["userID"] = $row['userID']; // Store in session
        echo json_encode(["success" => true, "userID" => $row["userID"], "fullName" => $row["fullName"]]);
    } else {
        echo json_encode(["success" => false, "error" => "Invalid password"]);
    }
} else {
    echo json_encode(["success" => false, "error" => "User not found"]);
}

$stmt->close();
$conn->close();
?>
