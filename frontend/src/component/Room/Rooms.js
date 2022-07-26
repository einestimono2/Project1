import "./Rooms.css";

import React, { Fragment, useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams, Link } from "react-router-dom";
import Pagination from "react-js-pagination";
import { useAlert } from "react-alert";

import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogActions,
} from "@material-ui/core";

import { getRooms, clearErrors } from "../../actions/roomAction";
import Loading from "../layout/loading/loading";
import RoomCard from "../Home/RoomCard";
import MetaData from "../layout/MetaData";

import Slider from "@material-ui/core/Slider";
import Typography from "@material-ui/core/Typography";

const categories = ["Tất cả", "Phòng trọ", "Nhà nghỉ", "Nhà nguyên căn"];

const Rooms = () => {
  const dispatch = useDispatch();
  const alert = useAlert();
  const { keyword } = useParams();

  const [listProvinces, setListProvinces] = useState([]);
  const [listDistricts, setListDistricts] = useState([]);
  const [listWards, setListWards] = useState([]);
  const [index, setIndex] = useState(0);

  const [openAddress, setOpenAddress] = useState(false);
  const [openCategory, setOpenCategory] = useState(false);
  const [openPrice, setOpenPrice] = useState(false);
  const [openArea, setOpenArea] = useState(false);
  const [openRating, setOpenRating] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);

  const [price, setPrice] = useState([0, 500000000]);
  const [area, setArea] = useState([0, 1000]);
  const [category, setCategory] = useState("Tất cả");
  const [address, setAddress] = useState("Toàn quốc");
  const [rating, setRating] = useState([0, 5]);

  const [stateChange, setStateChange] = useState(true);

  const { loading, error, rooms, resultPerPage, filteredRoomsCount } =
    useSelector((state) => state.rooms);

  useEffect(() => {
    fetch("https://provinces.open-api.vn/api/?depth=3")
      .then((response) => response.json())
      .then((json) => {
        setListProvinces(json);
      });

    if (error) {
      alert.error(error);
      dispatch(clearErrors());
    }

    if (stateChange) {
      dispatch(
        getRooms(keyword, currentPage, price, category, rating, area, address)
      );
      setStateChange(false);
    }
  }, [
    alert,
    dispatch,
    error,
    currentPage,
    stateChange,
    keyword,
    price,
    category,
    rating,
    area,
    address,
  ]);

  const setCurrentPageNo = (e) => {
    setCurrentPage(e);
    setStateChange(true);
  };

  const submitAddressToggle = () => {
    openAddress ? setOpenAddress(false) : setOpenAddress(true);
    setIndex(0);
    if (!openAddress) setAddress("Toàn quốc");
  };

  const submitCategoryToggle = () => {
    openCategory ? setOpenCategory(false) : setOpenCategory(true);
  };

  const submitPriceToggle = () => {
    openPrice ? setOpenPrice(false) : setOpenPrice(true);
  };

  const submitAreaToggle = () => {
    openArea ? setOpenArea(false) : setOpenArea(true);
  };

  const submitRatingToggle = () => {
    openRating ? setOpenRating(false) : setOpenRating(true);
  };

  const categoryHandler = (e) => {
    if (e.target.localName === "input") {
      setCategory(e.target.value);
    } else if (e.target.localName === "li") {
      setCategory(e.target.children[0].value);
    }

    setOpenCategory(!openCategory);
  };

  const addressHandler = (e) => {
    if (e.target.localName === "input") {
      address === "Toàn quốc"
        ? setAddress(e.target.value)
        : setAddress(e.target.value + ", " + address);

      if (index === 0)
        setListDistricts(
          listProvinces.find((elem) => elem.name === e.target.value).districts
        );
      else if (index === 1)
        setListWards(
          listDistricts.find((elem) => elem.name === e.target.value).wards
        );

      setIndex(index + 1);
    } else if (e.target.localName === "li") {
      address === "Toàn quốc"
        ? setAddress(e.target.children[0].value)
        : setAddress(e.target.children[0].value + ", " + address);

      if (index === 0)
        setListDistricts(
          listProvinces.find((elem) => elem.name === e.target.children[0].value)
            .districts
        );
      else if (index === 1) {
        setListWards(
          listDistricts.find((elem) => elem.name === e.target.children[0].value)
            .wards
        );
      }

      setIndex(index + 1);
    }

    if (index === 2) setOpenAddress(!openAddress);
  };

  const priceHandler = (e, newPrice) => {
    setPrice(newPrice);
  };

  const areaHandler = (e, newArea) => {
    setArea(newArea);
  };

  const ratingHandler = (e, newRating) => {
    setRating(newRating);
  };

  const clearHandler = (type) => {
    switch (type) {
      case "Loại":
        setCategory("Tất cả");
        break;
      case "Địa chỉ":
        setAddress("Toàn quốc");
        break;
      case "Giá":
        setPrice([0, 500000000]);
        break;
      case "Diện tích":
        setArea([0, 1000]);
        break;
      case "Đánh giá":
        setRating([0, 5]);
        break;
      default:
        break;
    }
  };

  const filterHandler = () => {
    setCurrentPage(1);
    setStateChange(true);
  };

  return (
    <Fragment>
      {loading ? (
        <Loading />
      ) : (
        <Fragment>
          <MetaData title={"Danh sách phòng"} />

          <div className="filterContainer">
            <div>
              <span onClick={submitCategoryToggle}>{category}</span>
              <i onClick={() => clearHandler("Loại")} />
            </div>
            <div>
              <span onClick={submitAddressToggle}>{address}</span>
              <i onClick={() => clearHandler("Địa chỉ")} />
            </div>
            <div>
              <span onClick={submitPriceToggle}>
                {price[0].toLocaleString("en-US")} -{" "}
                {price[1].toLocaleString("en-US")} VNĐ
              </span>
              <i onClick={() => clearHandler("Giá")} />
            </div>
            <div>
              <span onClick={submitAreaToggle}>
                {area[0]} - {area[1]} &#13217;
              </span>
              <i onClick={() => clearHandler("Diện tích")} />
            </div>
            <div>
              <span onClick={submitRatingToggle}>
                {rating[0]} - {rating[1]} &#9734;
              </span>
              <i onClick={() => clearHandler("Đánh giá")} />
            </div>
            <div onClick={filterHandler}>Tìm kiếm</div>
          </div>

          <div className="rooms">
            {rooms && rooms.length > 0 ? (
              rooms.map((room) => <RoomCard key={room._id} room={room} />)
            ) : (
              <div className="noRooms">
                <p>Không có phòng thỏa mãn !</p>
                <Link to="/login?redirect=room/create">Đăng tin</Link>
              </div>
            )}
          </div>

          <Dialog
            aria-labelledby="simple-dialog-title"
            open={openCategory}
            onClose={submitCategoryToggle}
            PaperProps={{
              style: {
                height: "40%",
                width: "40%",
              },
            }}
          >
            <DialogTitle>
              <div>
                <Typography variant="h6" align="center">
                  {category}
                </Typography>
              </div>
            </DialogTitle>
            <DialogContent>
              <ul className="listProvinces">
                {categories.map((e) => (
                  <li key={e} value={e} onClick={categoryHandler}>
                    <input type="radio" value={e} onChange={categoryHandler} />
                    {e}
                  </li>
                ))}
              </ul>
            </DialogContent>
          </Dialog>

          <Dialog
            aria-labelledby="simple-dialog-title"
            open={openAddress}
            onClose={submitAddressToggle}
            PaperProps={{
              style: {
                height: "70%",
                width: "50%",
              },
            }}
          >
            <DialogTitle>
              <div>
                <Typography variant="h6" align="center">
                  {address}
                </Typography>
              </div>
            </DialogTitle>
            <DialogContent>
              <ul className="listProvinces">
                {index === 0 &&
                  listProvinces.map((e) => (
                    <li key={e.code} value={e.name} onClick={addressHandler}>
                      <input
                        type="radio"
                        value={e.name}
                        onChange={addressHandler}
                      />
                      {e.name}
                    </li>
                  ))}

                {index === 1 &&
                  listDistricts.map((e) => (
                    <li key={e.code} value={e.name} onClick={addressHandler}>
                      <input
                        type="radio"
                        value={e.name}
                        checked={address.includes(e.name)}
                        onChange={addressHandler}
                      />
                      {e.name}
                    </li>
                  ))}

                {index === 2 &&
                  listWards.map((e) => (
                    <li key={e.code} value={e.name} onClick={addressHandler}>
                      <input
                        type="radio"
                        value={e.name}
                        checked={address.includes(e.name)}
                        onChange={addressHandler}
                      />
                      {e.name}
                    </li>
                  ))}
              </ul>
            </DialogContent>
          </Dialog>

          <Dialog
            aria-labelledby="simple-dialog-title"
            open={openPrice}
            onClose={submitPriceToggle}
            PaperProps={{
              style: {
                height: "44%",
                width: "50%",
              },
            }}
          >
            <DialogTitle>
              <div>
                <Typography variant="h6" align="center">
                  Chọn khoảng giá
                </Typography>
              </div>
            </DialogTitle>
            <DialogContent className="slidePrice">
              <Typography align="center">
                {price[0].toLocaleString("en-US")} -{" "}
                {price[1].toLocaleString("en-US")} VNĐ
              </Typography>
              <Slider
                value={price}
                onChange={priceHandler}
                min={0}
                max={50000000}
                step={100000}
              />
            </DialogContent>
            <DialogActions>
              <div className="confirmDialog" onClick={submitPriceToggle}>
                Xác nhận
              </div>
            </DialogActions>
          </Dialog>

          <Dialog
            aria-labelledby="simple-dialog-title"
            open={openArea}
            onClose={submitAreaToggle}
            PaperProps={{
              style: {
                height: "44%",
                width: "50%",
              },
            }}
          >
            <DialogTitle>
              <div>
                <Typography variant="h6" align="center">
                  Chọn diện tích
                </Typography>
              </div>
            </DialogTitle>
            <DialogContent className="slidePrice">
              <Typography align="center">
                {area[0]} - {area[1]} &#13217;
              </Typography>
              <Slider
                value={area}
                onChange={areaHandler}
                valueLabelDisplay="auto"
                aria-labelledby="range-slider"
                min={0}
                max={100}
                step={0.5}
              />
            </DialogContent>
            <DialogActions>
              <div className="confirmDialog" onClick={submitAreaToggle}>
                Xác nhận
              </div>
            </DialogActions>
          </Dialog>

          <Dialog
            aria-labelledby="simple-dialog-title"
            open={openRating}
            onClose={submitRatingToggle}
            PaperProps={{
              style: {
                height: "44%",
                width: "50%",
              },
            }}
          >
            <DialogTitle>
              <div>
                <Typography variant="h6" align="center">
                  Chọn đánh giá
                </Typography>
              </div>
            </DialogTitle>
            <DialogContent className="slidePrice">
              <Typography align="center">
                {rating[0]} - {rating[1]} &#9733;
              </Typography>
              <Slider
                value={rating}
                onChange={ratingHandler}
                valueLabelDisplay="auto"
                aria-labelledby="range-slider"
                min={0}
                max={5}
                step={0.5}
              />
            </DialogContent>
            <DialogActions>
              <div className="confirmDialog" onClick={submitRatingToggle}>
                Xác nhận
              </div>
            </DialogActions>
          </Dialog>

          {resultPerPage < filteredRoomsCount && (
            <div className="paginationBox">
              <Pagination
                activePage={currentPage}
                itemsCountPerPage={resultPerPage}
                totalItemsCount={filteredRoomsCount}
                pageRangeDisplayed={5}
                onChange={setCurrentPageNo}
                itemClass="page-item"
                linkClass="page-link"
                activeClass="pageItemActive"
                activeLinkClass="pageLinkActive"
              />
            </div>
          )}
        </Fragment>
      )}
    </Fragment>
  );
};

export default Rooms;
