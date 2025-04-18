const express = require("express");

const {
  getBookings,
  getBooking,
  addBooking,
  updateBooking,
  deleteBooking,
  getDashboardSummary,
} = require("../controllers/bookings");

const router = express.Router({ mergeParams: true });

const { protect, authorize } = require("../middleware/auth");

router
  .route("/")
  .get(protect, getBookings)
  .post(protect, authorize("admin", "user"), addBooking);

router
  .route("/dashboard")
  .get(protect, authorize("admin"), getDashboardSummary);

router
  .route("/:id")
  .get(protect, getBooking)
  .put(protect, authorize("admin", "user"), updateBooking)
  .delete(protect, authorize("admin", "user"), deleteBooking);

module.exports = router;
