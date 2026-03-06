import mongoose from "mongoose";

const participantSchema = new mongoose.Schema(
  {
    room: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Room",
      required: true
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    role: {
      type: String,
      enum: ["admin", "editor", "viewer"],
      required: true
    }
  },
  { timestamps: true }
);

participantSchema.index({ room: 1, user: 1 }, { unique: true });

const Participant = mongoose.model("Participant", participantSchema);

export default Participant;