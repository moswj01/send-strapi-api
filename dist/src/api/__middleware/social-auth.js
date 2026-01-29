"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = () => {
    return async (ctx, next) => {
        if (ctx.request.method === 'POST' && ctx.request.path === '/api/auth/social-login') {
            // Handle social login here
            const { provider, accessToken } = ctx.request.body;
            console.log('Social login request:', provider);
            // Call the custom auth controller
            const socialAuth = require('../../../extensions/users-permissions/controllers/custom-auth').default;
            return await socialAuth.socialLogin(ctx);
        }
        await next();
    };
};
