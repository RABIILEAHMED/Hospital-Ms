import Ticket from "../models/Ticket.js"
import Patient from "../models/Patient.js"
import { io } from "../server.js"

/* ======================
CREATE TICKET (FINAL)
====================== */
export const createTicket = async (req, res) => {
  try {

    let { name, age, gender, phone, address } = req.body

    name = name?.trim()
    phone = phone?.trim()
    address = address?.trim()

    if (!name || !age || !gender) {
      return res.status(400).json({ message: "Name, age & gender required" })
    }

    if (!phone) {
      return res.status(400).json({ message: "Phone is required" })
    }

    age = Number(age)

    /* 🧠 CHECK DUPLICATE (ACTIVE ONLY) */
    const existingTicket = await Ticket.findOne({
      phone,
      active: true
    })

    if (existingTicket) {
      return res.status(400).json({
        message: `⚠️ Patient already has ticket #${existingTicket.ticketNumber}`
      })
    }

    /* 📞 AUTO DETECT PATIENT */
    let patient = await Patient.findOne({ phone })

    if (patient) {
      name = patient.fullName
      gender = patient.gender
      age = patient.age
      address = patient.address
    }

    /* 🔢 LAST TICKET */
    const lastTicket = await Ticket.findOne().sort({ ticketNumber: -1 })

    const ticketNumber = lastTicket ? lastTicket.ticketNumber + 1 : 1
    const queueNumber = lastTicket ? lastTicket.queueNumber + 1 : 1

    /* 🎫 CREATE */
    const newTicket = await Ticket.create({
      name,
      age,
      gender,
      phone,
      address: address || "",
      ticketNumber,
      queueNumber,
      status: "waiting",
      active: true
    })

    io.emit("ticketCreated", newTicket)

    res.status(201).json(newTicket)

  } catch (error) {
    console.log(error)
    res.status(500).json({ message: "Ticket creation failed" })
  }
}

/* ======================
GET ALL TICKETS (NO DATE BUG)
====================== */
export const getTodayTickets = async (req, res) => {
  try {

    const tickets = await Ticket.find({})
      .sort({ createdAt: -1 })
      .limit(100)

    res.json(tickets)

  } catch (error) {
    res.status(500).json({ message: "Failed to fetch tickets" })
  }
}

/* ======================
WAITING
====================== */
/* ======================
WAITING (FIXED FINAL)
====================== */
export const getTodayWaitingTickets = async (req, res) => {
  try {

    const tickets = await Ticket.find({
      status: { $in: ["waiting", "accepted"] },
      active: true
    }).sort({ queueNumber: 1 })

    res.json(tickets)

  } catch (error) {
    console.log(error)
    res.status(500).json({ message: "Failed to fetch waiting tickets" })
  }
}

/* ======================
ACCEPTED
====================== */
export const getAcceptedTickets = async (req, res) => {
  try {

    const tickets = await Ticket.find({
      status: "accepted",
      active: true
    }).sort({ updatedAt: -1 })

    res.json(tickets)

  } catch (error) {
    res.status(500).json({ message: "Failed to fetch accepted tickets" })
  }
}

/* ======================
PROCESSED
====================== */
export const getProcessedTickets = async (req, res) => {
  try {

    const tickets = await Ticket.find({
      active: false
    }).sort({ updatedAt: -1 })

    res.json(tickets)

  } catch (error) {
    res.status(500).json({ message: "Failed to fetch processed tickets" })
  }
}

/* ======================
SEARCH
====================== */
export const searchTicket = async (req, res) => {
  try {

    const { query } = req.query

    const ticket = await Ticket.findOne({
      $or: [
        { phone: { $regex: query, $options: "i" } },
        { ticketNumber: Number(query) }
      ]
    }).sort({ createdAt: -1 })

    if (!ticket) {
      return res.status(404).json({ message: "Ticket not found" })
    }

    res.json(ticket)

  } catch {
    res.status(500).json({ message: "Search failed" })
  }
}

/* ======================
ACCEPT
====================== */
export const acceptTicket = async (req, res) => {
  try {

    const ticket = await Ticket.findById(req.params.ticketId)

    if (!ticket) {
      return res.status(404).json({ message: "Ticket not found" })
    }

    if (!ticket.active) {
      return res.status(400).json({ message: "Already processed" })
    }

    let patient = await Patient.findOne({ phone: ticket.phone })

    if (!patient) {
      patient = await Patient.create({
        fullName: ticket.name,
        phone: ticket.phone,
        address: ticket.address,
        gender: ticket.gender,
        age: ticket.age
      })
    }

    ticket.status = "accepted"
    ticket.active = true

    await ticket.save()

    io.emit("ticketUpdated", ticket)

    res.json({ message: "Patient accepted", patient, ticket })

  } catch {
    res.status(500).json({ message: "Accept failed" })
  }
}

/* ======================
REJECT
====================== */
export const rejectTicket = async (req, res) => {
  try {

    const ticket = await Ticket.findById(req.params.ticketId)

    if (!ticket) {
      return res.status(404).json({ message: "Ticket not found" })
    }

    ticket.status = "rejected"
    ticket.active = false

    await ticket.save()

    io.emit("ticketUpdated", ticket)

    res.json({ message: "Ticket rejected" })

  } catch {
    res.status(500).json({ message: "Reject failed" })
  }
}

/* ======================
COMPLETE
====================== */
export const completeTicket = async (req, res) => {
  try {

    const ticket = await Ticket.findById(req.params.ticketId)

    if (!ticket) {
      return res.status(404).json({ message: "Ticket not found" })
    }

    ticket.status = "done"
    ticket.active = false

    await ticket.save()

    io.emit("ticketUpdated", ticket)

    res.json({ message: "Ticket marked as done" })

  } catch {
    res.status(500).json({ message: "Complete failed" })
  }
}