const express = require("express");
const router = express.Router();

const auth = require("../middleware/authMiddleware");
const role = require("../middleware/roleMiddleware");

const gatePassController = require("../controllers/gatePassController");

// student
router.post(
  "/request",
  auth,
  role("student"),
  gatePassController.requestGatePass
);

// student - get my passes
router.get(
  "/my-passes",
  auth,
  role("student"),
  gatePassController.getMyGatePasses
);

// hod
router.get(
  "/pending",
  auth,
  role("hod"),
  gatePassController.getPendingRequests
);

router.post(
  "/approve/:id",
  auth,
  role("hod"),
  gatePassController.approveGatePass
);

// watchman ✅ EXIT
router.post(
  "/exit",
  auth,
  role("watchman"),
  gatePassController.exitGatePass
);

module.exports = router;


