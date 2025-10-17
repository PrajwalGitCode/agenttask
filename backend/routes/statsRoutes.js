// routes/admin.js
import express from "express";
import User from "../models/User.js";
import Sheet from "../models/Sheet.js";

const router = express.Router();

// Get total agents
router.get("/agents", async (req, res) => {
  try {
    // agents are stored in the User model with role 'agent'
    const count = await User.countDocuments({ role: "agent" });
    res.json({ count });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch agents count" });
  }
});

// Get total sheets and total rows
router.get("/sheets", async (req, res) => {
  try {
    const sheets = await Sheet.find();
    const totalRows = sheets.reduce((sum, sheet) => sum + (sheet.data?.length || 0), 0);
    res.json({ totalSheets: sheets.length, totalRows });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch sheets stats" });
  }
});

export default router;
