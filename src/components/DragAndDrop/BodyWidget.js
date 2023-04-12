import React, { useEffect, useState, useRef, useContext, } from "react";
import { connect } from "react-redux";

import { NotificationManager } from "react-notifications";
import moment from "moment";
import { Backdrop, CircularProgress } from "@material-ui/core";
//import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import {Lock, LockOpen, ZoomIn, ZoomOut} from '@material-ui/icons';
import MiniMap from './minimap_new/MiniMap';

import { get, isNull } from "lodash";

import SimulateService from "Api/Simulate";
import {
  runSimulationCompleted,
  saveSimulationCompleted,
  setSimulationConfigList,
  setRunSimulationConfigList,
  setSimulationActiveConfig,
  setOldCase,
  clearSimulationConfigList,
  clearRunSimulationConfigList,
  clearSimulationActiveConfig,
  setSelectSimulationConfig,
  toggleSimulateLeftPanel,
  runSimulation,
  changeTab,
} from "../../actions/Simulate";
import { initializeModel, deleteModel, 
        addModel, updateModel, 
        zoomInModel, zoomOutModel, 
        setOffSet, canvasWidthHeight, 
        minimapMarkWidth, minimapMarkLeft,
         extraPositiveWidth, extraNegitiveWidth, 
         extraPositiveHeight, 
         extraNegitiveHeight, 
         minimapMarkHeight, minimapIsOpenTab, 
         onDragStart, onDragEnd } from '../../actions/Minimap';

import SimulateUtil from "Utils/simulate";

import { updateExpectedStatus } from "../../actions";
import { setIsUpdateBlock } from "../../actions/SimulationConfigAction";
import { setSimulationConfigSelect } from "../../actions/SimulationConfigAction";
import { getComponentForm } from "Actions";

import { auth } from "../../firebase";
import DiagramEngine from "./Diagram/DiagramEngine";
import Diagram from "./Diagram/Diagram";

import "./style.css";

import ViewBoxContext from './minimap_new/ViewBoxContext';

