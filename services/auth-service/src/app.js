const express = require("express");
const db = require("./config/database");
const authRoutes = require("./routes/auth.routes");
const app = express();
app.use(express.json());
app.get("/health", (req, res) =>
  res.json({ service: "auth-service", status: "ok" }),
);
app.use("/auth", authRoutes);
app.use((error, req, res, next) =>
  res.status(error.status || (error.code === "23505" ? 409 : 500)).json({
    code: error.code || "INTERNAL_ERROR",
    message:
      error.code === "23505" ? "Phone or email already exists" : error.message,
  }),
);
if (require.main === module) {
  const port = process.env.PORT || 3001;
  db.waitForDatabase()
    .then(() =>
      app.listen(port, () => console.log(`auth-service listening on ${port}`)),
    )
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
}
module.exports = app;
