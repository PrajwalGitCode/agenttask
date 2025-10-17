import User from "../models/User.js";

// Add agent (admin only)
export const addAgent = async (req, res) => {
  try {
    if (!req.user) return res.status(401).json({ message: "Not authorized" });
    if (req.user.role !== "admin")
      return res.status(403).json({ message: "Only admin can add agents" });

    const { name, phone, email, password } = req.body;
    if (!name || !email || !password)
      return res
        .status(400)
        .json({ message: "name, email, and password are required" });

    const existingAgent = await User.findOne({ email });
    if (existingAgent)
      return res.status(400).json({ message: "Agent already exists" });

    const agent = await User.create({
      name,
      phone,
      email,
      password,
      role: "agent",
    });

    const { password: pwd, ...agentData } = agent._doc;
    res.status(201).json({ message: "Agent added", agent: agentData });
  } catch (err) {
    if (err.name === "ValidationError")
      return res
        .status(400)
        .json({ message: "Validation error", error: err.message });
    if (err.code === 11000)
      return res
        .status(400)
        .json({ message: "Duplicate key error", error: err.message });

    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Get all agents
export const getAgents = async (req, res) => {
  try {
    if (!req.user) return res.status(401).json({ message: "Not authorized" });
    if (req.user.role !== "admin")
      return res
        .status(403)
        .json({ message: "Only admin can view agents" });

    const agents = await User.find({ role: "agent" }).select("-password");
    res.json({ agents });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Update agent
export const updateAgent = async (req, res) => {
  try {
    if (!req.user) return res.status(401).json({ message: "Not authorized" });
    if (req.user.role !== "admin")
      return res
        .status(403)
        .json({ message: "Only admin can update agents" });

    const { id } = req.params;
    const { name, phone, email, password } = req.body;

    const agent = await User.findById(id);
    if (!agent || agent.role !== "agent")
      return res.status(404).json({ message: "Agent not found" });

    if (name) agent.name = name;
    if (phone) agent.phone = phone;
    if (email) agent.email = email;
    if (password) agent.password = password; 
    await agent.save();

    const { password: pwd, ...agentData } = agent._doc;
    res.json({ message: "Agent updated", agent: agentData });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

//  Delete agent
export const deleteAgent = async (req, res) => {
  try {
    if (!req.user) return res.status(401).json({ message: "Not authorized" });
    if (req.user.role !== "admin")
      return res
        .status(403)
        .json({ message: "Only admin can delete agents" });

    const { id } = req.params;
    const agent = await User.findById(id);
    if (!agent || agent.role !== "agent")
      return res.status(404).json({ message: "Agent not found" });

    await agent.deleteOne();
    res.json({ message: "Agent deleted" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
