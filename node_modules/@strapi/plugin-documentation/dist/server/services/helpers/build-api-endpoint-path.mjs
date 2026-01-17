import _ from 'lodash';
import * as pathToRegexp from 'path-to-regexp';
import pascalCase from './utils/pascal-case.mjs';
import params from './utils/query-params.mjs';
import loopContentTypeNames from './utils/loop-content-type-names.mjs';
import getApiResponse from './utils/get-api-responses.mjs';
import { hasFindMethod } from './utils/routes.mjs';

/**
 * @description Parses a route with ':variable'
 *
 * @param {string} routePath - The route's path property
 * @returns {string}
 */ const parsePathWithVariables = (routePath)=>{
    const { tokens } = pathToRegexp.parse(routePath);
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
    const { tokens } = pathToRegexp.parse(routePath);
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
        const isListOfEntities = hasFindMethod(route.handler);
        const methodVerb = route.method.toLowerCase();
        const hasPathParams = route.path.includes('/:');
        const pathWithPrefix = getPathWithPrefix(routeInfo.prefix, route);
        const routePath = hasPathParams ? parsePathWithVariables(pathWithPrefix) : pathWithPrefix;
        const responses = getApiResponse({
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
            swaggerConfig.parameters?.push(...params);
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

export { buildApiEndpointPath as default };
//# sourceMappingURL=build-api-endpoint-path.mjs.map
