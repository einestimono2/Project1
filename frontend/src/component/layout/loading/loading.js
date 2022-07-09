import React from "react";
import "./loading.css";

const Loading = (props) => {
  return (
    <div
      className="loading"
      style={{
        backgroundColor: props.backgroundColor || "white",
      }}
    >
      <div></div>
    </div>
  );
};

export default Loading;
