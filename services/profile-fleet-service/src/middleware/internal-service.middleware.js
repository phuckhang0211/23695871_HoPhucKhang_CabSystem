function requireInternalService(req, res, next) {
  const token = process.env.INTERNAL_SERVICE_TOKEN;
  if (token && req.get("x-internal-service-token") === token) return next();
  return res.status(401).json({
    code: "UNAUTHORIZED",
    message: "Internal service authentication required",
  });
}

module.exports = { requireInternalService };
