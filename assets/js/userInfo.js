/**
 * File: userInfo.js
 * Path: /project/assets/js/userInfo.js
 * Service for collecting detailed user information
 */

class UserInfoCollector {
    constructor() {
        this.info = {};
    }

    async collectAll() {
        this.collectBrowserInfo();
        this.collectDeviceInfo();
        await this.collectLocationInfo();
        this.collectNetworkInfo();
        this.collectBatteryInfo();
        return this.info;
    }

    collectBrowserInfo() {
        const ua = navigator.userAgent;
        const browserInfo = {
            userAgent: ua,
            appName: navigator.appName,
            appVersion: navigator.appVersion,
            platform: navigator.platform,
            cookieEnabled: navigator.cookieEnabled,
            language: navigator.language,
            languages: navigator.languages,
            onLine: navigator.onLine,
            doNotTrack: navigator.doNotTrack,
            hardwareConcurrency: navigator.hardwareConcurrency,
            maxTouchPoints: navigator.maxTouchPoints,
            vendor: navigator.vendor,
            plugins: Array.from(navigator.plugins).map(p => ({
                name: p.name,
                description: p.description
            })),
            mimeTypes: Array.from(navigator.mimeTypes).map(m => ({
                type: m.type,
                description: m.description
            }))
        };
        this.info.browser = browserInfo;
    }

    collectDeviceInfo() {
        const deviceInfo = {
            screenResolution: {
                width: screen.width,
                height: screen.height,
                availWidth: screen.availWidth,
                availHeight: screen.availHeight,
                colorDepth: screen.colorDepth,
                pixelDepth: screen.pixelDepth,
                orientation: screen.orientation?.type
            },
            deviceMemory: navigator.deviceMemory,
            devicePixelRatio: window.devicePixelRatio,
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
            timezoneOffset: new Date().getTimezoneOffset(),
            touchSupport: {
                maxTouchPoints: navigator.maxTouchPoints,
                touchEvent: 'ontouchstart' in window,
                touchPoints: navigator.maxTouchPoints
            },
            rendering: {
                webgl: this.getWebGLInfo(),
                canvas: this.getCanvasFingerprint()
            }
        };
        this.info.device = deviceInfo;
    }

    async collectLocationInfo() {
        try {
            // Try getting precise location
            const position = await this.getCurrentPosition();
            this.info.location = {
                coords: {
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                    accuracy: position.coords.accuracy,
                    altitude: position.coords.altitude,
                    heading: position.coords.heading,
                    speed: position.coords.speed
                },
                timestamp: position.timestamp
            };
        } catch (error) {
            // Fallback to IP-based location
            try {
                const response = await fetch('https://ipapi.co/json/');
                const data = await response.json();
                this.info.location = {
                    ip: data.ip,
                    city: data.city,
                    region: data.region,
                    country: data.country_name,
                    postal: data.postal,
                    latitude: data.latitude,
                    longitude: data.longitude,
                    timezone: data.timezone,
                    org: data.org
                };
            } catch (e) {
                this.info.location = { error: 'Location information unavailable' };
            }
        }
    }

    collectNetworkInfo() {
        const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
        if (connection) {
            this.info.network = {
                effectiveType: connection.effectiveType,
                downlink: connection.downlink,
                rtt: connection.rtt,
                saveData: connection.saveData,
                type: connection.type
            };
        }
    }

    async collectBatteryInfo() {
        if ('getBattery' in navigator) {
            try {
                const battery = await navigator.getBattery();
                this.info.battery = {
                    charging: battery.charging,
                    level: battery.level,
                    chargingTime: battery.chargingTime,
                    dischargingTime: battery.dischargingTime
                };
            } catch (e) {
                this.info.battery = { error: 'Battery information unavailable' };
            }
        }
    }

    getWebGLInfo() {
        const canvas = document.createElement('canvas');
        const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
        if (!gl) return null;

        return {
            vendor: gl.getParameter(gl.VENDOR),
            renderer: gl.getParameter(gl.RENDERER),
            version: gl.getParameter(gl.VERSION),
            shadingLanguageVersion: gl.getParameter(gl.SHADING_LANGUAGE_VERSION),
            extensions: gl.getSupportedExtensions()
        };
    }

    getCanvasFingerprint() {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = 200;
        canvas.height = 200;

        // Add text with different styles
        ctx.textBaseline = "top";
        ctx.font = "14px 'Arial'";
        ctx.textBaseline = "alphabetic";
        ctx.fillStyle = "#f60";
        ctx.fillRect(125,1,62,20);
        ctx.fillStyle = "#069";
        ctx.fillText("abcdefghijklmnopqrstuvwxyz", 2, 15);
        ctx.fillStyle = "rgba(102, 204, 0, 0.7)";
        ctx.fillText("abcdefghijklmnopqrstuvwxyz", 4, 17);

        return canvas.toDataURL();
    }

    getCurrentPosition() {
        return new Promise((resolve, reject) => {
            if (!navigator.geolocation) {
                reject(new Error('Geolocation not supported'));
                return;
            }

            navigator.geolocation.getCurrentPosition(resolve, reject, {
                enableHighAccuracy: true,
                timeout: 5000,
                maximumAge: 0
            });
        });
    }
}

// نحوه استفاده در main.js
async function collectUserInfo() {
    const collector = new UserInfoCollector();
    const userInfo = await collector.collectAll();
    return userInfo;
}