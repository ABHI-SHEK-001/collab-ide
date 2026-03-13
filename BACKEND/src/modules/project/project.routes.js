import express from "express";
import { getProject, createFile, updateFileContent , deleteFile , renameFile } from "./project.controller.js";
import protect from "../auth/auth.middleware.js";

const router = express.Router();

// Load project structure for a room
router.get("/:roomId", protect, getProject);

router.post("/file", protect, createFile);

router.patch("/file/:fileId", protect, updateFileContent);

router.delete("/file/:fileId", protect, deleteFile);

router.patch("/file/rename/:fileId", protect, renameFile);




export default router;