const BodyWidget = (props) => {

  const getMinimapRedux = (minimapRedux) => {
    console.log("ReduxN",minimapRedux);
  }

 

  const {
    xPos,
    yPos,
    miniMapX,
    miniMapY
  } = useContext(ViewBoxContext);

  useEffect(()=>{
    console.log("Show Context", xPos, yPos, miniMapX, miniMapY);
  }, [xPos, yPos, miniMapX, miniMapY]);

  const [loading, setLoading] = React.useState(true);
  const dragAndDropApp = props.dragAndDropApp
  
  const [zoom, setZoom] = React.useState(true);
  const [minimap, setMinimap] = useState({
    offsetX: 0,
    offsetY: 0
  });
  const [isDrag, setIsDrag] = useState(false);

  React.useEffect(() => {
    setLoading(false);
  }, []);

  useEffect(()=>{
    
    // dragAndDropApp.adjustGridOffset(minimap);
    if(dragAndDropApp){
      dragAndDropApp.getModel().setOffset(
         minimap.offsetX,
         minimap.offsetY
      );

      dragAndDropApp.getEngine().repaintCanvas();
    }
   
  }, [minimap]);

  useEffect(()=> {
    
    props.onDragStart(isDrag);
  }, [isDrag])

  /**
  * Zoom Control Functionality
  * Nirmalya Saha
  */

  function zoomHandler(){
    dragAndDropApp.setZoomLocked(zoom)
    setZoom(!zoom);
  }

  function onZoomIn(){
    dragAndDropApp.setZoomIn();
    // updatenode('ZOOM_IN', null);
  }

  function onZoomOut(){
    dragAndDropApp.setZoomOut();
    // updatenode('ZOOM_OUT', null);
  }

  function selectConfiguration(conf, isupdateSelectSimulation) {
    if (!isNull(conf.parameters)) {
      dragAndDropApp.load(JSON.parse(conf.parameters));
    }
    else if(isNull(conf.parameters)){
      props.initializeModel([]);
      console.log("Calling4",conf.parameters,!isNull(conf.parameters));
    }
    // dragAndDropApp.load(JSON.parse(conf.parameters));
    if (isupdateSelectSimulation) {
      props.setSelectSimulationConfig(conf);
    }
  }

  function exportData(params, runConfigurationId, runid) {
    const { simulate } = props;
    let simulationData = {
      Command: "Start",
      SimulationDetails: {
        "Project Name": simulate.getIn(["project", "ProjectName"]),
        "Project id": simulate.getIn(["project", "id"]),
        configurations: new Date(runid).toLocaleString(),
        tempconfigId:simulate.getIn(["case", "tempId"]),
        Runid: runid,
        simRate: {
          value: simulate.getIn([
            "selectedSimulationConfig",
            "simRate",
            "value",
          ]),
          unit: simulate.getIn(["selectedSimulationConfig", "simRate", "unit"]),
        },
        "Parameter id": runConfigurationId,
        "Simulation Name": simulate.getIn(["case", "SimulationName"]),
        "Simulation id": simulate.getIn(["case", "id"]),
        "Start Date": moment(
          simulate.getIn(["case", "StartDate"]).seconds * 1000 +
          simulate.getIn(["case", "StartDate"]).nanoseconds / 1000000
        )
          .utc()
          .format("YYYY-MM-DD HH:mm:ss.SSS"),
        "End Date": moment(
          simulate.getIn(["case", "EndDate"]).seconds * 1000 +
          simulate.getIn(["case", "EndDate"]).nanoseconds / 1000000
        )
          .utc()
          .format("YYYY-MM-DD HH:mm:ss.SSS"),
      },
      Data: JSON.parse(params),
      Groundstation: props.groundStation,
    };

    return {
      ...simulationData,
    };
  }

  const runtheSimulation = async () => {
    if (dragAndDropApp) {
      //save to database
      const parametersJson = dragAndDropApp.serialize();
      const parameters = JSON.stringify(parametersJson);

      const projectId = props.simulate.getIn(["project", "id"]);
      const simulation = props.simulate.getIn(["case", "id"]);
      
      let tempId = props.simulate.getIn(["case", "tempId"]);

      let email = props.userinfo.email;
      
      const simRateObj = {
        value: props.simulate.getIn([
          "selectedSimulationConfig",
          "simRate",
          "value",
        ]),
        unit: props.simulate.getIn([
          "selectedSimulationConfig",
          "simRate",
          "unit",
        ]),
      };

      const runid = moment(new Date()).valueOf();
      //saving new configuration in the databse
      const result = await SimulateService.saveParameters(
        projectId,
        simulation,
        tempId,
        parameters,
        runid,
        email,
        simRateObj
      );

      if (result) {
        let runConfigurationId = result.id;
        const data_to_transfer = exportData(
          parameters,
          runConfigurationId,
          runid
        );

        props.socket.emit(
          `FromClient-${auth.currentUser.uid}`,
          data_to_transfer,

          (ackResult) => {
            if (ackResult === true) {
              global.czmls = [];
              global.dataSource = null;

              props.changeTab(1);

              const { SimulationDetails } = data_to_transfer;
              const time = moment().valueOf();

              const expectedSimInfo = {
                epoch: time,
                information: {
                  project_id: get(SimulationDetails, ["Project id"]),
                  project_name: get(SimulationDetails, ["Project Name"]),
                  simulation_id: get(SimulationDetails, ["Simulation id"]),
                  simulation_name: get(SimulationDetails, ["Simulation Name"]),
                  configuration_name: get(SimulationDetails, [
                    "configurations",
                  ]),
                  configuration_id: get(SimulationDetails, ["Parameter id"]),
                  runid: get(SimulationDetails, ["Runid"]),
                },
              };

              props.updateExpectedStatus(expectedSimInfo);
              SimulateUtil.updatedExpected_simulation(expectedSimInfo);
              NotificationManager.success("Parameters updated successfully");
            } else {
              NotificationManager.error("Could not start simulation");
            }
          }
        );
      } else {
        NotificationManager.error("Could not save parameters");
      }
      // this.updateSimulationlog("Running");
    }
  };

  const savetheSimulation = async () => {
    const { simulate } = props;
    const projectId = simulate.getIn(["project", "id"]);
    const CaseId = simulate.getIn(["case", "id"]);
    
    let tempId = props.simulate.getIn(["case", "tempId"]);

    let email = props.userinfo.email;
    

    const parametersJson = dragAndDropApp.serialize();
    const parameters = JSON.stringify(parametersJson);

    const simRateObj = {
      value: props.simulate.getIn([
        "selectedSimulationConfig",
        "simRate",
        "value",
      ]),
      unit: props.simulate.getIn([
        "selectedSimulationConfig",
        "simRate",
        "unit",
      ]),
    };

    const runid = moment(new Date()).valueOf();

    const result = await SimulateService.updateTempConfigParameters(
      projectId,
      CaseId,
      tempId,
      parameters,
      runid,
      "",
      email,
      simRateObj,
      null
    );

    if (result) {
      NotificationManager.success("Parameters updated successfully");
    } else {
      NotificationManager.error("Could not update parameters");
    }

    props.setSaveSimulationFlag(false);
  };

  useEffect(() => {
    if (props.runSimulationFlag) {
      runtheSimulation();
    }
  }, [props.runSimulationFlag]);

  useEffect(() => {
    if (props.saveSimulationFlag) {
      savetheSimulation();
    }
  }, [props.saveSimulationFlag]);

  useEffect(() => {
    const projectId = props.simulate.getIn(["project", "id"]);
    const caseId = props.simulate.getIn(["case", "id"]);
    
    let tempId = props.simulate.getIn(["case", "tempId"]);
    

    const getSimulation = async (projectId, caseId, tempId) => {
      await SimulateService.getCurrentConfigurationSnapshot(
        projectId,
        caseId,
        tempId,
        (snapshot) => {
          selectConfiguration(snapshot.data(), true);
        }
      );
    };
    if (projectId && caseId && tempId) {
      getSimulation(projectId, caseId, tempId);
    }
  }, [props.projectId, props.caseId, props.tempId]);

  //Clone Bug
  useEffect(() => {
    if(props.selectedSimulationConfig === null){
      const projectId = props.simulate.getIn(["project", "id"]);
      const caseId = props.simulate.getIn(["case", "id"]);
      
      let tempId = props.simulate.getIn(["case", "tempId"]);
      
  
      const getSimulation = async (projectId, caseId, tempId) => {
        await SimulateService.getCurrentConfigurationSnapshot(
          projectId,
          caseId,
          tempId,
          (snapshot) => {
            selectConfiguration(snapshot.data(), true);
          }
        );
      };
      if (projectId && caseId && tempId) {
        getSimulation(projectId, caseId, tempId);
        console.log("Calling")
      }
    }
  }, [props.selectedSimulationConfig]);

  useEffect(() => {

    console.log("dragAndDropApp ==>",dragAndDropApp)
    if(dragAndDropApp){

    const projectId = props.simulate.getIn(["project", "id"]);
    const caseId = props.simulate.getIn(["case", "id"]);

    let tempId = props.simulate.getIn(["case", "tempId"]);
    const getSimulation = async (projectId, caseId, tempId) => {
      await SimulateService.getCurrentConfigurationSnapshot(
        projectId,
        caseId,
        tempId,
        (snapshot) => {
          selectConfiguration(snapshot.data(), true);
        }
      );
    };

    }

    


  },[dragAndDropApp])

  if (loading)
    return (
      <Backdrop open={loading}>
        <CircularProgress color="inherit" />
      </Backdrop>
    );

  return (
    <div className="fw-wrapper">
      <Diagram engine={dragAndDropApp} />
      <button onClick={zoomHandler} className="zoom-lock">
        {
          (zoom === true) ? (
            <LockOpen className="zoom-lock-button"  />
          ) : (
            <Lock className="zoom-lock-button"  />
          )
        }
      </button>
      <button onClick={onZoomOut} className="zoom-out">
            <ZoomOut className="zoom-lock-button"  />
      </button>
      <button onClick={onZoomIn} className="zoom-in">
            <ZoomIn className="zoom-lock-button"  />
      </button>
      <div className="minimap">
        <MiniMap getMinimapRedux={getMinimapRedux} minimap={minimap} setMinimap={setMinimap} isDrag={isDrag} setIsDrag={setIsDrag}/>
      </div>
    </div>
  );
};

