import "./RoomCardMore.css";

import React from "react";
import { Link } from "react-router-dom";

const RoomCard = () => {
  return (
    <Link className="roomCardMore" to={`/rooms`}>
      <div>
        <span>Xem thêm</span>
        <i></i>
      </div>
    </Link>
  );
};

export default RoomCard;
