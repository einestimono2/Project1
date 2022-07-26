import React from "react";
import "./Sidebar.css";
import { Link } from "react-router-dom";
import { TreeView, TreeItem } from "@material-ui/lab";

// icon
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import ExpandLessOutlinedIcon from "@material-ui/icons/ExpandLessOutlined";
import DoneAllIcon from "@material-ui/icons/DoneAll";
import ListAltIcon from "@material-ui/icons/ListAlt";
import DashboardIcon from "@material-ui/icons/Dashboard";
import PeopleIcon from "@material-ui/icons/People";
import RateReviewIcon from "@material-ui/icons/RateReview";
import ReceiptIcon from "@material-ui/icons/Receipt";
import TimelineIcon from "@material-ui/icons/Timeline";

const Sidebar = () => {
  return (
    <div className="sidebar">
      {/* <Link to="/">HOME<img src={logo} alt="Ecommerce" /></Link> */}
      <Link to="/admin/dashboard">
        <p>
          <DashboardIcon /> Dashboard
        </p>
      </Link>

      <TreeView
        defaultCollapseIcon={<ExpandMoreIcon />}
        defaultExpandIcon={<ExpandLessOutlinedIcon />}
      >
        <TreeItem nodeId="1" label="Bài đăng">
          <Link to="/admin/rooms">
            <TreeItem nodeId="2" label="Tất cả" icon={<ListAltIcon />} />
          </Link>

          <Link to="/admin/rooms/confirm">
            <TreeItem nodeId="3" label="Phê duyệt" icon={<DoneAllIcon />} />
          </Link>
        </TreeItem>
      </TreeView>

      <Link to="/admin/bookings">
        <p>
          <ReceiptIcon /> Đặt phòng
        </p>
      </Link>

      <Link to="/admin/users">
        <p>
          <PeopleIcon /> Người dùng
        </p>
      </Link>

      <Link to="/admin/reviews">
        <p>
          <RateReviewIcon />
          Đánh giá
        </p>
      </Link>

      <Link to="/admin/statistics">
        <p>
          <TimelineIcon />
          Thống kê
        </p>
      </Link>
    </div>
  );
};

export default Sidebar;
