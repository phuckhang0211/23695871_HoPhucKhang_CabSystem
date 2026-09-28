const service = require("../services/booking.service");

function notFound(message) {
  return { code: "NOT_FOUND", message };
}
async function create(req, res, next) {
  try {
    const booking = await service.createBooking(req.user.sub, req.body);
    try {
      const assignment = await service.startAssignment(booking, req.body);
      return res.status(201).json({ booking, assignment });
    } catch (workflowError) {
      const searchingBooking = await service.markSearching(booking.booking_id);
      return res
        .status(202)
        .json({
          booking: searchingBooking,
          workflowStatus: "SEARCHING_DRIVER",
          message: "Booking created; driver assignment will retry.",
        });
    }
  } catch (error) {
    return next(error);
  }
}
async function list(req, res, next) {
  try {
    return res.json({ data: await service.listBookings(req.user.sub) });
  } catch (error) {
    return next(error);
  }
}
async function get(req, res, next) {
  try {
    const booking = await service.getBooking(
      req.user.sub,
      req.params.bookingId,
    );
    return booking
      ? res.json(booking)
      : res.status(404).json(notFound("Booking not found"));
  } catch (error) {
    return next(error);
  }
}
async function update(req, res, next) {
  try {
    const booking = await service.updateBooking(
      req.user.sub,
      req.params.bookingId,
      req.body,
    );
    return booking
      ? res.json(booking)
      : res.status(404).json(notFound("Editable booking not found"));
  } catch (error) {
    return next(error);
  }
}
async function remove(req, res, next) {
  try {
    const booking = await service.cancelBooking(
      req.user.sub,
      req.params.bookingId,
    );
    return booking
      ? res.json(booking)
      : res.status(404).json(notFound("Cancellable booking not found"));
  } catch (error) {
    return next(error);
  }
}
module.exports = { create, list, get, update, remove };
