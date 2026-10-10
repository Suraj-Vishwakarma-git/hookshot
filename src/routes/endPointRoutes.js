import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";

import {
    createEndpoint,
    getEndpoints,
    updateEndpoint,
    deleteEndpoint
} from "../controllers/endPointController.js";

const router = express.Router();

router.post("/", authMiddleware, createEndpoint);
router.get("/", authMiddleware, getEndpoints);
router.patch("/:id", authMiddleware, updateEndpoint);
router.delete("/:id", authMiddleware, deleteEndpoint);

export default router;