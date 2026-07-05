import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./auth.js";
import { createApiApp } from "./app.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const distPath = path.join(__dirname, "..", "dist");

const app = express();

// Better Auth needs the raw (unparsed) request body, so it must be mounted
// before the API app's express.json() middleware.
app.all("/api/auth/*splat", toNodeHandler(auth));

app.use(createApiApp());

app.use(express.static(distPath));
app.get(/^\/(?!api).*/, (req, res) => {
  res.sendFile(path.join(distPath, "index.html"));
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}`);
});
