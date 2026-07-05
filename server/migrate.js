import "dotenv/config";
import { pool } from "./db.js";

const sql = `
  CREATE EXTENSION IF NOT EXISTS pgcrypto;

  CREATE TABLE IF NOT EXISTS bookings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    court_id TEXT NOT NULL,
    date_key DATE NOT NULL,
    time TEXT NOT NULL,
    booked_by TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE (court_id, date_key, time)
  );

  ALTER TABLE bookings
    ADD COLUMN IF NOT EXISTS user_id TEXT REFERENCES "user"(id) ON DELETE CASCADE;
`;

const backfillCheckSql = `SELECT count(*) FROM bookings WHERE user_id IS NULL;`;
const enforceNotNullSql = `ALTER TABLE bookings ALTER COLUMN user_id SET NOT NULL;`;

async function migrate() {
  await pool.query(sql);
  const { rows } = await pool.query(backfillCheckSql);
  if (Number(rows[0].count) === 0) {
    await pool.query(enforceNotNullSql);
  } else {
    console.warn(
      `Skipping NOT NULL on bookings.user_id: ${rows[0].count} existing row(s) have no owner.`
    );
  }
  console.log("Migration complete: bookings table is ready.");
  await pool.end();
}

migrate().catch((err) => {
  console.error("Migration failed:", err.message);
  process.exit(1);
});
