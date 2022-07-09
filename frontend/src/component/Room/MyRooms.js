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

import { clearErrors, myRooms, deleteRoom } from "../../actions/roomAction";
import { DELETE_ROOM_RESET } from "../../constants/roomConstants";

import LaunchIcon from "@material-ui/icons/Launch";
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";

const MyRooms = () => {
  const dispatch = useDispatch();
  const alert = useAlert();
  const navigate = useNavigate();

  const { loading, error, rooms } = useSelector((state) => state.myRooms);
  const {
    loading: deleteLoading,
    error: deleteError,
    isDeleted,
  } = useSelector((state) => state.room);
  const { user } = useSelector((state) => state.user);

  const [open, setOpen] = useState(false);
  const [idDelete, setIdDelete] = useState("");

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
      minWidth: 160,
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
        price: item.price.toLocaleString("en-us") + " VNĐ",
        image: item.images[0].url,
        address: item.address,
        status: item.status,
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

    dispatch(myRooms());
  }, [dispatch, alert, error, deleteError, isDeleted]);

  const deleteRoomHandler = () => {
    if (idDelete !== "") dispatch(deleteRoom(idDelete));
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
      {deleteLoading && <Loading backgroundColor={"transparent"} />}
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

          <Dialog
            aria-labelledby="simple-dialog-title"
            open={open}
            onClose={openDialogToggle}
          >
            <DialogContent className="submitDialog">
              <p>Bạn có chắc muốn xóa phòng này không?</p>
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
