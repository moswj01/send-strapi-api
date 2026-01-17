import { jsx } from 'react/jsx-runtime';
import 'react';
import { Main } from '@strapi/design-system';
import { useNotification, useAPIErrorHandler, Page } from '@strapi/strapi/admin';
import { useIntl } from 'react-intl';
import { SettingsForm } from '../components/SettingsForm.mjs';
import { useGetInfoQuery, useUpdateSettingsMutation } from '../services/api.mjs';
import { getTrad } from '../utils/getTrad.mjs';
import { isBaseQueryError } from '../utils/baseQuery.mjs';

const SettingsPage = ()=>{
    const { toggleNotification } = useNotification();
    const { formatMessage } = useIntl();
    const { _unstableFormatAPIError: formatAPIError, _unstableFormatValidationErrors: formatValidationErrors } = useAPIErrorHandler();
    const { data, isError, isLoading, isFetching } = useGetInfoQuery();
    const [updateSettings] = useUpdateSettingsMutation();
    const onUpdateSettings = async (body, formik)=>{
        return updateSettings({
            body
        }).unwrap().then(()=>{
            toggleNotification({
                type: 'success',
                message: formatMessage({
                    id: getTrad('notification.update.success'),
                    defaultMessage: 'Successfully updated settings'
                })
            });
        }).catch((err)=>{
            if (isBaseQueryError(err) && err.name === 'ValidationError') {
                toggleNotification({
                    type: 'danger',
                    message: formatAPIError(err)
                });
            }
        });
    };
    if (isLoading || isFetching) {
        return /*#__PURE__*/ jsx(Page.Loading, {});
    }
    if (isError) {
        return /*#__PURE__*/ jsx(Page.Error, {});
    }
    return /*#__PURE__*/ jsx(Main, {
        children: /*#__PURE__*/ jsx(SettingsForm, {
            data: data,
            onSubmit: onUpdateSettings
        })
    });
};

export { SettingsPage };
//# sourceMappingURL=Settings.mjs.map
