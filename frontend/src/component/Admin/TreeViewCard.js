import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import TreeView from "@material-ui/lab/TreeView";
import TreeItem from "@material-ui/lab/TreeItem";

import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import HomeIcon from "@material-ui/icons/Home";
import RoomIcon from "@material-ui/icons/Room";
import LocalHotelIcon from "@material-ui/icons/LocalHotel";
import HomeWorkIcon from "@material-ui/icons/HomeWork";
import AccountBalanceWalletIcon from "@material-ui/icons/AccountBalanceWallet";
import CreditCardIcon from "@material-ui/icons/CreditCard";
import AttachMoneyIcon from "@material-ui/icons/AttachMoney";
import CategoryIcon from "@material-ui/icons/Category";
import PersonIcon from "@material-ui/icons/Person";
import VerifiedUserIcon from "@material-ui/icons/VerifiedUser";
import PeopleAltIcon from "@material-ui/icons/PeopleAlt";

const useStyles = makeStyles({
  root: {
    height: 300,
    flexGrow: 1,
    maxWidth: 300,
  },
});

const useTreeItemStyles = makeStyles((theme) => ({
  root: {
    color: theme.palette.text.secondary,
    "&:hover > $content": {
      backgroundColor: theme.palette.action.hover,
    },
    "&:focus > $content, &$selected > $content": {
      backgroundColor: `var(--tree-view-bg-color, ${theme.palette.grey[400]})`,
      color: "var(--tree-view-color)",
    },
    "&:focus > $content $label, &:hover > $content $label, &$selected > $content $label":
      {
        backgroundColor: "transparent",
      },
  },
  content: {
    color: theme.palette.text.secondary,
    borderTopRightRadius: theme.spacing(2),
    borderBottomRightRadius: theme.spacing(2),
    paddingRight: theme.spacing(1),
    fontWeight: theme.typography.fontWeightMedium,
    "$expanded > &": {
      fontWeight: theme.typography.fontWeightRegular,
    },
  },
  group: {
    marginLeft: 0,
    "& $content": {
      paddingLeft: theme.spacing(2),
    },
  },
  expanded: {},
  selected: {},
  label: {
    fontWeight: "inherit",
    color: "inherit",
  },
  labelRoot: {
    display: "flex",
    alignItems: "center",
    padding: theme.spacing(0.5, 0),
  },
  labelIcon: {
    marginRight: theme.spacing(1),
  },
  labelText: {
    fontWeight: "inherit",
    flexGrow: 1,
  },
}));

function StyledTreeItem(props) {
  const classes = useTreeItemStyles();
  const {
    labelText,
    labelIcon: LabelIcon,
    color,
    bgColor,
    labelInfo,
    ...other
  } = props;

  return (
    <TreeItem
      label={
        <div className={classes.labelRoot}>
          <LabelIcon color="inherit" className={classes.labelIcon} />
          <Typography variant="body2" className={classes.labelText}>
            {labelText}
          </Typography>
          <Typography variant="caption" color="inherit">
            {labelInfo}
          </Typography>
        </div>
      }
      style={{
        "--tree-view-color": color,
        "--tree-view-bg-color": "#f3e8fd",
      }}
      classes={{
        root: classes.root,
        content: classes.content,
        expanded: classes.expanded,
        selected: classes.selected,
        group: classes.group,
        label: classes.label,
      }}
      {...other}
    />
  );
}

