const express = require("express");
const {
  requireServiceAuth,
} = require("../../../../services/shared/internal-auth");
const controller = require("../controllers/trip.controller");
const router = express.Router();
router.post("/trips", requireServiceAuth, controller.create);
router.get("/trips/:tripId", requireServiceAuth, controller.get);
router.patch("/trips/:tripId", requireServiceAuth, controller.update);
router.patch(
  "/trips/:tripId/location",
  requireServiceAuth,
  controller.saveLocation,
);
router.get(
  "/trips/:tripId/location",
  requireServiceAuth,
  controller.getLocation,
);
module.exports = router;
