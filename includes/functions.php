<?php
/**
 * File: includes/functions.php
 * Helper functions
 */

/**
 * File Handling Functions
 */
function validateUploadedFile($file) {
    if (!isset($file) || $file['error'] !== UPLOAD_ERR_OK) {
        return ['خطا در آپلود فایل'];
    }

    $errors = [];
    $finfo = finfo_open(FILEINFO_MIME_TYPE);
    $mimeType = finfo_file($finfo, $file['tmp_name']);
    finfo_close($finfo);

    if (!in_array($mimeType, ALLOWED_TYPES)) {
        $errors[] = 'فرمت فایل نامعتبر است';
    }

    if ($file['size'] > MAX_FILE_SIZE) {
        $errors[] = sprintf('حجم فایل باید کمتر از %s مگابایت باشد', MAX_FILE_SIZE / (1024 * 1024));
    }

    return $errors;
}

function generateUniqueId($length = 4) {
    $chars = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ';
    do {
        $id = substr(str_shuffle($chars), 0, $length);
    } while (isIdExists($id));
    return $id;
}

function isIdExists($id) {
    return file_exists(IMG_PATH . '/' . $id . '.*');
}

/**
 * Directory Management
 */
function ensureDirectoriesExist() {
    $directories = [
        ASSETS_PATH . '/css/components',
        ASSETS_PATH . '/js/components',
        ASSETS_PATH . '/js/utils',
        ASSETS_PATH . '/img',
        INCLUDES_PATH . '/components',
        API_PATH,
        IMG_PATH,
        ORIGINAL_PATH
    ];
    
    foreach ($directories as $dir) {
        if (!file_exists($dir) && !mkdir($dir, 0777, true)) {
            throw new Exception("Failed to create directory: $dir");
        }
        if (!is_writable($dir)) {
            throw new Exception("Directory not writable: $dir");
        }
    }
}

/**
 * Security Functions
 */
function sanitizeFileName($fileName) {
    $fileName = preg_replace("/[^a-zA-Z0-9.]/", "", $fileName);
    return strtolower($fileName);
}

function isSecureFile($file) {
    $finfo = finfo_open(FILEINFO_MIME_TYPE);
    $mimeType = finfo_file($finfo, $file['tmp_name']);
    finfo_close($finfo);
    
    return in_array($mimeType, ALLOWED_TYPES);
}

/**
 * Response Handlers
 */
function jsonResponse($data, $statusCode = 200) {
    http_response_code($statusCode);
    foreach (JSON_RESPONSE_HEADERS as $header) {
        header($header);
    }
    echo json_encode($data);
    exit;
}

function errorResponse($message, $statusCode = 400) {
    jsonResponse([
        'success' => false,
        'error' => $message,
        'debug' => DEBUG_MODE ? debug_backtrace() : null
    ], $statusCode);
}

/**
 * Image Processing
 */
function createThumbnail($sourcePath, $targetPath, $width = THUMBNAIL_WIDTH, $height = THUMBNAIL_HEIGHT) {
    list($origWidth, $origHeight) = getimagesize($sourcePath);
    $ratio = min($width / $origWidth, $height / $origHeight);
    $newWidth = $origWidth * $ratio;
    $newHeight = $origHeight * $ratio;
    
    $thumb = imagecreatetruecolor($newWidth, $newHeight);
    $source = imagecreatefromstring(file_get_contents($sourcePath));
    
    imagecopyresampled($thumb, $source, 0, 0, 0, 0, $newWidth, $newHeight, $origWidth, $origHeight);
    imagejpeg($thumb, $targetPath, IMAGE_QUALITY);
    
    imagedestroy($thumb);
    imagedestroy($source);
}