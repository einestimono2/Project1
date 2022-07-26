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

import Loading from "../layout/loading/loading";
import MetaData from "../layout/MetaData";
import { printBookingConfirmation } from "../../utils/exportExcel";

import { clearErrors, myRooms, deleteRoom } from "../../actions/roomAction";
import {
  getAllBookingUsers,
  deleteBooking,
  clearErrors as bookingClearErrors,
} from "../../actions/bookingAction";
import { DELETE_ROOM_RESET } from "../../constants/roomConstants";
import { DELETE_BOOKING_RESET } from "../../constants/bookingConstants";

import LaunchIcon from "@material-ui/icons/Launch";
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";
import ViewListIcon from "@material-ui/icons/ViewList";
import PrintIcon from "@material-ui/icons/Print";
import CancelIcon from "@material-ui/icons/Cancel";

const MyRooms = () => {
  const dispatch = useDispatch();
  const alert = useAlert();
  const navigate = useNavigate();

  const { loading, error, rooms } = useSelector((state) => state.myRooms);
  const { loading: bookingLoading, bookings } = useSelector(
    (state) => state.bookings
  );
  const {
    loading: deleteLoading,
    error: deleteError,
    isDeleted,
  } = useSelector((state) => state.room);
  const { user } = useSelector((state) => state.user);
  const {
    loading: deleteBookingLoading,
    error: bookingError,
    isDeleted: isDeletedBook,
  } = useSelector((state) => state.booking);

  const [open, setOpen] = useState(false);
  const [idDelete, setIdDelete] = useState("");
  const [deleteType, setDeleteType] = useState("");
  const [showBooking, setShowBooking] = useState(false);

  const columns = [
    { field: "id", headerName: "Mã phòng", minWidth: 240 },

    {
      field: "image",
      headerName: "Ảnh",
      minWidth: 120,
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
      field: "num",
      headerName: "Slg",
      minWidth: 105,
      cellClassName: (params) => {
        return params.getValue(params.id, "num") === 0 ? "red_color" : null;
      },
    },

    {
      field: "address",
      headerName: "Địa chỉ",
      minWidth: 600,
    },

    {
      field: "price",
      headerName: "Giá",
      minWidth: 140,
    },

    {
      field: "status",
      headerName: "Trạng thái",
      minWidth: 170,
      cellClassName: (params) => {
        return params.getValue(params.id, "status") === "Đã phê duyệt"
          ? "green_color"
          : params.getValue(params.id, "status") === "Chờ phê duyệt"
          ? "orange_color"
          : "red_color";
      },
    },

    {
      field: "actions",
      headerName: "Hành động",
      minWidth: 270,
      type: "number",
      flex: 1,
      sortable: false,
      renderCell: (params) => {
        return (
          <Fragment>
            <Button
              onClick={() => {
                navigate(`/room/update/${params.getValue(params.id, "id")}`);
              }}
            >
              <EditIcon />
            </Button>

            <Button
              onClick={() => {
                setIdDelete(params.getValue(params.id, "id"));
                setDeleteType("Room");
                openDialogToggle();
              }}
            >
              <DeleteIcon />
            </Button>

            <Button
              onClick={() => {
                navigate(`/room/${params.getValue(params.id, "id")}`);
              }}
            >
              <LaunchIcon />
            </Button>

            <Button
              onClick={() => {
                dispatch(getAllBookingUsers(params.getValue(params.id, "id")));
                setShowBooking(true);
              }}
            >
              <ViewListIcon />
            </Button>
          </Fragment>
        );
      },
    },
  ];

  const rows = [];

  rooms &&
    rooms.forEach((item) => {
      rows.push({
        id: item._id,
        num: item.numOfRooms,
        price: item.price.toLocaleString("en-us") + " VNĐ",
        image: item.images[0].url,
        address: item.address,
        status: item.status,
      });
    });

  const bookingColumns = [
    { field: "id", headerName: "Mã Booking", minWidth: 215 },

    { field: "email", headerName: "Email", minWidth: 150 },

    { field: "name", headerName: "Họ tên", minWidth: 150 },

    { field: "phoneNumber", headerName: "SĐT", minWidth: 125 },

    {
      field: "createdAt",
      headerName: "Ngày đặt",
      minWidth: 180,
    },

    {
      field: "numOfRooms",
      headerName: "Slg",
      minWidth: 115,
    },

    {
      field: "checkinDate",
      headerName: "Ngày nhận",
      minWidth: 180,
    },

    {
      field: "paidAt",
      headerName: "Thanh toán",
      minWidth: 180,
      cellClassName: (params) => {
        return params.getValue(params.id, "paidAt") === "Thanh toán sau"
          ? "red_color"
          : "green_color";
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
                setDeleteType("Booking");
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

  const bookingRows = [];

  bookings &&
    bookings.forEach((item) => {
      bookingRows.push({
        id: item._id,
        email: item.user?.email,
        name: item.user?.name || "",
        phoneNumber: item.user?.phoneNumber || "",
        checkinDate: new Date(item.checkInDate).toLocaleString("en-GB"),
        numOfRooms: item.numOfRooms,
        createdAt: new Date(item.createdAt).toLocaleString("en-GB"),
        paidAt: item.paidAt
          ? new Date(item.paidAt).toLocaleString("en-GB")
          : "Thanh toán sau",
      });
    });

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
      alert.success("Xóa phòng thành công");
      dispatch({ type: DELETE_ROOM_RESET });
    }

    if (bookingError) {
      alert.error(deleteError);
      dispatch(bookingClearErrors());
    }

    if (isDeletedBook) {
      alert.success("Hủy đặt phòng thành công");
      navigate("/myrooms");
      dispatch({ type: DELETE_BOOKING_RESET });
    }

    dispatch(myRooms());
  }, [
    dispatch,
    alert,
    error,
    deleteError,
    isDeleted,
    bookingError,
    isDeletedBook,
    navigate,
  ]);

  const exportExcelHandler = (id) => {
    const booking = bookings.find((e) => e._id === id);

    if (!booking) return alert.error("Có lỗi xảy ra, vui lòng thử lại");

    printBookingConfirmation(booking);
  };

  const deleteRoomHandler = () => {
    deleteType === "Room"
      ? dispatch(deleteRoom(idDelete))
      : dispatch(deleteBooking(idDelete));
  };

  const openDialogToggle = () => {
    setOpen(!open);
  };

  const submitHandler = () => {
    deleteRoomHandler();
    setOpen(false);
  };

  return (
    <Fragment>
      <MetaData title={`${user.name ?? user.email} - Rooms`} />
      {(deleteLoading || bookingLoading || deleteBookingLoading) && (
        <Loading backgroundColor={"transparent"} />
      )}
      {loading ? (
        <Loading />
      ) : (
        <div className="myBookingsPage">
          <Typography id="myBookingsHeading">
            {user.name ?? user.email} - Rooms
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

          {showBooking && bookings && bookings.length > 0 ? (
            <Fragment>
              <Typography
                align="center"
                style={{
                  margin: "5vmax auto 1.5vmax auto",
                  fontSize: "1.5vmax",
                  width: "42%",
                  borderBottom: "1px solid gray",
                  color: "red",
                }}
              >
                {`Danh sách đặt phòng #${bookings[0]?.room}`}
              </Typography>

              <DataGrid
                rows={bookingRows}
                columns={bookingColumns}
                pageSize={5}
                rowsPerPageOptions={[5]}
                disableSelectionOnClick
                className="myBookingTable"
                autoHeight
              />
            </Fragment>
          ) : (
            showBooking &&
            !bookingLoading && (
              <h1
                className="allReviewsFormHeading"
                style={{ marginTop: "5vmax", color: "crimson" }}
              >
                Phòng chưa có ai đặt !
              </h1>
            )
          )}

          <Dialog
            aria-labelledby="simple-dialog-title"
            open={open}
            onClose={openDialogToggle}
          >
            <DialogContent className="submitDialog">
              <p>
                {deleteType === "Room"
                  ? "Bạn có chắc muốn xóa phòng này không ?"
                  : "Bạn muốn hủy đặt phòng của người này ?"}
              </p>
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

export default MyRooms;
