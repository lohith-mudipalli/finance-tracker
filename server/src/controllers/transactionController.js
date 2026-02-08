const { createTransaction, getTransactionsByUser } = require("../models/transactionModel");
const { transactionSchema } = require("../utils/validators");
const { deleteTransaction } = require("../models/transactionModel");

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

async function removeTransaction(req, res) {
  const userId = req.user.userId;
  const id = Number(req.params.id);

  if (!id) return res.status(400).json({ message: "Invalid id" });

  const deleted = await deleteTransaction({ userId, id });
  if (!deleted) return res.status(404).json({ message: "Transaction not found" });

  res.json({ message: "Deleted", id: deleted.id });
}


module.exports = { addTransaction, listTransactions, removeTransaction };
