-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1:3307
-- Generation Time: Apr 16, 2025 at 08:31 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `grocery_store`
--

-- --------------------------------------------------------

--
-- Table structure for table `categories`
--

CREATE TABLE `categories` (
  `categoryID` int(11) NOT NULL,
  `categoryName` varchar(100) NOT NULL,
  `description` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `categories`
--

INSERT INTO `categories` (`categoryID`, `categoryName`, `description`) VALUES
(1, 'vegetables', 'Vegetables'),
(2, 'fruits', 'Fruits'),
(3, 'dairy', 'Dairy'),
(4, 'beverages', 'Beverages');

-- --------------------------------------------------------

--
-- Table structure for table `orderdetails`
--

CREATE TABLE `orderdetails` (
  `orderDetailID` int(11) NOT NULL,
  `orderID` int(11) NOT NULL,
  `productID` int(11) NOT NULL,
  `quantity` int(11) NOT NULL,
  `price` decimal(10,0) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `orderdetails`
--

INSERT INTO `orderdetails` (`orderDetailID`, `orderID`, `productID`, `quantity`, `price`) VALUES
(13, 6, 1, 1, 3),
(14, 6, 2, 1, 2),
(15, 7, 1, 2, 3),
(16, 7, 2, 1, 2),
(17, 8, 4, 1, 4),
(18, 9, 4, 1, 4),
(19, 10, 4, 1, 4);

-- --------------------------------------------------------

--
-- Table structure for table `orders`
--

CREATE TABLE `orders` (
  `orderID` int(11) NOT NULL,
  `userID` int(11) NOT NULL,
  `totalPrice` decimal(10,0) NOT NULL,
  `orderStatus` enum('pending','shipped','delivered','cancelled') NOT NULL DEFAULT 'pending',
  `placedAt` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `orders`
--

INSERT INTO `orders` (`orderID`, `userID`, `totalPrice`, `orderStatus`, `placedAt`) VALUES
(6, 2, 5, 'pending', '2025-04-16 02:48:21'),
(7, 1, 8, 'pending', '2025-04-16 05:01:49'),
(8, 1, 4, 'pending', '2025-04-16 05:35:57'),
(9, 1, 4, 'pending', '2025-04-16 05:42:29'),
(10, 1, 4, 'pending', '2025-04-16 06:00:51');

-- --------------------------------------------------------

--
-- Table structure for table `products`
--

CREATE TABLE `products` (
  `productID` int(11) NOT NULL,
  `productName` varchar(255) NOT NULL,
  `description` text NOT NULL,
  `price` decimal(10,0) NOT NULL,
  `stock` int(11) NOT NULL,
  `imageURL` varchar(255) NOT NULL,
  `createdAt` timestamp NOT NULL DEFAULT current_timestamp(),
  `subcategoryID` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `products`
--

INSERT INTO `products` (`productID`, `productName`, `description`, `price`, `stock`, `imageURL`, `createdAt`, `subcategoryID`) VALUES
(1, 'Broccoli', 'Fresh green broccoli, 500g', 3, 96, 'images/broccoli.jpg', '2025-04-06 07:42:42', 3),
(2, 'Banana', 'Organic ripe bananas, per kg', 2, 147, 'images/banana.jpg', '2025-04-05 13:00:00', 6),
(3, 'Milk', 'Full cream milk, 2L', 3, 80, 'images/milk.jpg', '2025-04-05 13:00:00', 7),
(4, 'Orange Juice', 'Freshly squeezed orange juice, 1L', 4, 57, 'images/orange_juice.jpg', '2025-04-05 13:00:00', 11),
(5, 'Cheddar Cheese', 'Aged cheddar cheese block, 250g', 6, 40, 'images/cheddar_cheese.jpg', '2025-04-05 13:00:00', 8),
(6, 'Apple', 'Crispy red apples, per kg', 2, 90, 'images/apple.jpg', '2025-04-05 13:00:00', 13),
(7, 'Spinach', 'Baby spinach leaves, 200g', 2, 70, 'images/spinach.jpg', '2025-04-05 13:00:00', 1),
(8, 'Coke', 'Coca-Cola soft drink, 1.25L', 2, 120, 'images/coke.jpg', '2025-04-05 13:00:00', 10),
(9, 'Strawberries', 'Fresh strawberries, 250g punnet', 4, 70, 'images/strawberries.jpg', '2025-04-05 13:00:00', 5),
(10, 'Carrots', 'Orange carrots, 1kg', 2, 85, 'images/carrots.jpg', '2025-04-05 13:00:00', 2),
(11, 'Greek Yogurt', 'Natural Greek yogurt, 500g tub', 4, 50, 'images/greek_yogurt.jpg', '2025-04-05 13:00:00', 9),
(12, 'Iced Tea', 'Peach-flavored iced tea, 1.5L bottle', 3, 65, 'images/iced_tea.jpg', '2025-04-05 13:00:00', 12),
(13, 'Eggs', 'Free range eggs, dozen pack', 5, 100, 'images/eggs.jpg', '2025-04-05 13:00:00', 14),
(14, 'Grapes', 'Seedless red grapes, per kg', 4, 60, 'images/grapes.jpg', '2025-04-05 13:00:00', 5),
(15, 'Lettuce', 'Crisp iceberg lettuce', 2, 40, 'images/lettuce.jpg', '2025-04-05 13:00:00', 1),
(16, 'Orange', 'Juicy navel oranges, per kg', 3, 75, 'images/oranges.jpg', '2025-04-05 13:00:00', 4),
(17, 'Butter', 'Salted dairy butter, 250g block', 4, 30, 'images/butter.jpg', '2025-04-05 13:00:00', 9),
(18, 'Sparkling Water', 'Lime-flavored sparkling water, 1L', 2, 90, 'images/sparkling_water.jpg', '2025-04-05 13:00:00', 10),
(19, 'Mango', 'Ripe Australian mangoes, each', 3, 50, 'images/mango.jpg', '2025-04-05 13:00:00', 6),
(20, 'Cucumber', 'Green cucumbers, per piece', 1, 55, 'images/cucumber.jpg', '2025-04-05 13:00:00', 1),
(21, 'Chocolate Milk', 'Chilled chocolate milk, 600ml', 3, 40, 'images/chocolate_milk.jpg', '2025-04-05 13:00:00', 7),
(22, 'Parmesan Cheese', 'Grated parmesan cheese, 100g', 5, 25, 'images/parmesan.jpg', '2025-04-05 13:00:00', 8);

-- --------------------------------------------------------

--
-- Table structure for table `subcategories`
--

CREATE TABLE `subcategories` (
  `subcategoryID` int(11) NOT NULL,
  `subcategoryName` text NOT NULL,
  `description` varchar(255) NOT NULL,
  `categoryID` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `subcategories`
--

INSERT INTO `subcategories` (`subcategoryID`, `subcategoryName`, `description`, `categoryID`) VALUES
(1, 'Leafy Greens', 'Vegetables like spinach, kale, and lettuce', 1),
(2, 'Root Vegetables', 'Vegetables like carrots, beets, and radishes', 1),
(3, 'Cruciferous Vegetables', 'Vegetables like broccoli, cauliflower, and cabbage', 1),
(4, 'Citrus', 'Fruits like oranges, lemons, and limes', 2),
(5, 'Berries', 'Fruits like strawberries, blueberries, and raspberries', 2),
(6, 'Tropical Fruits', 'Fruits like mangoes, pineapples, and bananas', 2),
(7, 'Milk', 'Cow, goat, and plant-based milks', 3),
(8, 'Cheese', 'Hard and soft cheeses', 3),
(9, 'Yogurt & Cream', 'Yogurts, sour cream, and heavy cream', 3),
(10, 'Soft Drinks', 'Sodas and fizzy drinks', 4),
(11, 'Juices', 'Fruit and vegetable juices', 4),
(12, 'Tea & Coffee', 'Packaged tea and coffee products', 4),
(13, 'Tree Fruit', 'Fruits that grow on trees such as apples and pears', 2),
(14, 'Eggs', 'Eggs', 3);

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `userID` int(11) NOT NULL,
  `fullName` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `phoneNum` varchar(20) NOT NULL,
  `address` varchar(255) NOT NULL,
  `createdAt` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`userID`, `fullName`, `email`, `password`, `phoneNum`, `address`, `createdAt`) VALUES
(1, 'Mark Lee', 'marklee8941@gmail.com', 'Mark7375', '0466092790', '805/5 Waterways St', '2025-04-16 02:37:36'),
(2, 'Kevin Lee', 'kevinlee@gmail.com', '4567', '0412345678', '29 Archer St.', '2025-04-16 02:47:34');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `categories`
--
ALTER TABLE `categories`
  ADD PRIMARY KEY (`categoryID`),
  ADD UNIQUE KEY `categoryIndex` (`categoryName`);

--
-- Indexes for table `orderdetails`
--
ALTER TABLE `orderdetails`
  ADD PRIMARY KEY (`orderDetailID`),
  ADD KEY `orderID` (`orderID`),
  ADD KEY `productID` (`productID`);

--
-- Indexes for table `orders`
--
ALTER TABLE `orders`
  ADD PRIMARY KEY (`orderID`),
  ADD KEY `userID` (`userID`);

--
-- Indexes for table `products`
--
ALTER TABLE `products`
  ADD PRIMARY KEY (`productID`),
  ADD KEY `subcategoryID` (`subcategoryID`);

--
-- Indexes for table `subcategories`
--
ALTER TABLE `subcategories`
  ADD PRIMARY KEY (`subcategoryID`),
  ADD KEY `categoryID` (`categoryID`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`userID`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `orderdetails`
--
ALTER TABLE `orderdetails`
  MODIFY `orderDetailID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=20;

--
-- AUTO_INCREMENT for table `orders`
--
ALTER TABLE `orders`
  MODIFY `orderID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `subcategories`
--
ALTER TABLE `subcategories`
  MODIFY `subcategoryID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `userID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `orderdetails`
--
ALTER TABLE `orderdetails`
  ADD CONSTRAINT `orderdetails_ibfk_1` FOREIGN KEY (`orderID`) REFERENCES `orders` (`orderID`),
  ADD CONSTRAINT `orderdetails_ibfk_2` FOREIGN KEY (`productID`) REFERENCES `products` (`productID`);

--
-- Constraints for table `orders`
--
ALTER TABLE `orders`
  ADD CONSTRAINT `orders_ibfk_1` FOREIGN KEY (`userID`) REFERENCES `users` (`userID`) ON DELETE CASCADE;

--
-- Constraints for table `products`
--
ALTER TABLE `products`
  ADD CONSTRAINT `products_ibfk_1` FOREIGN KEY (`subcategoryID`) REFERENCES `subcategories` (`subcategoryID`);

--
-- Constraints for table `subcategories`
--
ALTER TABLE `subcategories`
  ADD CONSTRAINT `subcategories_ibfk_1` FOREIGN KEY (`categoryID`) REFERENCES `categories` (`categoryID`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
