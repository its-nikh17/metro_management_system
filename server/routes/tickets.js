const router = require("express").Router();
const Ticket = require("../models/Ticket");
const User = require("../models/Users");
const authMiddleware = require("../middleware/auth");

router.post("/book", authMiddleware, async (req, res, next) => {
  try {
    const { start, end, number, fare } = req.body;
    const ticket = await Ticket.create({
      userId: req.userId,
      destination: end,
      startroute: start,
      numberOfTickets: Number(number),
      fare: Number(fare),
      status: "active",
    });

    await User.findByIdAndUpdate(req.userId, {
      $set: {
        ticket: {
          destination: ticket.destination,
          startroute: ticket.startroute,
          numberOfTickets: ticket.numberOfTickets,
          fare: ticket.fare,
          ticketId: ticket._id,
        },
      },
    });

    return res.status(201).json({ ticket });
  } catch (error) {
    return next(error);
  }
});

router.get("/current", authMiddleware, async (req, res, next) => {
  try {
    const ticket = await Ticket.findOne({ userId: req.userId, status: "active" }).sort({ createdAt: -1 });
    if (!ticket) {
      return res.status(404).json({ message: "No active ticket found" });
    }
    return res.status(200).json({ ticket });
  } catch (error) {
    return next(error);
  }
});

router.delete("/current", authMiddleware, async (req, res, next) => {
  try {
    const ticket = await Ticket.findOne({ userId: req.userId, status: "active" }).sort({ createdAt: -1 });
    if (!ticket) {
      return res.status(404).json({ message: "No active ticket to cancel" });
    }

    ticket.status = "cancelled";
    await ticket.save();

    await User.findByIdAndUpdate(req.userId, { $unset: { ticket: "" } });
    return res.status(200).json({ message: "Ticket cancelled successfully" });
  } catch (error) {
    return next(error);
  }
});

module.exports = router;
