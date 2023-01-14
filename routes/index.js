const logger = require("../utils/log4js").getLogger("ROUTES");
const jwtAuthMiddleware = require("../auth/jwt-middleware");
const config = require("../config");
const adminModelRoutes = require("./admin-model-routes");
const userModelRoutes = require("./user-model-routes");

const secrets = {
  JWT_SECRET: config.JWT_SECRET,
  JWT_PL_SECRET: config.JWT_PL_SECRET,
  JWT_SALT: config.JWT_SALT,
};

const jwtMiddleware = jwtAuthMiddleware(secrets);

const routes = (app) => {
  const authRouteFilter = new RegExp(
    "" +
      new RegExp("^(?!^/api/v\\d+/users/login(/)?$)").source +
      new RegExp("^(?!^/api/v\\d+/admins/login(/)?$)").source
  );

  app.use("/api/v1/", require("./auth-routes"));

  app.use(authRouteFilter, jwtMiddleware);

  app.use("/api/v1/user", require("./user-custom-routes"));

  app.use("/api/v1/admin", require("./admin-custom-routes"));

  app.use(userModelRoutes);

  app.use(adminModelRoutes);

  logger.debug("Initialized all routes");
};

module.exports = routes;
