const Booking = require("../models/booking-model");
const Room = require("../models/room-model");
const ErrorHander = require("../utils/error-handler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const ApiFeatures = require("../utils/api-features");

async function updateNOR(id, nor, type) {
  const room = await Room.findById(id);

  if (!room) return;

  if (type === "new") room.numOfRooms -= nor;
  else room.numOfRooms += nor;

  await room.save({ validateBeforeSave: false });
}

// Create new booking
exports.newBooking = catchAsyncErrors(async (req, res, next) => {
  const {
    room,
    paymentInfo,
    roomPrice,
    numOfRooms,
    checkInDate,
    totalPrice,
    status,
  } = req.body;

  let booking;

  if (status == "Thanh toán sau") {
    booking = await Booking.create({
      room,
      user: req.user._id,
      roomPrice,
      numOfRooms,
      checkInDate,
      totalPrice,
      status,
    });
  } else {
    booking = await Booking.create({
      room,
      user: req.user._id,
      roomPrice,
      numOfRooms,
      checkInDate,
      totalPrice,
      status,
      paymentInfo,
      paidAt: Date.now(),
    });
  }

  await updateNOR(room, numOfRooms, "new");

  res.status(201).json({
    success: true,
    booking,
  });
});

// Get A Booking
exports.getBooking = catchAsyncErrors(async (req, res, next) => {
  const booking = await Booking.findById(req.params.id)
    .populate("user")
    .populate({
      path: "room",
      populate: {
        path: "user",
      },
    });

  if (!booking) {
    return next(new ErrorHander("Booking not exist", 404));
  }

  res.status(200).json({
    success: true,
    booking,
  });
});

// Get All Bookings Of Rooms
exports.getAllBookingOfUsers = catchAsyncErrors(async (req, res, next) => {
  const bookings = await Booking.find({ room: req.params.id }).populate("user");

  if (!bookings) {
    return next(new ErrorHander("Booking not exist", 404));
  }

  res.status(200).json({
    success: true,
    bookings,
  });
});

// Get My Booking
exports.myBookings = catchAsyncErrors(async (req, res, next) => {
  const bookings = await Booking.find({ user: req.user._id })
    .populate("user")
    .populate({
      path: "room",
      populate: {
        path: "user",
      },
    });

  res.status(200).json({
    success: true,
    bookings,
  });
});

// Statistic Booking
exports.getBookingStatistics = catchAsyncErrors(async (req, res, next) => {
  const apiFeature = new ApiFeatures(Booking.find().populate("room"), req.query)
    .search()
    .filter();

  let bookings = await apiFeature.query;

  let totalAmount = bookings.reduce((sum, cur) => sum + cur.totalPrice, 0);
  const datas = {
    phongTro: 0,
    nhaNghi: 0,
    nhaNguyenCan: 0,
    thanhToanSau: 0,
    thanhToanOnline: 0,
  };

  bookings.map((booking) => {
    if (booking.status === "Thanh toán online")
      datas["thanhToanOnline"] = datas["thanhToanOnline"] + 1;
    else datas["thanhToanSau"] = datas["thanhToanSau"] + 1;

    try {
      if (booking.room.category === "Phòng trọ")
        datas["phongTro"] = datas["phongTro"] + 1;
      else if (booking.room.category === "Nhà nghỉ")
        datas["nhaNghi"] = datas["nhaNghi"] + 1;
      else datas["nhaNguyenCan"] = datas["nhaNguyenCan"] + 1;
    } catch {}
  });

  res.status(200).json({
    success: true,
    bookings,
    statistic: datas,
    totalAmount,
  });
});

// Get All Bookings
exports.getAllBookings = catchAsyncErrors(async (req, res, next) => {
  const apiFeature = new ApiFeatures(Booking.find().populate("user"), req.query)
    .search()
    .filter();

  const bookings = await apiFeature.query;

  let totalAmount = 0;

  bookings.forEach((booking) => {
    totalAmount += booking.totalPrice;
  });

  res.status(200).json({
    success: true,
    totalAmount,
    bookings,
  });
});

// Delete Booking
exports.deleteBooking = catchAsyncErrors(async (req, res, next) => {
  const booking = await Booking.findById(req.params.id);

  if (!booking) {
    return next(new ErrorHander("Booking not exist", 404));
  }

  await updateNOR(booking.room, booking.numOfRooms, "delete");

  await booking.remove();

  res.status(200).json({
    success: true,
  });
});
