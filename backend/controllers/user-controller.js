const ErrorHandler = require("../utils/error-handler");
const catchAsyncError = require("../middleware/catchAsyncErrors");
const User = require("../models/user-model");
const sendToken = require("../utils/send-token");
const sendEmail = require("../utils/send-email.js");
const crypto = require("crypto");
const cloudinary = require("cloudinary");
const ApiFeatures = require("../utils/api-features");

// Register
exports.register = catchAsyncError(async (req, res, next) => {
  const { email, password } = req.body;
  let user;

  if (req.body.avatar) {
    const myCloud = await cloudinary.v2.uploader.upload(req.body.avatar, {
      folder: "avatars",
      width: 150,
      crop: "scale",
    });

    user = await User.create({
      email: email,
      password: password,
      avatar: {
        public_id: myCloud.public_id,
        url: myCloud.secure_url,
      },
    });
  } else {
    user = await User.create({
      email: email,
      password: password,
    });
  }

  sendToken(user, 200, res);
});

// Login
exports.login = catchAsyncError(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password)
    return next(new ErrorHandler("Please enter email or passworod", 400));

  // "+password" = allow select hidden field password
  const user = await User.findOne({ email: email }).select("+password");

  if (!user) return next(new ErrorHandler("Invalid email or password", 401));

  const isPasswordMatched = await user.comparePassword(password);

  if (!isPasswordMatched)
    return next(new ErrorHandler("Invalid password", 401));

  sendToken(user, 200, res);
});

// Logout
exports.logout = catchAsyncError(async (req, res, next) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  });

  res.status(200).json({
    success: true,
    message: "Logged Out",
  });
});

// Forgot password
exports.forgotPassword = catchAsyncError(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user)
    return next(
      new ErrorHandler("Email not exist, please check your email again", 404)
    );

  // Get reset password token
  const resetToken = user.getResetPasswordToken();

  await user.save({ validateBeforeSave: false });

  const resetPasswordUrl = `${req.protocol}://${req.get(
    "host"
  )}/password/reset/${resetToken}`;
  // const resetPasswordUrl = `${process.env.FRONTEND_URL}/password/reset/${resetToken}`;

  const message = `Your password reset token is : \n\n ${resetPasswordUrl} \n\nIf you have not requested this email then, please ignore it.`;

  try {
    await sendEmail({
      email: user.email,
      subject: `Password Recovery`,
      message,
    });

    res.status(200).json({
      success: true,
      message: `Email sent to ${user.email} successfully`,
    });
  } catch (error) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save({ validateBeforeSave: false });

    return next(new ErrorHandler(error.message, 500));
  }
});

// Reset password
exports.resetPassword = catchAsyncError(async (req, res, next) => {
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user) {
    return next(
      new ErrorHandler(
        "Reset Password Token is invalid or has been expired",
        400
      )
    );
  }

  if (req.body.password !== req.body.confirmPassword) {
    return next(new ErrorHander("Password does not password", 400));
  }

  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;

  await user.save();

  sendToken(user, 200, res);
});

// Get user details
exports.getDetails = catchAsyncError(async (req, res, next) => {
  const user = await User.findById(req.user.id);

  res.status(200).json({
    success: true,
    user,
  });
});

// Update password
exports.updatePassword = catchAsyncError(async (req, res, next) => {
  const user = await User.findById(req.user.id).select("+password");

  const isPasswordMatched = await user.comparePassword(req.body.oldPassword);

  if (!isPasswordMatched)
    return next(new ErrorHandler("Old password is incorrect", 400));

  if (req.body.newPassword != req.body.confirmPassword)
    return next(new ErrorHandler("Password does not match", 400));

  user.password = req.body.newPassword;

  await user.save();

  sendToken(user, 200, res);
});

// Update profile
exports.updateProfile = catchAsyncError(async (req, res, next) => {
  const newProfile = {
    email: req.body.email,
  };

  if (req.body.name) newProfile.name = req.body.name;
  if (req.body.phoneNumber) newProfile.phoneNumber = req.body.phoneNumber;

  if (req.body.avatar !== "") {
    const user = await User.findById(req.user.id);

    const imgID = user.avatar.public_id;
    if (imgID) await cloudinary.v2.uploader.destroy(imgID);

    const myCloud = await cloudinary.v2.uploader.upload(req.body.avatar, {
      folder: "avatars",
      width: 150,
      crop: "scale",
    });

    newProfile.avatar = {
      public_id: myCloud.public_id,
      url: myCloud.url,
    };
  }

  await User.findByIdAndUpdate(req.user.id, newProfile, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

  res.status(200).json({
    success: true,
  });
});

// Get all users
exports.getAllUsers = catchAsyncError(async (req, res, next) => {
  const apiFeature = new ApiFeatures(User.find(), req.query).search().filter();

  let users = await apiFeature.query;

  res.status(200).json({
    success: true,
    users,
  });
});

// Statistic User
exports.getUserStatistics = catchAsyncError(async (req, res, next) => {
  const apiFeature = new ApiFeatures(User.find(), req.query).search().filter();

  let users = await apiFeature.query;

  const datas = { admin: 0, user: 0 };

  users.map((user) => {
    if (user.role === "admin") datas["admin"] = datas["admin"] + 1;
    else datas["user"] = datas["user"] + 1;
  });

  res.status(200).json({
    success: true,
    users,
    statistic: datas,
  });
});

// Get user
exports.getUser = catchAsyncError(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return next(new ErrorHandler(`User id: ${req.params.id} does not exist`));
  }

  res.status(200).json({
    success: true,
    user,
  });
});

// Update role
exports.updateRole = catchAsyncError(async (req, res, next) => {
  const newRole = {
    role: req.body.role,
  };

  await User.findByIdAndUpdate(req.params.id, newRole, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

  res.status(200).json({
    success: true,
  });
});

// Delete user
exports.deleteUser = catchAsyncError(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return next(
      new ErrorHandler(`User id: ${req.params.id} does not exist with`, 400)
    );
  }

  if (user.avatar.public_id) {
    const imageId = user.avatar.public_id;
    await cloudinary.v2.uploader.destroy(imageId);
  }

  await user.remove();

  res.status(200).json({
    success: true,
    message: "Successfully delete",
  });
});
