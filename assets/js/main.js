/**
* File: assets/js/main.js
* Main JavaScript entry point
*/

document.addEventListener('DOMContentLoaded', function() {
    // متغیرهای سراسری
    let cropper = null;
    let originalImage = null;
    let originalImageType = '';
 
    // المان‌های DOM
    const dropZone = document.getElementById('dropZone');
    const fileInput = document.getElementById('fileInput');
    const previewSection = document.getElementById('previewSection');
    const previewImage = document.getElementById('previewImage');
    const cropBtn = document.getElementById('cropBtn');
    const uploadBtn = document.getElementById('uploadBtn');
    const cancelBtn = document.getElementById('cancelBtn');
    const uploadResult = document.getElementById('uploadResult');
    const fileUrl = document.getElementById('fileUrl');
    const uploadedImage = document.getElementById('uploadedImage');
 
    // بررسی وجود المان‌ها
    console.log('DOM Elements:', {
        dropZone: !!dropZone,
        fileInput: !!fileInput,
        previewSection: !!previewSection,
        previewImage: !!previewImage
    });
 
    // رویدادهای Drag & Drop
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        dropZone.addEventListener(eventName, preventDefaults, false);
    });
 
    function preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
    }
 
    dropZone.addEventListener('drop', handleDrop, false);
    dropZone.addEventListener('click', () => fileInput.click());
    fileInput.addEventListener('change', handleFileSelect);
 
    function handleDrop(e) {
        const dt = e.dataTransfer;
        handleFiles(dt.files);
    }
 
    function handleFileSelect(e) {
        handleFiles(e.target.files);
    }
 
    function handleFiles(files) {
        console.log('Files:', files);
        if (files.length > 0) {
            const file = files[0];
            if (file.type.startsWith('image/')) {
                originalImageType = file.type;
                const reader = new FileReader();
                reader.onload = function(e) {
                    console.log('File loaded');
                    originalImage = e.target.result;
                    showPreview(e.target.result);
                }
                reader.readAsDataURL(file);
            }
        }
    }
 
    function showPreview(src) {
        console.log('Showing preview:', src.substring(0, 50) + '...');
        previewImage.src = src;
        dropZone.classList.add('d-none');
        previewSection.classList.remove('d-none');
        uploadResult.classList.add('d-none');
        console.log('Preview visibility:', !previewSection.classList.contains('d-none'));
    }
 
    function hidePreview() {
        previewSection.classList.add('d-none');
        dropZone.classList.remove('d-none');
        fileInput.value = '';
        if (cropper) {
            cropper.destroy();
            cropper = null;
        }
    }
 
    function showUploadResult(result) {
        // مخفی کردن بخش پیش‌نمایش
        previewSection.classList.add('d-none');
        
        // ساخت URL کامل
        const baseUrl = window.location.origin + window.location.pathname;
        // به جای مسیر مستقیم فایل، از view.php استفاده می‌کنیم
        const viewUrl = baseUrl.replace('index.php', '') + 'view.php?id=' + result.file.id;
               // نمایش نتیجه
               fileUrl.value = viewUrl;
               uploadedImage.src = baseUrl.replace('index.php', '') + result.file.path;
               uploadResult.classList.remove('d-none');
           }
 
    function copyToClipboard() {
        const fileUrl = document.getElementById('fileUrl');
        fileUrl.select();
        document.execCommand('copy');
        
        // نمایش پیام موفقیت
        const copyBtn = document.getElementById('copyUrlBtn');
        const originalText = copyBtn.innerHTML;
        copyBtn.innerHTML = '<i class="bi bi-check2"></i> کپی شد!';
        copyBtn.classList.remove('btn-secondary');
        copyBtn.classList.add('btn-success');
        
        setTimeout(() => {
            copyBtn.innerHTML = originalText;
            copyBtn.classList.remove('btn-success');
            copyBtn.classList.add('btn-secondary');
        }, 2000);
    }
 
    // دکمه کراپ
    if (cropBtn) {
        cropBtn.addEventListener('click', () => {
            console.log('Crop button clicked');
            const cropModal = new bootstrap.Modal(document.getElementById('cropModal'));
            const cropImage = document.getElementById('cropImage');
            cropImage.src = previewImage.src;
            
            cropModal.show();
            
            if (cropper) {
                cropper.destroy();
            }
            
            cropper = new Cropper(cropImage, {
                aspectRatio: NaN,
                viewMode: 1,
                dragMode: 'move',
                autoCropArea: 1,
                restore: false,
                modal: true,
                guides: true,
                highlight: true,
                cropBoxMovable: true,
                cropBoxResizable: true,
                toggleDragModeOnDblclick: true,
                rotatable: true
            });
        });
    }
 
    // دکمه‌های چرخش
    document.getElementById('rotateLeft')?.addEventListener('click', () => {
        if (cropper) cropper.rotate(-90);
    });
 
    document.getElementById('rotateRight')?.addEventListener('click', () => {
        if (cropper) cropper.rotate(90);
    });
 
    // ذخیره کراپ
    document.getElementById('cropSaveBtn')?.addEventListener('click', () => {
        console.log('Save crop clicked');
        if (cropper) {
            const croppedCanvas = cropper.getCroppedCanvas({
                maxWidth: 4096,
                maxHeight: 4096,
                fillColor: '#fff'
            });
 
            previewImage.src = croppedCanvas.toDataURL(originalImageType);
            bootstrap.Modal.getInstance(document.getElementById('cropModal')).hide();
            cropper.destroy();
            cropper = null;
        }
    });
 
    // دکمه کنسل
    if (cancelBtn) {
        cancelBtn.addEventListener('click', () => {
            console.log('Cancel clicked');
            hidePreview();
        });
    }
 
    // دکمه آپلود
    if (uploadBtn) {
        uploadBtn.addEventListener('click', async () => {
            try {
                console.log('Upload started');
                const formData = new FormData();
                const blob = await fetch(previewImage.src).then(r => r.blob());
                formData.append('image', blob, 'image.' + originalImageType.split('/')[1]);
 
                uploadBtn.disabled = true;
                uploadBtn.innerHTML = 'در حال آپلود...';
 
                const response = await fetch('api/v1/upload.php', {
                    method: 'POST',
                    body: formData
                });
 
                const result = await response.json();
 
                if (result.success) {
                    console.log('Upload success:', result);
                    showUploadResult(result);
                } else {
                    throw new Error(result.error || 'خطا در آپلود فایل');
                }
 
            } catch (error) {
                console.error('Upload error:', error);
                alert('خطا در آپلود فایل: ' + error.message);
            } finally {
                uploadBtn.disabled = false;
                uploadBtn.innerHTML = 'آپلود';
            }
        });
    }
 
    // اضافه کردن کلاس‌های hover
    ['dragenter', 'dragover'].forEach(eventName => {
        dropZone.addEventListener(eventName, highlight, false);
    });
 
    ['dragleave', 'drop'].forEach(eventName => {
        dropZone.addEventListener(eventName, unhighlight, false);
    });
 
    function highlight(e) {
        dropZone.classList.add('border-primary');
    }
 
    function unhighlight(e) {
        dropZone.classList.remove('border-primary');
    }
 
    // کپی به کلیپبورد
    window.copyToClipboard = copyToClipboard;
 });