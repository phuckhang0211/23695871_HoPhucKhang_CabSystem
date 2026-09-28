const crypto = require("node:crypto");
const express = require("express");
const { createPool, waitForDatabase } = require("../shared/db");
const { signAccessToken } = require("../shared/auth");

const app = express();
const pool = createPool();
const port = process.env.PORT || 3001;
app.use(express.json());

function hashPassword(password, salt = crypto.randomBytes(16).toString("hex")) {
  const hash = crypto.scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${hash}`;
}
function verifyPassword(password, stored) {
  const [salt, expected] = stored.split(":");
  const actual = crypto.scryptSync(password, salt, 64).toString("hex");
  return crypto.timingSafeEqual(
    Buffer.from(actual, "hex"),
    Buffer.from(expected, "hex"),
  );
}
function presentUser(row) {
  return {
    id: row.user_id,
    name: row.name,
    phone: row.phone,
    email: row.email,
    role: row.role,
    status: row.status,
  };
}

app.get("/health", (req, res) =>
  res.json({ service: "auth-service", status: "ok" }),
);
app.post("/auth/register", async (req, res, next) => {
  try {
    const { name, phone, email, password, role = "CUSTOMER" } = req.body;
    if (
      !name ||
      !phone ||
      !password ||
      !["CUSTOMER", "DRIVER"].includes(role)
    ) {
      return res
        .status(400)
        .json({
          code: "VALIDATION_ERROR",
          message: "name, phone, password and a valid role are required",
        });
    }
    const result = await pool.query(
      "INSERT INTO users (name, phone, email, role, password_hash) VALUES ($1,$2,$3,$4,$5) RETURNING *",
      [name, phone, email || null, role, hashPassword(password)],
    );
    const user = presentUser(result.rows[0]);
    return res
      .status(201)
      .json({ user, accessToken: signAccessToken(user), tokenType: "Bearer" });
  } catch (error) {
    if (error.code === "23505")
      return res
        .status(409)
        .json({
          code: "DUPLICATE_USER",
          message: "Phone or email already exists",
        });
    return next(error);
  }
});
app.post("/auth/login", async (req, res, next) => {
  try {
    const result = await pool.query(
      "SELECT * FROM users WHERE email = $1 OR phone = $1",
      [req.body.identifier],
    );
    const row = result.rows[0];
    if (!row || !verifyPassword(req.body.password || "", row.password_hash)) {
      return res
        .status(401)
        .json({ code: "INVALID_CREDENTIALS", message: "Invalid credentials" });
    }
    const user = presentUser(row);
    return res.json({
      user,
      accessToken: signAccessToken(user),
      tokenType: "Bearer",
    });
  } catch (error) {
    return next(error);
  }
});

app.use((error, req, res, next) => {
  console.error(error);
  res
    .status(500)
    .json({ code: "INTERNAL_ERROR", message: "Unexpected auth service error" });
});
waitForDatabase(pool)
  .then(() =>
    app.listen(port, () => console.log(`auth-service listening on ${port}`)),
  )
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
