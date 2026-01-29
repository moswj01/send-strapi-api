"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = {
    social_login: {
        method: 'POST',
        path: '/auth/social-login',
        handler: 'plugin::users-permissions.auth.socialLogin',
        config: {
            auth: false,
            policies: [],
        },
    },
};
