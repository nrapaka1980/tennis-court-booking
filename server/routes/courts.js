import { Router } from "express";
import { courts } from "../data/courts.js";

const router = Router();

router.get("/", (req, res) => {
  res.json(courts);
});

export default router;
