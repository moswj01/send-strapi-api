export default (plugin) => {
  // Add the social login controller method
  plugin.controllers.auth.socialLogin = async (ctx) => {
    const customAuthController = require('./controllers/custom-auth').default;
    return customAuthController.socialLogin(ctx);
  };

  return plugin;
};
