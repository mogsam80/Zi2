<?php
/**
 * File: config.php
 * Application configuration
 */

// تنظیمات محیط
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// Debug mode
define('DEBUG_MODE', true);

// Path configurations
define('BASE_PATH', dirname(__DIR__));
define('ASSETS_PATH', BASE_PATH . '/assets');
define('INCLUDES_PATH', BASE_PATH . '/includes');
define('COMPONENTS_PATH', INCLUDES_PATH . '/components');
define('API_PATH', BASE_PATH . '/api/v1');
define('UPLOADS_PATH', BASE_PATH . '/upld');
define('IMG_PATH', UPLOADS_PATH . '/img');
define('ORIGINAL_PATH', UPLOADS_PATH . '/original');

// Upload settings
define('MAX_FILE_SIZE', 10 * 1024 * 1024); // 10MB
define('ALLOWED_TYPES', [
    'image/jpeg',
    'image/png',
    'image/gif'
]);
define('ALLOWED_EXTENSIONS', ['jpg', 'jpeg', 'png', 'gif']);

// Image processing settings
define('MAX_IMAGE_WIDTH', 4096);
define('MAX_IMAGE_HEIGHT', 4096);
define('IMAGE_QUALITY', 90);
define('THUMBNAIL_WIDTH', 300);
define('THUMBNAIL_HEIGHT', 300);

// Security settings
define('SECURE_TOKEN_LENGTH', 32);
define('SESSION_TIMEOUT', 3600); // 1 hour

// Response settings
define('JSON_RESPONSE_HEADERS', [
    'Content-Type: application/json',
    'Cache-Control: no-cache, must-revalidate'
]);