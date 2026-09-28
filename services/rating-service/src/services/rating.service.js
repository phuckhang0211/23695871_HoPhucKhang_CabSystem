const crypto = require("node:crypto");
const db = require("../config/database");
const { requestJson, internalHeaders } = require("../../../shared/http-client");
const create = async (data) =>
  (async () => {
    const rating = (
      await db.query(
        "INSERT INTO ratings (rating_id, trip_id, rater_id, driver_id, score, comment) VALUES ($1,$2,$3,$4,$5,$6) RETURNING *",
        [
          crypto.randomUUID(),
          data.tripId,
          data.raterId,
          data.driverId,
          data.score,
          data.comment || null,
        ],
      )
    ).rows[0];
    try {
      await requestJson(
        `${process.env.NOTIFICATION_SERVICE_URL}/notifications`,
        {
          method: "POST",
          headers: internalHeaders(),
          body: JSON.stringify({
            recipientId: data.driverId,
            type: "RATING_SUBMITTED",
            title: "New rating",
            message: `You received a rating of ${data.score}/5.`,
          }),
        },
      );
    } catch (error) {
      console.error("rating notification failed", error.message);
    }
    return rating;
  })();
const get = async (tripId) =>
  (await db.query("SELECT * FROM ratings WHERE trip_id = $1", [tripId])).rows;
module.exports = { create, get };
