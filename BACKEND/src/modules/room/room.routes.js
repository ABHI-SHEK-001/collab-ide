import express from "express";
import { createRoom, joinRoom, getUserRooms, getRoomDetails } from "./room.controller.js";
import protect from "../auth/auth.middleware.js";

const router = express.Router();

router.post("/", protect, createRoom);

router.post("/:roomId/join", protect, joinRoom);

router.get("/", protect, getUserRooms);

router.get("/:roomId", protect, getRoomDetails);

export default router;