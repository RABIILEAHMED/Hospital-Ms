import express from "express"

import {
  searchPatient,
  getTests,
  createInvoice,
  getPayments
} from "../controllers/billingController.js"

import { protect } from "../middleware/authMiddleware.js"
import { authorizeRoles } from "../middleware/roleMiddleware.js"

const router = express.Router()

/* ======================
SEARCH PATIENT
====================== */
router.get(
  "/search",
  protect,
  authorizeRoles("accountant","admin"),
  searchPatient
)

/* ======================
TEST LIST
====================== */
router.get(
  "/tests",
  protect,
  authorizeRoles("accountant","admin"),
  getTests
)

/* ======================
CREATE INVOICE
====================== */
router.post(
  "/invoice",
  protect,
  authorizeRoles("accountant","admin"),
  createInvoice
)

/* ======================
PAYMENTS
====================== */
router.get(
  "/payments",
  protect,
  authorizeRoles("accountant","admin"),
  getPayments
)

export default router