import { addDocumentMiddlewares } from './middlewares/documentation.mjs';

async function register({ strapi }) {
    await addDocumentMiddlewares({
        strapi
    });
}

export { register };
//# sourceMappingURL=register.mjs.map
