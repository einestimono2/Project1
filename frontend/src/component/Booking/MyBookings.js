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

import { printBookingConfirmation } from "../../utils/exportExcel";
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

    printBookingConfirmation(booking);
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
