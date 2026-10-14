<?php
require __DIR__ . '/../config.php';
$q = trim($_GET['q'] ?? '');
$type = trim($_GET['type'] ?? 'All');
$category = trim($_GET['category'] ?? 'All');
$sql = "SELECT id,item_name,item_type,category,description,location,item_date,status,created_at FROM items WHERE status='Open' AND (item_name LIKE :q OR description LIKE :q OR location LIKE :q)";
$params = [':q' => '%' . $q . '%'];
if (in_array($type, ['Lost', 'Found'], true)) { $sql .= ' AND item_type=:type'; $params[':type'] = $type; }
if ($category !== 'All') { $sql .= ' AND category=:category'; $params[':category'] = $category; }
$sql .= ' ORDER BY created_at DESC';
$stmt = $pdo->prepare($sql); $stmt->execute($params);
$items = $stmt->fetchAll();
$categories = $pdo->query('SELECT DISTINCT category FROM items ORDER BY category')->fetchAll(PDO::FETCH_COLUMN);
json_response(['items' => $items, 'categories' => $categories]);
