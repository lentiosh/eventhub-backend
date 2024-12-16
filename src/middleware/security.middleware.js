import helmet from "helmet";
import cors from "cors";
import rateLimit from "express-rate-limit";

export const helmetMiddleware = helmet();

export const corsMiddleware = cors({
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
});

export const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20, 
  message: "Too many requests from this IP, please try again later.",
});
