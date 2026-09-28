const express = require("express");
const db = require("../../../services/shared/db");
const { waitForDatabase } = require("../../../services/shared/db");
const routes = require("./routes/payment.routes");
const app = express();
app.use(express.json());
app.get("/health", (req, res) =>
  res.json({ service: "payment-service", status: "ok" }),
);
app.use(routes);
app.use((error, req, res, next) => {
  console.error(error);
  const status = error.status || (error.code === "23505" ? 409 : 500);
  res
    .status(status)
    .json({
      code: error.code || "INTERNAL_ERROR",
      message:
        error.code === "23505"
          ? "Idempotency key already used"
          : error.status
            ? error.message
            : "Unexpected payment service error",
    });
});
if (require.main === module) {
  waitForDatabase(db)
    .then(() =>
      app.listen(process.env.PORT || 3004, () =>
        console.log("payment-service listening on 3004"),
      ),
    )
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
}
module.exports = app;
