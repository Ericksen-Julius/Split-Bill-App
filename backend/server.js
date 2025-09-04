import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";

import authRoutes from "./routes/auth.routes.js";

dotenv.config();

const app = express();
app.use(express.json());

// DB connect
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("✅ MongoDB connected"))
    .catch(err => console.error("❌ MongoDB error:", err));

// Routes
app.use("/api/auth", authRoutes);

app.get("/", (req, res) => res.send("API OK"));

// Start
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ Server running http://localhost:${PORT}`));
