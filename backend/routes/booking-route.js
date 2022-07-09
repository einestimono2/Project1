const express = require("express");
const router = express.Router();

const {
  newBooking,
  getBooking,
  myBookings,
  getAllBookings,
  deleteBooking,
} = require("../controllers/booking-controller");

const {
  isAuthenticatedUser,
  authorizeRoles,
} = require("../middleware/authenticate");

router.route("/booking/new").post(isAuthenticatedUser, newBooking);

router.route("/booking/:id").get(isAuthenticatedUser, getBooking);

router.route("/bookings/me").get(isAuthenticatedUser, myBookings);

router
  .route("/admin/bookings")
  .get(isAuthenticatedUser, authorizeRoles("admin"), getAllBookings);

router.route("/admin/booking/:id").delete(isAuthenticatedUser, deleteBooking);
//   .put(isAuthenticatedUser, authorizeRoles("admin"), updateBooking);

module.exports = router;
