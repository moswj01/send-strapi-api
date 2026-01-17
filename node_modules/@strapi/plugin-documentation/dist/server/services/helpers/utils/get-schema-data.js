'use strict';

/**
 * @description Determines the format of the data response
 *
 * @param {boolean} isListOfEntities - Checks for a multiple entities
 * @param {object} attributes - The attributes found on a contentType

 * @returns object | array of attributes
 */ var getSchemaData = ((isListOfEntities, attributes)=>{
    if (isListOfEntities) {
        return {
            type: 'array',
            items: {
                type: 'object',
                properties: {
                    id: {
                        oneOf: [
                            {
                                type: 'string'
                            },
                            {
                                type: 'number'
                            }
                        ]
                    },
                    documentId: {
                        type: 'string'
                    },
                    ...attributes
                }
            }
        };
    }
    return {
        type: 'object',
        properties: {
            id: {
                oneOf: [
                    {
                        type: 'string'
                    },
                    {
                        type: 'number'
                    }
                ]
            },
            documentId: {
                type: 'string'
            },
            ...attributes
        }
    };
});

module.exports = getSchemaData;
//# sourceMappingURL=get-schema-data.js.map
