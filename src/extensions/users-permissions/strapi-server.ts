export default (plugin) => {
  // Add custom social login routes
  plugin.routes["content-api"].push({
    method: "POST",
    path: "/auth/social-login",
    handler: "plugin::users-permissions.user.socialLogin",
    config: {
      auth: false,
    },
  });

  return plugin;
};
