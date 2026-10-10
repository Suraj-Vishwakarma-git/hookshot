import createLimiter from "./src/middleware/rateLimiter.js";

const limiter = createLimiter({
    limit: 2,
    windowMs: 3000
});

console.log(limiter("user-123"));
console.log(limiter("user-123"));
console.log(limiter("user-123"));
console.log(limiter("user-123"));

console.log("User 456:");

console.log(limiter("user-456"));
console.log(limiter("user-456"));