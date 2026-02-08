const express = require("express");
const verifyToken = require("../middleware/verifyToken");
const { addTransaction, listTransactions, removeTransaction } = require("../controllers/transactionController");

const router = express.Router();

router.get("/", verifyToken, listTransactions);
router.post("/", verifyToken, addTransaction);
router.delete("/:id", verifyToken, removeTransaction);

module.exports = router;
