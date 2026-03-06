import Room from "./room.model.js";

export const createRoom = async (req, res) => {
  try {
    const { name, runtime, entryFile } = req.body;

    if (!name || !runtime || !entryFile) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const room = await Room.create({
      name,
      runtime,
      entryFile,
      owner: req.user._id
    });

    res.status(201).json({
      message: "Room created successfully",
      room
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};