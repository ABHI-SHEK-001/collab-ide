import mongoose from "mongoose";

const roomSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    runtime: {
      type: String,
      enum: ["node", "python", "cpp"],
      required: true
    },
    entryFile: {
      type: String,
      required: true
    }
  },
  { timestamps: true }
);

const Room = mongoose.model("Room", roomSchema);

export default Room;