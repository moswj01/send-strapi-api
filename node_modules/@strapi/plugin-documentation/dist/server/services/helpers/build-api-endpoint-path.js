'use strict';

var _ = require('lodash');
var pathToRegexp = require('path-to-regexp');
var pascalCase = require('./utils/pascal-case.js');
var queryParams = require('./utils/query-params.js');
var loopContentTypeNames = require('./utils/loop-content-type-names.js');
var getApiResponses = require('./utils/get-api-responses.js');
var routes = require('./utils/routes.js');

function _interopNamespaceDefault(e) {
  var n = Object.create(null);
  if (e) {
    Object.keys(e).forEach(function (k) {
      if (k !== 'default') {
        var d = Object.getOwnPropertyDescriptor(e, k);
        Object.defineProperty(n, k, d.get ? d : {
          enumerable: true,
          get: function () { return e[k]; }
        });
      }
    });
  }
  n.default = e;
  return Object.freeze(n);
}

var pathToRegexp__namespace = /*#__PURE__*/_interopNamespaceDefault(pathToRegexp);

/**
 * @description Parses a route with ':variable'
 *
 * @param {string} routePath - The route's path property
 * @returns {string}
 */ const parsePathWithVariables = (routePath)=>{
    const { tokens } = pathToRegexp__namespace.parse(routePath);
    return tokens.map((token)=>{
        switch(token.type){
            case 'text':
                return token.value;
            case 'param':
                return `{${token.name}}`;
            case 'wildcard':
                return `{${token.name}}`;
            case 'group':
                // Handle group tokens by mapping them within the same function context
                return `(${parsePathWithVariables(token.tokens.map((t)=>t).join(''))})`;
            default:
                throw new Error(`Unknown token type: ${token.type}`);
        }
    }).join('');
};
/**
 * @description Builds the required object for a path parameter
 *
 * @param {string} routePath - The route's path property
 *
 * @returns {object } Swagger path params object
 */ const getPathParams = (routePath)=>{
    const { tokens } = pathToRegexp__namespace.parse(routePath);
    return tokens.reduce((acc, param)=>{
        // Skip non-parameter tokens
        if (param.type !== 'param') {
            return acc;
        }
        acc.push({
            name: `${param.name}`,
            in: 'path',
            description: '',
            deprecated: false,
            required: true,
            schema: {
                type: 'number'
            }
        });
        return acc;
    }, []);
};
const getPathWithPrefix = (prefix, route)=>{
    // When the prefix is set on the routes and
    // the current route is not trying to remove it
    if (prefix && !_.has(route.config, 'prefix')) {
        // Add the prefix to the path
        return prefix.concat(route.path);
    }
    // Otherwise just return path
    return route.path;
};
/**
 * @description Gets all paths based on routes
 *
 * @param {object} apiInfo
 * @property {object} apiInfo.routeInfo - The api routes object
 * @property {string} apiInfo.uniqueName - Content type name | Api name + Content type name
 * @property {object} apiInfo.contentTypeInfo - The info object found on content type schemas
 *
 * @returns {object}
 */ const getPaths = ({ routeInfo, uniqueName, contentTypeInfo, kind })=>{
    // Get the routes for the current content type
    const contentTypeRoutes = routeInfo.routes.filter((route)=>{
        return route.path.includes(contentTypeInfo.pluralName) || route.path.includes(contentTypeInfo.singularName);
    });
    const paths = contentTypeRoutes.reduce((acc, route)=>{
        // TODO: Find a more reliable way to determine list of entities vs a single entity
        const isListOfEntities = routes.hasFindMethod(route.handler);
        const methodVerb = route.method.toLowerCase();
        const hasPathParams = route.path.includes('/:');
        const pathWithPrefix = getPathWithPrefix(routeInfo.prefix, route);
        const routePath = hasPathParams ? parsePathWithVariables(pathWithPrefix) : pathWithPrefix;
        const responses = getApiResponses({
            uniqueName,
            route,
            isListOfEntities: kind !== 'singleType' && isListOfEntities
        });
        const swaggerConfig = {
            responses,
            tags: [
                _.upperFirst(uniqueName)
            ],
            parameters: [],
            operationId: `${methodVerb}${routePath}`
        };
        if (isListOfEntities) {
            swaggerConfig.parameters?.push(...queryParams);
        }
        if (hasPathParams) {
            const pathParams = getPathParams(route.path);
            swaggerConfig.parameters?.push(...pathParams);
        }
        if ([
            'post',
            'put'
        ].includes(methodVerb)) {
            const refName = 'Request';
            const requestBody = {
                required: true,
                content: {
                    'application/json': {
                        schema: {
                            $ref: `#/components/schemas/${pascalCase(uniqueName)}${refName}`
                        }
                    }
                }
            };
            swaggerConfig.requestBody = requestBody;
        }
        _.set(acc, `${routePath}.${methodVerb}`, swaggerConfig);
        return acc;
    }, {});
    return paths;
};
/**
 * @description - Builds the Swagger paths object for each api
 */ const buildApiEndpointPath = (api)=>{
    // A reusable loop for building paths and component schemas
    // Uses the api param to build a new set of params for each content type
    // Passes these new params to the function provided
    return loopContentTypeNames(api, getPaths);
};

module.exports = buildApiEndpointPath;
//# sourceMappingURL=build-api-endpoint-path.js.map
