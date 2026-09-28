const http = require("node:http");
const express = require("express");
const { authenticate } = require("../middleware/auth.middleware");

const router = express.Router();
const routes = [
  ["/auth", "AUTH_SERVICE_URL", false],
  ["/profiles", "PROFILE_FLEET_SERVICE_URL", true],
  ["/bookings", "BOOKING_SERVICE_URL", true],
  ["/trips", "TRIP_SERVICE_URL", true],
  ["/payments", "PAYMENT_SERVICE_URL", true],
  ["/assignments", "DRIVER_ASSIGNMENT_SERVICE_URL", true],
  ["/notifications", "NOTIFICATION_SERVICE_URL", true],
  ["/ratings", "RATING_SERVICE_URL", true],
  ["/incidents", "OPERATIONS_SERVICE_URL", true],
  ["/reports", "REPORTING_SERVICE_URL", true],
];

function forward(req, res, target, upstreamPrefix = "") {
  const body = ["GET", "HEAD"].includes(req.method)
    ? null
    : JSON.stringify(req.body || {});
  const request = http.request(
    {
      hostname: target.hostname,
      port: target.port,
      path: `${upstreamPrefix}${req.originalUrl.replace(/^\/api\/v1\/[a-z-]+/, "")}`,
      method: req.method,
      headers: {
        authorization: req.get("authorization") || "",
        "content-type": "application/json",
        ...(body ? { "content-length": Buffer.byteLength(body) } : {}),
      },
    },
    (response) => {
      res.status(response.statusCode || 502);
      Object.entries(response.headers).forEach(
        ([key, value]) => value !== undefined && res.setHeader(key, value),
      );
      response.pipe(res);
    },
  );
  request.on("error", (error) =>
    res
      .status(502)
      .json({ code: "SERVICE_UNAVAILABLE", message: error.message }),
  );
  if (body) request.write(body);
  request.end();
}

router.use((req, res, next) => {
  const subResourceMatch = /^\/trips\/[^/]+\/(fare|payments)$/.test(req.path)
    ? ["/trips", "PAYMENT_SERVICE_URL", true]
    : /^\/trips\/[^/]+\/ratings$/.test(req.path)
      ? ["/trips", "RATING_SERVICE_URL", true]
      : null;
  const match =
    subResourceMatch ||
    routes.find(
      ([prefix]) => req.path === prefix || req.path.startsWith(`${prefix}/`),
    );
  if (!match) return next();
  const upstreamPrefix = match[3] || match[0];
  if (match[2])
    return authenticate(req, res, () =>
      forward(req, res, new URL(process.env[match[1]]), upstreamPrefix),
    );
  return forward(req, res, new URL(process.env[match[1]]), upstreamPrefix);
});

module.exports = router;
