import "./RoomList.css";

import React, { Fragment, useEffect, useState } from "react";
import { DataGrid } from "@material-ui/data-grid";
import { useSelector, useDispatch } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { useAlert } from "react-alert";
import { Button } from "@material-ui/core";
import {
  Dialog,
  DialogActions,
  DialogContent,
  Button as BtnDialog,
} from "@material-ui/core";

import {
  clearErrors,
  getAllRooms,
  deleteRoom,
  updateStatus,
} from "../../actions/roomAction";
import {
  DELETE_ROOM_RESET,
  UPDATE_STATUS_RESET,
} from "../../constants/roomConstants";
import MetaData from "../layout/MetaData";
import SideBar from "./Sidebar";
import Loading from "../layout/loading/loading";

import { exportExcel } from "../../utils/exportExcel";

// icon
import LaunchIcon from "@material-ui/icons/Launch";
import EditIcon from "@material-ui/icons/Edit";
import DeleteIcon from "@material-ui/icons/Delete";
import DoneOutlinedIcon from "@material-ui/icons/DoneOutlined";
import ClearOutlinedIcon from "@material-ui/icons/ClearOutlined";

const RoomList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { type } = useParams();
  const alert = useAlert();

  const [open, setOpen] = useState(false);
  const [idDelete, setIdDelete] = useState("");

  const { loading, error, rooms } = useSelector((state) => state.rooms);
  const { user } = useSelector((state) => state.user);
  const {
    loading: roomLoading,
    error: deleteError,
    isDeleted,
    isUpdated,
  } = useSelector((state) => state.room);

  const openDialogToggle = () => {
    setOpen(!open);
  };

  const submitHandler = () => {
    deleteRoomHandler();
    setOpen(false);
  };

  const deleteRoomHandler = () => {
    dispatch(deleteRoom(idDelete));
  };

  const acceptRoomHandler = (id) => {
    const myForm = new FormData();

    myForm.set("status", "Đã phê duyệt");

    dispatch(updateStatus(id, myForm));
  };

  const refuseRoomHandler = (id) => {
    const myForm = new FormData();

    myForm.set("status", "Bị từ chối");

    dispatch(updateStatus(id, myForm));
  };

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
      alert.success("Phòng đã được xóa");
      dispatch({ type: DELETE_ROOM_RESET });
    }

    if (isUpdated) {
      alert.success("Phòng đã được cập nhật");
      dispatch({ type: UPDATE_STATUS_RESET });
    }

    type === undefined
      ? dispatch(getAllRooms())
      : dispatch(getAllRooms("Chờ phê duyệt"));
  }, [dispatch, alert, error, deleteError, isDeleted, type, isUpdated]);

  const columns = [
    { field: "id", headerName: "Mã phòng", minWidth: 250 },

    {
      field: "user",
      headerName: "Người đăng",
      minWidth: 200,
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
      minWidth: 600,
    },

    {
      field: "price",
      headerName: "Giá",
      minWidth: 150,
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
      headerName: "Actions",
      minWidth: 200,
      // type: "number",
      flex: 1,
      sortable: false,
      renderCell: (params) => {
        return type === undefined ? (
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
        ) : (
          <Fragment>
            <Button
              onClick={() =>
                acceptRoomHandler(params.getValue(params.id, "id"))
              }
            >
              <DoneOutlinedIcon />
            </Button>

            <Button
              onClick={() =>
                refuseRoomHandler(params.getValue(params.id, "id"))
              }
            >
              <ClearOutlinedIcon />
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
        user: item.user?.name ?? item.user?.email,
        image: item.images[0].url,
        address: item.address,
        status: item.status,
      });
    });

  return (
    <Fragment>
      <MetaData title={`Danh sách phòng`} />

      <div className="dashboard">
        <SideBar />
        {loading ? (
          <Loading />
        ) : (
          <div className="roomListContainer">
            <h1 id="roomListHeading">
              {type === undefined
                ? "DANH SÁCH BÀI ĐĂNG"
                : "DANH SÁCH BÀI CHỜ PHÊ DUYỆT"}
            </h1>

            {type === undefined && (
              <div
                onClick={() =>
                  exportExcel("Danh sách phòng", user, null, rooms, null, null)
                }
                className="exportExcel"
              >
                Xuất Excel
              </div>
            )}

            <DataGrid
              rows={rows}
              columns={columns}
              pageSize={10}
              rowsPerPageOptions={[10]}
              disableSelectionOnClick
              className="roomListTable"
              autoHeight
            />

            {roomLoading && <Loading backgroundColor={"transparent"} />}

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
      </div>
    </Fragment>
  );
};

export default RoomList;
