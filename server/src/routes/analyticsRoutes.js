const express = require("express");
const verifyToken = require("../middleware/verifyToken");
const { categoryBreakdown, dailyExpenses } = require("../controllers/analyticsController");

const router = express.Router();

router.get("/category-breakdown", verifyToken, categoryBreakdown);
router.get("/daily-expenses", verifyToken, dailyExpenses);

module.exports = router;
