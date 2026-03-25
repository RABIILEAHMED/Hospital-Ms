import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";

/* ROUTES */
import authRoutes from "./routes/authRoutes.js";
import patientRoutes from "./routes/patientRoutes.js";
import doctorRoutes from "./routes/doctorRoutes.js";
import ticketRoutes from "./routes/ticketRoutes.js";
import billingRoutes from "./routes/billingRoutes.js";
import labRoutes from "./routes/labRoutes.js";
import appointmentRoutes from "./routes/appointmentRoutes.js";

dotenv.config();

const app = express();

/* MIDDLEWARE */
app.use(cors());
app.use(express.json());
app.use("/reports",express.static("reports"))

/* ======================
   CREATE HTTP SERVER
====================== */
const server = http.createServer(app);

/* ======================
   SOCKET.IO SETUP
====================== */
export const io = new Server(server, {
  cors: {
    origin: "*", // frontend url haddii aad leedahay geli
    methods: ["GET", "POST", "PUT"]
  }
});

/* SOCKET CONNECTION */
io.on("connection", (socket) => {
  console.log("🟢 User connected:", socket.id);

  socket.on("disconnect", () => {
    console.log("🔴 User disconnected:", socket.id);
  });
});

/* ======================
   DATABASE
====================== */
mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("✅ MongoDB Connected"))
.catch(err => console.log("❌ DB Error:", err));

/* ======================
   ROUTES
====================== */
app.use("/api/auth", authRoutes);
app.use("/api/patients", patientRoutes);
app.use("/api/doctors", doctorRoutes);
app.use("/api/tickets", ticketRoutes);
app.use("/api/billing", billingRoutes);
app.use("/api/lab", labRoutes);
app.use("/api/appointments", appointmentRoutes);

/* ======================
   START SERVER
====================== */
const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});