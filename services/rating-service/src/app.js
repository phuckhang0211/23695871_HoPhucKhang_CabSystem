const express = require("express");
const db = require("./config/database");
const routes = require("./routes/rating.routes");
const app = express();
app.use(express.json());
app.get("/health", (req, res) =>
  res.json({ service: "rating-service", status: "ok" }),
);
app.use(routes);
app.use((error, req, res, next) =>
  res
    .status(error.code === "23505" ? 409 : 500)
    .json({ code: error.code || "INTERNAL_ERROR", message: error.message }),
);
if (require.main === module) {
  db.waitForDatabase()
    .then(() =>
      app.listen(process.env.PORT || 3010, () =>
        console.log("rating-service listening"),
      ),
    )
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
}
module.exports = app;
