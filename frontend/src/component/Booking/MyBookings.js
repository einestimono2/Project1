import "./MyBookings.css";

import React, { Fragment, useEffect, useState } from "react";
import { DataGrid } from "@material-ui/data-grid";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useAlert } from "react-alert";
import Typography from "@material-ui/core/Typography";
import { Button } from "@material-ui/core";
import {
  Dialog,
  DialogActions,
  DialogContent,
  Button as BtnDialog,
} from "@material-ui/core";
import ExcelJs from "exceljs";

import Loading from "../layout/loading/loading";
import MetaData from "../layout/MetaData";
import {
  clearErrors,
  myBookings,
  deleteBooking,
} from "../../actions/bookingAction";
import { DELETE_BOOKING_RESET } from "../../constants/bookingConstants";

import LaunchIcon from "@material-ui/icons/Launch";
import PrintIcon from "@material-ui/icons/Print";
import CancelIcon from "@material-ui/icons/Cancel";

const MyBookings = () => {
  const dispatch = useDispatch();
  const alert = useAlert();
  const navigate = useNavigate();

  const { loading, error, bookings } = useSelector((state) => state.myBookings);
  const { user } = useSelector((state) => state.user);
  const {
    loading: deleteLoading,
    error: deleteError,
    isDeleted,
  } = useSelector((state) => state.booking);

  const [open, setOpen] = useState(false);
  const [idDelete, setIdDelete] = useState("");

  useEffect(() => {
    if (error) {
      alert.error(error);
      dispatch(clearErrors());
    }

    if (deleteError) {
      alert.error(deleteError);
      dispatch(clearErrors());
    }

    if (isDeleted) {
      alert.success("Hủy đặt phòng thành công");
      navigate("/mybookings");
      dispatch({ type: DELETE_BOOKING_RESET });
    }

    dispatch(myBookings());
  }, [dispatch, alert, error, deleteError, isDeleted, navigate]);

  const exportExcelHandler = (id) => {
    const booking = bookings.find((e) => e._id === id);

    if (!booking) return alert.error("Có lỗi xảy ra, vui lòng thử lại");

    const sheetName = `Booking_${booking._id}.xlsx`;
    const workbook = new ExcelJs.Workbook();
    const sheet = workbook.addWorksheet(sheetName, {
      views: [{ showGridLines: false }],
    });

    // Thông tin website
    sheet.getRow(1).values = ["RR", "WEBSITE ĐĂNG TIN & ĐẶT PHÒNG", "", ""];
    sheet.getRow(2).values = ["", "Địa chỉ: xx xx xx xx xx", "", ""];
    sheet.getRow(3).values = ["", "Liên hệ: 0123456798", "", ""];
    sheet.mergeCells(`A1:A3`);
    sheet.mergeCells(`B1:D1`);
    sheet.mergeCells(`B2:D2`);
    sheet.mergeCells(`B3:D3`);

    // Thanh thông tiêu đề
    sheet.getCell("A5").value = {
      richText: [
        {
          font: { size: 22, bold: true, color: { argb: "FF0000" } },
          text: `GIẤY XÁC NHẬN ĐẶT PHÒNG`,
        },
      ],
    };
    sheet.mergeCells(`A5:F5`);
    sheet.getRow(5).height = 40;
    sheet.getRow(6).values = ["", "", "", `Booking #${booking._id}`];
    sheet.getRow(7).values = [
      "",
      "",
      "",
      `Ngày xuất: ${new Date(Date.now()).toLocaleString("en-GB")}`,
    ];
    sheet.mergeCells(`D6:E6`);
    sheet.mergeCells(`D7:E7`);

    //Thông tin người đặt
    sheet.getCell("A9").value = {
      richText: [
        {
          font: { size: 16, bold: true },
          text: "Thông tin đặt phòng",
        },
      ],
    };
    sheet.getRow(10).values = ["ID", booking.user?._id];
    sheet.getRow(11).values = ["Email", booking.user?.email];
    sheet.getRow(12).values = ["Họ tên", booking.user?.name];
    sheet.getRow(13).values = ["Số điện thoại", booking.user?.phoneNumber];
    sheet.getRow(14).values = [
      "Ngày đặt",
      new Date(booking.createdAt).toLocaleString("en-GB"),
    ];
    sheet.getRow(15).values = [
      "Ngày nhận",
      new Date(booking.checkInDate).toLocaleString("en-GB"),
    ];

    // Phòng đặt
    sheet.getCell("A17").value = {
      richText: [
        {
          font: { size: 16, bold: true },
          text: "Thông tin chi tiết",
        },
      ],
    };
    sheet.getRow(18).values = [
      "Mã phòng",
      "Loại phòng",
      "Số phòng",
      "Giá phòng",
      "Thành tiền",
    ];

    sheet.columns = [
      { key: "roomID", width: 30 },
      { key: "category", width: 20 },
      { key: "numOfRooms", width: 10 },
      { key: "roomPrice", width: 20 },
      { key: "totalPrice", width: 20 },
    ];

    sheet.addRow({
      roomID: booking.room?._id,
      category: booking.room?.category,
      numOfRooms: booking.numOfRooms,
      roomPrice: booking.roomPrice.toLocaleString("en-us") + " VNĐ",
      totalPrice: booking.totalPrice.toLocaleString("en-us") + " VNĐ",
    });

    sheet.addRow({
      roomID: "TỔNG",
      category: "",
      numOfRooms: "",
      roomPrice: "",
      totalPrice: booking.totalPrice.toLocaleString("en-us") + " VNĐ",
    });

    sheet.getCell("D22").value = {
      richText: [
        {
          font: { size: 16, bold: true },
          text: "Thông tin thanh toán",
        },
      ],
    };
    sheet.mergeCells(`D22:E22`);

    sheet.addRow({
      roomID: "",
      category: "",
      numOfRooms: "",
      roomPrice: "Tổng",
      totalPrice: booking.totalPrice.toLocaleString("en-us") + " VNĐ",
    });

    sheet.addRow({
      roomID: "",
      category: "",
      numOfRooms: "",
      roomPrice: "Phí",
      totalPrice: "0",
    });

    sheet.addRow({
      roomID: "",
      category: "",
      numOfRooms: "",
      roomPrice: "Hình thức",
      totalPrice: booking.status,
    });

    if (booking.status === "Thanh toán online") {
      sheet.addRow({
        roomID: "",
        category: "",
        numOfRooms: "",
        roomPrice: "Thánh toán",
        totalPrice: new Date(booking.paidAt).toLocaleString("en-GB"),
      });

      sheet.addRow({
        roomID: "",
        category: "",
        numOfRooms: "",
        roomPrice: "Trạng thái",
        totalPrice: booking.paymentInfo?.status,
      });
    }

    //
    const row = sheet.getRow(18);
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
      "D6",
      "D7",
      "A9",
      "B10",
      "B11",
      "B12",
      "B13",
      "B14",
      "B15",
      "A17",
      "D22",
      "D23",
      "D24",
      "D25",
      "D26",
      "D27",
      "E23",
      "E24",
      "E25",
      "E26",
      "E27",
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

  const deleteRoomHandler = () => {
    dispatch(deleteBooking(idDelete));
  };

  const openDialogToggle = () => {
    setOpen(!open);
  };

  const submitHandler = () => {
    deleteRoomHandler();
    setOpen(false);
  };

  const columns = [
    { field: "id", headerName: "Mã Booking", minWidth: 220 },

    { field: "roomID", headerName: "Mã phòng", minWidth: 220 },

    {
      field: "numOfRooms",
      headerName: "Slg",
      minWidth: 115,
    },

    {
      field: "totalPrices",
      headerName: "Tổng giá",
      minWidth: 160,
    },

    {
      field: "checkinDate",
      headerName: "Ngày nhận",
      minWidth: 200,
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
      field: "actions",
      flex: 1,
      headerName: "Actions",
      minWidth: 210,
      type: "number",
      sortable: false,
      renderCell: (params) => {
        return (
          <Fragment>
            <Button
              onClick={() =>
                exportExcelHandler(params.getValue(params.id, "id"))
              }
            >
              <PrintIcon />
            </Button>

            <Button
              onClick={() => {
                setIdDelete(params.getValue(params.id, "id"));
                openDialogToggle();
              }}
            >
              <CancelIcon />
            </Button>

            <Button
              onClick={() => {
                navigate(`/booking/${params.getValue(params.id, "id")}`);
              }}
            >
              <LaunchIcon />
            </Button>
          </Fragment>
        );
      },
    },
  ];

  const rows = [];

  bookings &&
    bookings.forEach((item, index) => {
      rows.push({
        id: item._id,
        roomID: item.room?._id,
        numOfRooms: item.numOfRooms,
        totalPrices: item.totalPrice.toLocaleString("en-US") + " VNĐ",
        checkinDate: new Date(item.checkInDate).toLocaleString("en-GB"),
        paidAt:
          item.status === "Thanh toán online"
            ? new Date(item.paidAt).toLocaleString("en-GB")
            : "",
        status: item.status,
      });
    });

  return (
    <Fragment>
      <MetaData title={`${user.name ?? user.email} - Bookings`} />
      {deleteLoading && <Loading backgroundColor={"transparent"} />},
      {loading ? (
        <Loading />
      ) : (
        <div className="myBookingsPage">
          <Typography id="myBookingsHeading">
            {user.name ?? user.email} - Booking
          </Typography>

          <DataGrid
            rows={rows}
            columns={columns}
            pageSize={8}
            rowsPerPageOptions={[8]}
            disableSelectionOnClick
            className="myBookingTable"
            autoHeight
          />

          <Dialog
            aria-labelledby="simple-dialog-title"
            open={open}
            onClose={openDialogToggle}
          >
            <DialogContent className="submitDialog">
              {Math.ceil(
                (new Date() -
                  new Date(
                    bookings.find((e) => e._id === idDelete)?.createdAt
                  )) /
                  (1000 * 60 * 60 * 24)
              ) > 1 ? (
                <p>
                  Đã quá 24h kể từ khi đặt <br /> Hủy đặt sẽ không được hoàn lại
                  tiền.
                  <br /> Bạn có chắc muốn hủy đặt phòng không?
                </p>
              ) : (
                <p>Bạn có chắc muốn hủy đặt phòng không?</p>
              )}
            </DialogContent>
            <DialogActions>
              <BtnDialog onClick={openDialogToggle} color="secondary">
                Hủy bỏ
              </BtnDialog>
              <BtnDialog onClick={submitHandler} color="primary">
                Xác nhận
              </BtnDialog>
            </DialogActions>
          </Dialog>
        </div>
      )}
    </Fragment>
  );
};

export default MyBookings;
