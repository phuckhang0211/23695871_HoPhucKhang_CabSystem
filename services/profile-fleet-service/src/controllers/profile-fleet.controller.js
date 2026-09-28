const service = require("../services/profile-fleet.service");
async function get(req, res, next) {
  try {
    return res.json(await service.getProfile(req.params.userId));
  } catch (error) {
    return next(error);
  }
}
async function put(req, res, next) {
  try {
    return res.json(await service.saveProfile(req.params.userId, req.body));
  } catch (error) {
    return next(error);
  }
}
module.exports = { get, put };
