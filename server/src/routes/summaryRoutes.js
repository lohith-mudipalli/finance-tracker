const express = require("express");
const verifyToken = require("../middleware/verifyToken");
const { monthlySummary } = require("../controllers/summaryController");

const router = express.Router();
router.get("/monthly", verifyToken, monthlySummary);

module.exports = router;
