const crypto = require("node:crypto");
const db = require("../config/database");
const { requestJson, internalHeaders } = require("../../../shared/http-client");
const create = async (data) => {
  if (!data.bookingId || !data.driverId) {
    const error = new Error("bookingId and driverId are required");
    error.status = 400;
    error.code = "VALIDATION_ERROR";
    throw error;
  }
  const assignment = (
    await db.query(
      "INSERT INTO assignments (assignment_id, booking_id, driver_id, status) VALUES ($1,$2,$3,'PENDING') RETURNING *",
      [crypto.randomUUID(), data.bookingId, data.driverId],
    )
  ).rows[0];
  const trip = await requestJson(`${process.env.TRIP_SERVICE_URL}/trips`, {
    method: "POST",
    headers: internalHeaders(),
    body: JSON.stringify({
      bookingId: data.bookingId,
      driverId: data.driverId,
    }),
  });
  const updated = (
    await db.query(
      "UPDATE assignments SET status = 'ASSIGNED', trip_id = $1, updated_at = now() WHERE assignment_id = $2 RETURNING *",
      [trip.trip_id, assignment.assignment_id],
    )
  ).rows[0];
  try {
    await requestJson(`${process.env.NOTIFICATION_SERVICE_URL}/notifications`, {
      method: "POST",
      headers: internalHeaders(),
      body: JSON.stringify({
        recipientId: data.customerId,
        type: "DRIVER_ASSIGNED",
        title: "Driver assigned",
        message: "A driver has been assigned to your booking.",
      }),
    });
  } catch (error) {
    console.error("notification failed", error.message);
  }
  return { assignment: updated, trip };
};
const get = async (id) =>
  (await db.query("SELECT * FROM assignments WHERE assignment_id = $1", [id]))
    .rows[0];
const update = async (id, status) =>
  (
    await db.query(
      "UPDATE assignments SET status = $1, updated_at = now() WHERE assignment_id = $2 RETURNING *",
      [status, id],
    )
  ).rows[0];
module.exports = { create, get, update };
