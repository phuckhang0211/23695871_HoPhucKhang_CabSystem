const { requireAuth } = require("./auth");

function requireServiceAuth(req, res, next) {
  const serviceToken = process.env.INTERNAL_SERVICE_TOKEN;
  if (serviceToken && req.get("x-internal-service-token") === serviceToken) {
    req.isInternalService = true;
    return next();
  }
  return requireAuth(req, res, next);
}

module.exports = { requireServiceAuth };
