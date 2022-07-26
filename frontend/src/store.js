import { createStore, combineReducers, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import { composeWithDevTools } from "redux-devtools-extension";

import {
  roomsReducer,
  roomReducer,
  roomDetailsReducer,
  newReviewReducer,
  newRoomReducer,
  allReviewsReducer,
  reviewReducer,
  myRoomsReducer,
  roomStatisticsReducer,
} from "./reducers/roomReducer";

import {
  userReducer,
  profileReducer,
  forgotPasswordReducer,
  userDetailsReducer,
  allUsersReducer,
  userStatisticsReducer,
} from "./reducers/userReducer";

import {
  newBookingReducer,
  myBookingsReducer,
  allBookingsReducer,
  bookingReducer,
  bookingDetailsReducer,
  bookingStatisticsReducer,
} from "./reducers/bookingReducer";

const reducer = combineReducers({
  rooms: roomsReducer,
  room: roomReducer,
  roomDetails: roomDetailsReducer,
  newReview: newReviewReducer,
  newRoom: newRoomReducer,
  allReviews: allReviewsReducer,
  review: reviewReducer,
  myRooms: myRoomsReducer,
  //
  user: userReducer,
  profile: profileReducer,
  forgotPassword: forgotPasswordReducer,
  users: allUsersReducer,
  userDetails: userDetailsReducer,
  //
  booking: bookingReducer,
  newBooking: newBookingReducer,
  myBookings: myBookingsReducer,
  bookingDetails: bookingDetailsReducer,
  bookings: allBookingsReducer,
  //
  roomStatistics: roomStatisticsReducer,
  userStatistics: userStatisticsReducer,
  bookingStatistics: bookingStatisticsReducer,
});

let initialState = {};

const middleware = [thunk];

const store = createStore(
  reducer,
  initialState,
  composeWithDevTools(applyMiddleware(...middleware))
);

export default store;
