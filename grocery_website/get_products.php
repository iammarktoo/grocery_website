<?php
header('Content-Type: application/json');
$conn = new mysqli("localhost:3307", "webuser", "1234", "grocery_store");

if ($conn->connect_error) {
    http_response_code(500);
    echo json_encode(["error" => "Database connection failed"]);
    exit;
}

$subcategory = $_GET['subcategory'] ?? 'all';
$search = $_GET['search'] ?? '';

$products = [];

if ($subcategory !== 'all' && !empty($search)) {
    // Filter by subcategory AND search
    $sql = "SELECT * FROM products WHERE subcategoryID = ? AND (productName LIKE ? OR description LIKE ?)";
    $stmt = $conn->prepare($sql);
    $like = '%' . $search . '%';
    $stmt->bind_param("iss", $subcategory, $like, $like);
} elseif ($subcategory !== 'all') {
    // Filter by subcategory only
    $sql = "SELECT * FROM products WHERE subcategoryID = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("i", $subcategory);
} elseif (!empty($search)) {
    // Filter by search only
    $sql = "SELECT * FROM products WHERE productName LIKE ? OR description LIKE ?";
    $stmt = $conn->prepare($sql);
    $like = '%' . $search . '%';
    $stmt->bind_param("ss", $like, $like);
} else {
    // No filters, get all products
    $sql = "SELECT * FROM products";
    $result = $conn->query($sql);
    while ($row = $result->fetch_assoc()) {
        $products[] = $row;
    }
    echo json_encode($products);
    $conn->close();
    exit;
}

$stmt->execute();
$result = $stmt->get_result();
while ($row = $result->fetch_assoc()) {
    $products[] = $row;
}

echo json_encode($products);
$conn->close();
