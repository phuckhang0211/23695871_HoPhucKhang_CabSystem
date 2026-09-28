const express = require("express");
const controller = require("../controllers/notification.controller");
const router = express.Router();
const { requireServiceAuth } = require("../../../shared/internal-auth");
router.post("/notifications", requireServiceAuth, controller.create);
router.get("/notifications", requireServiceAuth, controller.list);
router.patch(
  "/notifications/:notificationId",
  requireServiceAuth,
  controller.update,
);
module.exports = router;