export default function FileSystemNavigator(props) {
  const classes = useStyles();

  let id = 0;

  const nodes =
    props.type === "Danh sách phòng"
      ? {
          name: "TỔNG SỐ PHÒNG",
          phongTro: props.roomData.reduce(
            (sum, current) => sum + current.phongTro,
            0
          ),
          nhaNghi: props.roomData.reduce(
            (sum, current) => sum + current.nhaNghi,
            0
          ),
          nhaNguyenCan: props.roomData.reduce(
            (sum, current) => sum + current.nhaNguyenCan,
            0
          ),
          datas: [...props.roomData],
        }
      : {};

  const renderTree = (nodes) =>
    props.type === "Danh sách phòng" ? (
      <StyledTreeItem
        key={id.toString()}
        nodeId={(id++).toString()}
        labelText={nodes.name}
        labelIcon={RoomIcon}
        color="#a250f5"
        bgColor="#f3e8fd"
        labelInfo={nodes.phongTro + nodes.nhaNguyenCan + nodes.nhaNghi}
      >
        <StyledTreeItem
          key={id.toString()}
          nodeId={(id++).toString()}
          labelText={`Phòng trọ: ${nodes.phongTro}`}
          labelIcon={HomeIcon}
          color="#1a73e8"
          bgColor="#e8f0fe"
        />
        <StyledTreeItem
          key={id.toString()}
          nodeId={(id++).toString()}
          labelText={`Nhà nghỉ: ${nodes.nhaNghi}`}
          labelIcon={LocalHotelIcon}
          color="#e3742f"
          bgColor="#fcefe3"
        />
        <StyledTreeItem
          key={id.toString()}
          nodeId={(id++).toString()}
          labelText={`Nhà nguyên căn: ${nodes.nhaNguyenCan}`}
          labelIcon={HomeWorkIcon}
          color="#3c8039"
          bgColor="#e6f4ea"
        />
        {Array.isArray(nodes.datas)
          ? nodes.datas.map((node) => renderTree(node))
          : null}
      </StyledTreeItem>
    ) : null;

  return (
    <TreeView
      className={classes.root}
      defaultCollapseIcon={<ExpandMoreIcon />}
      defaultExpandIcon={<ChevronRightIcon />}
      defaultExpanded={["0", "1", "5"]}
    >
      {props.type === "Danh sách phòng" ? (
        renderTree(props.roomData.length === 1 ? props.roomData[0] : nodes)
      ) : props.type === "Danh sách đặt phòng" ? (
        <StyledTreeItem
          key={"0"}
          nodeId={"0"}
          labelText={"TỔNG GIÁ TRỊ"}
          labelIcon={AttachMoneyIcon}
          color="#a250f5"
          bgColor="#f3e8fd"
          labelInfo={`${props.totalAmount.toLocaleString("en-US")} VNĐ`}
        >
          <StyledTreeItem
            key={"1"}
            nodeId={"1"}
            labelText={`Loại phòng đặt`}
            labelIcon={CategoryIcon}
            color="#1a73e8"
            bgColor="#e8f0fe"
            labelInfo={
              props.bookingData.phongTro +
              props.bookingData.nhaNguyenCan +
              props.bookingData.nhaNghi
            }
          >
            <StyledTreeItem
              key={"2"}
              nodeId={"2"}
              labelText={`Phòng trọ: ${props.bookingData.phongTro}`}
              labelIcon={HomeIcon}
              color="#1a73e8"
              bgColor="#e8f0fe"
            />
            <StyledTreeItem
              key={"3"}
              nodeId={"3"}
              labelText={`Nhà nghỉ: ${props.bookingData.nhaNghi}`}
              labelIcon={LocalHotelIcon}
              color="#e3742f"
              bgColor="#fcefe3"
            />
            <StyledTreeItem
              key={"4"}
              nodeId={"4"}
              labelText={`Nhà nguyên căn: ${props.bookingData.nhaNguyenCan}`}
              labelIcon={HomeWorkIcon}
              color="#3c8039"
              bgColor="#e6f4ea"
            />
          </StyledTreeItem>
          <StyledTreeItem
            key={"5"}
            nodeId={"5"}
            labelText={`Loại thanh toán`}
            labelIcon={AccountBalanceWalletIcon}
            color="#e3742f"
            bgColor="#fcefe3"
            labelInfo={
              props.bookingData.thanhToanOnline + props.bookingData.thanhToanSau
            }
          >
            <StyledTreeItem
              key={"6"}
              nodeId={"6"}
              labelText={`Thanh toán sau: ${props.bookingData.thanhToanSau}`}
              labelIcon={RoomIcon}
              color="#3c8039"
              bgColor="#e6f4ea"
            />
            <StyledTreeItem
              key={"7"}
              nodeId={"7"}
              labelText={`Thanh toán online: ${props.bookingData.thanhToanOnline}`}
              labelIcon={CreditCardIcon}
              color="#3c8039"
              bgColor="#e6f4ea"
            />
          </StyledTreeItem>
        </StyledTreeItem>
      ) : (
        <StyledTreeItem
          key={"0"}
          nodeId={"0"}
          labelText={"SỐ LƯỢNG NGƯỜI DÙNG"}
          labelIcon={PeopleAltIcon}
          color="#a250f5"
          bgColor="#f3e8fd"
          labelInfo={props.userData.user + props.userData.admin}
        >
          <StyledTreeItem
            key={"1"}
            nodeId={"1"}
            labelText={`Admin: ${props.userData.admin}`}
            labelIcon={VerifiedUserIcon}
            color="#e3742f"
            bgColor="#fcefe3"
          />
          <StyledTreeItem
            key={"2"}
            nodeId={"2"}
            labelText={`User: ${props.userData.user}`}
            labelIcon={PersonIcon}
            color="#1a73e8"
            bgColor="#e8f0fe"
          />
        </StyledTreeItem>
      )}
    </TreeView>
  );
}
