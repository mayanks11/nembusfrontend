import React, { useEffect, useState, Fragment, useRef } from "react";
import { Row, Col } from "reactstrap";
import ReactDOM from "react-dom";
import 'react-reflex/styles.css';
import { ReflexContainer, ReflexSplitter, ReflexElement } from "react-reflex";
import ArrowForward from '@material-ui/icons/ArrowForward';
import { makeStyles } from "@material-ui/core/styles";
import CircularProgress from "@material-ui/core/CircularProgress";

import { connect } from "react-redux";
import { setSimulationStatus } from "Actions/Simulate";
import SimulateUtil from "../../../utils/simulate";
import { withStyles } from "@material-ui/core/styles";

import EarthVisualization from "./earthvisualization";
import Split from "./SplitSimulation/split";
//import PersistentDrawer from './PlottingWindow/PersistentDrawer';
import "./index.scss";
import { Socket } from "socket.io-client";
import PlotingWindow from "./PlottingWindow"
import { TextField } from "@material-ui/core";


    // {/* <div className="calendar-wrapper">
    // <ReflexContainer
    //     orientation='vertical'
    //     className={isHeaderCollapsed ? classes.reflexContainer : classes.reflexContainerCollapsed}
    //     windowResizeAware={true}
    //   >
    //     <ReflexElement minSize={900} flex={1} propagateDimensionsRate={200}
    //       propagateDimensions={true} onStopResize={handleStopResize}>
    //       <div className={`${classes.pane} ${classes.centerPane}`}> 
    //       <EarthVisualization socket={socket} addCesiumcontroller={setViewer} />
    //       {/* <Split socket={socket} addCesiumcontroller={setViewer} saveCzmlData={props.saveCzmlData} /> */}
    //       </div>
    //     </ReflexElement>
    //     {/* <ReflexSplitter propagate={true} /> */}
       
    //   </ReflexContainer>
    //   </div> */}


const useStyles = makeStyles((theme) => ({
  pane: {
    // height: 'calc(100vh - 50px)',
    // margin: theme.spacing(0, 1, 0, 1),
    // height: '100%',
  },
  leftPane: {
  },
  centerPane: {
    alignItems: 'stretch',
  },
  rightPane: {},
  reflexContainer: {
    flex: '1',
    [theme.breakpoints.up('sm')]: {
      height: `calc(100vh -  64px)`,
      minHeight: `calc(100vh - 64px)`
    },
    [theme.breakpoints.down('sm')]: {
      height: `calc(100vh - 64px)`,
      minHeight: `calc(100vh - 64px)`
    },

    // alignItems: 'stretch',
  },
  reflexContainerCollapsed: {
    [theme.breakpoints.up('sm')]: {
      height: `calc(100vh - 64px)`,
      minHeight: `calc(100vh - 64px)`
    },
    [theme.breakpoints.down('sm')]: {
      height: `calc(100vh - 64px)`,
      minHeight: `calc(100vh - 64px)`
    },
  }
}));

const Simulation = (props) => {

  const classes = useStyles();

  const { socket, isHeaderCollapsed } = props;
  const isSocketHealthy = socket && socket.connected === true;

  const [viewer, setViewer] = useState(null);
  const [flexValue, setFlexValue] = useState(800);
  const [size, setSize] = useState(800);


  if (!isSocketHealthy) {
    return <CircularProgress />;
  }
  const handleStopResize = (e) => {

    if (e.domElement) {
      // console.log("dom ele", e.domElement);
      // console.log("inner width", window.innerWidth);

      // console.log("currrent OffsetWidth ", e.domElement.offsetWidth);
      // console.log("currrent offSetHeight ", e.domElement.offsetHeight);
      
    }
  }

 

  

  useEffect(() => {
    console.log("minSize", flexValue)
  }, [flexValue])

 
  
  

 


  return (
    <div>
      <EarthVisualization socket={socket} addCesiumcontroller={setViewer} />
    </div>
  );
};

const mapState = (state) => ({
  simulate: state.simulate,
  isHeaderCollapsed: state.settings.isHeaderCollapsed
});

const mapDispatch = {
  setSimulationStatus,
};

export default connect(mapState, mapDispatch)(Simulation);
