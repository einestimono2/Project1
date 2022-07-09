import "./AboutSection.css";

import React from "react";
import { Typography } from "@material-ui/core";
import { Fragment } from "react";

import MetaData from "../MetaData";

const About = () => {
  return (
    <Fragment>
      <MetaData title="Nhóm 01" />
      <div className="aboutSection">
        <div></div>
        <div className="aboutSectionGradient"></div>
        <div className="aboutSectionContainer">
          <Typography component="h1">Thông tin</Typography>

          <div>
            <div className="aboutSectionContainer2">
              <Typography component="h2">Nhóm 01</Typography>
              <div>Nguyễn Đức Tuệ</div>
              <div>Nguyễn Huy Bách</div>
              <div>Đỗ Văn Vũ</div>
              <div>Trần Hữu Quang</div>
            </div>
            <div className="aboutSectionContainer2">
              <Typography component="h2">PROJECT I</Typography>
              <div>GVHD: ThS.Lê Thị Hoa</div>
              <div>Lớp: IT-LTU K64</div>
              <div>Học kỳ: 20212</div>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default About;
