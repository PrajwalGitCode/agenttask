// controllers/sheetController.js
import csvParser from "csv-parser";
import fs from "fs";
import XLSX from "xlsx";
import Sheet from "../models/Sheet.js";
import User from "../models/User.js";
import path from "path";

const REQUIRED_COLUMNS = ["FirstName", "Phone", "Notes"];

// Helper: parse CSV
const parseCSV = (filePath) =>
  new Promise((resolve, reject) => {
    const results = [];
    fs.createReadStream(filePath)
      .pipe(csvParser())
      .on("data", (row) => results.push(row))
      .on("end", () => resolve(results))
      .on("error", reject);
  });

// Helper: parse XLS/XLSX
const parseExcel = (filePath) => {
  const workbook = XLSX.readFile(filePath);
  const sheetName = workbook.SheetNames[0];
  const sheet = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);
  return sheet;
};


//  Upload and distribute sheet (smart distribution)
export const uploadSheet = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "No file uploaded" });

    const ext = path.extname(req.file.originalname).toLowerCase();
    if (![".csv", ".xls", ".xlsx"].includes(ext)) {
      return res.status(400).json({ message: "Only CSV, XLS, XLSX files allowed" });
    }

    let rows = ext === ".csv" ? await parseCSV(req.file.path) : parseExcel(req.file.path);
    fs.unlinkSync(req.file.path); // cleanup

    if (rows.length === 0) return res.status(400).json({ message: "File is empty" });

    for (const col of REQUIRED_COLUMNS) {
      if (!Object.keys(rows[0]).includes(col)) {
        return res.status(400).json({ message: `Missing required column "${col}"` });
      }
    }

    const agents = await User.find({ role: "agent" });
    if (!agents.length) return res.status(400).json({ message: "No agents found" });

    // Fetch current sheet counts
    const sheets = await Sheet.find({ agentId: { $in: agents.map(a => a._id) } });
    const agentMap = agents.map(agent => {
      const sheet = sheets.find(s => s.agentId.toString() === agent._id.toString());
      return {
        agent,
        count: sheet ? sheet.data.length : 0,
        sheet: sheet || null,
      };
    });

    // Sort agents by current count (ascending)
    agentMap.sort((a, b) => a.count - b.count);

    // Distribute rows one by one to the agent with least rows
    for (const row of rows) {
      agentMap[0].sheet
        ? agentMap[0].sheet.data.push({
            firstName: row.FirstName,
            phone: row.Phone,
            notes: row.Notes || "",
          })
        : agentMap[0].sheet = new Sheet({
            agentId: agentMap[0].agent._id,
            data: [{
              firstName: row.FirstName,
              phone: row.Phone,
              notes: row.Notes || "",
            }],
            uploadedBy: req.user._id,
          });

      agentMap[0].count++; 
      agentMap.sort((a, b) => a.count - b.count);
    }

    // Save all sheets
    for (const { sheet } of agentMap) {
      await sheet.save();
    }

    return res.status(200).json({
      message: "Sheet uploaded and distributed fairly",
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
    const sheet = await Sheet.findOne({ agentId: req.user._id });
    res.status(200).json({ sheet });
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
