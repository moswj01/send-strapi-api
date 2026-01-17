import { getPluginsThatNeedDocumentation } from './utils/get-plugins-that-need-documentation.mjs';

const createService = ({ strapi })=>{
    const registeredOverrides = [];
    const excludedFromGeneration = [];
    return {
        registeredOverrides,
        excludedFromGeneration,
        /**
     *
     * @param {(string | string[])} api - The name of the api or and array of apis to exclude from generation
     */ excludeFromGeneration (api) {
            if (Array.isArray(api)) {
                excludedFromGeneration.push(...api);
                return;
            }
            excludedFromGeneration.push(api);
        },
        isEnabled (name) {
            return excludedFromGeneration.includes(name);
        },
        registerOverride (override, opts) {
            const { pluginOrigin, excludeFromGeneration = [] } = opts ?? {};
            const pluginsThatNeedDocumentation = getPluginsThatNeedDocumentation(strapi.config.get('plugin::documentation'));
            // Don't apply the override if the plugin is not in the list of plugins that need documentation
            if (pluginOrigin && !pluginsThatNeedDocumentation.includes(pluginOrigin)) return;
            if (excludeFromGeneration.length) {
                this.excludeFromGeneration(excludeFromGeneration);
            }
            let overrideToRegister = override;
            // Parse yaml if we receive a string
            if (typeof override === 'string') {
                // eslint-disable-next-line @typescript-eslint/no-var-requires
                overrideToRegister = require('yaml').parse(overrideToRegister);
            }
            // receive an object we can register it directly
            registeredOverrides.push(overrideToRegister);
        }
    };
};

export { createService as default };
//# sourceMappingURL=override.mjs.map
