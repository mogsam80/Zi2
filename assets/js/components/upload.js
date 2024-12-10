/**
* File: assets/js/components/upload.js
* Upload component functionality with drag & drop, preview, and validation
*/

import FileUtils from '../utils/file.js';
import ValidationUtils from '../utils/validation.js';

class UploadHandler {
   constructor() {
       this.initializeElements();
       this.initializeEvents();
       this.uploading = false;
   }

   initializeElements() {
       this.elements = {
           dropZone: document.getElementById('dropZone'),
           fileInput: document.getElementById('fileInput'),
           previewSection: document.getElementById('previewSection'),
           previewImage: document.getElementById('previewImage'),
           uploadBtn: document.getElementById('uploadBtn'),
           cancelBtn: document.getElementById('cancelBtn'),
           uploadProgress: document.getElementById('uploadProgress'),
           uploadInfo: document.getElementById('uploadInfo')
       };
   }

   initializeEvents() {
       // Drag & Drop events
       ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
           this.elements.dropZone.addEventListener(eventName, this.preventDefaults);
       });

       // Drag & Drop Highlighting
       ['dragenter', 'dragover'].forEach(eventName => {
           this.elements.dropZone.addEventListener(eventName, () => 
               this.elements.dropZone.classList.add('drag-over'));
       });

       ['dragleave', 'drop'].forEach(eventName => {
           this.elements.dropZone.addEventListener(eventName, () => 
               this.elements.dropZone.classList.remove('drag-over'));
       });

       // Main Events
       this.elements.dropZone.addEventListener('drop', this.handleDrop.bind(this));
       this.elements.dropZone.addEventListener('click', () => this.elements.fileInput.click());
       this.elements.fileInput.addEventListener('change', this.handleFileSelect.bind(this));
       this.elements.cancelBtn?.addEventListener('click', this.handleCancel.bind(this));
       this.elements.uploadBtn?.addEventListener('click', this.handleUpload.bind(this));
   }

   preventDefaults(e) {
       e.preventDefault();
       e.stopPropagation();
   }

   async handleFiles(files) {
       if (!files.length) return;

       const file = files[0];
       const validation = ValidationUtils.validateImage(file);
       
       if (!validation.isValid) {
           ValidationUtils.showError(validation.errors.join('\n'));
           return;
       }

       const reader = new FileReader();
       reader.onload = (e) => this.showPreview(e.target.result);
       reader.onerror = () => ValidationUtils.showError('خطا در خواندن فایل');
       reader.readAsDataURL(file);
   }

   showPreview(src) {
       this.elements.previewImage.src = src;
       this.elements.previewSection.classList.remove('d-none');
       this.elements.dropZone.classList.add('d-none');
       this.updateUploadInfo();
   }

   updateUploadInfo() {
       const file = this.elements.fileInput.files[0];
       if (file) {
           const size = FileUtils.formatSize(file.size);
           this.elements.uploadInfo.textContent = `${file.name} (${size})`;
       }
   }

   handleCancel() {
       if (this.uploading) return;
       
       this.elements.previewSection.classList.add('d-none');
       this.elements.dropZone.classList.remove('d-none');
       this.elements.fileInput.value = '';
       this.elements.uploadInfo.textContent = '';
       this.resetProgress();
   }

   handleDrop(e) {
       this.handleFiles(e.dataTransfer.files);
   }

   handleFileSelect(e) {
       this.handleFiles(e.target.files);
   }

   async handleUpload() {
       if (this.uploading) return;

       try {
           this.uploading = true;
           this.elements.uploadBtn.disabled = true;
           this.elements.uploadBtn.innerHTML = '<span class="spinner-border spinner-border-sm"></span> در حال آپلود...';
           
           await this.uploadFile();
           
           ValidationUtils.showSuccess('فایل با موفقیت آپلود شد');
           this.handleCancel();
       } catch (error) {
           ValidationUtils.showError(error.message);
       } finally {
           this.uploading = false;
           this.elements.uploadBtn.disabled = false;
           this.elements.uploadBtn.innerHTML = 'آپلود';
           this.resetProgress();
       }
   }

   async uploadFile() {
       const formData = new FormData();
       const file = await FileUtils.optimizeImage(this.elements.previewImage);
       formData.append('image', file);

       const xhr = new XMLHttpRequest();
       
       xhr.upload.addEventListener('progress', (e) => {
           if (e.lengthComputable) {
               const percent = (e.loaded / e.total) * 100;
               this.updateProgress(percent);
           }
       });

       return new Promise((resolve, reject) => {
           xhr.onload = () => resolve(JSON.parse(xhr.response));
           xhr.onerror = () => reject(new Error('خطا در آپلود فایل'));
           xhr.open('POST', 'api/upload.php');
           xhr.send(formData);
       });
   }

   updateProgress(percent) {
       this.elements.uploadProgress.classList.remove('d-none');
       this.elements.uploadProgress.querySelector('.progress-bar').style.width = `${percent}%`;
   }

   resetProgress() {
       this.elements.uploadProgress.classList.add('d-none');
       this.elements.uploadProgress.querySelector('.progress-bar').style.width = '0%';
   }
}

export default UploadHandler;