// controllers/sheetController.js
import csvParser from "csv-parser";
import fs from "fs";
import XLSX from "xlsx";
import Sheet from "../models/Sheet.js";
import User from "../models/User.js";
import path from "path";

const REQUIRED_COLUMNS = ["FirstName", "Phone", "Notes"];

// ✅ Helper: parse CSV
const parseCSV = (filePath) =>
  new Promise((resolve, reject) => {
    const results = [];
    fs.createReadStream(filePath)
      .pipe(csvParser())
      .on("data", (row) => results.push(row))
      .on("end", () => resolve(results))
      .on("error", reject);
  });

// ✅ Helper: parse XLS/XLSX
const parseExcel = (filePath) => {
  const workbook = XLSX.readFile(filePath);
  const sheetName = workbook.SheetNames[0];
  const sheet = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);
  return sheet;
};

// Upload and distribute sheet
export const uploadSheet = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "No file uploaded" });

    const ext = path.extname(req.file.originalname).toLowerCase();
    if (![".csv", ".xls", ".xlsx"].includes(ext)) {
      return res.status(400).json({ message: "Only CSV, XLS, XLSX files allowed" });
    }

    let rows = [];
    if (ext === ".csv") {
      rows = await parseCSV(req.file.path);
    } else {
      rows = parseExcel(req.file.path);
    }

    fs.unlinkSync(req.file.path); // cleanup

    if (rows.length === 0) return res.status(400).json({ message: "File is empty" });

    // Validate columns
    for (const col of REQUIRED_COLUMNS) {
      if (!Object.keys(rows[0]).includes(col)) {
        return res.status(400).json({
          message: `Invalid format: Missing required column "${col}"`,
        });
      }
    }

    // Fetch all agents
    const agents = await User.find({ role: "agent" });
    if (agents.length === 0) return res.status(400).json({ message: "No agents found" });

    // Get current total assigned items per agent
    const agentLoad = await Promise.all(
      agents.map(async (agent) => {
        const sheets = await Sheet.find({ agentId: agent._id });
        const totalItems = sheets.reduce((acc, s) => acc + s.data.length, 0);
        return { agent, totalItems };
      })
    );

    // Assign each row to the agent with the least total items
    for (const r of rows) {
      agentLoad.sort((a, b) => a.totalItems - b.totalItems); // sort ascending
      const target = agentLoad[0];

      const chunk = {
        firstName: r.FirstName,
        phone: r.Phone,
        notes: r.Notes || "",
      };

      // Save row in a Sheet document
      await Sheet.create({
        agentId: target.agent._id,
        data: [chunk],
        uploadedBy: req.user._id,
      });

      // Increment agent's count
      target.totalItems += 1;
    }

    return res.status(200).json({
      message: "Sheet uploaded and distributed successfully",
      totalItems: rows.length,
      totalAgents: agents.length,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: err.message || "Server error" });
  }
};

// Get sheets assigned to logged-in agent
export const getAgentSheet = async (req, res) => {
  try {
    const sheets = await Sheet.find({ agentId: req.user._id }).sort({ createdAt: -1 });
    res.status(200).json({ sheets });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch sheets" });
  }
};

// Get all sheets (Admin)
export const getAllSheets = async (req, res) => {
  try {
    const sheets = await Sheet.find()
      .populate("agentId", "name email")
      .populate("uploadedBy", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json({ sheets });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch sheets" });
  }
};

// Agent self-view
export const getMySheets = async (req, res) => {
  try {
    if (!req.user || req.user.role !== "agent") {
      return res.status(403).json({ message: "Only agents can view this data" });
    }

    const sheets = await Sheet.find({ agentId: req.user._id }).sort({ createdAt: -1 });

    res.status(200).json({ sheets });
  } catch (error) {
    console.error("Error fetching agent sheets:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
