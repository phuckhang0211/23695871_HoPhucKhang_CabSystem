const authService = require("../services/auth.service");

async function register(req, res, next) {
  try {
    const { name, phone, email, password, role = "CUSTOMER" } = req.body;
    if (!name || !phone || !password || !["CUSTOMER", "DRIVER"].includes(role))
      return res
        .status(400)
        .json({
          code: "VALIDATION_ERROR",
          message: "name, phone, password and role are required",
        });
    return res
      .status(201)
      .json(await authService.register({ name, phone, email, password, role }));
  } catch (error) {
    return next(error);
  }
}
async function login(req, res, next) {
  try {
    return res.json(
      await authService.login(req.body.identifier, req.body.password),
    );
  } catch (error) {
    return next(error);
  }
}
module.exports = { register, login };
