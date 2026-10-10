


export const  createLimiter = ({ limit, windowMs }) => {
    const requests = new Map();

    const check = (key) => {
        const now = Date.now();
        const entry = requests.get(key);

        if (!entry || now >= entry.resetTime) {
            requests.set(key, {
                count: 1,
                resetTime: now + windowMs
            });

            return {
                allowed: true
            };
        }

        entry.count++;

        if (entry.count > limit) {
            const retryAfterSeconds = Math.ceil(
                (entry.resetTime - now) / 1000
            );

            return {
                allowed: false,
                retryAfterSeconds
            };
        }

        return {
            allowed: true
        };
    };

    return check;
};

export const rateLimitMiddleware = ({
    limiter,
    keyGenerator
}) => {
    return (req, res, next) => {
        const key = keyGenerator(req);

        const result = limiter(key);

        if (!result.allowed) {
            res.set(
                "Retry-After",
                String(result.retryAfterSeconds)
            );

            return res.status(429).json({
                message: "Too many requests",
                retryAfterSeconds: result.retryAfterSeconds
            });
        }

        next();
    };
};

