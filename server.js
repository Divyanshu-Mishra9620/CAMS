import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import authRoutes from "./routes/auth.js";
import studentRoutes from "./routes/students.js";
import attendanceRoutes from "./routes/attendance.js";
import teacherRoutes from "./routes/teachers.js";
import User from "./models/User.js";
import Teacher from "./models/Teacher.js";

dotenv.config();

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

if (!process.env.MONGODB_URI) {
  console.error("MONGODB_URI is missing from .env");
  process.exit(1);
}

if (!process.env.JWT_SECRET) {
  console.error("JWT_SECRET is missing from .env");
  process.exit(1);
}

const seedDefaultAccounts = async () => {
  let teacherUser = await User.findOne({ username: "teacher" });

  if (!teacherUser) {
    teacherUser = await User.create({
      username: "teacher",
      email: "teacher@cams.local",
      password: "teacher",
      role: "teacher",
    });
  }

  await Teacher.findOneAndUpdate(
    { userId: teacherUser._id },
    {
      userId: teacherUser._id,
      employeeId: "EMP001",
      name: "Teacher",
      email: "teacher@cams.local",
      department: "Computer Science",
      subjects: [],
      classes: [],
    },
    { upsert: true, new: true, setDefaultsOnInsert: true },
  );
};

mongoose
  .connect(process.env.MONGODB_URI)
  .then(async () => {
    console.log("MongoDB connected successfully");
    await seedDefaultAccounts();
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err.message);
    process.exit(1);
  });

app.use("/api/auth", authRoutes);
app.use("/api/students", studentRoutes);
app.use("/api/attendance", attendanceRoutes);
app.use("/api/teachers", teacherRoutes);

app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    database: mongoose.connection.readyState === 1 ? "connected" : "offline",
  });
});

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.use((req, res, next) => {
  if (req.path.startsWith("/api")) {
    return res.status(404).json({ error: "API route not found" });
  }
  next();
});

app.use((err, req, res, next) => {
  console.error("Error:", err);
  res.status(err.status || 500).json({
    error: err.message || "Internal Server Error",
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`CAMS server running on http://localhost:${PORT}`);
});
