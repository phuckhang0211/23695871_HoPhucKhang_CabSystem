const service = require("../services/reporting.service");
async function trips(req, res, next) {
  try {
    return res.json(await service.tripReport());
  } catch (error) {
    return next(error);
  }
}
async function revenue(req, res, next) {
  try {
    return res.json(await service.revenueReport());
  } catch (error) {
    return next(error);
  }
}
module.exports = { trips, revenue };
