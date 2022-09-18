import express from "express";
import {
  signup,
  signin,
  signinWithGoogle,
} from "../controllers/authController.js";

const router = express.Router();

// CREATE USER:
router.post("/signup", signup);

// SIGN IN:
router.post("/signin", signin);

// GOOGLE AUTH:
router.post("/google", signinWithGoogle);

export default router;
