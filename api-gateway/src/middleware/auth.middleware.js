const jwt = require("jsonwebtoken");

function authenticate(req, res, next) {
  const header = req.get("authorization") || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;
  if (!token)
    return res
      .status(401)
      .json({ code: "UNAUTHORIZED", message: "Bearer token is required" });
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    return next();
  } catch {
    return res
      .status(401)
      .json({ code: "UNAUTHORIZED", message: "Invalid or expired token" });
  }
}

module.exports = { authenticate };
