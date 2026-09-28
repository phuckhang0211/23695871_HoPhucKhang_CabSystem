const express = require("express");
const db = require("./config/database");
const routes = require("./routes/assignment.routes");
const app = express();
app.use(express.json());
app.get("/health", (req, res) =>
  res.json({ service: "driver-assignment-service", status: "ok" }),
);
app.use(routes);
app.use((error, req, res, next) =>
  res.status(500).json({ code: "INTERNAL_ERROR", message: error.message }),
);
if (require.main === module) {
  db.waitForDatabase()
    .then(() =>
      app.listen(process.env.PORT || 3008, () =>
        console.log("driver-assignment-service listening"),
      ),
    )
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
}
module.exports = app;
