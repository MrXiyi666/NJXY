<?php
header('Content-Type: text/html; charset=utf-8');

$name = $_POST['name'];
$data = $_POST['data'];

$filePath = __DIR__ . '/' . $name . '.rmmzsave';

// FILE_USE_INCLUDE_PATH可选，LOCK_EX加文件锁防止并发写入错乱
$res = file_put_contents($filePath, $data, LOCK_EX);
if ($res === false) {
    echo 'no';
}