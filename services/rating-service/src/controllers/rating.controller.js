const service = require("../services/rating.service");
async function create(req, res, next) {
  try {
    if (
      !Number.isInteger(req.body.score) ||
      req.body.score < 1 ||
      req.body.score > 5
    )
      return res.status(400).json({
        code: "VALIDATION_ERROR",
        message: "score must be an integer from 1 to 5",
      });
    return res
      .status(201)
      .json(
        await service.create({
          ...req.body,
          raterId: req.user?.sub || req.body.raterId,
        }),
      );
  } catch (error) {
    return next(error);
  }
}
async function get(req, res, next) {
  try {
    return res.json({ data: await service.get(req.params.tripId) });
  } catch (error) {
    return next(error);
  }
}
module.exports = { create, get };
