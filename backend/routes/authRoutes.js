import express from "express";
import { registerUser, loginUser } from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";
import { authorizeRoles } from "../middleware/roleMiddleware.js";

const router = express.Router();

/* ======================
AUTH
====================== */
router.post("/register", registerUser)
router.post("/login", loginUser)

/* ======================
ROLE TEST ROUTES
====================== */
router.get(
  "/admin-only",
  protect,
  authorizeRoles("admin"),
  (req,res)=>{
    res.json({ message: "Admin access granted" });
  }
);

router.get(
  "/dentist-only",
  protect,
  authorizeRoles("dentist"),
  (req,res)=>{
    res.json({ message: "Dentist access granted" });
  }
);

router.get(
  "/lab-only",
  protect,
  authorizeRoles("labTechnician"),
  (req,res)=>{
    res.json({ message: "Lab access granted" });
  }
);

export default router;