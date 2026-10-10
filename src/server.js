import "dotenv/config";
import express from "express";
import cors from "cors";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import endPointRoutes from "./routes/endPointRoutes.js";
import eventRoutes from "./routes/eventRoutes.js";
import { getStats } from "./utils/cache.js";
import { getEndpointDbQueryCount } from "./utils/endpointsHelper.js";

const app = express();
const allowedOrigin = process.env.CLIENT_ORIGIN;
app.use(cors({ origin: allowedOrigin ? [allowedOrigin] : true }));
app.use(express.json({ limit: "1mb" }));
app.get("/", (_req, res) => res.json({ message: "Hookshot API is running", status: "ok" }));
app.get("/health", (_req, res) => res.json({ status: "ok" }));
app.use("/api/auth", authRoutes);
app.use("/api/endpoints", endPointRoutes);
app.use("/api/events", eventRoutes);
app.get("/debug/cache", (_req, res) => res.json({ cache: getStats(), endpointDbQueryCount: getEndpointDbQueryCount() }));
app.use((req, res) => res.status(404).json({ message: `Route not found: ${req.method} ${req.originalUrl}` }));
app.use((err, _req, res, _next) => { console.error(err); res.status(500).json({ message: "Unexpected server error" }); });

const PORT = Number(process.env.PORT || 3000);
try {
  await connectDB();
  app.listen(PORT, () => console.log(`Hookshot API running at http://localhost:${PORT}`));
} catch (error) {
  console.error("Could not connect to MongoDB:", error.message);
  process.exit(1);
}
