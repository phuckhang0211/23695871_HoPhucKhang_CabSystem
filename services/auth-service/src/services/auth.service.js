const crypto = require("node:crypto");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

async function createProfile(user) {
  const profileServiceUrl = process.env.PROFILE_FLEET_SERVICE_URL;
  if (!profileServiceUrl) return;

  const response = await fetch(
    `${profileServiceUrl}/internal/profiles/${user.id}`,
    {
      method: "PUT",
      headers: {
        "content-type": "application/json",
        "x-internal-service-token": process.env.INTERNAL_SERVICE_TOKEN || "",
      },
      body: JSON.stringify({
        displayName: user.name,
        phone: user.phone,
        email: user.email,
      }),
    },
  );
  if (!response.ok) {
    const body = await response.text();
    const error = new Error(
      body || `Profile service failed with status ${response.status}`,
    );
    error.status = 502;
    error.code = "PROFILE_SERVICE_ERROR";
    throw error;
  }
}

function hashPassword(password, salt = crypto.randomBytes(16).toString("hex")) {
  return `${salt}:${crypto.scryptSync(password, salt, 64).toString("hex")}`;
}
function verifyPassword(password, stored) {
  if (typeof password !== "string" || typeof stored !== "string") return false;
  const [salt, expected] = stored.split(":");
  if (!salt || !expected) return false;
  const actual = crypto.scryptSync(password, salt, 64).toString("hex");
  if (actual.length !== expected.length) return false;
  return crypto.timingSafeEqual(
    Buffer.from(actual, "hex"),
    Buffer.from(expected, "hex"),
  );
}
function tokenFor(user) {
  return jwt.sign(
    { sub: user.id, role: user.role, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || "1h" },
  );
}
async function register(input) {
  const user = User.present(
    await User.createUser({
      ...input,
      passwordHash: hashPassword(input.password),
    }),
  );
  await createProfile(user);
  return { user, accessToken: tokenFor(user), tokenType: "Bearer" };
}
async function login(identifier, password) {
  const stored = await User.findByIdentifier(identifier);
  if (!stored || !verifyPassword(password, stored.password_hash))
    throw Object.assign(new Error("Invalid credentials"), {
      status: 401,
      code: "INVALID_CREDENTIALS",
    });
  const user = User.present(stored);
  return { user, accessToken: tokenFor(user), tokenType: "Bearer" };
}
module.exports = { register, login };
