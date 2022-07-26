import React, { Fragment, useEffect, useState } from "react";
import { DataGrid } from "@material-ui/data-grid";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useAlert } from "react-alert";
import { Button } from "@material-ui/core";
import {
  Dialog,
  DialogActions,
  DialogContent,
  Button as BtnDialog,
} from "@material-ui/core";

import Loading from "../layout/loading/loading";
import MetaData from "../layout/MetaData";
import SideBar from "./Sidebar";

import {
  deleteBooking,
  getAllBookings,
  clearErrors,
} from "../../actions/bookingAction";
import { DELETE_BOOKING_RESET } from "../../constants/bookingConstants";
import { exportExcel } from "../../utils/exportExcel";

import LaunchIcon from "@material-ui/icons/Launch";
import DeleteIcon from "@material-ui/icons/Delete";

const BookingList = () => {
  const dispatch = useDispatch();
  const alert = useAlert();
  const navigate = useNavigate();

  const [open, setOpen] = useState(false);
  const [idDelete, setIdDelete] = useState("");

  const { loading, error, bookings, totalAmount } = useSelector(
    (state) => state.bookings
  );
  const { user } = useSelector((state) => state.user);
  const {
    loading: deleteLoading,
    error: deleteError,
    isDeleted,
  } = useSelector((state) => state.booking);

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
      alert.success("Đơn đặt phòng đã được xóa");
      navigate("/admin/bookings");
      dispatch({ type: DELETE_BOOKING_RESET });
    }

    dispatch(getAllBookings());
  }, [dispatch, alert, error, deleteError, isDeleted, navigate]);

  const deleteBookingHandler = () => {
    dispatch(deleteBooking(idDelete));
  };

  const openDialogToggle = () => {
    setOpen(!open);
  };

  const submitHandler = () => {
    deleteBookingHandler();
    setOpen(false);
  };

  const columns = [
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
      minWidth: 120,
    },

    {
      field: "totalPrices",
      headerName: "Tổng giá",
      minWidth: 170,
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
      headerName: "Actions",
      minWidth: 160,
      flex: 1,
      // type: "number",
      sortable: false,
      renderCell: (params) => {
        return (
          <Fragment>
            <Button
              onClick={() => {
                navigate(`/booking/${params.getValue(params.id, "id")}`);
              }}
            >
              <LaunchIcon />
            </Button>

            <Button
              onClick={() => {
                setIdDelete(params.getValue(params.id, "id"));
                openDialogToggle();
              }}
            >
              <DeleteIcon />
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
        roomID: item.room,
        name: item.user?.name || item.user?.email,
        createdAt: new Date(item.createdAt).toLocaleString("en-GB"),
        numOfRooms: item.numOfRooms,
        totalPrices: item.totalPrice?.toLocaleString("en-US") + " VNĐ",
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
      <MetaData title={`Danh sách đặt phòng`} />

      <div className="dashboard">
        <SideBar />
        {loading ? (
          <Loading />
        ) : (
          <div className="roomListContainer">
            <h1 id="roomListHeading">DANH SÁCH ĐẶT PHÒNG</h1>

            <div
              onClick={() =>
                exportExcel(
                  "Danh sách đặt phòng",
                  user,
                  null,
                  null,
                  bookings,
                  totalAmount
                )
              }
              className="exportExcel"
            >
              Xuất Excel
            </div>

            <DataGrid
              rows={rows}
              columns={columns}
              pageSize={10}
              rowsPerPageOptions={[10]}
              disableSelectionOnClick
              className="roomListTable"
              autoHeight
            />

            {totalAmount !== 0 && (
              <div className="statisticTotal">
                <div>
                  {"Tổng cộng: " + totalAmount?.toLocaleString("en-us") + " VNĐ"}
                </div>
              </div>
            )}

            <Dialog
              aria-labelledby="simple-dialog-title"
              open={open}
              onClose={openDialogToggle}
            >
              <DialogContent className="submitDialog">
                <p>Bạn có chắc muốn xóa đơn đặt phòng không?</p>
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
        {deleteLoading && <Loading backgroundColor={"transparent"} />}
      </div>
    </Fragment>
  );
};

export default BookingList;
