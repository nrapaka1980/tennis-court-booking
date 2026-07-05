import express from "express";
import "dotenv/config";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./auth.js";

const app = express();

app.all("/api/auth/*splat", toNodeHandler(auth));

const port = process.env.AUTH_PORT || 3001;
app.listen(port, () => {
  console.log(`Auth server listening on http://localhost:${port}`);
});
