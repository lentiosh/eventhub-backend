import { db } from "../db/index.js";
import { usersTable } from "../db/schema.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { eq } from "drizzle-orm";

function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function isValidPassword(password) {
  // At least 8 chars, one uppercase, one lowercase, one number, and one special char
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;
  return passwordRegex.test(password);
}

export const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    if (!name || typeof name !== 'string' || name.trim().length === 0 || name.length > 50) {
      return res.status(400).json({ message: "Invalid name." });
    }

    if (!email || !isValidEmail(email)) {
  
      return res.status(400).json({ message: "Invalid email format." });
    }

    if (!password || !isValidPassword(password)) {
      
      return res.status(400).json({ message: "Password does not meet complexity requirements." });
    }

    const existingUser = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.email, email))
      .limit(1);

    if (existingUser.length > 0) {
      
      return res.status(400).json({ message: "Email already exists." });
    }

    console.log("[AUTH CONTROLLER] Creating new user...");
    const hashedPassword = await bcrypt.hash(password, 10);

    const [newUser] = await db
      .insert(usersTable)
      .values({
        name,
        email,
        password: hashedPassword,
        is_staff: false,
      })
      .returning({
        id: usersTable.id,
        email: usersTable.email,
        is_staff: usersTable.is_staff,
        name: usersTable.name,
      });

    const token = jwt.sign(
      {
        id: newUser.id,
        email: newUser.email,
        is_staff: newUser.is_staff,
        name: newUser.name,
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || "1h" }
    );

    res.status(201).json({
      message: "User registered successfully.",
      token,
    });
  } catch (error) {
    
    next(error);
  }
};

export const login = async (req, res, next) => {
  
  try {
    const { email, password } = req.body;
  
    if (!email || !isValidEmail(email)) {
      return res.status(400).json({ message: "Invalid email format." });
    }

    if (!password || typeof password !== 'string' || password.length === 0) {
      
      return res.status(400).json({ message: "Password is required." });
    }

    const users = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.email, email))
      .limit(1);

    if (users.length === 0) {
      
      return res.status(400).json({ message: "Invalid credentials." });
    }

    const user = users[0];
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      
      return res.status(400).json({ message: "Invalid credentials." });
    }

    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        is_staff: user.is_staff,
        name: user.name,
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || "1h" }
    );

    res.status(200).json({
      message: "Logged in successfully.",
      token,
    });
  } catch (error) {
    next(error);
  }
};

export const googleCallback = async (req, res, next) => {
  
  try {
    if (!req.user) {
      
      return res.status(400).json({ message: "User information not found." });
    }

    const token = jwt.sign(
      {
        id: req.user.id,
        email: req.user.email,
        is_staff: req.user.is_staff,
        name: req.user.name,
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || "1h" }
    );

    res.redirect(`${process.env.FRONTEND_URL}/auth/google?token=${token}`);
  } catch (error) {
    next(error);
  }
};
