const express = require("express");
const controller = require("../controllers/profile-fleet.controller");
const {
  requireInternalService,
} = require("../middleware/internal-service.middleware");
const router = express.Router();
router.get("/profiles/:userId", controller.get);
router.put("/profiles/:userId", controller.put);
router.put(
  "/internal/profiles/:userId",
  requireInternalService,
  controller.put,
);
module.exports = router;
