import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";
import cron from "node-cron";
import axios from "axios";

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

/* ======================
   MIDDLEWARE
====================== */
const allowedOrigins = [
  "http://localhost:5173",
  "https://hospital-ms-ten.vercel.app"
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    } else {
      return callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true
}));

app.use(express.json());
app.use("/reports", express.static("reports"));

/* ======================
   TEST ROUTE (MUHIIM)
====================== */
app.get("/", (req, res) => {
  res.send("API is running...");
});

/* ======================
   PING ROUTE (FOR CRON)
====================== */
app.get("/ping", (req, res) => {
  res.status(200).send("pong");
});

/* ======================
   CREATE HTTP SERVER
====================== */
const server = http.createServer(app);

/* ======================
   SOCKET.IO SETUP
====================== */
export const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST", "PUT"],
    credentials: true
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
.catch(err => {
  console.log("❌ DB Error:", err);
  process.exit(1); // muhiim si Render u ogaado crash
});

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
   SELF PING CRON JOB (EVERY 5 MIN)
====================== */
cron.schedule("*/5 * * * *", async () => {
  try {
    const res = await axios.get(`${process.env.BACKEND_URL || "https://hospital-ms-ask1.onrender.com"}/ping`);
    console.log("⏱️ Self ping successful:", res.status);
  } catch (err) {
    console.log("❌ Self ping failed:", err.message);
  }
});

/* ======================
   START SERVER
====================== */
const PORT = process.env.PORT || 5000;

server.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server running on port ${PORT}`);
});