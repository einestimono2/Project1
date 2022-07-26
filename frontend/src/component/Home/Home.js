import "./Home.css";

// Import map và css của map
import "leaflet/dist/leaflet.css";
import Map from "../Map/Map";

import React, { Fragment, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useAlert } from "react-alert";
import { Link } from "react-router-dom";

import RoomCard from "./RoomCard";
import RoomCardMore from "./RoomCardMore";
import MetaData from "../layout/MetaData";
import { getAllRooms, clearErrors } from "../../actions/roomAction";
import Loading from "../layout/loading/loading";

import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { Pagination, Navigation } from "swiper";

const Home = () => {
  const alert = useAlert();
  const dispatch = useDispatch();

  const { loading, error, rooms } = useSelector((state) => state.rooms);

  useEffect(() => {
    if (error) {
      alert.error(error);
      dispatch(clearErrors());
    }
    dispatch(getAllRooms("Đã phê duyệt"));
  }, [dispatch, error, alert]);

  return (
    <Fragment>
      {loading ? (
        <Loading />
      ) : (
        <Fragment>
          <MetaData title="Trang chủ" />

          <div className="mapboxContainer">
            <Map view={true} rooms={rooms} />
          </div>

          <h2 className="homeHeading">Bài đăng gần đây</h2>
          <div className="listContainer" id="listContainer">
            {rooms && rooms.length === 0 ? (
              <div className="rooms">
                <div className="noRooms">
                  <p>Chưa có bài đăng nào ~</p>
                  <Link to="/login?redirect=room/create">Đăng tin ngay</Link>
                </div>
              </div>
            ) : (
              <Swiper
                slidesPerView={window.innerWidth < 600 ? 2 : 4}
                spaceBetween={window.innerWidth < 600 ? 0 : 20}
                slidesPerGroup={window.innerWidth < 600 ? 2 : 4}
                pagination={{
                  clickable: true,
                }}
                modules={[Pagination, Navigation]}
              >
                {rooms && rooms.length < 8
                  ? rooms?.reverse().map((room) => (
                      <SwiperSlide key={room._id}>
                        <RoomCard key={room._id} room={room} />
                      </SwiperSlide>
                    ))
                  : rooms
                      ?.reverse()
                      .slice(0, 8)
                      .map((room, i) => (
                        <SwiperSlide key={room._id}>
                          {i === 7 ? (
                            <RoomCardMore />
                          ) : (
                            <RoomCard key={room._id} room={room} />
                          )}
                        </SwiperSlide>
                      ))}
              </Swiper>
            )}
          </div>
        </Fragment>
      )}
    </Fragment>
  );
};

export default Home;
