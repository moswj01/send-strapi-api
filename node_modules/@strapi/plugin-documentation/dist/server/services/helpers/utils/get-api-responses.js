'use strict';

var pascalCase = require('./pascal-case.js');

/**
 * @description - Builds the Swagger response object for a given api
 */ const getApiResponse = ({ uniqueName, route, isListOfEntities = false })=>{
    const getSchema = ()=>{
        if (route.method === 'DELETE') {
            return {
                type: 'integer',
                format: 'int64'
            };
        }
        if (isListOfEntities) {
            return {
                $ref: `#/components/schemas/${pascalCase(uniqueName)}ListResponse`
            };
        }
        return {
            $ref: `#/components/schemas/${pascalCase(uniqueName)}Response`
        };
    };
    const schema = getSchema();
    return {
        200: {
            description: 'OK',
            content: {
                'application/json': {
                    schema
                }
            }
        },
        400: {
            description: 'Bad Request',
            content: {
                'application/json': {
                    schema: {
                        $ref: '#/components/schemas/Error'
                    }
                }
            }
        },
        401: {
            description: 'Unauthorized',
            content: {
                'application/json': {
                    schema: {
                        $ref: '#/components/schemas/Error'
                    }
                }
            }
        },
        403: {
            description: 'Forbidden',
            content: {
                'application/json': {
                    schema: {
                        $ref: '#/components/schemas/Error'
                    }
                }
            }
        },
        404: {
            description: 'Not Found',
            content: {
                'application/json': {
                    schema: {
                        $ref: '#/components/schemas/Error'
                    }
                }
            }
        },
        500: {
            description: 'Internal Server Error',
            content: {
                'application/json': {
                    schema: {
                        $ref: '#/components/schemas/Error'
                    }
                }
            }
        }
    };
};

module.exports = getApiResponse;
//# sourceMappingURL=get-api-responses.js.map
