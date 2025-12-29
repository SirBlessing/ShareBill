const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { body, validationResult } = require("express-validator");
const pool = require("../db");
require("dotenv").config();


const router = express.Router();
const SALT_ROUNDS = parseInt(process.env.BCRYPT_SALT_ROUNDS || "10", 10);

// REGISTER
router.post(
  "/register",
  [
    body("fullname").isLength({ min: 2 }).trim(),
    body("email").notEmpty().trim(),
    body("phone_number").isLength({ min: 11 }),
    body("password").isLength({ min: 6 }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { fullname, email, phone_number, password } = req.body;

    try {
      // Check if user exists
      const [existing] = await pool.query(
        "SELECT id FROM users WHERE email = ? OR phone_number = ? LIMIT 1",
        [email, phone_number]
      );

      if (existing.length > 0)
        return res.status(400).json({ success: false, message: "User already exists" });

      const hashed = await bcrypt.hash(password, SALT_ROUNDS);

      // Insert new user
      const [result] = await pool.query(
        "INSERT INTO users (fullname, email, phone_number, password_hash) VALUES (?, ?, ?, ?)",
        [fullname, email, phone_number, hashed]
      );

      return res.json({
        success: true,
        userId: result.insertId,
      });

    } catch (err) {
      console.error(err);
      return res.status(500).json({ success: false, message: "Server error" });
    }
  }
);


// LOGIN
router.post(
  "/login",
  [
    body("email").notEmpty(),

    body("password").notEmpty(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

   const { email, password } = req.body;


    try {
      const [rows] = await pool.query(
        "SELECT id, fullname, password_hash FROM users WHERE email = ? OR phone_number = ? LIMIT 1",
        [email, email]
      );

      if (rows.length === 0)
        return res.status(401).json({ success: false, message: "Invalid credentials" });

      const user = rows[0];

      const match = await bcrypt.compare(password, user.password_hash);
      if (!match)
        return res.status(401).json({ success: false, message: "Invalid credentials" });

      const token = jwt.sign(
        { id: user.id, fullname: user.fullname },
        process.env.JWT_SECRET,
        { expiresIn: "3h" }
      );

      return res.json({
        success: true,
        token,
        user: { id: user.id, fullname: user.fullname },
      });

    } catch (err) {
      console.error(err);
      return res.status(500).json({ success: false, message: "Server error" });
    }
  }
);



module.exports = router;
0