<?php
session_start();
header("Content-Type: application/json");

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

$conn = new mysqli("localhost:3307", "webuser", "1234", "grocery_store");

if ($conn->connect_error) {
    echo json_encode(["success" => false, "error" => "DB connection failed"]);
    exit;
}

$data = json_decode(file_get_contents("php://input"), true);

$fullName = $data['fullName'] ?? null;
$email = $data['email'] ?? null;
$password = $data['password'] ?? null;
$phoneNum = $data['phoneNum'] ?? null;
$address = $data['address'] ?? null;

if (!$fullName || !$email || !$password || !$phoneNum || !$address) {
    echo json_encode(["success" => false, "error" => "All fields required"]);
    exit;
}

// Check for existing user
$check = $conn->prepare("SELECT userID FROM users WHERE email = ?");
$check->bind_param("s", $email);
$check->execute();
$checkResult = $check->get_result();

if ($checkResult->num_rows > 0) {
    echo json_encode(["success" => false, "error" => "Email already in use"]);
    exit;
}

$stmt = $conn->prepare("INSERT INTO users (fullName, email, password, phoneNum, address) VALUES (?, ?, ?, ?, ?)");
$stmt->bind_param("sssss", $fullName, $email, $password, $phoneNum, $address);

if ($stmt->execute()) {
    echo json_encode(["success" => true]);
} else {
    echo json_encode(["success" => false, "error" => "Insert failed"]);
}

$stmt->close();
$conn->close();
?>