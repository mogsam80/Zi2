/**
 * File: validation.js
 * Validation utilities
 */

const ValidationUtils = {
    // اعتبارسنجی ورودی‌ها
    validateImage: (file) => {
        const maxSize = 10 * 1024 * 1024; // 10MB
        const validTypes = ['image/jpeg', 'image/png', 'image/gif'];
        
        const errors = [];
        
        if (!file) {
            errors.push('لطفاً یک تصویر انتخاب کنید');
        } else {
            if (!validTypes.includes(file.type)) {
                errors.push('فرمت فایل نامعتبر است. لطفاً از فرمت‌های JPG، PNG یا GIF استفاده کنید');
            }
            if (file.size > maxSize) {
                errors.push('حجم فایل نباید بیشتر از 10 مگابایت باشد');
            }
        }
        
        return {
            isValid: errors.length === 0,
            errors
        };
    },

    showError: (message) => {
        // نمایش خطا به کاربر
        alert(message);
    }
};

export default ValidationUtils;