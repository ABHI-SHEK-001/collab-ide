import express from "express";
import { register, login } from "./auth.controller.js";
import protect from "./auth.middleware.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/me", protect, (req, res) => {
  res.status(200).json({
    message: "Protected route accessed",
    user: req.user
  });
});

export default router;