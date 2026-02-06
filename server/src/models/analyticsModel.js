const pool = require("../config/db");

// Pie: total expense amount by category (only expenses)
async function getExpenseByCategory(userId, days = 30) {
  const result = await pool.query(
    `
    SELECT category, SUM(amount)::float as total
    FROM transactions
    WHERE user_id=$1
      AND type='expense'
      AND date >= CURRENT_DATE - $2::int
    GROUP BY category
    ORDER BY total DESC
    `,
    [userId, days]
  );

  return result.rows;
}

// Line: daily total expenses over last N days
async function getDailyExpenses(userId, days = 30) {
  const result = await pool.query(
    `
    SELECT date, SUM(amount)::float as total
    FROM transactions
    WHERE user_id=$1
      AND type='expense'
      AND date >= CURRENT_DATE - $2::int
    GROUP BY date
    ORDER BY date ASC
    `,
    [userId, days]
  );

  return result.rows;
}

module.exports = { getExpenseByCategory, getDailyExpenses };
