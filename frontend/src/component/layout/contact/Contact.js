import "./Contact.css";

import React from "react";
import { Button } from "@material-ui/core";
import { Fragment } from "react";

import MetaData from "../MetaData";

const Contact = () => {
  return (
    <Fragment>
      <MetaData title="Liên hệ" />
      <div className="contactContainer">
        <a className="mailBtn" href="mailto:group01@gmail.com">
          <Button>Liên hệ: group01@gmail.com</Button>
        </a>
      </div>
    </Fragment>
  );
};

export default Contact;
