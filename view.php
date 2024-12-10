<?php
/**
 * File: view.php
 * Image viewer with custom frame
 */

// دریافت شناسه تصویر از URL
$imageId = $_GET['id'] ?? '';

// اگر شناسه خالی بود، نمایش خطا
if (empty($imageId)) {
    header('Location: index.php');
    exit;
}

// مسیر تصویر
$imagePath = 'upld/img/' . $imageId . '.*';
$files = glob($imagePath);

if (empty($files)) {
    header('Location: index.php');
    exit;
}

$imagePath = $files[0];
?>
<!DOCTYPE html>
<html lang="fa" dir="rtl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>مشاهده تصویر - آپلودر هوشمند</title>
    <link href="https://cdn.jsdelivr.net/gh/rastikerdar/vazirmatn@v33.003/Vazirmatn-font-face.css" rel="stylesheet">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.rtl.min.css" rel="stylesheet">
    <style>
        body {
            background-color: #1a1a1a;
            color: #fff;
            font-family: 'Vazirmatn', sans-serif;
        }
        
        .viewer-header {
            background-color: rgba(0, 0, 0, 0.8);
            backdrop-filter: blur(10px);
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            z-index: 1000;
            padding: 1rem;
        }

        .image-container {
            margin-top: 80px;
            margin-bottom: 80px;
            min-height: calc(100vh - 160px);
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .image-container img {
            max-width: 100%;
            max-height: calc(100vh - 160px);
            object-fit: contain;
        }

        .viewer-footer {
            background-color: rgba(0, 0, 0, 0.8);
            backdrop-filter: blur(10px);
            position: fixed;
            bottom: 0;
            left: 0;
            right: 0;
            z-index: 1000;
            padding: 1rem;
        }

        .viewer-controls {
            display: flex;
            gap: 1rem;
            justify-content: center;
        }

        .viewer-controls button {
            background: rgba(255, 255, 255, 0.1);
            border: none;
            color: white;
            padding: 0.5rem 1rem;
            border-radius: 5px;
            display: flex;
            align-items: center;
            gap: 0.5rem;
            transition: all 0.3s ease;
        }

        .viewer-controls button:hover {
            background: rgba(255, 255, 255, 0.2);
        }
    </style>
</head>
<body>
    <!-- هدر -->
    <header class="viewer-header">
        <div class="container">
            <div class="d-flex justify-content-between align-items-center">
                <div class="d-flex align-items-center gap-3">
                    <img src="assets/img/logo.svg" alt="لوگو" width="32" height="32">
                    <h1 class="h5 mb-0">آپلودر هوشمند تصویر</h1>
                </div>
                <div>
                    <a href="index.php" class="btn btn-sm btn-outline-light">بازگشت به صفحه اصلی</a>
                </div>
            </div>
        </div>
    </header>

    <!-- تصویر -->
    <div class="image-container">
        <img src="<?php echo $imagePath; ?>" alt="تصویر">
    </div>

    <!-- فوتر -->
    <footer class="viewer-footer">
        <div class="container">
            <div class="viewer-controls">
                <button onclick="downloadImage()">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                        <polyline points="7 10 12 15 17 10"/>
                        <line x1="12" y1="15" x2="12" y2="3"/>
                    </svg>
                    دانلود تصویر
                </button>
                <button onclick="shareImage()">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <circle cx="18" cy="5" r="3"/>
                        <circle cx="6" cy="12" r="3"/>
                        <circle cx="18" cy="19" r="3"/>
                        <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/>
                        <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
                    </svg>
                    اشتراک‌گذاری
                </button>
            </div>
        </div>
    </footer>

    <script>
        // دانلود تصویر
        function downloadImage() {
            const a = document.createElement('a');
            a.href = '<?php echo $imagePath; ?>';
            a.download = '<?php echo basename($imagePath); ?>';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
        }

        // اشتراک‌گذاری
        async function shareImage() {
            if (navigator.share) {
                try {
                    await navigator.share({
                        title: 'اشتراک‌گذاری تصویر',
                        url: window.location.href
                    });
                } catch (err) {
                    console.error('Error sharing:', err);
                }
            } else {
                // کپی لینک در کلیپبورد
                navigator.clipboard.writeText(window.location.href);
                alert('لینک تصویر در کلیپبورد کپی شد!');
            }
        }
    </script>
</body>
</html>