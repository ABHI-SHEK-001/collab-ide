import Room from "./room.model.js";
import Participant from "../participant/participant.model.js";

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

    await Participant.create({
      room: room._id,
      user: req.user._id,
      role: "admin"
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

// adding participant


export const joinRoom = async (req, res) => {
  try {
    const { roomId } = req.params;
    const { role } = req.body;

    if (!role || !["viewer", "editor"].includes(role)) {
      return res.status(400).json({ message: "Invalid role" });
    }

    const room = await Room.findById(roomId);
    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }

    // Check if already participant
    const existing = await Participant.findOne({
      room: roomId,
      user: req.user._id
    });

    if (existing) {
      return res.status(400).json({ message: "Already joined this room" });
    }

    const participant = await Participant.create({
      room: roomId,
      user: req.user._id,
      role
    });

    res.status(200).json({
      message: "Joined room successfully",
      participant
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// user room details

export const getUserRooms = async (req, res) => {
  try {
    const participants = await Participant.find({
      user: req.user._id
    }).populate("room");

    const rooms = participants.map(p => ({
      roomId: p.room._id,
      name: p.room.name,
      runtime: p.room.runtime,
      role: p.role
    }));

    res.status(200).json({
      rooms
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// room details

export const getRoomDetails = async (req, res) => {
  try {
    const { roomId } = req.params;

    const room = await Room.findById(roomId);

    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }

    const participant = await Participant.findOne({
      room: roomId,
      user: req.user._id
    });

    if (!participant) {
      return res.status(403).json({ message: "You are not part of this room" });
    }

    const participants = await Participant.find({ room: roomId })
      .populate("user", "name email");

    res.status(200).json({
      room,
      participants
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};