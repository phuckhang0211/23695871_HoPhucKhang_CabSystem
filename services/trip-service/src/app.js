const express = require("express");
const db = require("../../../services/shared/db");
const { waitForDatabase } = require("../../../services/shared/db");
const routes = require("./routes/trip.routes");
const app = express();
app.use(express.json());
app.get("/health", (req, res) =>
  res.json({ service: "trip-service", status: "ok" }),
);
app.use(routes);
app.use((error, req, res, next) => {
  console.error(error);
  res
    .status(error.status || 500)
    .json({
      code: error.code || "INTERNAL_ERROR",
      message: error.status ? error.message : "Unexpected trip service error",
    });
});
if (require.main === module) {
  waitForDatabase(db)
    .then(() =>
      app.listen(process.env.PORT || 3003, () =>
        console.log("trip-service listening on 3003"),
      ),
    )
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
}
module.exports = app;
