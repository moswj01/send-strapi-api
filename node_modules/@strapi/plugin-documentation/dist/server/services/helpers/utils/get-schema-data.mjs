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

export { getSchemaData as default };
//# sourceMappingURL=get-schema-data.mjs.map
