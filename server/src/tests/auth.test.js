require("dotenv").config(); // ✅ load env FIRST

const pool = require("../config/db"); // ✅ now env is available
const request = require("supertest");
const express = require("express");

const authRoutes = require("../routes/authRoutes");

const app = express();
app.use(express.json());
app.use("/api/v1/auth", authRoutes);

describe("Auth endpoints", () => {
  const email = `test_${Date.now()}@example.com`;
  const password = "Password123";

  it("should register a user", async () => {
    const res = await request(app)
      .post("/api/v1/auth/register")
      .send({ email, password });

    expect(res.statusCode).toBe(201);
    expect(res.body.token).toBeTruthy();
  });

  it("should login a user", async () => {
    await request(app)
      .post("/api/v1/auth/register")
      .send({ email, password });

    const res = await request(app)
      .post("/api/v1/auth/login")
      .send({ email, password });

    expect(res.statusCode).toBe(200);
    expect(res.body.token).toBeTruthy();
  });
});

afterAll(async () => {
  await pool.end(); // ✅ close DB pool so Jest exits cleanly
});
