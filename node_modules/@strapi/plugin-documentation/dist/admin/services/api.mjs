import { adminApi } from '@strapi/admin/strapi-admin';

const api = adminApi.enhanceEndpoints({
    addTagTypes: [
        'DocumentInfo'
    ]
}).injectEndpoints({
    endpoints: (builder)=>{
        return {
            getInfo: builder.query({
                query: ()=>'/documentation/getInfos',
                providesTags: [
                    'DocumentInfo'
                ]
            }),
            deleteVersion: builder.mutation({
                query: ({ version })=>({
                        url: `/documentation/deleteDoc/${version}`,
                        method: 'DELETE'
                    }),
                invalidatesTags: [
                    'DocumentInfo'
                ]
            }),
            updateSettings: builder.mutation({
                query: ({ body })=>({
                        url: `/documentation/updateSettings`,
                        method: 'PUT',
                        data: body
                    }),
                invalidatesTags: [
                    'DocumentInfo'
                ]
            }),
            regenerateDoc: builder.mutation({
                query: ({ version })=>({
                        url: `/documentation/regenerateDoc`,
                        method: 'POST',
                        data: {
                            version
                        }
                    })
            })
        };
    }
});
const { useGetInfoQuery, useDeleteVersionMutation, useUpdateSettingsMutation, useRegenerateDocMutation } = api;

export { useDeleteVersionMutation, useGetInfoQuery, useRegenerateDocMutation, useUpdateSettingsMutation };
//# sourceMappingURL=api.mjs.map
