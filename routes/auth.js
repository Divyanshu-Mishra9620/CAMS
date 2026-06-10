import express from "express";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import Student from "../models/Student.js";
import Teacher from "../models/Teacher.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

const buildUserResponse = (user, profile = null) => ({
  id: user._id,
  email: user.email,
  username: user.username,
  name: profile?.name || user.username,
  role: user.role,
  studentId: profile?.studentId,
  employeeId: profile?.employeeId,
  semester: profile?.semester,
  classes: profile?.classes || [],
  subjects: profile?.subjects || [],
  department: profile?.department,
  profileId: profile?._id,
});

const getAvailableUsername = async (email, preferredUsername) => {
  const baseUsername = (preferredUsername || email.split("@")[0])
    .trim()
    .replace(/\s+/g, "")
    .toLowerCase();
  let username = baseUsername;
  let counter = 1;

  while (await User.exists({ username })) {
    username = `${baseUsername}${counter}`;
    counter += 1;
  }

  return username;
};

// Register route
router.post("/register", async (req, res) => {
  try {
    const {
      username,
      email,
      password,
      role,
      studentId,
      name,
      semester,
      employeeId,
      department,
      subjects,
    } = req.body;

    // Validate required fields
    if (!email || !password || !role || !name) {
      return res.status(400).json({
        message: "Missing required fields: email, password, role, name",
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [{ email: email.toLowerCase() }],
    });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "Email already registered. Please login instead." });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const finalUsername = await getAvailableUsername(normalizedEmail, username);

    // Create user
    const user = new User({
      username: finalUsername,
      email: normalizedEmail,
      password,
      role,
    });

    await user.save();

    // Create role-specific profile
    let profile = null;
    if (role === "student") {
      profile = new Student({
        userId: user._id,
        studentId: studentId || `S${Date.now()}`,
        name,
        email: normalizedEmail,
        semester: semester || 1,
        classes: [],
      });
      await profile.save();
    } else if (role === "teacher") {
      profile = new Teacher({
        userId: user._id,
        employeeId: employeeId || `EMP${Date.now()}`,
        name,
        email: normalizedEmail,
        department: department || "General",
        subjects: subjects || [],
        classes: [],
      });
      await profile.save();
    }

    // Generate token
    const token = jwt.sign(
      { userId: user._id, role: user.role, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "7d" },
    );

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      token,
      user: buildUserResponse(user, profile),
      profile,
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Registration failed",
    });
  }
});

// Login route
router.post("/login", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Support both username and email login
    const loginField = email || username;

    if (!loginField || !password) {
      return res.status(400).json({
        success: false,
        message: "Email/username and password are required",
      });
    }

    // Find user by email or username
    const user = await User.findOne({
      $or: [{ email: loginField.toLowerCase() }, { username: loginField }],
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // Check password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // Generate token
    const token = jwt.sign(
      { userId: user._id, role: user.role, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "7d" },
    );

    // Get role-specific profile
    let profile = null;
    if (user.role === "student") {
      profile = await Student.findOne({ userId: user._id });
    } else if (user.role === "teacher") {
      profile = await Teacher.findOne({ userId: user._id });
    }

    res.json({
      success: true,
      message: "Login successful",
      token,
      user: buildUserResponse(user, profile),
      profile,
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Login failed",
    });
  }
});

// Verify token route
router.get("/verify", verifyToken, async (req, res) => {
  const user = await User.findById(req.user.userId);

  if (!user) {
    return res.status(404).json({ valid: false, message: "User not found" });
  }

  let profile = null;
  if (user.role === "student") {
    profile = await Student.findOne({ userId: user._id });
  } else if (user.role === "teacher") {
    profile = await Teacher.findOne({ userId: user._id });
  }

  res.json({ valid: true, user: buildUserResponse(user, profile), profile });
});

// Get current user
router.get("/me", verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);

    let profile = null;
    if (user.role === "student") {
      profile = await Student.findOne({ userId: user._id });
    } else if (user.role === "teacher") {
      profile = await Teacher.findOne({ userId: user._id });
    }

    res.json({ user: buildUserResponse(user, profile), profile });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
