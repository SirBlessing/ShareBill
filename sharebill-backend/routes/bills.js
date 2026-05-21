const express = require("express");
const pool    = require("../db");
const auth    = require("../middleware/auth");

const router = express.Router();

/*
  ROUTE ORDER MATTERS in Express.
  More specific paths (/create, /my-bills, /public/...)
  must come BEFORE the wildcard /:id route.
*/

/* ══════════════════════════════════════════════
   POST /bills/create  — create a new bill
══════════════════════════════════════════════ */
router.post("/create", auth, async (req, res) => {
  const {
    title, total_amount, description, due_date,
    account_name, account_number, bank_name,
    equalSplit, participants,
  } = req.body;

  if (!title || !total_amount || !account_name || !account_number || !bank_name) {
    return res.status(400).json({ message: "Missing required fields." });
  }

  try {
    // ── Equal-split recalculated server-side (source of truth) ──
    let finalParticipants = participants || [];

    if (equalSplit) {
      const totalPeople = finalParticipants.length + 1; // +1 for creator
      const splitAmount = parseFloat((Number(total_amount) / totalPeople).toFixed(2));

      finalParticipants = finalParticipants.map(p => ({
        ...p,
        amount: splitAmount,
        status: "pending",
      }));
    } else {
      finalParticipants = finalParticipants.map(p => ({
        ...p,
        amount: Number(p.amount) || 0,
        status: "pending",
      }));
    }

    const [result] = await pool.query(
      `INSERT INTO bill
        (user_id, title, total_amount, description, due_date,
         account_name, account_number, bank_name, equal_split, participants)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        req.user.id,
        title,
        Number(total_amount),
        description  || null,
        due_date     || null,
        account_name,
        account_number,
        bank_name,
        equalSplit ? 1 : 0,
        JSON.stringify(finalParticipants),
      ]
    );

    res.json({ success: true, billId: result.insertId });
  } catch (err) {
    console.error("CREATE BILL ERROR:", err);
    res.status(500).json({ message: "Server error. Could not create bill." });
  }
});


/* ══════════════════════════════════════════════
   GET /bills/my-bills  — all bills for logged-in user
══════════════════════════════════════════════ */
router.get("/my-bills", auth, async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT * FROM bill WHERE user_id = ? ORDER BY created_at DESC",
      [req.user.id]
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error." });
  }
});


/* ══════════════════════════════════════════════
   GET /bills/public/:billId/:participantIndex
   PUBLIC — no token needed (participant view)
══════════════════════════════════════════════ */
router.get("/public/:billId/:participantIndex", async (req, res) => {
  const { billId, participantIndex } = req.params;
  try {
    const [rows] = await pool.query(
      `SELECT id, title, total_amount, account_name, account_number,
              bank_name, participants, equal_split, status
       FROM bill WHERE id = ?`,
      [billId]
    );
    if (!rows.length) return res.status(404).json({ message: "Bill not found." });

    const bill = rows[0];
    const participants = JSON.parse(bill.participants || "[]");
    const idx = parseInt(participantIndex, 10);

    if (isNaN(idx) || idx < 0 || idx >= participants.length)
      return res.status(404).json({ message: "Participant not found." });

    const p = participants[idx];
    res.json({
      billId:          bill.id,
      billTitle:       bill.title,
      totalAmount:     bill.total_amount,
      accountName:     bill.account_name,
      accountNumber:   bill.account_number,
      bankName:        bill.bank_name,
      participantName: p.name,
      amount:          p.amount,
      status:          p.status || "pending",
      hasReceipt:      !!p.receipt,
      billStatus:      bill.status,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error." });
  }
});


/* ══════════════════════════════════════════════
   POST /bills/public/:billId/:participantIndex/receipt
   PUBLIC — participant uploads receipt
══════════════════════════════════════════════ */
router.post("/public/:billId/:participantIndex/receipt", async (req, res) => {
  const { billId, participantIndex } = req.params;
  const { receipt } = req.body;

  if (!receipt)
    return res.status(400).json({ message: "No receipt provided." });

  if (receipt.length > 3_000_000)
    return res.status(400).json({ message: "Receipt image too large. Max ~2 MB." });

  try {
    const [rows] = await pool.query("SELECT * FROM bill WHERE id = ?", [billId]);
    if (!rows.length) return res.status(404).json({ message: "Bill not found." });

    const participants = JSON.parse(rows[0].participants || "[]");
    const idx = parseInt(participantIndex, 10);

    if (isNaN(idx) || idx < 0 || idx >= participants.length)
      return res.status(400).json({ message: "Invalid participant." });

    if (participants[idx].status === "paid")
      return res.status(400).json({ message: "Payment already confirmed." });

    participants[idx].receipt = receipt;
    participants[idx].status  = "awaiting";

    await pool.query(
      "UPDATE bill SET participants = ? WHERE id = ?",
      [JSON.stringify(participants), billId]
    );

    res.json({ success: true, message: "Receipt uploaded. Awaiting confirmation." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error." });
  }
});


/* ══════════════════════════════════════════════
   PATCH /bills/:id/participant/:index
   Update one participant's status (mark paid / undo)
══════════════════════════════════════════════ */
router.patch("/:id/participant/:index", auth, async (req, res) => {
  const { status } = req.body;
  const { id, index } = req.params;

  if (!["pending", "awaiting", "paid"].includes(status))
    return res.status(400).json({ message: "Invalid status value." });

  try {
    const [rows] = await pool.query(
      "SELECT * FROM bill WHERE id = ? AND user_id = ?",
      [id, req.user.id]
    );
    if (!rows.length) return res.status(404).json({ message: "Bill not found." });

    const participants = JSON.parse(rows[0].participants || "[]");
    const idx = parseInt(index, 10);

    if (isNaN(idx) || idx < 0 || idx >= participants.length)
      return res.status(400).json({ message: "Invalid participant index." });

    participants[idx].status = status;

    await pool.query(
      "UPDATE bill SET participants = ? WHERE id = ?",
      [JSON.stringify(participants), id]
    );

    res.json({ success: true, participants });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error." });
  }
});


/* ══════════════════════════════════════════════
   PATCH /bills/:id/close  — mark bill as completed
══════════════════════════════════════════════ */
router.patch("/:id/close", auth, async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT id FROM bill WHERE id = ? AND user_id = ?",
      [req.params.id, req.user.id]
    );
    if (!rows.length) return res.status(404).json({ message: "Bill not found." });

    await pool.query(
      "UPDATE bill SET status = 'completed' WHERE id = ?",
      [req.params.id]
    );
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error." });
  }
});


/* ══════════════════════════════════════════════
   GET /bills/:id  — single bill (creator only)
   NOTE: this wildcard route MUST be last
══════════════════════════════════════════════ */
router.get("/:id", auth, async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT * FROM bill WHERE id = ? AND user_id = ?",
      [req.params.id, req.user.id]
    );
    if (!rows.length) return res.status(404).json({ message: "Bill not found." });
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error." });
  }
});


module.exports = router;