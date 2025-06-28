// client/env.js

export default {
  LOGIN_REDIRECT_URL:
    process.env.NUXT_ENV_LOGIN_REDIRECT_URL ||
    "http://localhost:3001/login/ce8967c2-5f64-4259-87d9-85ba9ebcfdd2"
};
