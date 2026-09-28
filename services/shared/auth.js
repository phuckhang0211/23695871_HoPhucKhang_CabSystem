const jwt = require("jsonwebtoken");

const secret = process.env.JWT_SECRET || "change-this-secret-in-production";

function signAccessToken(user) {
  return jwt.sign(
    { sub: user.id, role: user.role, email: user.email },
    secret,
    { expiresIn: process.env.JWT_EXPIRES_IN || "1h" },
  );
}

function requireAuth(req, res, next) {
  const header = req.get("authorization") || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;
  if (!token)
    return res
      .status(401)
      .json({ code: "UNAUTHORIZED", message: "Bearer token is required" });

  try {
    req.user = jwt.verify(token, secret);
    return next();
  } catch {
    return res
      .status(401)
      .json({ code: "UNAUTHORIZED", message: "Invalid or expired token" });
  }
}

function requireRole(...roles) {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res
        .status(403)
        .json({ code: "FORBIDDEN", message: "Insufficient role" });
    }
    return next();
  };
}

module.exports = { requireAuth, requireRole, signAccessToken };
