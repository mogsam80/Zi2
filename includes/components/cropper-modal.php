<?php
/**
 * File: cropper-modal.php
 * Image cropper modal component
 */
?>
<div class="modal fade" id="cropModal" tabindex="-1" data-bs-backdrop="static">
    <div class="modal-dialog modal-lg">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title">برش تصویر</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <div class="modal-body">
                <div class="img-container">
                    <img id="cropImage" src="">
                </div>
                <div class="crop-controls">
                    <button class="btn btn-sm btn-secondary" id="rotateLeft">چرخش به چپ</button>
                    <button class="btn btn-sm btn-secondary" id="rotateRight">چرخش به راست</button>
                </div>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">انصراف</button>
                <button type="button" class="btn btn-primary" id="cropSaveBtn">اعمال برش</button>
            </div>
        </div>
    </div>
</div>