import express from "express"

import {
  createTicket,
  getTodayTickets,
  searchTicket,
  acceptTicket,
  rejectTicket,
  completeTicket,
  getTodayWaitingTickets,
  getPublicTickets ,
  getProcessedTickets
} from "../controllers/ticketController.js"

import { protect } from "../middleware/authMiddleware.js"
import { authorizeRoles } from "../middleware/roleMiddleware.js"

const router = express.Router()

/* ======================
CREATE TICKET (Receptionist + Admin)
====================== */
router.post(
  "/",
  protect,
  authorizeRoles("receptionist","admin"),
  createTicket
)

/* ======================
GET ALL TODAY TICKETS (Dentist + Admin)
====================== */
router.get(
  "/",
  protect,
  authorizeRoles("dentist","admin"),
  getTodayTickets
)

/* ======================
WAITING QUEUE (Doctor View)
====================== */
router.get(
  "/waiting",
  protect,
  authorizeRoles("dentist","admin"),
  getTodayWaitingTickets
)

router.get("/public", getPublicTickets)

/* ======================
PROCESSED TICKETS
====================== */
router.get(
  "/processed",
  protect,
  authorizeRoles("dentist","admin"),
  getProcessedTickets
)

/* ======================
SEARCH (Reception + Admin)
====================== */
router.get(
  "/search",
  protect,
  authorizeRoles("receptionist","admin"),
  searchTicket
)

/* ======================
ACTIONS (Doctor)
====================== */

/* ✅ ACCEPT */
router.put(
  "/accept/:ticketId",
  protect,
  authorizeRoles("dentist","admin"),
  acceptTicket
)

/* ❌ REJECT */
router.put(
  "/reject/:ticketId",
  protect,
  authorizeRoles("dentist","admin"),
  rejectTicket
)

/* ✅ COMPLETE */
router.put(
  "/complete/:ticketId",
  protect,
  authorizeRoles("dentist","admin"),
  completeTicket
)

export default router