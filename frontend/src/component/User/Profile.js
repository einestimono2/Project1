import "./Profile.css";

import React, { Fragment, useEffect } from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

import MetaData from "../layout/MetaData";
import Loading from "../layout/loading/loading";

const Profile = () => {
  const navigate = useNavigate();

  const { user, loading, isAuthenticated } = useSelector((state) => state.user);

  useEffect(() => {
    if (isAuthenticated === false) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);

  return (
    <Fragment>
      {loading ? (
        <Loading />
      ) : (
        <Fragment>
          <MetaData title={`${user.name ?? user.email}`} />
          <div className="profileContainer">
            <div>
              <h1>Thông tin hồ sơ</h1>
              <img src={user.avatar?.url || "./Profile.png"} alt={user.name} />
              <Link to="/me/update">Cập nhật hồ sơ</Link>
              <Link to="/password/update">Đổi mật khẩu</Link>
            </div>
            <div>
              <div>
                <h4>Email</h4>
                <p>{user.email}</p>
              </div>
              <div>
                <h4>Họ tên</h4>
                <p>{user.name === "undefined" ? "" : user.name}</p>
              </div>
              <div>
                <h4>Số điện thoại</h4>
                <p>
                  {user.phoneNumber === "undefined" ? "" : user.phoneNumber}
                </p>
              </div>
              <div>
                <h4>Ngày tạo</h4>
                <p>{new Date(user.createdAt).toLocaleString("en-GB")}</p>
              </div>

              <div>
                <Link to="/myrooms">Danh sách phòng của tôi</Link>
                <Link to="/mybookings">Danh sách đặt phòng của tôi</Link>
              </div>
            </div>
          </div>
        </Fragment>
      )}
    </Fragment>
  );
};

export default Profile;
