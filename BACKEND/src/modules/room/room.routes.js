import express from "express";
import { createRoom, joinRoom } from "./room.controller.js";
import protect from "../auth/auth.middleware.js";

const router = express.Router();

router.post("/", protect, createRoom);

router.post("/:roomId/join", protect, joinRoom);

export default router;