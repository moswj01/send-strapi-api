export default ({ env }) => ({
  'users-permissions': {
    config: {
      register: {
        allowedFields: ['username', 'email', 'password', 'p_no', 'img_cover', 'credit','google_id'],
      },
      providers: {
        google: {
          enabled: true,
          clientId: env('GOOGLE_CLIENT_ID'),
          clientSecret: env('GOOGLE_CLIENT_SECRET'),
          // ใช้ custom scheme ตรงกับ Google OAuth Client
          callback: 'sendapp://auth/callback',
        },
      },
    },
  },
});
