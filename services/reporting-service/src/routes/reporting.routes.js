const express = require("express");
const controller = require("../controllers/reporting.controller");
const router = express.Router();
router.get("/reports/trips", controller.trips);
router.get("/reports/revenue", controller.revenue);
module.exports = router;
