const { createTransaction, getTransactionsByUser } = require("../models/transactionModel");
const { transactionSchema } = require("../utils/validators");

async function addTransaction(req, res) {
  const parsed = transactionSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ errors: parsed.error.issues });
  }

  const userId = req.user.userId;

  const tx = await createTransaction({
    userId,
    amount: parsed.data.amount,
    type: parsed.data.type,
    category: parsed.data.category,
    date: parsed.data.date,
  });

  res.status(201).json(tx);
}

async function listTransactions(req, res) {
  const userId = req.user.userId;
  const data = await getTransactionsByUser(userId);
  res.json(data);
}

module.exports = { addTransaction, listTransactions };
