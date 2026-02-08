const pool = require("../config/db");

async function createTransaction({ userId, amount, type, category, date }) {
  const result = await pool.query(
    `INSERT INTO transactions (user_id, amount, type, category, date)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING *`,
    [userId, amount, type, category, date]
  );
  return result.rows[0];
}

async function getTransactionsByUser(userId) {
  const result = await pool.query(
    "SELECT * FROM transactions WHERE user_id=$1 ORDER BY date DESC, id DESC",
    [userId]
  );
  return result.rows;
}

async function deleteTransaction({ userId, id }) {
  const result = await pool.query(
    `DELETE FROM transactions
     WHERE id=$1 AND user_id=$2
     RETURNING id`,
    [id, userId]
  );
  return result.rows[0];
}


module.exports = { createTransaction, getTransactionsByUser, deleteTransaction };
