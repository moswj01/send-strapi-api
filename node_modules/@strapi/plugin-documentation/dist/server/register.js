'use strict';

var documentation = require('./middlewares/documentation.js');

async function register({ strapi }) {
    await documentation.addDocumentMiddlewares({
        strapi
    });
}

exports.register = register;
//# sourceMappingURL=register.js.map
