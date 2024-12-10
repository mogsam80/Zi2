<?php
$uploadDir = 'upld/img/';
echo "Directory exists: " . (file_exists($uploadDir) ? 'Yes' : 'No') . "<br>";
echo "Directory is writable: " . (is_writable($uploadDir) ? 'Yes' : 'No') . "<br>";
echo "Directory permissions: " . decoct(fileperms($uploadDir)) . "<br>";
echo "PHP upload_max_filesize: " . ini_get('upload_max_filesize') . "<br>";
echo "PHP post_max_size: " . ini_get('post_max_size') . "<br>";