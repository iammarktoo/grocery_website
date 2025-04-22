<?php
session_start();
$conn = new mysqli("localhost:3307", "webuser", "1234", "grocery_store");
if ($conn->connect_error) {
    echo json_encode(["success" => false, "error" => "Database connection failed"]);
    exit;
}
header('Content-Type: application/json');

$userID = $_SESSION['userID']; // Adjust based on your session setup

$sql = "SELECT 
        o.orderID, o.placedAt, o.totalPrice, o.orderStatus,
        od.productID, od.quantity, od.price AS itemPrice,
        p.productName
    FROM orders o
    JOIN orderdetails od ON o.orderID = od.orderID
    JOIN products p ON od.productID = p.productID
    WHERE o.userID = ?
    ORDER BY o.placedAt DESC";

$stmt = $conn->prepare($sql);
if (!$stmt) {
    echo json_encode(["error" => "SQL prepare failed: " . $conn->error]);
    exit;
}
$stmt->bind_param("i", $userID);
$stmt->execute();
$result = $stmt->get_result();

$orders = [];

while ($row = $result->fetch_assoc()) {
    $id = $row['orderID'];
    if (!isset($orders[$id])) {
        $orders[$id] = [
            "orderID" => $id,
            "placedAt" => $row['placedAt'],
            "orderStatus" => $row['orderStatus'],
            "totalPrice" => $row['totalPrice'],
            "items" => [],
        ];
    }

    $orders[$id]["items"][] = [
        "productName" => $row["productName"],
        "quantity" => $row["quantity"],
    ];
}

echo json_encode(array_values($orders)); // Reset keys for JSON array
