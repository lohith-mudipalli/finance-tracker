const pool = require("../config/db");

async function getMonthlySummary(userId, year, month) {
  // month: 1-12
  const result = await pool.query(
    `
    SELECT
      COALESCE(SUM(CASE WHEN type='income' THEN amount ELSE 0 END),0)::float as income,
      COALESCE(SUM(CASE WHEN type='expense' THEN amount ELSE 0 END),0)::float as expense
    FROM transactions
    WHERE user_id=$1
      AND EXTRACT(YEAR FROM date) = $2
      AND EXTRACT(MONTH FROM date) = $3
    `,
    [userId, year, month]
  );

  const income = result.rows[0].income || 0;
  const expense = result.rows[0].expense || 0;
  return { income, expense, net: Number(income) - Number(expense) };
}

module.exports = { getMonthlySummary };
