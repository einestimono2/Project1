import "./RoomTile.css";

import React from "react";
import { Link } from "react-router-dom";
import TimeAgo from "../../utils/TimeAgo";

const RoomTile = ({ room }) => {
  return (
    <Link className="roomTile" to={`/room/${room._id}`}>
      <img src={room.images[0].url} alt={room.title} />
      <div>
        <p>{room.name}</p>
        <div>
          <p>{`${room.price.toLocaleString()} VNĐ`}</p>
          <p>{TimeAgo(room.createdAt)}</p>
        </div>
      </div>
    </Link>
  );
};

export default RoomTile;
