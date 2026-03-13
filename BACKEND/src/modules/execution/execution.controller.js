import fs from "fs";
import path from "path";
import { exec } from "child_process";
import { v4 as uuidv4 } from "uuid";
import Project from "../project/project.model.js";
import Room from "../room/room.model.js";

export const runCode = async (req, res) => {
  try {
    const { roomId } = req.body;

    const room = await Room.findById(roomId);
    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }

    const project = await Project.findOne({ room: roomId });
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    const runtime = room.runtime;
    const entryFile = room.entryFile;

    const tempDir = path.join("tmp", uuidv4());

    fs.mkdirSync(tempDir, { recursive: true });

    // Write files to temp directory
    project.files.forEach(file => {
      if (file.type === "file") {
        const filePath = path.join(tempDir, file.name);
        fs.writeFileSync(filePath, file.content || "");
      }
    });

    let command = "";

    if (runtime === "node") {
      command = `node ${entryFile}`;
    }

    if (runtime === "python") {
      command = `python ${entryFile}`;
    }

    if (runtime === "cpp") {
      command = `g++ ${entryFile} -o main && ./main`;
    }

    exec(command, { cwd: tempDir, timeout: 5000 }, (error, stdout, stderr) => {

      // cleanup
      fs.rmSync(tempDir, { recursive: true, force: true });

      if (error) {
        return res.json({
          success: false,
          error: stderr || error.message
        });
      }

      res.json({
        success: true,
        output: stdout
      });

    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Execution error" });
  }
};