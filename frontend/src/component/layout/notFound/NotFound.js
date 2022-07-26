import "./NotFound.css";

import React from "react";

import { Typography } from "@material-ui/core";
import { Link } from "react-router-dom";

import ErrorIcon from "@material-ui/icons/Error";

const NotFound = (props) => {
  return (
    <div className="PageNotFound">
      <ErrorIcon />

      <Typography>{props.name || "Trang không tồn tại !"} </Typography>
      <Link to="/">Trang chủ</Link>
    </div>
  );
};

export default NotFound;
