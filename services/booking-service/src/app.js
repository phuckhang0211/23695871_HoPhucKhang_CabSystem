const express = require("express");
const db = require("../../../services/shared/db");
const { waitForDatabase } = require("../../../services/shared/db");
const routes = require("./routes/booking.routes");
const app = express();
app.use(express.json());
app.get("/health", (req, res) =>
  res.json({ service: "booking-service", status: "ok" }),
);
app.use(routes);
app.use((error, req, res, next) => {
  console.error(error);
  res
    .status(error.status || 500)
    .json({
      code: error.code || "INTERNAL_ERROR",
      message: error.status
        ? error.message
        : "Unexpected booking service error",
    });
});
if (require.main === module) {
  const port = process.env.PORT || 3002;
  waitForDatabase(db)
    .then(() =>
      app.listen(port, () =>
        console.log(`booking-service listening on ${port}`),
      ),
    )
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
}
module.exports = app;
