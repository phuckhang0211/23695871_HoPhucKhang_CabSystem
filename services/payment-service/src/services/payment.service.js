const crypto = require("node:crypto");
const db = require("../../../../services/shared/db");
const {
  PRICE_PER_KM,
  calculateFare,
} = require("../../../../services/shared/pricing");
const {
  requestJson,
  internalHeaders,
} = require("../../../../services/shared/http-client");

function validateDistance(distanceKm) {
  const distance = Number(distanceKm);
  if (!Number.isFinite(distance) || distance < 0) {
    const error = new Error("distanceKm must be a non-negative number");
    error.status = 400;
    error.code = "VALIDATION_ERROR";
    throw error;
  }
  return distance;
}

function fare(tripId, distanceKm) {
  const distance = validateDistance(distanceKm);
  return {
    tripId,
    distanceKm: distance,
    pricePerKm: PRICE_PER_KM,
    amount: calculateFare(distance),
    currency: "VND",
  };
}

async function createPayment(tripId, data, idempotencyKey) {
  const distance = validateDistance(data.distanceKm);
  const method = data.method || "CASH";
  if (!["CASH", "ELECTRONIC"].includes(method)) {
    const error = new Error(
      "distanceKm and CASH/ELECTRONIC method are required",
    );
    error.status = 400;
    error.code = "VALIDATION_ERROR";
    throw error;
  }
  const result = await db.query(
    "INSERT INTO payments (payment_id, trip_id, amount, currency, method, status, idempotency_key) VALUES ($1,$2,$3,'VND',$4,$5,$6) RETURNING *",
    [
      crypto.randomUUID(),
      tripId,
      calculateFare(distance),
      method,
      method === "CASH" ? "SUCCESS" : "PENDING",
      idempotencyKey || crypto.randomUUID(),
    ],
  );
  const payment = result.rows[0];
  try {
    await requestJson(`${process.env.NOTIFICATION_SERVICE_URL}/notifications`, {
      method: "POST",
      headers: internalHeaders(),
      body: JSON.stringify({
        recipientId: data.customerId,
        type: "PAYMENT_CREATED",
        title: "Payment created",
        message: `Payment ${payment.status.toLowerCase()} for ${payment.amount} VND.`,
      }),
    });
  } catch (error) {
    console.error("payment notification failed", error.message);
  }
  return payment;
}

async function getPayment(paymentId) {
  return (
    await db.query("SELECT * FROM payments WHERE payment_id = $1", [paymentId])
  ).rows[0];
}

module.exports = { fare, createPayment, getPayment };
