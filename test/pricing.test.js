const test = require("node:test");
const assert = require("node:assert/strict");
const { calculateFare, PRICE_PER_KM } = require("../services/shared/pricing");

test("calculates fare as distance multiplied by 5,000 VND", () => {
  assert.equal(calculateFare(10), 10 * PRICE_PER_KM);
  assert.equal(calculateFare(1.25), 6250);
});

test("rejects invalid or negative distance", () => {
  assert.throws(() => calculateFare(-1));
  assert.throws(() => calculateFare("unknown"));
});
