import express from "express"
import {
getTodayTickets,
acceptTicket,
rejectTicket
} from "../controllers/ticketController.js"

const router = express.Router()

router.get("/today", getTodayTickets)
router.put("/accept/:id", acceptTicket)
router.put("/reject/:id", rejectTicket)

export default router