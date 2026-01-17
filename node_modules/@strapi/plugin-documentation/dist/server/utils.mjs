const getService = (name, { strapi } = {
    strapi: global.strapi
})=>{
    return strapi.plugin('documentation').service(name);
};

export { getService };
//# sourceMappingURL=utils.mjs.map
