import "./Statistics.css";

import React, { Fragment, useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useAlert } from "react-alert";
import { Button } from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogActions,
  Button as BtnDialog,
} from "@material-ui/core";

import "react-datepicker/dist/react-datepicker.css";
import DatePicker from "react-datepicker";

import Loading from "../layout/loading/loading";
import MetaData from "../layout/MetaData";
import SideBar from "./Sidebar";

import TreeViewCard from "./TreeViewCard";
import { Doughnut } from "react-chartjs-2";
import { Chart, registerables } from "chart.js";

import { roomStatistics } from "../../actions/roomAction";
import { userStatistics } from "../../actions/userAction";
import { bookingStatistics } from "../../actions/bookingAction";

Chart.register(...registerables);

const Statistics = () => {
  const dispatch = useDispatch();
  const alert = useAlert();

  const statistics = [
    "Danh sách phòng",
    "Danh sách đặt phòng",
    "Danh sách người dùng",
  ];
  const roles = ["Tất cả", "User", "Admin"];
  const paymentTypes = ["Tất cả", "Thanh toán online", "Thanh toán sau"];

  const [statistic, setStatistic] = useState("");
  const [role, setRole] = useState("Tất cả");
  const [paymentType, setPaymentType] = useState("Tất cả");
  const [address, setAddress] = useState("Toàn quốc");
  const [startTime, setStartTime] = useState();
  const [endTime, setEndTime] = useState();

  const [listProvinces, setListProvinces] = useState([]);
  const [listDistricts, setListDistricts] = useState([]);

  const [openAddress, setOpenAddress] = useState(false);
  const [index, setIndex] = useState(0);
  const [openTime, setOpenTime] = useState(false);
  const [display, setDisplay] = useState(false);

  const {
    loading: roomsLoading,
    rooms,
    statistic: roomData,
  } = useSelector((state) => state.roomStatistics);
  const {
    loading: usersLoading,
    users,
    statistic: userData,
  } = useSelector((state) => state.userStatistics);
  const {
    loading: bookingsLoading,
    bookings,
    totalAmount,
    statistic: bookingData,
  } = useSelector((state) => state.bookingStatistics);

  useEffect(() => {
    fetch("https://provinces.open-api.vn/api/?depth=2")
      .then((response) => response.json())
      .then((json) => {
        setListProvinces(json);
      });
  }, [dispatch]);

  const submitAddressToggle = () => {
    openAddress ? setOpenAddress(false) : setOpenAddress(true);
    setIndex(0);
    if (!openAddress) setAddress("Toàn quốc");
  };

  const submitTimeToggle = () => {
    openTime ? setOpenTime(false) : setOpenTime(true);
    if (!startTime || !endTime) {
      setStartTime();
      setEndTime();
    }
  };

  const addressHandler = (e) => {
    if (e.target.localName === "input") {
      address === "Toàn quốc"
        ? setAddress(e.target.value)
        : setAddress(e.target.value + ", " + address);

      if (index === 0)
        setListDistricts(
          listProvinces.find((elem) => elem.name === e.target.value).districts
        );

      setIndex(index + 1);
    } else if (e.target.localName === "li") {
      address === "Toàn quốc"
        ? setAddress(e.target.children[0].value)
        : setAddress(e.target.children[0].value + ", " + address);

      if (index === 0)
        setListDistricts(
          listProvinces.find((elem) => elem.name === e.target.children[0].value)
            .districts
        );

      setIndex(index + 1);
    }

    if (index === 1) setOpenAddress(!openAddress);
  };

  const timeHandler = () => {
    if (!startTime) alert.error("Chọn thời gian bắt đầu !");
    else if (!endTime) alert.error("Chọn thời gian kết thúc !");
    else if (endTime < startTime)
      alert.error("Khoảng thời gian không hợp lệ !");
    else setOpenTime(false);
  };

  const clearHandler = (type) => {
    switch (type) {
      case "Thời gian":
        setStartTime();
        setEndTime();
        break;
      case "Địa chỉ":
        setAddress("Toàn quốc");
        break;
      default:
        break;
    }
  };

  const statisticHandler = () => {
    if (statistic === "") {
      alert.error("Chọn tiêu chí");
      return;
    } else if (statistic === "Danh sách phòng") {
      setDisplay(true);
      dispatch(roomStatistics(address, [startTime, endTime]));
    } else if (statistic === "Danh sách người dùng") {
      setDisplay(true);
      dispatch(userStatistics(role, [startTime, endTime]));
    } else if (statistic === "Danh sách đặt phòng") {
      setDisplay(true);
      dispatch(bookingStatistics(paymentType, [startTime, endTime]));
    } else {
      return;
    }
  };

  const doughnutState = {
    labels:
      statistic === "Danh sách người dùng"
        ? ["User", "Admin"]
        : statistic === "Danh sách đặt phòng"
        ? ["Phòng trọ", "Nhà nghỉ", "Nhà nguyên căn"]
        : ["Phòng trọ", "Nhà nghỉ", "Nhà nguyên căn"],
    datasets: [
      {
        backgroundColor: [
          "#00A6B4",
          "#6800B4",
          statistic === "Danh sách đặt phòng" ? "#3c8039" : "",
        ],
        hoverBackgroundColor: [
          "#4B5000",
          "#35014F",
          statistic === "Danh sách đặt phòng" ? "#3c5039" : "",
        ],
        data:
          statistic === "Danh sách người dùng"
            ? [userData?.user, userData?.admin]
            : statistic === "Danh sách đặt phòng"
            ? [
                bookingData?.phongTro,
                bookingData?.nhaNghi,
                bookingData?.nhaNguyenCan,
              ]
            : [
                roomData?.reduce((sum, current) => sum + current.phongTro, 0),
                roomData?.reduce((sum, current) => sum + current.nhaNghi, 0),
                roomData?.reduce(
                  (sum, current) => sum + current.nhaNguyenCan,
                  0
                ),
              ],
      },
    ],
  };

  return (
    <Fragment>
      <MetaData title={`Thống kê`} />

      <div className="dashboard">
        <SideBar />
        <div className="statisticContainer">
          <h1>THỐNG KÊ</h1>

          <div className="statisticTitle">
            <div>
              <label>
                Tiêu chí
                <select
                  onChange={(e) => {
                    setDisplay(false);
                    setStatistic(e.target.value);
                  }}
                >
                  <option value="">-- Chọn tiêu chí --</option>
                  {statistics.map((statistic) => (
                    <option key={statistic} value={statistic}>
                      {statistic}
                    </option>
                  ))}
                </select>
              </label>

              {statistic === "Danh sách phòng" ? (
                <label>
                  Địa chỉ
                  <div>
                    <span onClick={submitAddressToggle}>{address}</span>
                    <i onClick={() => clearHandler("Địa chỉ")} />
                  </div>
                </label>
              ) : statistic === "Danh sách người dùng" ? (
                <label>
                  Vai trò
                  <select
                    onChange={(e) => {
                      setRole(e.target.value);
                    }}
                  >
                    {roles.map((role) => (
                      <option key={role} value={role}>
                        {role}
                      </option>
                    ))}
                  </select>
                </label>
              ) : statistic === "Danh sách đặt phòng" ? (
                <label>
                  Loại thanh toán
                  <select
                    onChange={(e) => {
                      setPaymentType(e.target.value);
                    }}
                  >
                    {paymentTypes.map((paymentType) => (
                      <option key={paymentType} value={paymentType}>
                        {paymentType}
                      </option>
                    ))}
                  </select>
                </label>
              ) : null}

              {statistic !== "" && (
                <label>
                  Thời gian
                  <div>
                    <span onClick={submitTimeToggle}>
                      {startTime && endTime
                        ? `${startTime.toLocaleString().split(",")[0]} - ${
                            endTime.toLocaleString().split(",")[0]
                          }`
                        : "Tất cả"}
                    </span>
                    <i onClick={() => clearHandler("Thời gian")} />
                  </div>
                </label>
              )}
            </div>

            <div>
              {statistic !== "" && (
                <Button
                  onClick={statisticHandler}
                  disabled={
                    roomsLoading ||
                    usersLoading ||
                    bookingsLoading ||
                    statistic === ""
                      ? true
                      : false
                  }
                >
                  Thống kê
                </Button>
              )}
            </div>
          </div>

          {display && statistic === "Danh sách phòng" && (
            <div
              style={{
                height: "95%",
                overflow: "auto",
                marginBottom: "1vmax",
                marginLeft: "1vmax",
              }}
            >
              {roomData?.length > 0 ? (
                <div className="statisticsView">
                  <div>
                    <TreeViewCard
                      roomData={roomData}
                      type={"Danh sách phòng"}
                    ></TreeViewCard>
                  </div>
                  <div className="doughnutChart">
                    <Doughnut data={doughnutState} />
                  </div>
                </div>
              ) : (
                !roomsLoading && <h1>Không có phòng thỏa mãn !</h1>
              )}
            </div>
          )}

          {display && statistic === "Danh sách người dùng" && (
            <div
              style={{
                height: "95%",
                overflow: "auto",
                marginBottom: "1vmax",
                marginLeft: "1vmax",
              }}
            >
              {!usersLoading && (
                <div className="statisticsView">
                  <div>
                    <TreeViewCard
                      userData={userData}
                      type={"Danh sách người dùng"}
                    ></TreeViewCard>
                  </div>
                  <div className="doughnutChart">
                    <Doughnut data={doughnutState} />
                  </div>
                </div>
              )}
            </div>
          )}

          {display && statistic === "Danh sách đặt phòng" && (
            <div
              style={{
                height: "95%",
                overflow: "auto",
                marginBottom: "1vmax",
                marginLeft: "1vmax",
              }}
            >
              {!bookingsLoading && (
                <div className="statisticsView">
                  <div>
                    <TreeViewCard
                      bookingData={bookingData}
                      totalAmount={totalAmount}
                      type={"Danh sách đặt phòng"}
                    ></TreeViewCard>
                  </div>
                  <div className="doughnutChart">
                    <Doughnut data={doughnutState} />
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {(roomsLoading || usersLoading || bookingsLoading) && (
          <Loading backgroundColor={"transparent"} />
        )}

        <Dialog
          aria-labelledby="simple-dialog-title"
          open={openAddress}
          onClose={submitAddressToggle}
          PaperProps={{
            style: {
              height: "70%",
              width: "50%",
            },
          }}
        >
          <DialogTitle>
            <div>
              <Typography variant="h6" align="center">
                {address}
              </Typography>
            </div>
          </DialogTitle>
          <DialogContent>
            <ul className="listProvinces">
              {index === 0 &&
                listProvinces.map((e) => (
                  <li key={e.code} value={e.name} onClick={addressHandler}>
                    <input
                      type="radio"
                      value={e.name}
                      onChange={addressHandler}
                    />
                    {e.name}
                  </li>
                ))}

              {index === 1 &&
                listDistricts.map((e) => (
                  <li key={e.code} value={e.name} onClick={addressHandler}>
                    <input
                      type="radio"
                      value={e.name}
                      checked={address.includes(e.name)}
                      onChange={addressHandler}
                    />
                    {e.name}
                  </li>
                ))}
            </ul>
          </DialogContent>
        </Dialog>

        <Dialog
          aria-labelledby="simple-dialog-title"
          open={openTime}
          onClose={submitTimeToggle}
          PaperProps={{
            style: {
              height: "39%",
              width: "25%",
            },
          }}
        >
          <DialogTitle>
            <div>
              <Typography variant="h6" align="center">
                {startTime && endTime
                  ? `${startTime.toLocaleString("en-GB").split(",")[0]} - ${
                      endTime.toLocaleString().split(",")[0]
                    }`
                  : "Tất cả"}
              </Typography>
            </div>
          </DialogTitle>
          <DialogContent>
            <label>
              Từ ngày
              <DatePicker
                selected={startTime}
                onChange={(date) => setStartTime(date)}
              />
            </label>
            <label>
              Đến ngày
              <DatePicker
                selected={endTime}
                onChange={(date) => setEndTime(date)}
              />
            </label>
          </DialogContent>
          <DialogActions>
            <BtnDialog onClick={submitTimeToggle} color="secondary">
              Hủy bỏ
            </BtnDialog>
            <BtnDialog onClick={timeHandler} color="primary">
              Xác nhận
            </BtnDialog>
          </DialogActions>
        </Dialog>
      </div>
    </Fragment>
  );
};

export default Statistics;
