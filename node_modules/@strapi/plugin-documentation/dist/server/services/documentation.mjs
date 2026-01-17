import path from 'path';
import fs from 'fs-extra';
import { produce } from 'immer';
import buildApiEndpointPath from './helpers/build-api-endpoint-path.mjs';
import buildComponentSchema from './helpers/build-component-schema.mjs';
import { getPluginsThatNeedDocumentation } from './utils/get-plugins-that-need-documentation.mjs';
import { getService } from '../utils.mjs';

const createService = ({ strapi })=>{
    const config = strapi.config.get('plugin::documentation');
    const pluginsThatNeedDocumentation = getPluginsThatNeedDocumentation(config);
    const overrideService = getService('override');
    return {
        getDocumentationVersion () {
            return config.info.version;
        },
        getFullDocumentationPath () {
            return path.join(strapi.dirs.app.extensions, 'documentation', 'documentation');
        },
        getDocumentationVersions () {
            return fs.readdirSync(this.getFullDocumentationPath()).map((version)=>{
                try {
                    const filePath = path.resolve(this.getFullDocumentationPath(), version, 'full_documentation.json');
                    const doc = JSON.parse(fs.readFileSync(filePath).toString());
                    const generatedDate = doc.info['x-generation-date'];
                    return {
                        version,
                        generatedDate,
                        url: ''
                    };
                } catch (err) {
                    return null;
                }
            }).filter((x)=>x);
        },
        /**
     * Returns settings stored in core-store
     */ async getDocumentationAccess () {
            const { restrictedAccess } = await strapi.store({
                environment: '',
                type: 'plugin',
                name: 'documentation',
                key: 'config'
            }).get();
            return {
                restrictedAccess
            };
        },
        getApiDocumentationPath (api) {
            if (api.getter === 'plugin') {
                return path.join(strapi.dirs.app.extensions, api.name, 'documentation');
            }
            return path.join(strapi.dirs.app.api, api.name, 'documentation');
        },
        async deleteDocumentation (version) {
            const apis = this.getPluginAndApiInfo();
            for (const api of apis){
                await fs.remove(path.join(this.getApiDocumentationPath(api), version));
            }
            await fs.remove(path.join(this.getFullDocumentationPath(), version));
        },
        getPluginAndApiInfo () {
            const pluginsToDocument = pluginsThatNeedDocumentation.map((plugin)=>{
                return {
                    name: plugin,
                    getter: 'plugin',
                    ctNames: Object.keys(strapi.plugin(plugin).contentTypes)
                };
            });
            const apisToDocument = Object.keys(strapi.apis).map((api)=>{
                return {
                    name: api,
                    getter: 'api',
                    ctNames: Object.keys(strapi.api(api).contentTypes)
                };
            });
            return [
                ...apisToDocument,
                ...pluginsToDocument
            ];
        },
        /**
     * @description - Creates the Swagger json files
     */ async generateFullDoc (versionOpt) {
            const version = versionOpt ?? this.getDocumentationVersion();
            const apis = this.getPluginAndApiInfo();
            const apisThatNeedGeneratedDocumentation = apis.filter(({ name })=>!overrideService.isEnabled(name));
            // Initialize the generated documentation with defaults
            const generatedDocumentation = await produce(config, async (draft)=>{
                if (draft.servers?.length === 0) {
                    // When no servers found set the defaults
                    const serverUrl = strapi.config.get('server.absoluteUrl');
                    const apiPath = strapi.config.get('api.rest.prefix');
                    draft.servers = [
                        {
                            url: `${serverUrl}${apiPath}`,
                            description: 'Development server'
                        }
                    ];
                }
                if (!draft.components) {
                    draft.components = {};
                }
                // Set the generated date
                draft.info['x-generation-date'] = new Date().toISOString();
                // Set the plugins that need documentation
                draft['x-strapi-config'].plugins = pluginsThatNeedDocumentation;
                // Delete the mutateDocumentation key from the config so it doesn't end up in the spec
                delete draft['x-strapi-config'].mutateDocumentation;
                // Generate the documentation for each api and update the generatedDocumentation
                for (const api of apisThatNeedGeneratedDocumentation){
                    const newApiPath = buildApiEndpointPath(api);
                    const generatedSchemas = buildComponentSchema(api);
                    if (generatedSchemas) {
                        draft.components.schemas = {
                            ...draft.components.schemas,
                            ...generatedSchemas
                        };
                    }
                    if (newApiPath) {
                        draft.paths = {
                            ...draft.paths,
                            ...newApiPath
                        };
                    }
                }
                // When overrides are present update the generatedDocumentation
                if (overrideService.registeredOverrides.length > 0) {
                    overrideService.registeredOverrides.forEach((override)=>{
                        // Only run the overrrides when no override version is provided,
                        // or when the generated documentation version matches the override version
                        if (!override?.info?.version || override.info.version === version) {
                            if (override.tags) {
                                // Merge override tags with the generated tags
                                draft.tags = draft.tags || [];
                                draft.tags.push(...override.tags);
                            }
                            if (override.paths) {
                                // Merge override paths with the generated paths
                                // The override will add a new path or replace the value of an existing path
                                draft.paths = {
                                    ...draft.paths,
                                    ...override.paths
                                };
                            }
                            if (override.components) {
                                const keys = Object.keys(override.components);
                                keys.forEach((overrideKey)=>{
                                    draft.components = draft.components || {};
                                    const overrideValue = override.components?.[overrideKey];
                                    const originalValue = draft.components?.[overrideKey];
                                    Object.assign(draft.components, {
                                        [overrideKey]: {
                                            ...originalValue,
                                            ...overrideValue
                                        }
                                    });
                                });
                            }
                        }
                    });
                }
            });
            // Escape hatch, allow the user to provide a mutateDocumentation function that can alter any part of
            // the generated documentation before it is written to the file system
            const userMutatesDocumentation = config['x-strapi-config'].mutateDocumentation;
            const finalDocumentation = userMutatesDocumentation ? produce(generatedDocumentation, userMutatesDocumentation) : generatedDocumentation;
            // Get the file path for the final documentation
            const fullDocJsonPath = path.join(this.getFullDocumentationPath(), version, 'full_documentation.json');
            // Write the documentation to the file system
            await fs.ensureFile(fullDocJsonPath);
            await fs.writeJson(fullDocJsonPath, finalDocumentation, {
                spaces: 2
            });
        }
    };
};

export { createService as default };
//# sourceMappingURL=documentation.mjs.map
