<?php
require __DIR__ . '/../config.php';
$id = filter_input(INPUT_GET, 'id', FILTER_VALIDATE_INT);
if (!$id) json_response(['error' => 'Invalid item ID.'], 400);
$stmt = $pdo->prepare('SELECT * FROM items WHERE id=?');
$stmt->execute([$id]);
$item = $stmt->fetch();
if (!$item) json_response(['error' => 'Item not found.'], 404);
json_response(['item' => $item]);
