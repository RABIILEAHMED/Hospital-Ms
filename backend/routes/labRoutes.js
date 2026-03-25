import express from "express";

import {
  getLabQueue,
  startProcessing,
  submitLabResult,
  downloadLabPDF
} from "../controllers/labController.js";

import { protect } from "../middleware/authMiddleware.js";
import { authorizeRoles } from "../middleware/roleMiddleware.js";

const router = express.Router();

/* ======================
LAB QUEUE
====================== */
router.get(
  "/queue",
  protect,
  authorizeRoles("labTechnician","admin"),
  getLabQueue
);

/* ======================
START PROCESSING
====================== */
router.put(
  "/start/:id",
  protect,
  authorizeRoles("labTechnician","admin"),
  startProcessing
);

/* ======================
SUBMIT RESULT
====================== */
router.post(
  "/result/:id",
  protect,
  authorizeRoles("labTechnician","admin"),
  submitLabResult
);

/* ======================
DOWNLOAD PDF
====================== */
router.get(
  "/download/:id",
  protect,
  authorizeRoles("labTechnician","admin","dentist"),
  downloadLabPDF
);

export default router;