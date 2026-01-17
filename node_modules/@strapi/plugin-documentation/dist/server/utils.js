'use strict';

const getService = (name, { strapi } = {
    strapi: global.strapi
})=>{
    return strapi.plugin('documentation').service(name);
};

exports.getService = getService;
//# sourceMappingURL=utils.js.map
