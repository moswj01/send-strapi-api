import _ from 'lodash';

const pascalCase = (string)=>{
    return _.upperFirst(_.camelCase(string));
};

export { pascalCase as default };
//# sourceMappingURL=pascal-case.mjs.map
