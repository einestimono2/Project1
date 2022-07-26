import "./ReviewList.css";

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

import {
  clearErrors,
  getAllRooms,
  getAllReviews,
  deleteReviews,
} from "../../actions/roomAction";
import Loading from "../layout/loading/loading";
import MetaData from "../layout/MetaData";
import SideBar from "./Sidebar";
import { DELETE_REVIEW_RESET } from "../../constants/roomConstants";

import DeleteIcon from "@material-ui/icons/Delete";
import Star from "@material-ui/icons/Star";

const ReviewList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const alert = useAlert();

  const {
    loading: deleteLoading,
    error: deleteError,
    isDeleted,
  } = useSelector((state) => state.review);

  const { error, reviews, loading } = useSelector((state) => state.allReviews);
  const { rooms } = useSelector((state) => state.rooms);

  const [roomID, setRoomID] = useState("");
  const [open, setOpen] = useState(false);
  const [idDelete, setIdDelete] = useState("");

  const deleteReviewHandler = () => {
    dispatch(deleteReviews(idDelete, roomID));
    dispatch(getAllReviews(roomID));
  };

  const openDialogToggle = () => {
    setOpen(!open);
  };

  const submitHandler = () => {
    deleteReviewHandler();
    setOpen(false);
  };

  const allReviewsSubmitHandler = (e) => {
    e.preventDefault();
    if (roomID !== "") dispatch(getAllReviews(roomID));
  };

  useEffect(() => {
    dispatch(getAllRooms());
  }, [dispatch]);

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
      alert.success("Đánh giá đã được xóa");
      dispatch({ type: DELETE_REVIEW_RESET });
      navigate("/admin/reviews");
    }
  }, [dispatch, alert, error, deleteError, isDeleted, navigate, roomID]);

  const columns = [
    { field: "id", headerName: "ID", minWidth: 250 },

    {
      field: "user",
      headerName: "Người dùng",
      minWidth: 200,
    },

    {
      field: "comment",
      headerName: "Bình luận",
      minWidth: 350,
      flex: 1,
    },

    {
      field: "rating",
      headerName: "Đánh giá",
      type: "number",
      minWidth: 170,

      cellClassName: (params) => {
        return params.getValue(params.id, "rating") >= 3
          ? "green_color"
          : "red_color";
      },
    },

    {
      field: "actions",
      headerName: "Hành động",
      minWidth: 170,
      type: "number",
      sortable: false,
      renderCell: (params) => {
        return (
          <Fragment>
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

  reviews &&
    reviews.forEach((item) => {
      rows.push({
        id: item._id,
        rating: item.rating,
        comment: item.comment,
        user: item.user.name,
      });
    });

  return (
    <Fragment>
      <MetaData title={`Danh sách đánh giá`} />

      <div className="dashboard">
        <SideBar />
        <div className="allReviewsContainer">
          <form className="allReviewsForm" onSubmit={allReviewsSubmitHandler}>
            <h1 className="allReviewsFormHeading">TẤT CẢ ĐÁNH GIÁ</h1>

            <div>
              <Star />
              <select
                onChange={(e) => {
                  setRoomID(e.target.value);
                }}
              >
                <option value="">Chọn mã phòng</option>
                {rooms &&
                  rooms.map((room) => (
                    <option key={room._id} value={room._id}>
                      {room._id}
                    </option>
                  ))}
              </select>
            </div>

            <Button
              id="searchReviewsBtn"
              type="submit"
              disabled={loading ? true : false || roomID === "" ? true : false}
            >
              Kiểm tra
            </Button>
          </form>

          {reviews && reviews.length > 0 && roomID !== "" ? (
            <DataGrid
              rows={rows}
              columns={columns}
              pageSize={7}
              rowsPerPageOptions={[7]}
              disableSelectionOnClick
              className="myBookingTable"
              autoHeight
            />
          ) : (
            <h1 className="allReviewsFormHeading">Không có đánh giá nào</h1>
          )}

          {deleteLoading && <Loading backgroundColor={"transparent"} />}

          <Dialog
            aria-labelledby="simple-dialog-title"
            open={open}
            onClose={openDialogToggle}
          >
            <DialogContent className="submitDialog">
              <p>Bạn có chắc muốn xóa đánh giá này không?</p>
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
      </div>
    </Fragment>
  );
};

export default ReviewList;
