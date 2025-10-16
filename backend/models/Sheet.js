// models/Sheet.js
import mongoose from "mongoose";

const sheetSchema = new mongoose.Schema({
  agentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  data: [
    {
      firstName: { type: String, required: true },
      phone: { type: String, required: true },
      notes: { type: String, required: false },
    },
  ],
  uploadedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("Sheet", sheetSchema);
