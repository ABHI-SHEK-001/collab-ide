import express from "express";
import { createRoom } from "./room.controller.js";
import protect from "../auth/auth.middleware.js";

const router = express.Router();

// Protected route
router.post("/", protect, createRoom);

export default router;