<?php
header('Content-Type: text/html; charset=utf-8');

$name = $_POST['name'];

$filePath = __DIR__ . '/' . $name . '.rmmzsave';

// 判断文件是否存在
if (!file_exists($filePath)) {
    echo 'no';
    exit;
}

// 读取文件内容
$content = file_get_contents($filePath);
if ($content === false) {
    echo 'no';
} else {
    // 输出存档内容给前端
    echo $content;
}