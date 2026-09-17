<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");

date_default_timezone_set('Asia/Shanghai');

$msTimestamp = (int)(microtime(true) * 1000);
$date = new DateTime();

$data = [
    "currentStamp" => $msTimestamp,
    "year" => (int)$date->format('Y'),
    "month" => (int)$date->format('n'),
    "day" => (int)$date->format('j'),
    "hour" => (int)$date->format('G'),
    "minute" => (int)$date->format('i'),
    "second" => (int)$date->format('s'),
    "ms" => $msTimestamp % 1000
];

echo json_encode($data);