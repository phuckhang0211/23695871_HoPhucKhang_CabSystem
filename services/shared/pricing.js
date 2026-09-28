const PRICE_PER_KM = 5000;

function calculateFare(distanceKm) {
  const distance = Number(distanceKm);
  if (!Number.isFinite(distance) || distance < 0)
    throw new Error("distanceKm must be a non-negative number");
  return Math.round(distance * PRICE_PER_KM);
}

module.exports = { PRICE_PER_KM, calculateFare };
