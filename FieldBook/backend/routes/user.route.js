import express from "express";
import {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
  getAllUsers,
  getUsersByRole,
  deleteUser,
  deactivateUser,
  getUserCount,
} from "../controllers/user.controller.js";

const router = express.Router();

// Auth routes
router.post("/register", registerUser);
router.post("/login", loginUser);

// User profile routes
router.get("/profile", getUserProfile);
router.put("/profile/update", updateUserProfile);

// Admin routes
router.get("/all", getAllUsers);
router.get("/count", getUserCount);
router.get("/role/:role", getUsersByRole);
router.delete("/delete", deleteUser);
router.put("/deactivate", deactivateUser);

export default router;