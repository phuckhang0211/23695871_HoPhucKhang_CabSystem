const express = require("express");
const controller = require("../controllers/operations.controller");
const router = express.Router();
router.post("/incidents", controller.createIncident);
router.get("/incidents", controller.listIncidents);
module.exports = router;
