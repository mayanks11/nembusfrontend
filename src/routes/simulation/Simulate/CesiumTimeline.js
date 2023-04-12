import React, { useEffect } from "react";
import "react-reflex/styles.css";
import { connect } from "react-redux";
import { CesiumTimeLine } from "../../../components/Visualization/Cesium/CesiumTimeLine";
import "../../../components/Visualization/Cesium/bucketRaw.css";

import "./index.scss";
import "./css/main.css";

const TimeLine = ({

}) => {

  useEffect(()=>{
    new CesiumTimeLine();
  },[])

  return (
    <div>
      <div id="global-time1" className="fullsize" style={{ height: "100%"}}></div>
    </div>
  );
};

const stateProp = (state) => ({

  });
  
  const dispatchProps = {

  };


export default connect(stateProp, dispatchProps)(TimeLine);
