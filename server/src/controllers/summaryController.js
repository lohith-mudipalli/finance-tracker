const { getMonthlySummary } = require("../models/summaryModel");

async function monthlySummary(req, res) {
  const userId = req.user.userId;

  const now = new Date();
  const year = Number(req.query.year || now.getFullYear());
  const month = Number(req.query.month || now.getMonth() + 1);

  const data = await getMonthlySummary(userId, year, month);
  res.json({ year, month, ...data });
}

module.exports = { monthlySummary };
