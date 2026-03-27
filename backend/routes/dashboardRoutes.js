import express from "express"
import Patient from "../models/Patient.js"
import Doctor from "../models/Doctor.js"
import Appointment from "../models/Appointment.js"

const router = express.Router()

router.get("/stats", async (req, res) => {
  try {
    const patients = await Patient.countDocuments()
    const doctors = await Doctor.countDocuments()
    const appointments = await Appointment.countDocuments()

    res.json({
      patients,
      doctors,
      appointments
    })
  } catch (err) {
    res.status(500).json({ message: "Server error" })
  }
})

export default router