const path = require("path");
const http = require("node:http");
const express = require("express");
const cors = require("cors");
const swaggerUi = require("swagger-ui-express");

const app = express();
const port = process.env.PORT || 3000;
const apiPrefix = "/api/v1";
const apiDocsPath = path.join(__dirname, "..", "document", "api_documents");

app.use(cors());
app.use(express.json());

app.use("/api", express.static(apiDocsPath));
app.use(
  "/docs",
  swaggerUi.serve,
  swaggerUi.setup(null, {
    swaggerOptions: {
      url: "/api/openapi.yaml",
    },
  }),
);

app.get("/", (req, res) => {
  res.redirect("/docs");
});

const router = express.Router();

router.get("/health", (req, res) =>
  res.json({ service: "api-gateway", status: "ok" }),
);

const serviceRoutes = [
  ["/auth", "AUTH_SERVICE_URL"],
  ["/bookings", "BOOKING_SERVICE_URL"],
  ["/trips", "TRIP_SERVICE_URL"],
  ["/payments", "PAYMENT_SERVICE_URL"],
];

router.use((req, res, next) => {
  const route = serviceRoutes.find(
    ([prefix]) => req.path === prefix || req.path.startsWith(`${prefix}/`),
  );
  if (!route) return next();

  const target = new URL(process.env[route[1]] || "http://localhost:3001");
  const body = ["GET", "HEAD"].includes(req.method)
    ? null
    : JSON.stringify(req.body || {});
  const proxy = http.request(
    {
      hostname: target.hostname,
      port: target.port,
      path: `${req.originalUrl}`,
      method: req.method,
      headers: {
        authorization: req.get("authorization") || "",
        "content-type": "application/json",
        ...(body ? { "content-length": Buffer.byteLength(body) } : {}),
      },
    },
    (response) => {
      res.status(response.statusCode || 502);
      Object.entries(response.headers).forEach(([key, value]) => {
        if (value !== undefined) res.setHeader(key, value);
      });
      response.pipe(res);
    },
  );
  proxy.on("error", (error) =>
    res
      .status(502)
      .json({ code: "SERVICE_UNAVAILABLE", message: error.message }),
  );
  if (body) proxy.write(body);
  proxy.end();
});

router.use((req, res) => {
  res.status(501).json({
    success: false,
    message:
      "API gateway scaffold is ready. Route this path to its owning service.",
    path: req.originalUrl,
  });
});

router.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
    code: "NOT_FOUND",
  });
});

app.use(apiPrefix, router);

app.listen(port, () => {
  console.log(
    `CAB System mock API is running at http://localhost:${port}${apiPrefix}`,
  );
  console.log(`Swagger UI is available at http://localhost:${port}/docs`);
});
