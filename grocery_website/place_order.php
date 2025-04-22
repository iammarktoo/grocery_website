<?php
session_start();

ini_set('display_errors', 1);
error_reporting(E_ALL);

header("Content-Type: application/json; charset=UTF-8");

$conn = new mysqli("localhost:3307", "webuser", "1234", "grocery_store");

if ($conn->connect_error) {
    echo json_encode(["success" => false, "error" => "Database connection failed"]);
    exit;
}

$data = json_decode(file_get_contents("php://input"), true);

// Debugging: Log the received data
file_put_contents("debug_log.txt", print_r($data, true));

if (!isset($data['userID']) || $data['userID'] <= 0 || empty($data['cartItems'])) {
    echo json_encode(["success" => false, "error" => "Missing userID or cart items"]);
    exit;
}

$userID = $data['userID'];
$cartItems = $data['cartItems'];

// Calculate total price
$totalPrice = 0;

foreach ($cartItems as $item) {
    $productID = $item['productID'];
    $quantity = $item['quantity'];

    // Fetch product price
    $priceQuery = $conn->prepare("SELECT price FROM products WHERE productID = ?");
    $priceQuery->bind_param("i", $productID);
    $priceQuery->execute();
    $priceResult = $priceQuery->get_result();

    if ($priceRow = $priceResult->fetch_assoc()) {
        $price = $priceRow["price"];
        $totalPrice += $price * $quantity;
    } else {
        echo json_encode(["success" => false, "error" => "Product not found: $productID"]);
        exit;
    }
}

// Insert order into the database
$insertOrder = $conn->prepare("INSERT INTO orders (userID, totalPrice, orderStatus, placedAt) VALUES (?, ?, 'pending', NOW())");
$insertOrder->bind_param("id", $userID, $totalPrice);

if (!$insertOrder->execute()) {
    echo json_encode(["success" => false, "error" => "Failed to place order: " . $insertOrder->error]);
    exit;
}

$orderID = $conn->insert_id;

// Process each cart item
foreach ($cartItems as $item) {
    $productID = $item['productID'];
    $quantity = $item['quantity'];

    // Fetch product details
    $priceQuery = $conn->prepare("SELECT price, stock FROM products WHERE productID = ?");
    $priceQuery->bind_param("i", $productID);
    $priceQuery->execute();
    $priceResult = $priceQuery->get_result();

    if ($priceRow = $priceResult->fetch_assoc()) {
        $price = $priceRow["price"];
        $stock = $priceRow["stock"];

        // Check stock availability
        if ($stock < $quantity) {
            echo json_encode(["success" => false, "error" => "Insufficient stock for product ID: $productID"]);
            exit;
        }

        // Insert into order details
        $insertDetails = $conn->prepare("INSERT INTO orderdetails (orderID, productID, quantity, price) VALUES (?, ?, ?, ?)");
        $insertDetails->bind_param("iiid", $orderID, $productID, $quantity, $price);
        $insertDetails->execute();

        // Update stock
        $updateStock = $conn->prepare("UPDATE products SET stock = stock - ? WHERE productID = ?");
        $updateStock->bind_param("ii", $quantity, $productID);
        $updateStock->execute();
    }
}

echo json_encode(["success" => true, "message" => "Order placed successfully", "orderID" => $orderID]);
$conn->close();
?>
