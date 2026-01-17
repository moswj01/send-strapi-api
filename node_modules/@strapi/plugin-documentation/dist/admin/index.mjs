import { Information } from '@strapi/icons';
import { PERMISSIONS } from './constants.mjs';
import { pluginId } from './pluginId.mjs';
import { prefixPluginTranslations } from './utils/prefixPluginTranslations.mjs';

function __variableDynamicImportRuntime2__(path) {
  switch (path) {
    case './translations/ar.json': return import('./translations/ar.json.mjs');
    case './translations/cs.json': return import('./translations/cs.json.mjs');
    case './translations/de.json': return import('./translations/de.json.mjs');
    case './translations/dk.json': return import('./translations/dk.json.mjs');
    case './translations/en.json': return import('./translations/en.json.mjs');
    case './translations/es.json': return import('./translations/es.json.mjs');
    case './translations/fr.json': return import('./translations/fr.json.mjs');
    case './translations/id.json': return import('./translations/id.json.mjs');
    case './translations/it.json': return import('./translations/it.json.mjs');
    case './translations/ko.json': return import('./translations/ko.json.mjs');
    case './translations/ms.json': return import('./translations/ms.json.mjs');
    case './translations/nl.json': return import('./translations/nl.json.mjs');
    case './translations/pl.json': return import('./translations/pl.json.mjs');
    case './translations/pt-BR.json': return import('./translations/pt-BR.json.mjs');
    case './translations/pt.json': return import('./translations/pt.json.mjs');
    case './translations/ru.json': return import('./translations/ru.json.mjs');
    case './translations/sk.json': return import('./translations/sk.json.mjs');
    case './translations/sv.json': return import('./translations/sv.json.mjs');
    case './translations/th.json': return import('./translations/th.json.mjs');
    case './translations/tr.json': return import('./translations/tr.json.mjs');
    case './translations/uk.json': return import('./translations/uk.json.mjs');
    case './translations/vi.json': return import('./translations/vi.json.mjs');
    case './translations/zh-Hans.json': return import('./translations/zh-Hans.json.mjs');
    case './translations/zh.json': return import('./translations/zh.json.mjs');
    default: return new Promise(function(resolve, reject) {
      (typeof queueMicrotask === 'function' ? queueMicrotask : setTimeout)(
        reject.bind(null, new Error("Unknown variable dynamic import: " + path))
      );
    })
   }
 }
// eslint-disable-next-line import/no-default-export
var index = {
    register (app) {
        app.addMenuLink({
            to: `plugins/${pluginId}`,
            icon: Information,
            intlLabel: {
                id: `${pluginId}.plugin.name`,
                defaultMessage: 'Documentation'
            },
            permissions: PERMISSIONS.main,
            Component: async ()=>{
                const { App } = await import('./pages/App.mjs');
                return App;
            },
            position: 9
        });
        app.registerPlugin({
            id: pluginId,
            name: pluginId
        });
    },
    bootstrap (app) {
        app.addSettingsLink('global', {
            intlLabel: {
                id: `${pluginId}.plugin.name`,
                defaultMessage: 'Documentation'
            },
            id: 'documentation',
            to: pluginId,
            Component: async ()=>{
                const { SettingsPage } = await import('./pages/Settings.mjs');
                return SettingsPage;
            },
            permissions: PERMISSIONS.main
        });
    },
    async registerTrads ({ locales }) {
        const importedTrads = await Promise.all(locales.map((locale)=>{
            return __variableDynamicImportRuntime2__(`./translations/${locale}.json`).then(({ default: data })=>{
                return {
                    data: prefixPluginTranslations(data, pluginId),
                    locale
                };
            }).catch(()=>{
                return {
                    data: {},
                    locale
                };
            });
        }));
        return Promise.resolve(importedTrads);
    }
};

export { index as default };
//# sourceMappingURL=index.mjs.map
