"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const custom_auth_1 = __importDefault(require("./controllers/custom-auth"));
exports.default = (plugin) => {
    const originalAuthController = plugin.controllers.auth;
    plugin.controllers.auth = (ctx) => {
        const base = typeof originalAuthController === 'function'
            ? originalAuthController(ctx)
            : originalAuthController;
        return {
            ...base,
            socialLogin: custom_auth_1.default.socialLogin,
        };
    };
    plugin.routes['content-api'].routes.push({
        method: 'POST',
        path: '/auth/social-login',
        handler: 'auth.socialLogin',
        config: { auth: false }
    });
    return plugin;
};
