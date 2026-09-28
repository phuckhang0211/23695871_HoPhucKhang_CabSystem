const service = require("../services/payment.service");

async function fare(req, res, next) {
  try {
    return res.json(service.fare(req.params.tripId, req.query.distanceKm));
  } catch (error) {
    return next(error);
  }
}
async function create(req, res, next) {
  try {
    return res
      .status(201)
      .json(
        await service.createPayment(
          req.params.tripId,
          { ...req.body, customerId: req.user.sub },
          req.get("idempotency-key"),
        ),
      );
  } catch (error) {
    return next(error);
  }
}
async function get(req, res, next) {
  try {
    const payment = await service.getPayment(req.params.paymentId);
    return payment
      ? res.json(payment)
      : res
          .status(404)
          .json({ code: "NOT_FOUND", message: "Payment not found" });
  } catch (error) {
    return next(error);
  }
}
module.exports = { fare, create, get };
