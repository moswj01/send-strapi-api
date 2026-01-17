import { bootstrap } from './bootstrap.mjs';
import { register } from './register.mjs';
import services from './services/index.mjs';
import routes from './routes/index.mjs';
import controllers from './controllers/index.mjs';
import { config } from './config/index.mjs';

var index = {
    bootstrap,
    config,
    routes,
    controllers,
    register,
    services
};

export { index as default };
//# sourceMappingURL=index.mjs.map
