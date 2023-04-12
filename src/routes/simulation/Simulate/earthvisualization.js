import React, { useEffect, useState, Fragment, useRef } from "react";
import { Row, Col } from "reactstrap";
import ReactDOM from "react-dom";
import "react-reflex/styles.css";
import { ReflexContainer, ReflexSplitter, ReflexElement } from "react-reflex";

import { makeStyles } from "@material-ui/core/styles";
import CircularProgress from "@material-ui/core/CircularProgress";
import { get } from "lodash";

import { connect } from "react-redux";
import { setSimulationStatus } from "Actions/Simulate";
import { updateSimProgressStatus,updateEngineStatus } from "Actions";
import SimulateUtil from "../../../utils/simulate";
import { withStyles } from "@material-ui/core/styles";
import firebase, { auth, fireStore } from "../../../firebase";
import Button from "@material-ui/core/Button";
import SimulationInfo from "./simulationInfo";
import Typography from "@material-ui/core/Typography";
import "../../../components/Visualization/Cesium/bucketRaw.css";
// rct collapsible card
import RctCollapsibleCard from "Components/RctCollapsibleCard/RctCollapsibleCard";
// rct card box
import { RctCardContent } from "Components/RctCard";
import { bindActionCreators } from "redux";

import "./index.scss";
import "./css/main.css";

const EarthVisualization = ({
  socket,
  addCesiumcontroller,
  updateSimProgressStatusfunction,
  updateEngineStatusValue,
  simulationProgress,
  simulationStatus,
}) => {
  const isSocketHealthy = socket && socket.connected === true;

  useEffect(() => {
    if (!isSocketHealthy) {
      return;
    }
   
    SimulateUtil.addProgressHandler(updateSimProgressStatusfunction,updateEngineStatusValue);
    initCesium();
  }, []);

  if (!isSocketHealthy) {
    return <CircularProgress />;
  }

  async function initCesium() {
    const uid = auth.currentUser.uid;
    const cesiumcontroller = SimulateUtil.initCesiumCached(socket, uid);
    addCesiumcontroller(cesiumcontroller);
  }

  const [simStatus, setSimStatus] = useState("Run");
  const [simRunStatus, setSimRunStatus] = useState(80);

  return (
    <div>
      <div id="cesiumContainer" className="fullSize" style={{ height: "95%"}}></div>
      <div id="toolbarLeft" style={{marginTop: "33px"}}>
      <SimulationInfo/>
      </div>
    </div>
  );
};

const mapState = (state) => ({
  simulate: state.simulate,
  simulationProgress: get(state.simengine, [
    "current_engine_states",
    "simulation_done",
  ]),
  simulationStatus: get(state.simengine, ["current_engine_states", "status"]),
});

const mapDispatchToProps = (dispatch) =>
  bindActionCreators(
    {
      setSimulationStatusfunc: setSimulationStatus,
      updateSimProgressStatusfunction: updateSimProgressStatus,
      updateEngineStatusValue: updateEngineStatus,
    },
    dispatch
  );

export default connect(mapState, mapDispatchToProps)(EarthVisualization);
