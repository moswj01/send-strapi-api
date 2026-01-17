'use strict';

var path = require('path');
var bcrypt = require('bcryptjs');
var fs = require('fs-extra');
var _ = require('lodash');
var koaStatic = require('koa-static');
var utils = require('@strapi/utils');
var utils$1 = require('../utils.js');

function _interopNamespaceDefaultOnly (e) { return Object.freeze({ __proto__: null, default: e }); }

const validation = {
    validateSettings: utils.validateYupSchema(utils.yup.object().shape({
        restrictedAccess: utils.yup.boolean(),
        password: utils.yup.string().min(8).matches(/[a-z]/, '${path} must contain at least one lowercase character').matches(/[A-Z]/, '${path} must contain at least one uppercase character').matches(/\d/, '${path} must contain at least one number').when('restrictedAccess', (value, initSchema)=>{
            return value ? initSchema.required('password is required') : initSchema;
        })
    }))
};
var documentation = {
    async getInfos (ctx) {
        try {
            const docService = utils$1.getService('documentation');
            const docVersions = docService.getDocumentationVersions();
            const documentationAccess = await docService.getDocumentationAccess();
            ctx.send({
                docVersions,
                currentVersion: docService.getDocumentationVersion(),
                prefix: '/documentation',
                documentationAccess
            });
        } catch (err) {
            strapi.log.error(err);
            ctx.badRequest();
        }
    },
    async index (ctx, next) {
        try {
            /**
       * We don't expose the specs using koa-static or something else due to security reasons.
       * That's why, we need to read the file localy and send the specs through it when we serve the Swagger UI.
       */ const { major, minor, patch } = ctx.params;
            const version = major && minor && patch ? `${major}.${minor}.${patch}` : utils$1.getService('documentation').getDocumentationVersion();
            const openAPISpecsPath = path.join(strapi.dirs.app.extensions, 'documentation', 'documentation', version, 'full_documentation.json');
            try {
                const documentation = fs.readFileSync(openAPISpecsPath, 'utf8');
                const layout = (await Promise.resolve().then(function () { return /*#__PURE__*/_interopNamespaceDefaultOnly(require('../public/index.html.js')); })).default;
                const filledLayout = _.template(layout)({
                    backendUrl: strapi.config.server.url,
                    spec: JSON.stringify(JSON.parse(documentation))
                });
                try {
                    const layoutPath = path.resolve(strapi.dirs.app.extensions, 'documentation', 'public', 'index.html');
                    await fs.ensureFile(layoutPath);
                    await fs.writeFile(layoutPath, filledLayout);
                    // Serve the file.
                    ctx.url = path.basename(`${ctx.url}/index.html`);
                    try {
                        const staticFolder = path.resolve(strapi.dirs.app.extensions, 'documentation', 'public');
                        return koaStatic(staticFolder)(ctx, next);
                    } catch (e) {
                        strapi.log.error(e);
                    }
                } catch (e) {
                    strapi.log.error(e);
                }
            } catch (e) {
                strapi.log.error(e);
            }
        } catch (e) {
            strapi.log.error(e);
        }
    },
    async loginView (ctx, next) {
        // lazy require cheerio
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const cheerio = require('cheerio');
        const { error } = ctx.query;
        try {
            const layout = (await Promise.resolve().then(function () { return /*#__PURE__*/_interopNamespaceDefaultOnly(require('../public/login.html.js')); })).default;
            const filledLayout = _.template(layout.toString())({
                actionUrl: `${strapi.config.server.url}/documentation/login`
            });
            const $ = cheerio.load(filledLayout);
            $('.error').text(_.isEmpty(error) ? '' : 'Wrong password...');
            try {
                const layoutPath = path.resolve(strapi.dirs.app.extensions, 'documentation', 'public', 'login.html');
                await fs.ensureFile(layoutPath);
                await fs.writeFile(layoutPath, $.html());
                ctx.url = path.basename(`${ctx.url}/login.html`);
                try {
                    const staticFolder = path.resolve(strapi.dirs.app.extensions, 'documentation', 'public');
                    return koaStatic(staticFolder)(ctx, next);
                } catch (e) {
                    strapi.log.error(e);
                }
            } catch (e) {
                strapi.log.error(e);
            }
        } catch (e) {
            strapi.log.error(e);
        }
    },
    async login (ctx) {
        const { body: { password } } = ctx.request;
        const { password: hash } = await strapi.store({
            type: 'plugin',
            name: 'documentation',
            key: 'config'
        }).get();
        const isValid = await bcrypt.compare(password, hash);
        let querystring = '?error=password';
        if (isValid && ctx.session) {
            ctx.session.documentation = {
                logged: true
            };
            querystring = '';
        }
        ctx.redirect(`${strapi.config.server.url}/documentation${querystring}`);
    },
    async regenerateDoc (ctx) {
        const { version } = ctx.request.body;
        const service = utils$1.getService('documentation');
        const documentationVersions = service.getDocumentationVersions().map((el)=>el.version);
        if (_.isEmpty(version)) {
            return ctx.badRequest('Please provide a version.');
        }
        if (!documentationVersions.includes(version)) {
            return ctx.badRequest('The version you are trying to generate does not exist.');
        }
        try {
            strapi.reload.isWatching = false;
            await service.generateFullDoc(version);
            ctx.send({
                ok: true
            });
        } finally{
            strapi.reload.isWatching = true;
        }
    },
    async deleteDoc (ctx) {
        const { version } = ctx.params;
        const service = utils$1.getService('documentation');
        const documentationVersions = service.getDocumentationVersions().map((el)=>el.version);
        if (_.isEmpty(version)) {
            return ctx.badRequest('Please provide a version.');
        }
        if (!documentationVersions.includes(version)) {
            return ctx.badRequest('The version you are trying to delete does not exist.');
        }
        try {
            strapi.reload.isWatching = false;
            await service.deleteDocumentation(version);
            ctx.send({
                ok: true
            });
        } finally{
            strapi.reload.isWatching = true;
        }
    },
    async updateSettings (ctx) {
        const pluginStore = strapi.store({
            type: 'plugin',
            name: 'documentation'
        });
        const data = await validation.validateSettings(ctx.request.body);
        const config = {
            restrictedAccess: Boolean(data.restrictedAccess)
        };
        if (data.password) {
            config.password = await bcrypt.hash(data.password, 10);
        }
        await pluginStore.set({
            key: 'config',
            value: config
        });
        return ctx.send({
            ok: true
        });
    }
};

module.exports = documentation;
//# sourceMappingURL=documentation.js.map
