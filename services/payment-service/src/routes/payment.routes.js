const express = require("express");
const {
  requireServiceAuth,
} = require("../../../../services/shared/internal-auth");
const controller = require("../controllers/payment.controller");
const router = express.Router();
router.get("/trips/:tripId/fare", requireServiceAuth, controller.fare);
router.post("/trips/:tripId/payments", requireServiceAuth, controller.create);
router.get("/payments/:paymentId", requireServiceAuth, controller.get);
module.exports = router;
