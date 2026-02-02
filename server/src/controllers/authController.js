const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { findUserByEmail, createUser } = require("../models/userModel");
const { registerSchema, loginSchema } = require("../utils/validators");

function signToken(user) {
  return jwt.sign(
    { userId: user.id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || "1d" }
  );
}

async function register(req, res) {
  const parsed = registerSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ errors: parsed.error.issues });
  }

  const { email, password } = parsed.data;

  const existing = await findUserByEmail(email);
  if (existing) {
    return res.status(409).json({ message: "Email already registered" });
  }

  const saltRounds = 10;
  const passwordHash = await bcrypt.hash(password, saltRounds);

  const user = await createUser(email, passwordHash);
  const token = signToken({ id: user.id, email: user.email });

  res.status(201).json({ user, token });
}

async function login(req, res) {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ errors: parsed.error.issues });
  }

  const { email, password } = parsed.data;

  const user = await findUserByEmail(email);
  if (!user) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const match = await bcrypt.compare(password, user.password_hash);
  if (!match) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const token = signToken({ id: user.id, email: user.email });

  res.json({
    user: { id: user.id, email: user.email, created_at: user.created_at },
    token,
  });
}

module.exports = { register, login };
