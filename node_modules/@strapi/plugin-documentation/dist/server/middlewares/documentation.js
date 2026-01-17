'use strict';

var path = require('path');
var koaStatic = require('koa-static');
var swaggerUi = require('swagger-ui-dist');

const addDocumentMiddlewares = async ({ strapi })=>{
    strapi.server.routes([
        {
            method: 'GET',
            path: '/plugins/documentation/(.*)',
            async handler (ctx, next) {
                ctx.url = path.basename(ctx.url);
                return koaStatic(swaggerUi.getAbsoluteFSPath(), {
                    maxage: 86400000,
                    defer: true
                })(ctx, next);
            },
            config: {
                auth: false
            }
        }
    ]);
};

exports.addDocumentMiddlewares = addDocumentMiddlewares;
//# sourceMappingURL=documentation.js.map
