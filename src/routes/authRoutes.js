import express from "express";
import { signup , login , getMe } from "../controllers/authController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import { createLimiter ,rateLimitMiddleware} from "../middleware/rateLimiter.js";

const router = express.Router();
const loginLimiter = createLimiter({
    limit: 3,
    windowMs: 10_000
});

const loginRateLimiter = rateLimitMiddleware({
    limiter: loginLimiter,
    keyGenerator: (req) => {
        return req.ip + ":" + req.body.email;
    }
});

router.post("/signup", signup);
router.post("/login", loginRateLimiter, login);
router.get("/me", authMiddleware, getMe);

export default router;