import express from "express"
import {
createPatient,
getPatients,
getPatientById
} from "../controllers/patientController.js"

const router = express.Router()

router.post("/",createPatient)
router.get("/",getPatients)
router.get("/:id",getPatientById)

export default router