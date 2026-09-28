require("dotenv").config();
const path = require("node:path");
const express = require("express");
const cors = require("cors");
const swaggerUi = require("swagger-ui-express");
const proxyRoutes = require("./routes/proxy.routes");

const app = express();
app.use(cors());
app.use(express.json());
app.get("/health", (req, res) =>
  res.json({ service: "api-gateway", status: "ok" }),
);
app.use(
  "/api",
  express.static(path.join(__dirname, "..", "..", "document", "api_documents")),
);
app.use(
  "/docs",
  swaggerUi.serve,
  swaggerUi.setup(null, { swaggerOptions: { url: "/api/openapi.yaml" } }),
);
app.use("/api/v1", proxyRoutes);
app.use((req, res) =>
  res.status(404).json({ code: "NOT_FOUND", message: "Route not found" }),
);

if (require.main === module) {
  const port = process.env.PORT || 3000;
  app.listen(port, () => console.log(`api-gateway listening on ${port}`));
}
module.exports = app;
