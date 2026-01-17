'use strict';

var _ = require('lodash');

const pascalCase = (string)=>{
    return _.upperFirst(_.camelCase(string));
};

module.exports = pascalCase;
//# sourceMappingURL=pascal-case.js.map
