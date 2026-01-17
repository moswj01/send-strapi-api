'use strict';

var restrictAccess = (async (ctx, next)=>{
    const pluginStore = strapi.store({
        type: 'plugin',
        name: 'documentation'
    });
    const config = await pluginStore.get({
        key: 'config'
    });
    if (!config.restrictedAccess) {
        return next();
    }
    if (!ctx.session || !ctx.session.documentation || !ctx.session.documentation.logged) {
        const querystring = ctx.querystring ? `?${ctx.querystring}` : '';
        return ctx.redirect(`${strapi.config.server.url}/documentation/login${querystring}`);
    }
    // Execute the action.
    return next();
});

module.exports = restrictAccess;
//# sourceMappingURL=restrict-access.js.map
