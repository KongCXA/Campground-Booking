const express = require("express");
const {
  register,
  login,
  getMe,
  logout,
  resetPassword,
  getUser,
} = require("../controllers/auth");
const { protect } = require("../middleware/auth");

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/me", protect, getMe);
router.get("/logout", protect, logout);
router.post("/reset-password", resetPassword);
router.get("/:id", protect, getUser);

module.exports = router;
