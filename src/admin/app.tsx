import type { StrapiApp } from '@strapi/strapi/admin';
import './extensions/custom-styles.css';

export default {
    config: {
        // Replace the Strapi logo in the auth pages
        auth: {
            logo: '/admin/custom-logo.png',
        },
        // Customize the login page
        head: {
            favicon: '/admin/favicon.png',
        },
        // Extend the translations
        locales: ['th'],
        translations: {
            en: {
                'Auth.form.welcome.title': 'Welcome to SENd',
                'Auth.form.welcome.subtitle': 'เข้าสู่ระบบจัดการ',
            },
            th: {
                'Auth.form.welcome.title': 'ยินดีต้อนรับสู่ระบบ SENd',
                'Auth.form.welcome.subtitle': 'เข้าสู่ระบบจัดการ',
                'Auth.form.button.login': 'เข้าสู่ระบบ',
                'Auth.form.email.label': 'อีเมล',
                'Auth.form.email.placeholder': 'กรอกอีเมล',
                'Auth.form.password.label': 'รหัสผ่าน',
                'Auth.form.password.placeholder': 'กรอกรหัสผ่าน',
                'Auth.form.rememberMe.label': 'จดจำฉัน',
                'Auth.link.forgot-password': 'ลืมรหัสผ่าน?',
            },
        },
        // Custom theme settings
        theme: {
            light: {
                colors: {
                    primary100: '#e6f7ff',
                    primary200: '#bae7ff',
                    primary500: '#FF1818',
                    primary600: '#D90909',
                    primary700: '#B30000',
                    danger700: '#d32f2f',
                    buttonPrimary500: '#C60707',
                    buttonPrimary600: '#D90909',
                }, typography: {
                    fontFamily: "'Kanit', sans-serif",
                },
            },
            dark: {
                colors: {
                    primary100: '#111d2c',
                    primary200: '#5F1E1E',
                    primary500: '#FF1818',
                    primary600: '#FF4040',
                    primary700: '#FF6969',
                    danger700: '#ff4d4f',
                    buttonPrimary500: '#FF1818',
                    buttonPrimary600: '#FF4040',
                },
                typography: {
                    fontFamily: "'Kanit', sans-serif",
                },
            },
        },
        // Disable tutorials
        tutorials: false,
        // Disable notifications
        notifications: {
            releases: false,
        },
    },
    bootstrap(app: StrapiApp) {
        console.log('Admin panel customized');
    },
};
