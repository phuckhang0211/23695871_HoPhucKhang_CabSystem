const express = require("express");
const db = require("./config/database");
const routes = require("./routes/reporting.routes");
const app = express();
app.use(express.json());
app.get("/health", (req, res) =>
  res.json({ service: "reporting-service", status: "ok" }),
);
app.use(routes);
app.use((error, req, res, next) =>
  res.status(500).json({ code: "INTERNAL_ERROR", message: error.message }),
);
if (require.main === module) {
  db.waitForDatabase()
    .then(() =>
      app.listen(process.env.PORT || 3012, () =>
        console.log("reporting-service listening"),
      ),
    )
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
}
module.exports = app;
