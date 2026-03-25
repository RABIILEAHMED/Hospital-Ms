import mongoose from "mongoose"

const ticketSchema = new mongoose.Schema(
{
  /* 🧍 BASIC PATIENT INFO */
  name: {
    type: String,
    required: true
  },

  age: {
    type: Number,
    required: true
  },

  gender: {
    type: String,
    enum: ["male","female"],
    required: true
  },

  phone: {
    type: String,
    default: ""
  },

  address: {
    type: String,
    default: ""
  },

  /* 🎫 QUEUE SYSTEM */
  ticketNumber: {
    type: Number,
    required: true
  },

  queueNumber: {
    type: Number,
    required: true
  },

  /* 🔄 STATUS FLOW */
  status: {
    type: String,
    enum: ["waiting","accepted","done","rejected"],
    default: "waiting"
  },

  /* 🔥 ACTIVE = TODAY QUEUE CONTROL */
  active: {
    type: Boolean,
    default: true
  },

  /* 👨‍⚕️ DOCTOR */
  doctor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    default: null
  }

},
{ timestamps: true }
)

/* ⚡ INDEXES (FAST SEARCH & SORT) */
ticketSchema.index({ createdAt: 1 })
ticketSchema.index({ ticketNumber: 1 })
ticketSchema.index({ queueNumber: 1 })
ticketSchema.index({ status: 1 })

export default mongoose.model("Ticket", ticketSchema)