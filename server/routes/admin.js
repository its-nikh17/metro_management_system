const router = require("express").Router();
const User = require("../models/Users");
const Ticket = require("../models/Ticket");
const Announcement = require("../models/Announcement");
const authMiddleware = require("../middleware/auth");
const adminMiddleware = require("../middleware/admin");

router.use(authMiddleware, adminMiddleware);

router.get("/overview", async (req, res, next) => {
  try {
    const [users, tickets, activeTickets, announcements] = await Promise.all([
      User.countDocuments(),
      Ticket.countDocuments(),
      Ticket.countDocuments({ status: "active" }),
      Announcement.countDocuments(),
    ]);

    const revenueData = await Ticket.aggregate([{ $group: { _id: null, total: { $sum: "$fare" } } }]);
    const revenue = revenueData[0]?.total || 0;
    return res.status(200).json({ users, tickets, activeTickets, announcements, revenue });
  } catch (error) {
    return next(error);
  }
});

router.get("/users", async (req, res, next) => {
  try {
    const users = await User.find({}).select("-password").sort({ createdAt: -1 });
    return res.status(200).json({ users });
  } catch (error) {
    return next(error);
  }
});

router.patch("/users/:userId/role", async (req, res, next) => {
  try {
    const { role } = req.body;
    if (!["user", "admin"].includes(role)) {
      return res.status(400).json({ message: "Invalid role value" });
    }
    const user = await User.findByIdAndUpdate(req.params.userId, { $set: { role } }, { new: true }).select(
      "-password"
    );
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.status(200).json({ user });
  } catch (error) {
    return next(error);
  }
});

router.get("/tickets", async (req, res, next) => {
  try {
    const tickets = await Ticket.find({}).sort({ createdAt: -1 });
    return res.status(200).json({ tickets });
  } catch (error) {
    return next(error);
  }
});

router.patch("/tickets/:ticketId/status", async (req, res, next) => {
  try {
    const { status } = req.body;
    if (!["active", "cancelled"].includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }
    const ticket = await Ticket.findByIdAndUpdate(req.params.ticketId, { $set: { status } }, { new: true });
    if (!ticket) {
      return res.status(404).json({ message: "Ticket not found" });
    }
    return res.status(200).json({ ticket });
  } catch (error) {
    return next(error);
  }
});

router.get("/announcements", async (req, res, next) => {
  try {
    const announcements = await Announcement.find({}).sort({ createdAt: -1 });
    return res.status(200).json({ announcements });
  } catch (error) {
    return next(error);
  }
});

router.post("/announcements", async (req, res, next) => {
  try {
    const { title, message, priority } = req.body;
    const announcement = await Announcement.create({ title, message, priority });
    return res.status(201).json({ announcement });
  } catch (error) {
    return next(error);
  }
});

module.exports = router;
