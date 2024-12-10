<?php
/**
* File: api/v1/upload.php
* Image upload API endpoint
*/

// تنظیم مسیر پایه
define('ROOT_PATH', dirname(dirname(dirname(__FILE__))));

// فراخوانی فایل‌های مورد نیاز
require_once ROOT_PATH . '/includes/config.php';
require_once ROOT_PATH . '/includes/functions.php';

try {
   // بررسی متد درخواست
   if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
       throw new Exception('Invalid request method');
   }

   // بررسی وجود فایل
   if (!isset($_FILES['image'])) {
       throw new Exception('No file uploaded');
   }

   // تنظیم مسیر‌های آپلود
   $uploadDir = ROOT_PATH . '/upld/img/';
   $originalDir = ROOT_PATH . '/upld/original/';

   // بررسی و ایجاد پوشه‌ها
   foreach ([$uploadDir, $originalDir] as $dir) {
       if (!file_exists($dir)) {
           if (!mkdir($dir, 0777, true)) {
               throw new Exception("Failed to create directory: $dir");
           }
       }
       if (!is_writable($dir)) {
           throw new Exception("Directory not writable: $dir");
       }
   }

   // اعتبارسنجی
   $errors = validateUploadedFile($_FILES['image']);
   if (!empty($errors)) {
       jsonResponse([
           'success' => false,
           'errors' => $errors
       ], 400);
   }

   // بررسی امنیتی
   if (!isSecureFile($_FILES['image'])) {
       throw new Exception('Invalid file type');
   }

   // ایجاد نام یکتا
   $uniqueId = generateUniqueId();
   $extension = strtolower(pathinfo($_FILES['image']['name'], PATHINFO_EXTENSION));
   $fileName = $uniqueId . '.' . $extension;

   // مسیر فایل‌ها
   $targetPath = $uploadDir . $fileName;
   $originalPath = $originalDir . 'orig_' . $fileName;

   // آپلود فایل
   if (!move_uploaded_file($_FILES['image']['tmp_name'], $targetPath)) {
       throw new Exception('Failed to move uploaded file');
   }

   // ذخیره نسخه اصلی
   if (!copy($targetPath, $originalPath)) {
       unlink($targetPath);
       throw new Exception('Failed to save original file');
   }

   // پاسخ موفقیت
  // در بخش پاسخ موفقیت
// پاسخ موفقیت
echo json_encode([
    'success' => true,
    'file' => [
        'id' => $uniqueId,
        'name' => $fileName,
        'path' => 'upld/img/' . $fileName,
        'type' => $_FILES['image']['type']
    ]
]);

} catch (Exception $e) {
   error_log('Upload error: ' . $e->getMessage());
   jsonResponse([
       'success' => false,
       'error' => $e->getMessage()
   ], 500);
}