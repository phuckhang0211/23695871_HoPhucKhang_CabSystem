const express = require("express");
const controller = require("../controllers/rating.controller");
const { requireServiceAuth } = require("../../../shared/internal-auth");
const router = express.Router();
router.post("/ratings", requireServiceAuth, controller.create);
router.get("/trips/:tripId/ratings", requireServiceAuth, controller.get);
module.exports = router;
