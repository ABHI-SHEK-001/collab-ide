import Project from "./project.model.js";
import Room from "../room/room.model.js";
import Participant from "../participant/participant.model.js";

// Load project for a room
export const getProject = async (req, res) => {
  try {
    const { roomId } = req.params;

    // Check room exists
    const room = await Room.findById(roomId);
    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }

    // Check user is participant
    const participant = await Participant.findOne({
      room: roomId,
      user: req.user._id
    });

    if (!participant) {
      return res.status(403).json({ message: "Not authorized for this room" });
    }

    // Find project
    let project = await Project.findOne({ room: roomId });

    // If project doesn't exist, create default structure
    if (!project) {
      project = await Project.create({
        room: roomId,
        files: [
          {
            id: "root",
            name: "root",
            type: "folder",
            parentId: null
          }
        ]
      });
    }

    res.status(200).json(project);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// adding files

export const createFile = async (req, res) => {
  try {
    const { roomId, name, type, parentId } = req.body;

    if (!roomId || !name || !type) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    if (!["file", "folder"].includes(type)) {
      return res.status(400).json({ message: "Invalid type" });
    }

    const project = await Project.findOne({ room: roomId });

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    const newFile = {
      id: new Date().getTime().toString(),
      name,
      type,
      parentId: parentId || "root",
      content: type === "file" ? "" : undefined
    };

    project.files.push(newFile);

    await project.save();

    res.status(201).json({
      message: "File created",
      file: newFile
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

//updtae file

export const updateFileContent = async (req, res) => {
  try {
    const { fileId } = req.params;
    const { roomId, content } = req.body;

    if (!roomId) {
      return res.status(400).json({ message: "roomId required" });
    }

    const project = await Project.findOne({ room: roomId });

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    const file = project.files.find(f => f.id === fileId);

    if (!file) {
      return res.status(404).json({ message: "File not found" });
    }

    if (file.type !== "file") {
      return res.status(400).json({ message: "Cannot edit folder content" });
    }

    file.content = content;

    await project.save();

    res.status(200).json({
      message: "File content updated",
      file
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// delete file

export const deleteFile = async (req, res) => {
  try {
    const { fileId } = req.params;
    const { roomId } = req.body;

    const project = await Project.findOne({ room: roomId });

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    const filesToDelete = new Set([fileId]);

    let found = true;

    while (found) {
      found = false;

      project.files.forEach(file => {
        if (filesToDelete.has(file.parentId)) {
          filesToDelete.add(file.id);
          found = true;
        }
      });
    }

    project.files = project.files.filter(file => !filesToDelete.has(file.id));

    await project.save();

    res.status(200).json({
      message: "File deleted successfully"
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// rename folders

export const renameFile = async (req, res) => {
  try {
    const { fileId } = req.params;
    const { roomId, newName } = req.body;

    if (!newName) {
      return res.status(400).json({ message: "file alreday exist" });
    }

    const project = await Project.findOne({ room: roomId });

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    const file = project.files.find(f => f.id === fileId);

    if (!file) {
      return res.status(404).json({ message: "File not found" });
    }

    file.name = newName;

    await project.save();

    res.status(200).json({
      message: "File renamed successfully",
      file
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};