import axios from "axios";

export default {
  async socialLogin(ctx) {
    const { provider, accessToken } = ctx.request.body;

    if (!provider || !accessToken) {
      return ctx.badRequest("Missing provider or accessToken");
    }

    try {
      let email = "", username = "", picture = "", socialId = "";

      if (provider === "facebook") {
        const res = await axios.get(
          `https://graph.facebook.com/me?fields=id,email,name,picture&access_token=${accessToken}`
        );
        email = res.data.email;
        username = res.data.name;
        picture = res.data.picture?.data?.url;
        socialId = res.data.id;
      } else if (provider === "google") {
        const res = await axios.get("https://www.googleapis.com/oauth2/v2/userinfo", {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        email = res.data.email;
        username = res.data.name;
        picture = res.data.picture;
        socialId = res.data.id;
      } else {
        return ctx.badRequest("Unsupported provider");
      }

      if (!email) {
        return ctx.badRequest("Email not provided by provider");
      }

      // Find or create user
      let user = await strapi.query("plugin::users-permissions.user").findOne({
        where: { email },
      });

      if (!user) {
        const defaultRole = await strapi.query("plugin::users-permissions.role").findOne({
          where: { type: "authenticated" },
        });

        user = await strapi.query("plugin::users-permissions.user").create({
          data: {
            email,
            username: username || email.split("@")[0],
            provider,
            confirmed: true,
            blocked: false,
            role: defaultRole?.id,
            picture,
            socialId,
          },
        });
      }

      // Generate JWT token
      const jwt = strapi.plugins["users-permissions"].services.jwt.issue({
        id: user.id,
      });

      return ctx.send({
        jwt,
        user: {
          id: user.id,
          email: user.email,
          username: user.username,
          picture: user.picture,
        },
      });
    } catch (error) {
      console.error("Social login error:", error);
      return ctx.badRequest("Social login failed");
    }
  },
};
