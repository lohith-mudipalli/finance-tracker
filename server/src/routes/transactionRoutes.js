const express = require("express");
const verifyToken = require("../middleware/verifyToken");
const { addTransaction, listTransactions } = require("../controllers/transactionController");

const router = express.Router();

router.get("/", verifyToken, listTransactions);
router.post("/", verifyToken, addTransaction);

module.exports = router;
