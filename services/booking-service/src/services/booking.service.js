const crypto = require("node:crypto");
const db = require("../../../../services/shared/db");
const {
  requestJson,
  internalHeaders,
} = require("../../../../services/shared/http-client");

async function createBooking(userId, data) {
  const { pickup, destination, vehicleType = "CAR", note = null } = data;
  if (
    !pickup ||
    !destination ||
    pickup.latitude == null ||
    destination.latitude == null
  ) {
    const error = new Error("pickup and destination coordinates are required");
    error.status = 400;
    error.code = "VALIDATION_ERROR";
    throw error;
  }
  const result = await db.query(
    "INSERT INTO bookings (booking_id, customer_id, pickup, destination, vehicle_type, note) VALUES ($1,$2,$3,$4,$5,$6) RETURNING *",
    [crypto.randomUUID(), userId, pickup, destination, vehicleType, note],
  );
  return result.rows[0];
}

async function startAssignment(booking, data) {
  return requestJson(`${process.env.ASSIGNMENT_SERVICE_URL}/assignments`, {
    method: "POST",
    headers: internalHeaders(),
    body: JSON.stringify({
      bookingId: booking.booking_id,
      driverId: data.driverId || process.env.DEFAULT_DRIVER_ID,
      customerId: booking.customer_id,
    }),
  });
}

async function markSearching(bookingId) {
  return (
    await db.query(
      "UPDATE bookings SET status = 'SEARCHING_DRIVER', updated_at = now() WHERE booking_id = $1 RETURNING *",
      [bookingId],
    )
  ).rows[0];
}

async function listBookings(userId) {
  const result = await db.query(
    "SELECT * FROM bookings WHERE customer_id = $1 ORDER BY created_at DESC",
    [userId],
  );
  return result.rows;
}

async function getBooking(userId, bookingId) {
  const result = await db.query(
    "SELECT * FROM bookings WHERE booking_id = $1 AND customer_id = $2",
    [bookingId, userId],
  );
  return result.rows[0];
}

async function updateBooking(userId, bookingId, data) {
  const result = await db.query(
    "UPDATE bookings SET pickup = COALESCE($1, pickup), destination = COALESCE($2, destination), note = COALESCE($3, note), updated_at = now() WHERE booking_id = $4 AND customer_id = $5 AND status = 'REQUESTED' RETURNING *",
    [
      data.pickup || null,
      data.destination || null,
      data.note || null,
      bookingId,
      userId,
    ],
  );
  return result.rows[0];
}

async function cancelBooking(userId, bookingId) {
  const result = await db.query(
    "UPDATE bookings SET status = 'CANCELLED', updated_at = now() WHERE booking_id = $1 AND customer_id = $2 AND status IN ('REQUESTED', 'SEARCHING_DRIVER') RETURNING *",
    [bookingId, userId],
  );
  return result.rows[0];
}

module.exports = {
  createBooking,
  startAssignment,
  markSearching,
  listBookings,
  getBooking,
  updateBooking,
  cancelBooking,
};
