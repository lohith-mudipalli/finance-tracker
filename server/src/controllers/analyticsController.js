const { getExpenseByCategory, getDailyExpenses } = require("../models/analyticsModel");

async function categoryBreakdown(req, res) {
  const userId = req.user.userId;
  const days = Number(req.query.days || 30);

  const data = await getExpenseByCategory(userId, days);
  res.json(data);
}

async function dailyExpenses(req, res) {
  const userId = req.user.userId;
  const days = Number(req.query.days || 30);

  const data = await getDailyExpenses(userId, days);
  res.json(data);
}

module.exports = { categoryBreakdown, dailyExpenses };
