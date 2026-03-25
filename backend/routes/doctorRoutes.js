import express from "express"

import {
  createDoctor,
  getDoctors,
  updateDoctor,
  deleteDoctor
} from "../controllers/doctorController.js"

import { protect } from "../middleware/authMiddleware.js"
import { authorizeRoles } from "../middleware/roleMiddleware.js"

const router = express.Router()

/* ======================
ADMIN ONLY
====================== */
router.post(
  "/",
  protect,
  authorizeRoles("admin"),
  createDoctor
)

router.put(
  "/:id",
  protect,
  authorizeRoles("admin"),
  updateDoctor
)

router.delete(
  "/:id",
  protect,
  authorizeRoles("admin"),
  deleteDoctor
)

/* ======================
VIEW DOCTORS (ALL STAFF)
====================== */
router.get(
  "/",
  protect,
  authorizeRoles("admin","receptionist","dentist"),
  getDoctors
)

export default router