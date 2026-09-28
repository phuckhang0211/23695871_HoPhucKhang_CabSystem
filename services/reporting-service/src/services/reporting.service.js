const db = require("../config/database");
const tripReport = async () =>
  (
    await db.query(
      "SELECT COUNT(*)::int AS total_trips, COUNT(*) FILTER (WHERE status = 'COMPLETED')::int AS completed_trips, COUNT(*) FILTER (WHERE status = 'CANCELLED')::int AS cancelled_trips FROM trip_history",
    )
  ).rows[0];
const revenueReport = async () =>
  (
    await db.query(
      "SELECT COALESCE(SUM(amount), 0)::numeric AS total_revenue, COUNT(*)::int AS total_payments FROM payment_history WHERE status = 'SUCCESS'",
    )
  ).rows[0];
module.exports = { tripReport, revenueReport };
