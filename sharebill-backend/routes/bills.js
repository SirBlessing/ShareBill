const express = require("express");
const { body, validationResult } = require("express-validator");
const pool = require("../db");
const auth = require("../middleware/auth");

const router = express.Router();

/**
 * CREATE BILL
 */
router.post(
  "/create",
  auth,
  async (req, res) => {
    const {
      title,
      total_amount,
      description,
      due_date,
      account_name,
      account_number,
      bank_name,
      equalSplit,
      participants,
    } = req.body;

    if (!title || !total_amount || !account_name || !account_number || !bank_name) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    try {
      const [result] = await pool.query(
        `INSERT INTO bill 
        (user_id, title, total_amount, description, due_date,
         account_name, account_number, bank_name, equal_split, participants)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          req.user.id,
          title,
          total_amount,
          description || null,
          due_date || null,
          account_name,
          account_number,
          bank_name,
          equalSplit,
          JSON.stringify(participants),
        ]
      );

      res.json({
        success: true,
        billId: result.insertId,
      });

    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Server error" });
    }
  }
);


/**
 * GET USER BILLS
 */
router.get("/my-bills", auth, async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT * FROM bill WHERE user_id = ? ORDER BY created_at DESC",
      [req.user.id]
    );

    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

/**
 * GET SINGLE BILL
 */
router.get("/:id", auth, async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT * FROM bill WHERE id = ? AND user_id = ?",
      [req.params.id, req.user.id]
    );

    if (!rows.length)
      return res.status(404).json({ message: "Bill not found" });

    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
