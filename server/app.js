import express from "express";
import "dotenv/config";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./auth.js";
import courtsRouter from "./routes/courts.js";
import bookingsRouter from "./routes/bookings.js";

export function createApp() {
  const app = express();

  // Better Auth needs the raw (unparsed) request body, so it must be mounted
  // before express.json().
  app.all("/api/auth/*splat", toNodeHandler(auth));

  app.use(express.json());

  app.use("/api/courts", courtsRouter);
  app.use("/api/bookings", bookingsRouter);

  app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  });

  return app;
}
