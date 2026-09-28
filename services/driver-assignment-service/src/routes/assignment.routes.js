const express = require("express");
const controller = require("../controllers/assignment.controller");
const { requireServiceAuth } = require("../../../shared/internal-auth");
const router = express.Router();
router.post("/assignments", requireServiceAuth, controller.create);
router.get("/assignments/:assignmentId", requireServiceAuth, controller.get);
router.patch(
  "/assignments/:assignmentId",
  requireServiceAuth,
  controller.update,
);
module.exports = router;
