<?php
header("Content-Type: application/json");
$conn = new mysqli("localhost:3307", "webuser", "1234", "grocery_store");

$input = json_decode(file_get_contents("php://input"), true);
$productIDs = $input["productIDs"] ?? [];

if (empty($productIDs)) {
    echo json_encode([]);
    exit;
}

$placeholders = implode(",", array_fill(0, count($productIDs), "?"));
$types = str_repeat("i", count($productIDs));

$stmt = $conn->prepare("SELECT productID, productName, price, imageURL FROM products WHERE productID IN ($placeholders)");
$stmt->bind_param($types, ...$productIDs);
$stmt->execute();

$result = $stmt->get_result();
$products = [];

while ($row = $result->fetch_assoc()) {
    $products[] = $row;
}

echo json_encode($products);
$conn->close();
