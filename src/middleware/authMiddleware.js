import jwt from "jsonwebtoken";

const authMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) return res.status(401).json({ message: "Authentication required" });
    const decoded = jwt.verify(authHeader.slice(7), process.env.JWT_SECRET || "development_only_change_this_secret");
    req.user = { id: decoded.userId };
    return next();
  } catch {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};
export default authMiddleware;
