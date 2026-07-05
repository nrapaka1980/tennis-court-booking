import { betterAuth } from "better-auth";
import "dotenv/config";
import { pool } from "./db.js";

export const auth = betterAuth({
  database: pool,
  baseURL: process.env.BETTER_AUTH_URL || `http://localhost:${process.env.AUTH_PORT || 3001}`,
  secret: process.env.BETTER_AUTH_SECRET,
  trustedOrigins: [process.env.CLIENT_ORIGIN || "http://localhost:5173"],
  emailAndPassword: {
    enabled: true,
  },
});
