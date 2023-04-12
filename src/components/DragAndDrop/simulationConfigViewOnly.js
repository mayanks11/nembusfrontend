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


import Diagram from "./Diagram/Diagram";

import "./style.css";

import ViewBoxContext from './minimap_new/ViewBoxContext';

const simulationConfigViewOnly = (props) => {

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
    }
    // dragAndDropApp.load(JSON.parse(conf.parameters));
    if (isupdateSelectSimulation) {
      props.setSelectSimulationConfig(conf);
    }
  }

  //GitGraph on mouse events 
  useEffect(()=>{
    if(props.commit === null){
      return;
    }
    const projectId = props.simulate.getIn(["project", "id"]);
    const caseId = props.simulate.getIn(["case", "id"]);
    
    let tempId = props.commit.hash;
    
    const getSimulation = async (projectId, caseId, tempId) => {
      const response = await SimulateService.getCurrentConfigurationGitGraph(
        projectId,
        caseId,
        tempId,
      );
      setLoading(false);
      selectConfiguration(response, true);
    };
    if (projectId && caseId && tempId) {
      setLoading(true);
      getSimulation(projectId, caseId, tempId);
    }
  },[props.commit, props.commitLoading])

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
export default connect(mapStateToProps, dispatchProps)(simulationConfigViewOnly);
