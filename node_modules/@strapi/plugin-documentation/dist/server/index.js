'use strict';

var bootstrap = require('./bootstrap.js');
var register = require('./register.js');
var index$4 = require('./services/index.js');
var index$2 = require('./routes/index.js');
var index$3 = require('./controllers/index.js');
var index$1 = require('./config/index.js');

var index = {
    bootstrap: bootstrap.bootstrap,
    config: index$1.config,
    routes: index$2,
    controllers: index$3,
    register: register.register,
    services: index$4
};

module.exports = index;
//# sourceMappingURL=index.js.map
