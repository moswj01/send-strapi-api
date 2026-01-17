const hasFindMethod = (handler)=>{
    if (typeof handler === 'string') {
        return handler.split('.').pop() === 'find';
    }
    return false;
};

export { hasFindMethod };
//# sourceMappingURL=routes.mjs.map
