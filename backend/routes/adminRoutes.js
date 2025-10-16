import express from "express";
import {
  addAgent,
  getAgents,
  updateAgent,
  deleteAgent,
} from "../controllers/adminController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/add-agent", protect, addAgent);
router.get("/agents", protect, getAgents);
router.put("/agents/:id", protect, updateAgent);
router.delete("/agents/:id", protect, deleteAgent);

export default router;