const mapStateToProps = (state) => ({
  simulate: state.simulate,
  // runSimulationState: state.simulate.get("simulate.run"),
  isRunning: state.simulate.getIn(["status", "status"]) === "Running",
  panelIsOpened: state.simulate.get("simulateLeftPanelOpened"),
  saveSimulate: state.simulate.get("simulate.save"),
  runSimulate: state.simulate.get("simulate.run"),
  SimulationConfigList: state.simulate.get("simulationConfigList"),
  simulationRunConfigList: state.simulate.get("simulationRunConfigList"),
  simulationActiveConfig: state.simulate.get("simulationActiveConfig"),
  selectedSimulationConfig: state.simulate.get("selectedSimulationConfig"),
  newConfigObject: state.SimulationConfigReducer.get("newConfigObject"),
  SimulationConfigReducer: state.SimulationConfigReducer,
  SimulationBlockName: state.SimulationConfigReducer.getIn([
    "Selectedblock",
    "options",
    "extras",
    "blockType",
    "name",
  ]),
  SimulationParams: state.SimulationConfigReducer.getIn([
    "Selectedblock",
    "options",
    "extras",
    "params",
  ]),
  isUpdateBock: state.SimulationConfigReducer.getIn(["isBlockUpdate"]),
  uiform: state.component.componentUiForm,
  // groundStation: state.groundStationState.get("GroundStationList").toJS(),
  groundStation: state.GroundStationDetails,
  SimConfiguration: state.SimConfiguration,
  userinfo: state.firebase.auth,
  MinimapReducer: state.MinimapReducer
});

const dispatchProps = {
  saveSimulationCompleted,
  runSimulationCompleted,
  setSimulationConfigList,
  setRunSimulationConfigList,
  setSimulationActiveConfig,
  setOldCase,
  clearSimulationConfigList,
  clearRunSimulationConfigList,
  clearSimulationActiveConfig,
  setSelectSimulationConfig,
  setSimulationConfigSelect,
  toggleSimulateLeftPanel,
  setIsUpdateBlock,
  getComponentForm,
  updateExpectedStatus,
  runSimulation,
  changeTab,
  initializeModel,
  deleteModel,
  addModel,
  updateModel,
  zoomInModel,
  zoomOutModel,
  setOffSet,
  canvasWidthHeight,
  minimapMarkWidth,
  minimapMarkLeft,
  extraPositiveWidth,
  extraNegitiveWidth,
  extraPositiveHeight,
  extraNegitiveHeight,
  minimapMarkHeight,
  minimapIsOpenTab,
  onDragStart,
  onDragEnd
};
export default connect(mapStateToProps, dispatchProps)(BodyWidget);
