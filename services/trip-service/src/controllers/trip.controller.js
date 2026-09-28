const service = require("../services/trip.service");
const notFound = (message) => ({ code: "NOT_FOUND", message });
async function create(req, res, next) {
  try {
    if (!req.body.bookingId || !req.body.driverId)
      return res.status(400).json({
        code: "VALIDATION_ERROR",
        message: "bookingId and driverId are required",
      });
    return res.status(201).json(await service.create(req.body));
  } catch (error) {
    return next(error);
  }
}
async function get(req, res, next) {
  try {
    const trip = await service.get(req.params.tripId);
    return trip
      ? res.json(trip)
      : res.status(404).json(notFound("Trip not found"));
  } catch (error) {
    return next(error);
  }
}
async function update(req, res, next) {
  try {
    const trip = await service.update(req.params.tripId, req.body.status);
    if (!trip) return res.status(404).json(notFound("Trip not found"));
    const fare =
      req.body.status === "COMPLETED" && req.body.distanceKm != null
        ? await service.getFare(req.params.tripId, req.body.distanceKm)
        : null;
    return res.json({ trip, fare });
  } catch (error) {
    return next(error);
  }
}
async function saveLocation(req, res, next) {
  try {
    return res.json(
      await service.saveLocation(
        req.params.tripId,
        req.body.latitude,
        req.body.longitude,
      ),
    );
  } catch (error) {
    return next(error);
  }
}
async function getLocation(req, res, next) {
  try {
    const location = await service.getLocation(req.params.tripId);
    return location
      ? res.json(location)
      : res.status(404).json(notFound("Location not found"));
  } catch (error) {
    return next(error);
  }
}
module.exports = { create, get, update, saveLocation, getLocation };
