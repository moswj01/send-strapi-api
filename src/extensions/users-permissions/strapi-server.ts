import customAuth from './controllers/custom-auth';

export default (plugin) => {
  const originalAuthController = plugin.controllers.auth;

  plugin.controllers.auth = (ctx) => {
    const base = typeof originalAuthController === 'function' 
      ? originalAuthController(ctx) 
      : originalAuthController;
    
    return {
      ...base,
      socialLogin: customAuth.socialLogin,
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
