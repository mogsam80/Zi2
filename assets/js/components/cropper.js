/**
* File: assets/js/components/cropper.js
* Image cropping component with advanced features
*/

cropper = new Cropper(cropImage, {
    aspectRatio: NaN,
    viewMode: 1,
    dragMode: 'move',
    autoCropArea: 0.8,
    restore: false,
    modal: true,
    guides: true,
    highlight: true,
    cropBoxMovable: true,
    cropBoxResizable: true,
    toggleDragModeOnDblclick: true,
    rotatable: true,
    responsive: true,
    minContainerWidth: 200,
    minContainerHeight: 200,
    minCropBoxWidth: 100,
    minCropBoxHeight: 100
});
 
    initializeElements() {
        this.elements = {
            cropModal: document.getElementById('cropModal'),
            cropImage: document.getElementById('cropImage'),
            previewImage: document.getElementById('previewImage'),
            cropBtn: document.getElementById('cropBtn'),
            cropSaveBtn: document.getElementById('cropSaveBtn'),
            rotateLeftBtn: document.getElementById('rotateLeft'),
            rotateRightBtn: document.getElementById('rotateRight'),
            aspectRatioButtons: document.querySelectorAll('[data-aspect-ratio]'),
            zoomInBtn: document.getElementById('zoomIn'),
            zoomOutBtn: document.getElementById('zoomOut'),
            resetBtn: document.getElementById('resetCrop')
        };
    }
 
    initializeEvents() {
        this.elements.cropBtn?.addEventListener('click', this.initCropper.bind(this));
        this.elements.cropSaveBtn?.addEventListener('click', this.saveCrop.bind(this));
        this.elements.rotateLeftBtn?.addEventListener('click', () => this.rotate(-90));
        this.elements.rotateRightBtn?.addEventListener('click', () => this.rotate(90));
        this.elements.zoomInBtn?.addEventListener('click', () => this.zoom(0.1));
        this.elements.zoomOutBtn?.addEventListener('click', () => this.zoom(-0.1));
        this.elements.resetBtn?.addEventListener('click', () => this.reset());
 
        // Aspect ratio controls
        this.elements.aspectRatioButtons?.forEach(btn => {
            btn.addEventListener('click', () => {
                const ratio = btn.dataset.aspectRatio;
                this.setAspectRatio(ratio === 'free' ? NaN : parseFloat(ratio));
            });
        });
 
        // Modal events
        this.elements.cropModal?.addEventListener('hidden.bs.modal', () => {
            if (this.cropper) {
                this.cropper.destroy();
                this.cropper = null;
            }
        });
    }
 
    initCropper() {
        const modal = new bootstrap.Modal(this.elements.cropModal);
        this.elements.cropImage.src = this.elements.previewImage.src;
        
        modal.show();
 
        this.elements.cropModal.addEventListener('shown.bs.modal', () => {
            if (this.cropper) {
                this.cropper.destroy();
            }
            
            this.cropper = new Cropper(this.elements.cropImage, this.cropperOptions);
        }, { once: true });
    }
 
    setAspectRatio(ratio) {
        if (this.cropper) {
            this.cropper.setAspectRatio(ratio);
        }
    }
 
    rotate(degree) {
        if (this.cropper) {
            this.cropper.rotate(degree);
        }
    }
 
    zoom(ratio) {
        if (this.cropper) {
            this.cropper.zoom(ratio);
        }
    }
 
    reset() {
        if (this.cropper) {
            this.cropper.reset();
        }
    }
 
    async saveCrop() {
        if (!this.cropper) return;
 
        try {
            const canvas = this.cropper.getCroppedCanvas({
                maxWidth: 4096,
                maxHeight: 4096,
                fillColor: '#fff',
                imageSmoothingEnabled: true,
                imageSmoothingQuality: 'high'
            });
 
            const croppedImage = await this.getCroppedImage(canvas);
            this.elements.previewImage.src = croppedImage;
            
            bootstrap.Modal.getInstance(this.elements.cropModal).hide();
        } catch (error) {
            console.error('Error saving cropped image:', error);
            alert('خطا در ذخیره تصویر برش خورده');
        }
    }
 
    getCroppedImage(canvas) {
        return new Promise((resolve, reject) => {
            try {
                const image = canvas.toDataURL('image/png', 1.0);
                resolve(image);
            } catch (error) {
                reject(error);
            }
        });
    }
 }
 
 export default ImageCropper;