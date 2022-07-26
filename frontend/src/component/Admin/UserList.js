import "./RoomList.css";

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
import { getAllUsers, clearErrors, deleteUser } from "../../actions/userAction";
import { DELETE_USER_RESET } from "../../constants/userConstants";
import { exportExcel } from "../../utils/exportExcel";

import EditIcon from "@material-ui/icons/Edit";
import DeleteIcon from "@material-ui/icons/Delete";

const UsersList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const alert = useAlert();

  const [open, setOpen] = useState(false);
  const [idDelete, setIdDelete] = useState("");

  const { loading, error, users } = useSelector((state) => state.users);
  const { user } = useSelector((state) => state.user);
  const {
    loading: deleteLoading,
    error: deleteError,
    isDeleted,
    message,
  } = useSelector((state) => state.profile);

  const deleteUserHandler = () => {
    dispatch(deleteUser(idDelete));
  };

  const openDialogToggle = () => {
    setOpen(!open);
  };

  const submitHandler = () => {
    deleteUserHandler();
    setOpen(false);
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
      alert.success("Người dùng đã được xóa");
      navigate("/admin/users");
      dispatch({ type: DELETE_USER_RESET });
    }

    dispatch(getAllUsers());
  }, [dispatch, alert, error, deleteError, isDeleted, message, navigate]);

  const columns = [
    { field: "id", headerName: "ID", minWidth: 260 },

    {
      field: "image",
      headerName: "Ảnh",
      minWidth: 130,
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
      minWidth: 230,
    },

    {
      field: "name",
      headerName: "Họ tên",
      minWidth: 180,
    },

    {
      field: "phoneNumber",
      headerName: "SĐT",
      minWidth: 130,
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
      cellClassName: (params) => {
        return params.getValue(params.id, "role") === "admin"
          ? "red_color"
          : "green_color";
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
                navigate(`/admin/user/${params.getValue(params.id, "id")}`);
              }}
            >
              <EditIcon />
            </Button>

            <Button
              onClick={() => {
                openDialogToggle();
                setIdDelete(params.getValue(params.id, "id"));
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

  users &&
    users.forEach((item) => {
      rows.push({
        id: item._id,
        image: item.avatar?.url,
        phoneNumber: item.phoneNumber || "",
        role: item.role,
        createdAt: new Date(item.createdAt)
          .toLocaleString("en-gb")
          .split(",")[0],
        email: item.email,
        name: item.name,
      });
    });

  return (
    <Fragment>
      <MetaData title={`Danh sách người dùng`} />

      <div className="dashboard">
        <SideBar />
        {deleteLoading && <Loading backgroundColor={"transparent"} />}
        {loading ? (
          <Loading />
        ) : (
          <div className="roomListContainer">
            <h1 id="roomListHeading">DANH SÁCH NGƯỜI DÙNG</h1>

            <div
              onClick={() =>
                exportExcel(
                  "Danh sách người dùng",
                  user,
                  users,
                  null,
                  null,
                  null
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

            <Dialog
              aria-labelledby="simple-dialog-title"
              open={open}
              onClose={openDialogToggle}
            >
              <DialogContent className="submitDialog">
                <p>Bạn có chắc muốn xóa người dùng này không?</p>
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

export default UsersList;
