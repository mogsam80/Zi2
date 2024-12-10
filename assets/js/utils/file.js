/**
 * File: file.js
 * Utility functions for file handling
 */

const FileUtils = {
    // تبدیل DataURL به File
    dataURLtoFile: (dataurl, filename) => {
        const arr = dataurl.split(',');
        const mime = arr[0].match(/:(.*?);/)[1];
        const bstr = atob(arr[1]);
        let n = bstr.length;
        const u8arr = new Uint8Array(n);
        while(n--) {
            u8arr[n] = bstr.charCodeAt(n);
        }
        return new File([u8arr], filename, {type: mime});
    },

    // بررسی نوع فایل
    isValidImageType: (file) => {
        const validTypes = ['image/jpeg', 'image/png', 'image/gif'];
        return file && validTypes.includes(file.type);
    },

    // بررسی سایز فایل
    isValidFileSize: (file, maxSize = 10 * 1024 * 1024) => {
        return file && file.size <= maxSize;
    }
};

export default FileUtils;