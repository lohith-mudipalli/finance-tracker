require("dotenv").config(); // ✅ load env first

const request = require("supertest");
const express = require("express");

const pool = require("../config/db");

const authRoutes = require("../routes/authRoutes");
const transactionRoutes = require("../routes/transactionRoutes");

function makeApp() {
  const app = express();
  app.use(express.json());

  app.use("/api/v1/auth", authRoutes);
  app.use("/api/v1/transactions", transactionRoutes);

  // optional: basic error handler so tests don't hang on thrown errors
  // (If you already have a global error handler in index.js, you can ignore this)
  app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  });

  return app;
}

describe("Transactions endpoints (basic)", () => {
  const app = makeApp();

  const email = `tx_test_${Date.now()}@example.com`;
  const password = "Password123";

  let token;
  let createdTxId;

  afterAll(async () => {
    // ✅ Cleanup: delete the test user (transactions should cascade if FK is ON DELETE CASCADE)
    try {
      await pool.query("DELETE FROM users WHERE email = $1", [email]);
    } finally {
      // ✅ Important: close DB pool so Jest exits
      await pool.end();
    }
  });

  it("registers a user and gets a token", async () => {
    const res = await request(app)
      .post("/api/v1/auth/register")
      .send({ email, password });

    expect(res.statusCode).toBe(201);
    expect(res.body.token).toBeTruthy();

    token = res.body.token;
  });

  it("creates a transaction", async () => {
    const payload = {
      type: "expense",
      category: "Food",
      amount: 12.5,
      date: "2026-02-08", // any valid date string is fine
    };

    const res = await request(app)
      .post("/api/v1/transactions")
      .set("Authorization", `Bearer ${token}`)
      .send(payload);

    // Some APIs return 201; some return 200. Adjust if your controller uses 200.
    expect([200, 201]).toContain(res.statusCode);

    // Expect an id back (common pattern)
    expect(res.body).toBeTruthy();
    expect(res.body.id).toBeTruthy();

    createdTxId = res.body.id;
  });

  it("lists transactions and includes the created transaction", async () => {
    const res = await request(app)
      .get("/api/v1/transactions")
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);

    const found = res.body.find((t) => Number(t.id) === Number(createdTxId));
    expect(found).toBeTruthy();
    expect(found.category).toBe("Food");
    expect(found.type).toBe("expense");
  });

  it("deletes the transaction", async () => {
    const res = await request(app)
      .delete(`/api/v1/transactions/${createdTxId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("Deleted");
    expect(Number(res.body.id)).toBe(Number(createdTxId));
  });

  it("after delete, transaction should not appear in list", async () => {
    const res = await request(app)
      .get("/api/v1/transactions")
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    const found = res.body.find((t) => Number(t.id) === Number(createdTxId));
    expect(found).toBeUndefined();
  });
});
