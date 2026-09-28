const crypto = require("node:crypto");
const db = require("../../../../services/shared/db");
const {
  requestJson,
  internalHeaders,
} = require("../../../../services/shared/http-client");
async function create(data) {
  return (
    await db.query(
      "INSERT INTO trips (trip_id, booking_id, driver_id) VALUES ($1,$2,$3) RETURNING *",
      [crypto.randomUUID(), data.bookingId, data.driverId],
    )
  ).rows[0];
}
async function get(tripId) {
  return (await db.query("SELECT * FROM trips WHERE trip_id = $1", [tripId]))
    .rows[0];
}
async function getFare(tripId, distanceKm) {
  return requestJson(
    `${process.env.PAYMENT_SERVICE_URL}/trips/${tripId}/fare?distanceKm=${encodeURIComponent(distanceKm)}`,
    { headers: internalHeaders() },
  );
}
async function update(tripId, status) {
  return (
    await db.query(
      "UPDATE trips SET status = COALESCE($1, status), updated_at = now() WHERE trip_id = $2 RETURNING *",
      [status || null, tripId],
    )
  ).rows[0];
}
async function saveLocation(tripId, latitude, longitude) {
  return (
    await db.query(
      "INSERT INTO trip_locations (trip_id, latitude, longitude) VALUES ($1,$2,$3) RETURNING *",
      [tripId, latitude, longitude],
    )
  ).rows[0];
}
async function getLocation(tripId) {
  return (
    await db.query(
      "SELECT * FROM trip_locations WHERE trip_id = $1 ORDER BY recorded_at DESC LIMIT 1",
      [tripId],
    )
  ).rows[0];
}
module.exports = { create, get, update, saveLocation, getLocation, getFare };
