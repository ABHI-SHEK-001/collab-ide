import express from "express";
import cors from "cors";
import authRoutes from "./modules/auth/auth.routes.js";
import roomRoutes from "./modules/room/room.routes.js";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Collab-IDE Backend Running");
});

app.use("/api/auth", authRoutes);

app.use("/api/room", roomRoutes);

export default app;