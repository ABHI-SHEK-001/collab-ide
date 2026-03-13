import express from "express";
import { runCode } from "./execution.controller.js";
import protect from "../auth/auth.middleware.js";

const router = express.Router();

router.post("/run", protect, runCode);

export default router;