const express = require("express");
const router = express.Router();

const {
  isAuthenticatedUser,
  authorizeRoles,
} = require("../middleware/authenticate");

const {
  getAllRooms,
  getAdminRooms,
  createRoom,
  updateRoom,
  deleteRoom,
  getRoomDetails,
  addReview,
  deleteReview,
  getAllReviews,
  updateStatus,
  myRooms,
  getRoomStatistics,
} = require("../controllers/room-controller");

// Route
router.route("/rooms").get(getAllRooms);
router.route("/myrooms").get(isAuthenticatedUser, myRooms);
router.route("/admin/rooms").get(getAdminRooms);
router
  .route("/admin/rooms/statistic")
  .get(isAuthenticatedUser, authorizeRoles("admin"), getRoomStatistics);

router.route("/room/create").post(isAuthenticatedUser, createRoom);

router
  .route("/room/:id")
  .put(isAuthenticatedUser, updateRoom)
  .delete(isAuthenticatedUser, deleteRoom)
  .get(getRoomDetails);

router.route("/room/:id/confirm").put(isAuthenticatedUser, updateStatus);

router.route("/review").put(isAuthenticatedUser, addReview);
router
  .route("/reviews")
  .get(isAuthenticatedUser, getAllReviews)
  .delete(isAuthenticatedUser, deleteReview);

module.exports = router;
