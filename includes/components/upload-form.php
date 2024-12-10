<?php
/**
* File: includes/components/upload-form.php
* Upload form component with preview and controls
*/
?>
<div class="card shadow-sm">
   <div class="card-header bg-primary text-white d-flex justify-content-between align-items-center">
       <h4 class="mb-0">آپلود و پردازش تصویر</h4>
       <span class="upload-info" id="uploadInfo"></span>
   </div>
   <div class="card-body">
       <!-- Upload Area -->
       <div class="upload-area" id="dropZone">
           <div class="upload-icon">
               <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                   <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                   <polyline points="17 8 12 3 7 8"/>
                   <line x1="12" y1="3" x2="12" y2="15"/>
               </svg>
           </div>
           <h5>تصویر خود را اینجا رها کنید</h5>
           <p class="text-muted">یا برای انتخاب کلیک کنید</p>
           <input type="file" id="fileInput" class="d-none" accept="<?php echo implode(',', ALLOWED_TYPES); ?>">
           <div class="upload-limits text-muted small mt-2">
               <div>حداکثر حجم مجاز: <?php echo MAX_FILE_SIZE / (1024 * 1024); ?>MB</div>
               <div>فرمت‌های مجاز: JPG، PNG، GIF</div>
           </div>
       </div>

       <!-- پیش‌نمایش -->
       <div class="preview-container d-none" id="previewSection">
           <img src="" alt="پیش‌نمایش" id="previewImage" class="preview-image">
           <div class="mt-3 d-flex justify-content-center gap-2">
               <button class="btn btn-warning" id="cropBtn">
                   برش تصویر
               </button>
               <button class="btn btn-primary" id="uploadBtn">
                   آپلود
               </button>
               <button class="btn btn-danger" id="cancelBtn">
                   انصراف
               </button>
           </div>
           <div class="progress mt-3 d-none" id="uploadProgress">
               <div class="progress-bar" role="progressbar" style="width: 0%"></div>
           </div>
       </div>

       <!-- نتیجه آپلود -->
       <div id="uploadResult" class="upload-result d-none">
           <div class="card border-success">
               <div class="card-header bg-success text-white d-flex justify-content-between align-items-center">
                   <h5 class="mb-0">آپلود موفقیت‌آمیز</h5>
                   <button class="btn btn-sm btn-outline-light" onclick="window.location.reload()">
                       آپلود تصویر جدید
                   </button>
               </div>
               <div class="card-body">
                   <div class="mb-3">
                       <label class="form-label">لینک دانلود تصویر:</label>
                       <div class="input-group">
                           <input type="text" id="fileUrl" class="form-control" readonly>
                           <button class="btn btn-secondary" id="copyUrlBtn" onclick="copyToClipboard()">
                               <i class="bi bi-clipboard"></i>
                               کپی لینک
                           </button>
                       </div>
                       <small class="text-muted mt-1 d-block">
                           این لینک را می‌توانید برای دیگران ارسال کنید.
                       </small>
                   </div>
                   <div class="text-center mt-3">
                       <img id="uploadedImage" src="" alt="تصویر آپلود شده" class="img-fluid rounded shadow-sm" style="max-height: 200px;">
                   </div>
               </div>
           </div>
       </div>
   </div>
</div>