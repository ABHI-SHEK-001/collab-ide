import mongoose from "mongoose";

const fileSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ["file", "folder"],
    required: true
  },
  parentId: {
    type: String,
    default: null
  },
  content: {
    type: String,
    default: ""
  }
});

const projectSchema = new mongoose.Schema(
  {
    room: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Room",
      required: true,
      unique: true
    },
    files: [fileSchema]
  },
  { timestamps: true }
);

const Project = mongoose.model("Project", projectSchema);

export default Project;