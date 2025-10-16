// routes/sheetRoutes.js
import express from "express";
import multer from "multer";
import { protect } from "../middleware/authMiddleware.js";
import { uploadSheet, getAgentSheet, getAllSheets, getMySheets  } from "../controllers/sheetController.js";

const router = express.Router();

const upload = multer({ dest: "uploads/" });
router.post("/upload", protect, upload.single("file"), uploadSheet);
router.get("/my-sheet", protect, getAgentSheet);
router.get("/allsheet", protect, getAllSheets);
router.get("/mysheet", protect, getMySheets);
export default router;
