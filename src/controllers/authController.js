import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const tokenFor = (user) => jwt.sign(
  { userId: String(user._id) },
  process.env.JWT_SECRET || "development_only_change_this_secret",
  { expiresIn: "1d" }
);

export const signup = async (req, res) => {
  try {
    const name = String(req.body.name || "").trim();
    const email = String(req.body.email || "").trim().toLowerCase();
    const password = String(req.body.password || "");
    if (!name || !email || !password) return res.status(400).json({ message: "Name, email and password are required" });
    if (!/^\S+@\S+\.\S+$/.test(email)) return res.status(400).json({ message: "Enter a valid email address" });
    if (password.length < 8) return res.status(400).json({ message: "Password must be at least 8 characters" });
    if (await User.findOne({ email })) return res.status(409).json({ message: "An account with this email already exists" });
    const user = await User.create({ name, email, password: await bcrypt.hash(password, 10) });
    return res.status(201).json({ message: "Account created successfully", token: tokenFor(user), user: { id: user._id, name: user.name, email: user.email } });
  } catch (error) {
    if (error.code === 11000) return res.status(409).json({ message: "An account with this email already exists" });
    console.error("Signup failed:", error);
    return res.status(500).json({ message: "Unable to create account right now" });
  }
};

export const login = async (req, res) => {
  try {
    const email = String(req.body.email || "").trim().toLowerCase();
    const password = String(req.body.password || "");
    if (!email || !password) return res.status(400).json({ message: "Email and password are required" });
    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) return res.status(401).json({ message: "Invalid email or password" });
    return res.status(200).json({ message: "Login successful", token: tokenFor(user), user: { id: user._id, name: user.name, email: user.email } });
  } catch (error) {
    console.error("Login failed:", error);
    return res.status(500).json({ message: "Unable to log in right now" });
  }
};

export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    return res.status(200).json({ user: { id: user._id, name: user.name, email: user.email, createdAt: user.createdAt } });
  } catch (error) {
    console.error("getMe failed:", error);
    return res.status(500).json({ message: "Unable to fetch profile" });
  }
};
