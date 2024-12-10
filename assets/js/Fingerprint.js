/**
 * File: Fingerprint.js
 * Path: /project/assets/js/Fingerprint.js
 * Service for generating unique user fingerprint
 */

class Fingerprint {
    constructor(userInfo) {
        this.userInfo = userInfo;
    }

    async generate() {
        try {
            // جمع‌آوری داده‌های کلیدی برای فینگرپرینت
            const components = [
                // اطلاعات مرورگر و سیستم‌عامل
                this.userInfo.browser.userAgent,
                this.userInfo.browser.language,
                this.userInfo.browser.platform,
                
                // اطلاعات سخت‌افزاری
                this.userInfo.device.screenResolution.width,
                this.userInfo.device.screenResolution.height,
                this.userInfo.device.deviceMemory,
                this.userInfo.device.hardwareConcurrency,
                
                // اطلاعات رندرینگ
                this.userInfo.device.rendering.canvas,
                JSON.stringify(this.userInfo.device.rendering.webgl),
                
                // اطلاعات منطقه زمانی
                this.userInfo.device.timezone,
                
                // اطلاعات شبکه (اگر در دسترس باشد)
                this.userInfo.network?.effectiveType,
                this.userInfo.network?.type,
                
                // اطلاعات فونت‌ها و پلاگین‌ها
                JSON.stringify(this.userInfo.browser.plugins),
                JSON.stringify(this.userInfo.browser.mimeTypes),
                
                // موقعیت تقریبی (فقط شهر و کشور برای ثبات بیشتر)
                this.userInfo.location?.city,
                this.userInfo.location?.country
            ].join('|');

            // تبدیل به هش با استفاده از SHA-256
            const hashBuffer = await crypto.subtle.digest(
                'SHA-256',
                new TextEncoder().encode(components)
            );

            // تبدیل به رشته hex
            const hashArray = Array.from(new Uint8Array(hashBuffer));
            const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

            // ساخت یک شناسه کوتاه‌تر (16 کاراکتر)
            const shortId = hashHex.substring(0, 16).toUpperCase();

            return {
                fullHash: hashHex,
                shortId: shortId,
                type: 'guest',
                createdAt: new Date().toISOString(),
                components: {
                    browser: {
                        name: this.getBrowserName(),
                        version: this.getBrowserVersion(),
                        platform: this.userInfo.browser.platform
                    },
                    screen: {
                        width: this.userInfo.device.screenResolution.width,
                        height: this.userInfo.device.screenResolution.height
                    },
                    location: {
                        city: this.userInfo.location?.city,
                        country: this.userInfo.location?.country
                    }
                }
            };
        } catch (error) {
            console.error('Error generating fingerprint:', error);
            // تولید یک ID تصادفی در صورت خطا
            return {
                shortId: 'G-' + Math.random().toString(36).substr(2, 10).toUpperCase(),
                type: 'guest',
                createdAt: new Date().toISOString(),
                error: true
            };
        }
    }

    getBrowserName() {
        const ua = this.userInfo.browser.userAgent;
        if (ua.includes('Firefox')) return 'Firefox';
        if (ua.includes('Chrome')) return 'Chrome';
        if (ua.includes('Safari')) return 'Safari';
        if (ua.includes('Edge')) return 'Edge';
        if (ua.includes('Opera')) return 'Opera';
        return 'Unknown';
    }

    getBrowserVersion() {
        const ua = this.userInfo.browser.userAgent;
        const matches = ua.match(/(?:firefox|chrome|safari|opera|edge|msie)\s*\/?\s*(\d+)/i);
        return matches ? matches[1] : 'Unknown';
    }
}