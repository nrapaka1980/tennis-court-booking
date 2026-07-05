import express from "express";
import "dotenv/config";
import courtsRouter from "./routes/courts.js";
import bookingsRouter from "./routes/bookings.js";

export function createApiApp() {
  const app = express();

  app.use(express.json());

  app.use("/api/courts", courtsRouter);
  app.use("/api/bookings", bookingsRouter);

  app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  });

  return app;
}
