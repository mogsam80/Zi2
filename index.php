
<!DOCTYPE html>
<html lang="fa" dir="rtl">
<head>
   <meta charset="UTF-8">
   <meta name="viewport" content="width=device-width, initial-scale=1.0">
   <title>آپلودر هوشمند تصویر</title>
   
   <!-- PWA Meta Tags -->
   <meta name="theme-color" content="#e0e5ec">
   <meta name="apple-mobile-web-app-capable" content="yes">
   <meta name="apple-mobile-web-app-status-bar-style" content="black">
   <link rel="manifest" href="manifest.json">
   
      <!-- استایل‌ها -->
   <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.rtl.min.css" rel="stylesheet">
   </head>


<?php

require_once 'includes/config.php';
require_once 'includes/functions.php';

try {
    // Check required directories
    $directories = [
        INCLUDES_PATH,
        COMPONENTS_PATH,
        ASSETS_PATH . '/css',
        ASSETS_PATH . '/js',
        ASSETS_PATH . '/img',
        UPLOADS_PATH . '/img',
        UPLOADS_PATH . '/original'
    ];

    foreach ($directories as $dir) {
        if (!file_exists($dir)) {
            mkdir($dir, 0777, true);
        }
    }

    // Check required files
    $requiredFiles = [
        COMPONENTS_PATH . '/header.php',
        COMPONENTS_PATH . '/cropper-modal.php',
        COMPONENTS_PATH . '/footer.php',
        API_PATH . '/upload.php'
    ];

    foreach ($requiredFiles as $file) {
        if (!file_exists($file)) {
            throw new Exception("Required file missing: $file");
        }
    }
    
    ob_start();
    require_once COMPONENTS_PATH . '/header.php';
    
    echo '<div class="container mt-4">';
    echo '<div class="row justify-content-center">';
    echo '<div class="col-md-8">';
    require_once COMPONENTS_PATH . '/upload-form.php';
    echo '</div>';
    echo '</div>';
    echo '</div>';
    
    require_once COMPONENTS_PATH . '/cropper-modal.php';
    require_once COMPONENTS_PATH . '/footer.php';
    ob_end_flush();
    
} catch (Exception $e) {
    ob_end_clean();
    error_log("Error: " . $e->getMessage());
    ?>
   

  <!-- اسکریپت‌ها -->
  <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"></script>
   <script src="https://cdnjs.cloudflare.com/ajax/libs/cropperjs/1.5.13/cropper.min.js"></script>
   <script type="module" src="assets/js/main.js"></script>

   <!-- Service Worker -->
   <script>
       if ('serviceWorker' in navigator) {
           navigator.serviceWorker.register('service-worker.js');
       }
   </script>
</body>
</html>
<?php
}