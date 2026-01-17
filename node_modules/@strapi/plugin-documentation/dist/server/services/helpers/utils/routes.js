'use strict';

const hasFindMethod = (handler)=>{
    if (typeof handler === 'string') {
        return handler.split('.').pop() === 'find';
    }
    return false;
};

exports.hasFindMethod = hasFindMethod;
//# sourceMappingURL=routes.js.map
