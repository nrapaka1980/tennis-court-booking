import { createApiApp } from "./app.js";

const port = process.env.PORT || 3000;
createApiApp().listen(port, () => {
  console.log(`API server listening on http://localhost:${port}`);
});
