import { Router } from "express";
import { fromNodeHeaders } from "better-auth/node";
import { pool } from "../db.js";
import { auth } from "../auth.js";
import { courts } from "../data/courts.js";

const router = Router();

const DATE_KEY_RE = /^\d{4}-\d{2}-\d{2}$/;
const TIME_RE = /^([01]\d|2[0-3]):00$/;
const courtIds = new Set(courts.map((c) => c.id));

function selectColumns() {
  return `id, court_id AS "courtId", to_char(date_key, 'YYYY-MM-DD') AS "dateKey", time, booked_by AS "bookedBy", user_id AS "userId", created_at AS "createdAt"`;
}

async function requireSession(req, res) {
  const session = await auth.api.getSession({ headers: fromNodeHeaders(req.headers) });
  if (!session) {
    res.status(401).json({ error: "Sign in required" });
    return null;
  }
  return session;
}

router.get("/", async (req, res, next) => {
  try {
    const { rows } = await pool.query(
      `SELECT ${selectColumns()} FROM bookings ORDER BY date_key, time`
    );
    res.json(rows);
  } catch (err) {
    next(err);
  }
});

router.post("/", async (req, res, next) => {
  try {
    const session = await requireSession(req, res);
    if (!session) return;

    const { courtId, dateKey, time } = req.body ?? {};

    if (!courtIds.has(courtId)) {
      return res.status(400).json({ error: "Unknown court" });
    }
    if (typeof dateKey !== "string" || !DATE_KEY_RE.test(dateKey)) {
      return res.status(400).json({ error: "Invalid date" });
    }
    if (typeof time !== "string" || !TIME_RE.test(time)) {
      return res.status(400).json({ error: "Invalid time slot" });
    }

    const { rows } = await pool.query(
      `INSERT INTO bookings (court_id, date_key, time, booked_by, user_id)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING ${selectColumns()}`,
      [courtId, dateKey, time, session.user.name, session.user.id]
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    if (err.code === "23505") {
      return res.status(409).json({ error: "That slot has just been booked by someone else." });
    }
    next(err);
  }
});

router.delete("/:id", async (req, res, next) => {
  try {
    const session = await requireSession(req, res);
    if (!session) return;

    const { rows } = await pool.query("SELECT user_id AS \"userId\" FROM bookings WHERE id = $1", [
      req.params.id,
    ]);
    if (rows.length === 0) {
      return res.status(404).json({ error: "Booking not found" });
    }
    if (rows[0].userId !== session.user.id) {
      return res.status(403).json({ error: "You can only cancel your own bookings" });
    }

    await pool.query("DELETE FROM bookings WHERE id = $1", [req.params.id]);
    res.status(204).end();
  } catch (err) {
    next(err);
  }
});

export default router;
