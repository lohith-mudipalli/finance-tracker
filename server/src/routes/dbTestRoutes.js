const express = require("express");
const pool = require("../config/db");

const router = express.Router();

router.get("/db-test", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW() as now");
    res.json({ db: "connected", time: result.rows[0].now });
  } catch (err) {
    res.status(500).json({
      db: "not connected",
      error: err.message,
    });
  }
});

module.exports = router;