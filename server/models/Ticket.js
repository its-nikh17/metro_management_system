const mongoose = require("mongoose");

const ticketSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
      required: true,
      index: true,
    },
    destination: { type: String, required: true, trim: true },
    startroute: { type: String, required: true, trim: true },
    numberOfTickets: { type: Number, required: true, min: 1, max: 30 },
    fare: { type: Number, required: true, min: 0 },
    status: { type: String, enum: ["active", "cancelled"], default: "active" },
  },
  { timestamps: true }
);

const Ticket = mongoose.model("Ticket", ticketSchema);
module.exports = Ticket;
