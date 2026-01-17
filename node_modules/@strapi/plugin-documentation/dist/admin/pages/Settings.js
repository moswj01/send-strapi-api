'use strict';

var jsxRuntime = require('react/jsx-runtime');
require('react');
var designSystem = require('@strapi/design-system');
var admin = require('@strapi/strapi/admin');
var reactIntl = require('react-intl');
var SettingsForm = require('../components/SettingsForm.js');
var api = require('../services/api.js');
var getTrad = require('../utils/getTrad.js');
var baseQuery = require('../utils/baseQuery.js');

const SettingsPage = ()=>{
    const { toggleNotification } = admin.useNotification();
    const { formatMessage } = reactIntl.useIntl();
    const { _unstableFormatAPIError: formatAPIError, _unstableFormatValidationErrors: formatValidationErrors } = admin.useAPIErrorHandler();
    const { data, isError, isLoading, isFetching } = api.useGetInfoQuery();
    const [updateSettings] = api.useUpdateSettingsMutation();
    const onUpdateSettings = async (body, formik)=>{
        return updateSettings({
            body
        }).unwrap().then(()=>{
            toggleNotification({
                type: 'success',
                message: formatMessage({
                    id: getTrad.getTrad('notification.update.success'),
                    defaultMessage: 'Successfully updated settings'
                })
            });
        }).catch((err)=>{
            if (baseQuery.isBaseQueryError(err) && err.name === 'ValidationError') {
                toggleNotification({
                    type: 'danger',
                    message: formatAPIError(err)
                });
            }
        });
    };
    if (isLoading || isFetching) {
        return /*#__PURE__*/ jsxRuntime.jsx(admin.Page.Loading, {});
    }
    if (isError) {
        return /*#__PURE__*/ jsxRuntime.jsx(admin.Page.Error, {});
    }
    return /*#__PURE__*/ jsxRuntime.jsx(designSystem.Main, {
        children: /*#__PURE__*/ jsxRuntime.jsx(SettingsForm.SettingsForm, {
            data: data,
            onSubmit: onUpdateSettings
        })
    });
};

exports.SettingsPage = SettingsPage;
//# sourceMappingURL=Settings.js.map
