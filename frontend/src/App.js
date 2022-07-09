import "./App.css";

import { UserRoute, AdminRoute } from "./component/Route/ProtectedRoute";

import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import WebFont from "webfontloader";
import axios from "axios";

// stripe
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

import store from "./store";

import Header from "./component/layout/header/Header.js";
import Footer from "./component/layout/footer/Footer";
import Contact from "./component/layout/contact/Contact";
import About from "./component/layout/about/About";
import NotFound from "./component/layout/notFound/NotFound";

import Home from "./component/Home/Home";

import RoomDetails from "./component/Room/RoomDetails.js";
import Rooms from "./component/Room/Rooms.js";
import NewRoom from "./component/Room/NewRoom.js";
import UpdateRoom from "./component/Room/UpdateRoom.js";
import MyRooms from "./component/Room/MyRooms.js";

import LoginRegister from "./component/User/LoginRegister";
import Profile from "./component/User/Profile.js";
import UpdateProfile from "./component/User/UpdateProfile.js";
import UpdatePassword from "./component/User/UpdatePassword.js";
import ForgotPassword from "./component/User/ForgotPassword.js";
import ResetPassword from "./component/User/ResetPassword.js";

import Booking from "./component/Booking/Booking.js";
import ConfirmBooking from "./component/Booking/ConfirmBooking.js";
import Payment from "./component/Booking/Payment.js";
import BookingSuccess from "./component/Booking/BookingSuccess.js";
import MyBookings from "./component/Booking/MyBookings.js";
import BookingDetails from "./component/Booking/BookingDetails.js";

import DashBoard from "./component/Admin/DashBoard.js";
import RoomList from "./component/Admin/RoomList.js";
import UserList from "./component/Admin/UserList.js";
import UpdateRole from "./component/Admin/UpdateRole.js";
import ReviewList from "./component/Admin/ReviewList.js";
import BookingList from "./component/Admin/BookingList";
import Statistics from "./component/Admin/Statistics";

import { loadUser } from "./actions/userAction";

function App() {
  const { user } = useSelector((state) => state.user);
  const [stripeApiKey, setStripeApiKey] = useState("");

  async function getStripeApiKey() {
    const { data } = await axios.get("/api/stripeapikey");

    setStripeApiKey(data.stripeApiKey);
  }

  useEffect(() => {
    //load font
    WebFont.load({
      google: {
        families: ["Roboto", "Droid Sans", "Chilanka"],
      },
    });

    //load user
    store.dispatch(loadUser());

    //load stripe key
    getStripeApiKey();
  }, []);

  return (
    <Router>
      <Header user={user} />

      <Routes>
        <Route path="/" element={<Home />} />

        <Route path="/contact" element={<Contact />} />
        <Route path="/about" element={<About />} />

        <Route path="/room/:id" element={<RoomDetails />} />
        <Route path="/rooms" element={<Rooms />} />
        <Route path="/rooms/:keyword" element={<Rooms />} />
        <Route
          path="/myrooms"
          element={
            <UserRoute>
              <MyRooms />
            </UserRoute>
          }
        />
        <Route
          path="/room/create"
          element={
            <UserRoute>
              <NewRoom />
            </UserRoute>
          }
        />
        <Route
          path="/room/update/:id"
          element={
            <UserRoute>
              <UpdateRoom />
            </UserRoute>
          }
        />

        <Route path="/booking" element={<Booking />} />
        <Route path="/booking/confirm" element={<ConfirmBooking />} />
        {stripeApiKey && (
          <Route
            path="/booking/payment"
            element={
              <Elements stripe={loadStripe(stripeApiKey)}>
                <Payment />
              </Elements>
            }
          />
        )}
        <Route path="/booking/success" element={<BookingSuccess />} />
        <Route
          path="/mybookings"
          element={
            <UserRoute>
              <MyBookings />
            </UserRoute>
          }
        />
        <Route
          path="/booking/:id"
          element={
            <UserRoute>
              <BookingDetails />
            </UserRoute>
          }
        />

        <Route path="/login" element={<LoginRegister />} />
        <Route
          path="/profile"
          element={
            <UserRoute>
              <Profile />
            </UserRoute>
          }
        />
        <Route
          path="/me/update"
          element={
            <UserRoute>
              <UpdateProfile />
            </UserRoute>
          }
        />
        <Route
          path="/password/update"
          element={
            <UserRoute>
              <UpdatePassword />
            </UserRoute>
          }
        />
        <Route path="/password/forgot" element={<ForgotPassword />} />
        <Route path="/password/reset/:token" element={<ResetPassword />} />

        <Route
          path="/admin/dashboard"
          element={
            <AdminRoute>
              <DashBoard />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/rooms"
          element={
            <AdminRoute>
              <RoomList />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/rooms/:type"
          element={
            <AdminRoute>
              <RoomList />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/users"
          element={
            <AdminRoute>
              <UserList />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/bookings"
          element={
            <AdminRoute>
              <BookingList />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/user/:id"
          element={
            <AdminRoute>
              <UpdateRole />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/reviews"
          element={
            <AdminRoute>
              <ReviewList />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/statistics"
          element={
            <AdminRoute>
              <Statistics />
            </AdminRoute>
          }
        />

        <Route
          path="/not_access"
          element={
            <NotFound name={"Bạn không có quyền truy cập trang này !"} />
          }
        />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
