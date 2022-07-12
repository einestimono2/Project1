import "./Statistics.css";

import React, { Fragment, useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { DataGrid } from "@material-ui/data-grid";
import { useAlert } from "react-alert";
import { Button } from "@material-ui/core";

import ExcelJs from "exceljs";

import MetaData from "../layout/MetaData";
import SideBar from "./Sidebar";

import { statisticRooms } from "../../actions/roomAction";
import { statisticUsers } from "../../actions/userAction";
import { statisticBookings } from "../../actions/bookingAction";

const Statistics = () => {
  const dispatch = useDispatch();
  const alert = useAlert();

  const statistics = [
    "Danh sách phòng",
    "Danh sách đặt phòng",
    "Danh sách người dùng",
  ];
  const type1 = ["Tất cả", "Phòng trọ", "Nhà nghỉ", "Nhà nguyên căn"]; //Danh sách phòng
  const type2 = ["Tất cả", "Thanh toán online", "Thanh toán sau"]; // Danh sách đặt phòng
  const type3 = ["Tất cả", "User", "Admin"]; // Danh sách người dùng
  const times = ["Tất cả", "Hôm nay", "Tuần này", "Tháng này", "Năm nay"];

  const [statistic, setStatistic] = useState("");
  const [time, setTime] = useState("Tất cả");
  const [type, setType] = useState("Tất cả");
  const [show, setShow] = useState(false);
  const [rows, setRows] = useState([]);

  const { loading: roomsLoading, rooms } = useSelector((state) => state.rooms);
  const { loading: usersLoading, users } = useSelector((state) => state.users);
  const { user } = useSelector((state) => state.user);
  const {
    loading: bookingsLoading,
    bookings,
    totalAmount,
  } = useSelector((state) => state.bookings);

  useEffect(() => {
    if (statistic === "") return;

    if (statistic === "Danh sách phòng") dispatch(statisticRooms(type, time));
    else if (statistic === "Danh sách người dùng")
      dispatch(statisticUsers(type, time));
    else dispatch(statisticBookings(type, time));
  }, [dispatch, statistic, time, type]);

  const exportHandler = () => {
    if (statistic === "") {
      alert.error("Chọn tiêu chí thống kê");
      return;
    }

    const sheetName = statistic.replaceAll(" ", "_") + ".xlsx";

    const workbook = new ExcelJs.Workbook();
    const sheet = workbook.addWorksheet(sheetName, {
      views: [{ showGridLines: false }],
    });

    // Tiêu đề
    sheet.getRow(1).values = ["RR", "WEBSITE ĐĂNG TIN & ĐẶT PHÒNG", "", ""];
    sheet.getRow(2).values = ["", "Địa chỉ: xx xx xx xx xx", "", ""];
    sheet.getRow(3).values = ["", "Liên hệ: 0123456798", "", ""];
    sheet.mergeCells(`A1:A3`);
    sheet.mergeCells(`B1:D1`);
    sheet.mergeCells(`B2:D2`);
    sheet.mergeCells(`B3:D3`);

    // Thanh thông tin (Danh sách phòng/DS dặt phòng/DS người dùng)
    sheet.getCell("A5").value = {
      richText: [
        {
          font: { size: 22, bold: true, color: { argb: "FF0000" } },
          text: statistic,
        },
      ],
    };
    sheet.mergeCells(`A5:I5`);
    sheet.getRow(5).height = 40;

    // Thông tin quản lý
    sheet.getCell("A7").value = {
      richText: [
        {
          font: { size: 16, bold: true },
          text: "Thông tin quản lý",
        },
      ],
    };
    sheet.getRow(8).values = ["Nhóm 01", "Nguyễn Đức Tuệ"];
    sheet.getRow(9).values = ["", "Đỗ Văn Vũ"];
    sheet.getRow(10).values = ["", "Trần Hữu Quang"];
    sheet.getRow(11).values = ["", "Nguyễn Huy Bách"];
    sheet.getRow(12).values = ["Lớp", "IT-LTU K64"];
    sheet.mergeCells(`A8:A11`);

    // Thông tin người xuất
    sheet.getCell("A14").value = {
      richText: [
        {
          font: { size: 16, bold: true },
          text: "Thông tin người thực hiện",
        },
      ],
    };
    sheet.getRow(15).values = ["Email", user.email];
    sheet.getRow(16).values = ["Họ tên", user.name];
    sheet.getRow(17).values = ["Số điện thoại", user.phoneNumber];
    sheet.getRow(18).values = [
      "Thời gian",
      new Date(Date.now()).toLocaleString("en-GB"),
    ];

    sheet.getCell("A20").value = {
      richText: [
        {
          font: { size: 16, bold: true },
          text:
            statistic === "Danh sách phòng"
              ? "Thông tin phòng"
              : statistic === "Danh sách đặt phòng"
              ? "Thông tin đặt phòng"
              : "Thông tin người dùng",
        },
      ],
    };

    // Danh sách Phòng
    if (statistic === "Danh sách phòng") {
      sheet.getRow(21).values = [
        "Mã phòng",
        "Tên phòng",
        "Loại phòng",
        "Mô tả",
        "Giá",
        "Địa chỉ",
        "lat",
        "lng",
        "Diện tích",
        "Người đăng",
        "",
        "",
        "",
        "",
        "",
        "Số phòng",
        "Đối tượng",
        "Trạng thái",
        "Ảnh",
        "Đánh giá",
        "Thời gian đăng",
      ];
      sheet.getRow(22).values = [
        "Mã phòng",
        "Tên phòng",
        "Loại phòng",
        "Mô tả",
        "Giá",
        "Địa chỉ",
        "lat",
        "lng",
        "Diện tích",
        "ID",
        "Avatar",
        "Email",
        "Họ tên",
        "SĐT",
        "TG tạo",
        "Số phòng",
        "Đối tượng",
        "Trạng thái",
        "Ảnh",
        "Đánh giá",
        "Thời gian đăng",
      ];

      sheet.columns = [
        { key: "roomID", width: 30 },
        { key: "roomName", width: 50 },
        { key: "category", width: 15 },
        { key: "description", width: 50 },
        { key: "price", width: 20 },
        { key: "address", width: 50 },
        { key: "lat", width: 10 },
        { key: "lng", width: 10 },
        { key: "area", width: 15 },
        { key: "userID", width: 30 },
        { key: "avatar", width: 30 },
        { key: "email", width: 30 },
        { key: "userName", width: 30 },
        { key: "phoneNumber", width: 15 },
        { key: "userCreatedAt", width: 15 },
        { key: "numOfRooms", width: 10 },
        { key: "tenant", width: 10 },
        { key: "status", width: 15 },
        { key: "images", width: 30 },
        { key: "raing", width: 10 },
        { key: "roomCreatedAt", width: 15 },
      ];

      let roomData = [];
      rooms.map((room) =>
        roomData.push({
          roomID: room._id,
          roomName: room.name,
          description: room.description,
          price: room.price.toLocaleString("en-us") + " VNĐ",
          address: room.address,
          lat: room.lat,
          lng: room.lng,
          area: room.area + " m2",
          category: room.category,
          userID: room.user?._id,
          avatar: room.user?.avatar?.url || "-",
          email: room.user?.email,
          userName: room.user?.name || "-",
          phoneNumber: room.user?.phoneNumber || "-",
          userCreatedAt: room.user?.createdAt
            ? new Date(room.user?.createdAt)
                .toLocaleString("en-GB")
                .split(",")[0]
            : "-",
          numOfRooms: room.numOfRooms,
          tenant: room.tenant,
          status: room.status,
          images: room.images[0]?.url,
          raing: room.rating,
          roomCreatedAt: new Date(room.createdAt)
            .toLocaleString("en-GB")
            .split(",")[0],
        })
      );
      sheet.addRows(roomData);

      sheet.mergeCells(`J21:O21`);
      sheet.mergeCells("A21:A22");
      sheet.mergeCells("B21:B22");
      sheet.mergeCells("C21:C22");
      sheet.mergeCells("D21:D22");
      sheet.mergeCells("E21:E22");
      sheet.mergeCells("F21:F22");
      sheet.mergeCells("G21:G22");
      sheet.mergeCells("H21:H22");
      sheet.mergeCells("I21:I22");
      sheet.mergeCells("P21:P22");
      sheet.mergeCells("Q21:Q22");
      sheet.mergeCells("R21:R22");
      sheet.mergeCells("S21:S22");
      sheet.mergeCells("T21:T22");
      sheet.mergeCells("U21:U22");
    } else if (statistic === "Danh sách đặt phòng") {
      sheet.getRow(21).values = [
        "Mã đặt phòng",
        "Mã phòng",
        "Thông tin người đặt",
        "",
        "",
        "",
        "Ngày đặt",
        "Ngày nhận",
        "Thông tin thanh toán",
        "",
        "",
        "Số phòng",
        "Giá phòng",
        "Tổng giá",
      ];
      sheet.getRow(22).values = [
        "Mã đặt phòng",
        "Mã phòng",
        "ID",
        "Email",
        "Họ tên",
        "SĐT",
        "Ngày đặt",
        "Ngày nhận",
        "Hình thức",
        "Thanh toán",
        "Trạng thái",
        "Số phòng",
        "Giá phòng",
        "Tổng giá",
      ];

      sheet.columns = [
        { key: "_id", width: 30 },
        { key: "roomID", width: 30 },
        { key: "userID", width: 30 },
        { key: "email", width: 30 },
        { key: "name", width: 20 },
        { key: "phoneNumber", width: 20 },
        { key: "createdAt", width: 25 },
        { key: "checkInDate", width: 25 },
        { key: "type", width: 20 },
        { key: "paidAt", width: 25 },
        { key: "status", width: 20 },
        { key: "nor", width: 10 },
        { key: "roomPrice", width: 20 },
        { key: "totalPrice", width: 20 },
      ];

      let bookingData = [];
      bookings.map((book) =>
        bookingData.push({
          _id: book._id,
          roomID: book.room,
          userID: book.user?._id,
          email: book.user?.email,
          name: book.user?.name || "",
          phoneNumber: book.user?.phoneNumber || "",
          createdAt: new Date(book.createdAt).toLocaleString("en-GB"),
          checkInDate: new Date(book.checkInDate).toLocaleString("en-GB"),
          type: book.status,
          paidAt: book.paidAt
            ? new Date(book.paidAt).toLocaleString("en-GB")
            : "",
          status: book.paymentInfo?.status || "",
          nor: book.numOfRooms,
          roomPrice: book.roomPrice.toLocaleString("en-US") + " VNĐ",
          totalPrice: book.totalPrice.toLocaleString("en-US") + " VNĐ",
        })
      );
      sheet.addRows(bookingData);

      // Tổng giá trị
      const index = (23 + bookings.length + 1).toString();
      sheet.getCell(`M${index}`).value = {
        richText: [
          {
            font: { size: 16, bold: true, color: { argb: "FF0000" } },
            text:
              "Tổng giá trị: " + totalAmount?.toLocaleString("en-US") + " VNĐ",
          },
        ],
      };
      sheet.mergeCells(`M${index}:N${index}`);

      sheet.mergeCells(`C21:F21`);
      sheet.mergeCells("A21:A22");
      sheet.mergeCells("B21:B22");
      sheet.mergeCells("G21:G22");
      sheet.mergeCells("H21:H22");
      sheet.mergeCells(`I21:K21`);
      sheet.mergeCells("L21:L22");
      sheet.mergeCells("M21:M22");
      sheet.mergeCells("N21:N22");
    } else {
      sheet.getRow(21).values = [
        "ID",
        "Avatar",
        "",
        "Email",
        "Họ tên",
        "SĐT",
        "Ngày tạo",
        "Vai trò",
      ];
      sheet.getRow(22).values = [
        "ID",
        "Avatar ID",
        "Url",
        "Email",
        "Họ tên",
        "SĐT",
        "Ngày tạo",
        "Vai trò",
      ];

      sheet.columns = [
        { key: "_id", width: 30 },
        { key: "public_id", width: 35 },
        { key: "url", width: 35 },
        { key: "email", width: 30 },
        { key: "name", width: 20 },
        { key: "phoneNumber", width: 20 },
        { key: "createdAt", width: 25 },
        { key: "role", width: 10 },
      ];

      let userData = [];
      users.map((user) =>
        userData.push({
          _id: user._id,
          public_id: user.avatar?.public_id || "-",
          url: user.avatar?.url || "-",
          email: user.email,
          name: user.name || "",
          phoneNumber: user.phoneNumber || "",
          createdAt: new Date(user.createdAt).toLocaleString("en-GB"),
          role: user.role,
        })
      );
      sheet.addRows(userData);

      sheet.mergeCells(`B21:C21`);
      sheet.mergeCells("A21:A22");
      sheet.mergeCells("D21:D22");
      sheet.mergeCells("E21:E22");
      sheet.mergeCells("F21:F22");
      sheet.mergeCells(`G21:G22`);
      sheet.mergeCells("H21:H22");
    }

    const row = sheet.getRow(21);
    row.eachCell((cell, rowNumber) => {
      sheet.getColumn(rowNumber).alignment = {
        vertical: "middle",
        horizontal: "center",
      };
      sheet.getColumn(rowNumber).font = { size: 12, family: 2 };
    });

    const cellLeft = [
      "B1",
      "B2",
      "B3",
      "A7",
      "A14",
      "A20",
      "B8",
      "B9",
      "B10",
      "B15",
      "B16",
      "B17",
      "B18",
      "B11",
      "B12",
    ];
    cellLeft.forEach(
      (e) =>
        (sheet.getCell(e).alignment = {
          vertical: "middle",
          horizontal: "left",
        })
    );

    const writeFile = (fileName, content) => {
      const link = document.createElement("a");
      const blob = new Blob([content], {
        type: "application/vnd.ms-excel;charset=utf-8;",
      });
      link.download = fileName;
      link.href = URL.createObjectURL(blob);
      link.click();
    };

    workbook.xlsx.writeBuffer().then((buffer) => {
      writeFile(sheetName, buffer);
    });
  };

  const statisticHandler = () => {
    if (statistic === "") {
      alert.error("Chọn tiêu chí thống kê");
      return;
    }

    switch (statistic) {
      case "Danh sách phòng":
        // Xóa dữ liệu trước đó
        setRows([]);
        // Thêm dữ liệu vào rows
        rooms.map((item) =>
          setRows((old) => [
            ...old,
            {
              id: item._id,
              price: item.price.toLocaleString("en-us") + " VNĐ",
              category: item.category,
              image: item.images[0]?.url,
              address: item.address,
              status: item.status,
            },
          ])
        );
        break;

      case "Danh sách đặt phòng":
        // Xóa dữ liệu trước đó
        setRows([]);
        // Thêm dữ liệu vào rows
        bookings.map((item) =>
          // Thêm vào cuối rows
          setRows((old) => [
            ...old,
            {
              id: item._id,
              roomID: item.room,
              name: item.user?.name || item.user?.email,
              createdAt: new Date(item.createdAt).toLocaleString("en-GB"),
              numOfRooms: item.numOfRooms,
              totalPrices: item.totalPrice.toLocaleString("en-US") + " VNĐ",
              checkinDate: new Date(item.checkInDate).toLocaleString("en-GB"),
              paidAt:
                item.status === "Thanh toán online"
                  ? new Date(item.paidAt).toLocaleString("en-GB")
                  : "",
              status: item.status,
            },
          ])
        );

        break;

      case "Danh sách người dùng":
        // Xóa dữ liệu trước đó
        setRows([]);
        // Thêm dữ liệu vào rows
        users.map((item) =>
          // Thêm vào cuối rows
          setRows((old) => [
            ...old,
            {
              id: item._id,
              image: item.avatar?.url,
              role: item.role,
              createdAt: new Date(item.createdAt)
                .toLocaleString("en-gb")
                .split(",")[0],
              email: item.email,
              name: item.name,
              phoneNumber: item.phoneNumber,
            },
          ])
        );
        break;

      default:
    }

    setShow(true);
  };

  const columnsRoom = [
    { field: "id", headerName: "Mã phòng", minWidth: 250 },

    {
      field: "category",
      headerName: "Loại phòng",
      minWidth: 180,
    },

    {
      field: "image",
      headerName: "Ảnh",
      minWidth: 130,
      renderCell: (params) => (
        <img
          style={{
            width: "80px",
            height: "60px",
            objectFit: "fill",
          }}
          src={params.value}
          alt=""
        />
      ),
    },

    {
      field: "address",
      headerName: "Địa chỉ",
      flex: 1,
      minWidth: 600,
    },

    {
      field: "price",
      headerName: "Giá",
      minWidth: 150,
      cellClassName: "red_color",
    },
  ];

  const columnsBooking = [
    { field: "id", headerName: "Mã Booking", minWidth: 250 },

    { field: "roomID", headerName: "Mã phòng", minWidth: 250 },

    { field: "name", headerName: "Người đặt", minWidth: 170 },

    {
      field: "createdAt",
      headerName: "Ngày đặt",
      minWidth: 200,
    },

    {
      field: "checkinDate",
      headerName: "Ngày nhận",
      minWidth: 200,
    },

    {
      field: "numOfRooms",
      headerName: "Slg",
      minWidth: 115,
    },

    {
      field: "status",
      headerName: "Hình thức",
      minWidth: 170,
      cellClassName: (params) => {
        return params.getValue(params.id, "status") === "Thanh toán sau"
          ? "red_color"
          : "green_color";
      },
    },

    {
      field: "paidAt",
      headerName: "Thanh toán",
      minWidth: 180,
      cellClassName: (params) => {
        return "green_color";
      },
    },

    {
      field: "totalPrices",
      headerName: "Tổng giá",
      type: "number",
      minWidth: 170,
      flex: 1,
    },
  ];

  const columnsUser = [
    { field: "id", headerName: "ID", minWidth: 260 },

    {
      field: "image",
      headerName: "Avatar",
      minWidth: 140,
      renderCell: (params) => (
        <img
          style={{
            width: "80px",
            height: "60px",
            objectFit: "contain",
          }}
          src={params.value}
          alt=""
        />
      ),
    },

    {
      field: "email",
      headerName: "Email",
      minWidth: 250,
    },

    {
      field: "name",
      headerName: "Họ tên",
      minWidth: 200,
    },

    {
      field: "phoneNumber",
      headerName: "SĐT",
      minWidth: 170,
    },

    {
      field: "createdAt",
      headerName: "Ngày tạo",
      minWidth: 160,
    },

    {
      field: "role",
      headerName: "Quyền",
      minWidth: 140,
      flex: 1,
      cellClassName: (params) => {
        return params.getValue(params.id, "role") === "admin"
          ? "red_color"
          : "green_color";
      },
    },
  ];

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
                    setShow(false);
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

              <label>
                Loại
                <select
                  onChange={(e) => {
                    setShow(false);
                    setType(e.target.value);
                  }}
                >
                  {statistic === "Danh sách phòng"
                    ? type1.map((type) => (
                        <option key={type} value={type}>
                          {type}
                        </option>
                      ))
                    : statistic === "Danh sách đặt phòng"
                    ? type2.map((type) => (
                        <option key={type} value={type}>
                          {type}
                        </option>
                      ))
                    : statistic === "Danh sách người dùng"
                    ? type3.map((type) => (
                        <option key={type} value={type}>
                          {type}
                        </option>
                      ))
                    : ""}
                </select>
              </label>

              <label>
                Thời gian
                <select
                  required
                  onChange={(e) => {
                    setShow(false);
                    setTime(e.target.value);
                  }}
                >
                  {times.map((time) => (
                    <option key={time} value={time}>
                      {time}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <div>
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

              <Button
                onClick={exportHandler}
                disabled={
                  roomsLoading ||
                  usersLoading ||
                  bookingsLoading ||
                  statistic === ""
                    ? true
                    : false
                }
              >
                Xuất Excel
              </Button>
            </div>
          </div>

          {show && (
            <DataGrid
              rows={rows}
              columns={
                statistic === "Danh sách phòng"
                  ? columnsRoom
                  : statistic === "Danh sách đặt phòng"
                  ? columnsBooking
                  : statistic === "Danh sách người dùng"
                  ? columnsUser
                  : setShow(false)
              }
              pageSize={statistic === "Danh sách đặt phòng" ? 7 : 8}
              rowsPerPageOptions={[statistic === "Danh sách đặt phòng" ? 7 : 8]}
              disableSelectionOnClick
              className="roomListTable"
              autoHeight
            />
          )}

          {totalAmount !== 0 && show && statistic === "Danh sách đặt phòng" && (
            <div className="statisticTotal">
              <div>
                {"Tổng cộng: " + totalAmount.toLocaleString("en-us") + " VNĐ"}
              </div>
            </div>
          )}
        </div>
      </div>
    </Fragment>
  );
};

export default Statistics;
