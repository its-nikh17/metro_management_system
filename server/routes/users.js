const router = require("express").Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/Users");
const Ticket = require("../models/Ticket");
const authMiddleware = require("../middleware/auth");

const createToken = (userId) =>
  jwt.sign({ userId }, process.env.JWT_SECRET || "metro-secret", { expiresIn: "7d" });

router.post("/register", async (req, res, next) => {
  try {
    const { name, age, email, password, phone } = req.body;
    const existing = await User.findOne({ email: String(email).toLowerCase().trim() });
    if (existing) {
      return res.status(409).json({ message: "Email already in use" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const adminCount = await User.countDocuments({ role: "admin" });
    const role = adminCount === 0 ? "admin" : "user";
    const user = await User.create({
      name,
      age,
      email,
      password: hashedPassword,
      phone,
      role,
    });

    return res.status(201).json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        age: user.age,
        role: user.role,
      },
    });
  } catch (error) {
    return next(error);
  }
});

router.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: String(email).toLowerCase().trim() }).select("+password");
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = createToken(user._id);
    return res.status(200).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        age: user.age,
        role: user.role,
      },
    });
  } catch (error) {
    return next(error);
  }
});

router.get("/history", authMiddleware, async (req, res, next) => {
  try {
    const tickets = await Ticket.find({ userId: req.userId }).sort({ createdAt: -1 });
    return res.status(200).json({ tickets });
  } catch (error) {
    return next(error);
  }
});

router.get("/users/me", authMiddleware, async (req, res, next) => {
  try {
    const user = await User.findById(req.userId).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.status(200).json({ user });
  } catch (error) {
    return next(error);
  }
});

module.exports = router;
