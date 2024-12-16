import express from "express";
import { register, login, googleCallback } from "../controllers/auth.controller.js";
import passport from "passport";

const router = express.Router();

const authRateLimiter = (req, res, next) => next();

router.post("/register", authRateLimiter, register);

router.post("/login", authRateLimiter, login);

router.get(
  "/google",
  passport.authenticate("google", { session: false })
);

router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: `${process.env.FRONTEND_URL}/login`,
    session: false,
  }),
  googleCallback
);

export default router;
