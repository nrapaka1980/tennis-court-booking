import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import "dotenv/config";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./auth.js";
import courtsRouter from "./routes/courts.js";
import bookingsRouter from "./routes/bookings.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const distPath = path.join(__dirname, "..", "dist");

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

app.use(express.static(distPath));
app.get(/^\/(?!api).*/, (req, res) => {
  res.sendFile(path.join(distPath, "index.html"));
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}`);
});
