import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import {
  AppBar,
  Toolbar,
  Menu,
  MenuItem,
  Typography,
  Divider,
  IconButton,
  Chip,
  Tooltip,
  Button,
  ListItemIcon,
  Paper, MenuList, ListItemText, Checkbox
} from "@material-ui/core";
import { Lock, LockOpen, Add, Remove } from '@material-ui/icons';
import { setMax, setMin, setLock, setExpand, setWindowCollapse } from "../../../../actions/Split";
import { Redirect } from "react-router-dom";
import InfoIcon from "@material-ui/icons/Info";
import EditIcon from "@material-ui/icons/Edit";
import DirectionsRunIcon from "@material-ui/icons/DirectionsRun";
import SaveIcon from "@material-ui/icons/Save";
import ShareIcon from "@material-ui/icons/Share";
import { makeStyles, withStyles, useTheme } from "@material-ui/core/styles";
import moment from "moment";
import ConfigurationTimedropdown from "../ConfigurationTimedropdown.js";
import ViewGroundStation from "../GroundStation/ViewGroundStation";
import AddGroundStation from "../GroundStation/AddGroundStation";
import CircularProgress from "@material-ui/core/CircularProgress";
import StopIcon from "@material-ui/icons/Stop";
import GroundStation from "../../Simulate/GroundStation/GroundStation.js";
import ArrowDropDownIcon from "@material-ui/icons/ArrowDropDown";
import SimulateService from "Api/Simulate";
import { setSelectSimulationConfig } from "Actions/Simulate";
import EditConfigDialog from "../EditConfigDialog.js";
import EditSimRateDialog from "../EditSimRateDialog.js";
import { NotificationManager } from "react-notifications";
import { updateGroundstationList } from "Actions/AddingGroundstation";
import {
  toggleSimulateLeftPanel,
  saveSimulation,
  runSimulation,
  saveSimulationCompleted,
} from "Actions/Simulate";
import ShareDialog from '../ShareSimulation/ShareDialog';
import { auth } from "../../../../firebase";
import { minimapMarkWidth, minimapMarkLeft, minimapMarkHeight, minimapIsOpenTab } from '../../../../actions/Minimap';

import { initializeModel, deleteModel, 
  addModel, updateModel, 
  zoomInModel, zoomOutModel, 
  setOffSet, canvasWidthHeight, 
   extraPositiveWidth, extraNegitiveWidth, 
   extraPositiveHeight, 
   extraNegitiveHeight,
   onDragStart, onDragEnd } from '../../../../actions/Minimap';

import {get} from 'lodash'

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    [theme.breakpoints.up('sm')]: {
      height: `calc(100vh - 96px)`,
    },
    [theme.breakpoints.down('sm')]: {
      height: `calc(100vh - 112px)`,
    },
    marginTop: theme.spacing(0),
    overflow: "hidden",
  },
  rootCollapse:{
    width: "100%",
    [theme.breakpoints.up('sm')]: {
      height: `calc(100vh - 48px)`,
    },
    [theme.breakpoints.down('sm')]: {
      height: `calc(100vh - 64px)`,
    },
    marginTop: theme.spacing(0),
    overflow: "hidden",
  },
  appFrame: {
    position: "relative",
    display: "flex",
    width: "100%",
    height: "100%",
    zIndex: 0,
  },
  appBar: {
    backgroundColor: "#183b56",
    position: "absolute",
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(["margin", "width"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["margin", "width"], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  "appBarShift-left": {
    marginLeft: drawerWidth,
  },
  "appBarShift-right": {
    marginRight: drawerWidth,
  },
  toolbar: {
    backgroundColor: "#183b56",
    color: "white",
  },
  toolbarinfo: {
    display: "inherit",
    alignItems: "center",
    justifyContent: "center",
    [theme.breakpoints.down("sm")]: {
      width: "auto",
    },
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  hide: {
    display: "none",
  },
  drawer: {
    width: drawerWidth,
    height: "100%",
    flexShrink: 0,
  },
  drawerPaper: {
    position: "relative",
    height: "100%",
    width: drawerWidth,
  },
  drawerHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    padding: "0 8px",
    ...theme.mixins.toolbar,
  },
  drawerContainer: {
    overflow: 'auto',
  },
  content: {
    width: "100%",
    flexGrow: 1,
    backgroundColor: theme.palette.background.default,
    padding: theme.spacing(0),
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    height: "100%",
    marginTop: 45,
  },
  "content-left": {
    marginLeft: -drawerWidth,
  },
  "content-right": {
    marginRight: -drawerWidth,
  },
  contentShift: {
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  "contentShift-left": {
    marginLeft: 0,
  },
  "contentShift-right": {
    marginRight: 0,
  },

  toolbarSection: {
    position: "relative",
    marginLeft: 0,
    width: "100%",
    color: "white",
    display: "flex",
    alignItems: "left",
  },
  Simulationdetail: {
    position: "relative",
    color: "white",
    display: "inherit",
    alignItems: "left",
    [theme.breakpoints.down("xs")]: {
      display: "none",
    },
  },
  simulationName: {
    display: "inherit",
    maxWidth: "200px",
  },
  groundstationdetail: {
    display: "flex",
    alignItems: "center",
    border: "1px solid #ffffff",
    borderRadius: "16px",
    padding: "2px",
  },
  simulationActiondetail: {
    position: "relative",
    display: "inherit",
  },
  toolbarSection1: {
    position: "relative",
    color: "white",
    display: "flex",
    overflow: "hidden",
    maxWidth: "160px",
    textOverflow: "ellipsis",
    "&:hover": {
      overflow: "visible",
      maxWidth: "auto",
    },
  },

  toolbarSection2: {
    position: "relative",
    marginLeft: "100px",
    color: "white",
    display: "flex",
    alignItems: "left",
  },
  simRateChip: {
    backgroundColor: "transparent",
    color: "#ffffff",
    border: "1px solid #ffffff",
    borderRadius: "20px",
    overflow: "hidden",
    textOverflow: "ellipsis",
    maxWidth: "140px",
    fontSize: "12px",
    "&:hover": {
      overflow: "visible",
      maxWidth: "auto",
    },
  },
  simulationRateContainer: {
    padding: "1px 2px",
    display: "flex",
    flexWrap: "wrap",
    color: "#ffffff",
  },
  simulationRate: {
    color: "#ffffff",
    fontSize: "8px",
  },

  cssLabel: {
    color: "white",
    fontSize: "12px",
    color: "#ffffff",
  },

  cssOutlinedInput: {
    "&$cssFocused $notchedOutline": {
      borderColor: `${theme.palette.white} !important`,
    },
  },

  cssFocused: {
    color: "white",
  },

  notchedOutline: {
    borderWidth: "1px",
    borderRadius: "16px",
    borderColor: "white !important",
  },

  button: {
    color: "white !important",
    padding: "0 5px",
    // border: "1px solid #ffffff",
    buttonDisabled: {
      color: theme.palette.grey[900],
    },
  },
  outlineButton: {
    border: "1px solid #ffffff",
    borderRadius: "12px",
    color: "#ffffff",
    "&:hover": {
      backgroundColor: "#ffffff",
      color: "#183b56",
      borderColor: "#183b56",
    },
  },
  select: {
    width: " 30px",
  },
  savediv: {
    position: "relative",
    marginLeft: "auto",
    display: "inherit",
  },
  saveProgress: {
    position: "relative",
    top: 0,
    left: -29,
    zIndex: 7,
  },
  projectName: {
    overflow: "hidden",
    whiteSpace: "nowrap",
    textOverflow: "ellipsis",
    width: "150px",
    cursor: "pointer",
    "&:hover": {
      overflow: "visible",
      fontWeight: "600",
    },
  },
  btnText: {
    color: "#ffffff",
    marginLeft: "4px",
    textTransform: "capitalize",
    cursor: "pointer",
    fontSize: "12px",
  },

}));

const HtmlTooltip = withStyles((theme) => ({
  tooltip: {
    backgroundColor: "#ffffff",
    color: "rgba(0, 0, 0, 0.87)",
    maxWidth: 300,
    fontSize: theme.typography.pxToRem(12),
    borderRadius: "12px",
  },
}))(Tooltip);

const StyledMenu = withStyles({
  paper: {
    border: "1px solid #d3d4d5",
  },
})((props) => (
  <Menu
    elevation={0}
    getContentAnchorEl={null}
    anchorOrigin={{
      vertical: "bottom",
      horizontal: "center",
    }}
    transformOrigin={{
      vertical: "top",
      horizontal: "center",
    }}
    {...props}
  />
));

const StyledMenuItem = withStyles((theme) => ({
  root: {
    "&:hover": {
      backgroundColor: theme.palette.primary.main,
      "& .MuiListItemIcon-root, & .MuiListItemText-primary": {
        color: theme.palette.common.white,
      },
    },
  },
}))(MenuItem);


const SimulationConfiguration = (props) => {

  const {
    simulate,
    socket,
    runSimulation,
    selectedSimulationConfig,
    SimConfiguration,
    setAnalysisSheetTab
  } = props;

  const [open, setOpen] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);
  const [anchor, setAnchor] = useState("left");
  const [anchorEl, setAnchorEl] = useState(null);
  const [simRateEditopen, setSimRateEditopen] = useState(false);
  const [runSimulationFlag, setRunSimulationFlag] = useState(false)
  const [saveSimulationFlag, setSaveSimulationFlag] = useState(false)
  const [shareSimulationFlag, setShareSimulationFlag] = useState(false);
  const [isLoading, SetIsLoading] = useState(false)

  const onShare = async () => {
    const { userinfo } = props;
      const projectId = simulate.getIn(["project", "id"]);
      const CaseId = simulate.getIn(["case", "id"]);
      const email = userinfo.email;
      const gitGraph = await SimulateService.getGitGraph(projectId,CaseId,email);
      const data = await SimulateService.checkOldGitData(projectId,CaseId);

      if(data.data.GitGraphVersion !== undefined){
        if(gitGraph !== undefined){
          if(gitGraph.parent !== undefined){
            setShareOpen(true);
          }
          else{
            NotificationManager.error("Couldnot share unsaved simulation");
          }
        } else {
          NotificationManager.error("Couldnot share unsaved simulation");
        }
      } 
      else{
        setShareOpen(true);
      }
  }

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const classes = useStyles();

  const handleSimRateEditClickOpen = () => {
    setSimRateEditopen(true);
  };

  const runSimulationHandler = async () => {
    runSimulation(true);
    setRunSimulationFlag(true);
  };

  const stopSimulationHadnler = () => {
    const simulationData = {
      Command: "Stop",
      SimulationDetails: {
        "Project Name": simulate.getIn(["project", "ProjectName"]),
        "Project id": simulate.getIn(["project", "id"]),
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
    };

    console.log("Stopping the simulation",simulationData)

    socket.emit(
      `FromClient-${auth.currentUser.uid}`,
      simulationData,
      (ackResult) => {
        // console.log("ack result : ", ackResult);
        if (ackResult === true) {
          // props.runSimulationCompleted();
          setRunSimulationFlag(false);
          runSimulation(false);
        } else {
          NotificationManager.error("Could not start simulation");
        }
      }
    );

    console.log("simulationData",simulationData)
  };

  const caseId = simulate.getIn(["case", "id"]);
  if (!caseId) {
    return <Redirect to={"/app/simulation/mysimulation"} />;
  }

  if (!socket || !socket.connected) {
    return <div>Connectivity issue</div>;
  }

  useEffect(() => {
    SetIsLoading(true);
    const stakeHolderList = props.simulate.getIn(["case", "StackholderList"]);
    const uid = props.userinfo.uid;
    if (stakeHolderList) {
      stakeHolderList.map((key, value) => {
        if (value === uid && key === "edit") {
          setShareSimulationFlag(true)
        }
      })
    }
  }, []);

 const [openn, setOpenn] = useState(false);
 const [axis, setAxis] = useState(null);

 var x = null;
 var y = null;
     
 document.addEventListener('mousemove', onMouseUpdate, false);
 document.addEventListener('mouseenter', onMouseUpdate, false);
     
 function onMouseUpdate(e) {
   x = e.pageX;
   y = e.pageY;
 }

 const [stateData, setStateData] = useState({
   pane1: {
     max: props.SplitReducer.pane1.max,
     min: props.SplitReducer.pane1.min,
     lock: props.SplitReducer.pane1.lock,
     collapse: props.SplitReducer.pane1.collapse
   },
   pane2: {
     max: props.SplitReducer.pane2.max,
     min: props.SplitReducer.pane2.min,
     lock: props.SplitReducer.pane2.lock,
     collapse: props.SplitReducer.pane2.collapse
   },
   pane3: {
     max: props.SplitReducer.pane3.max,
     min: props.SplitReducer.pane3.min,
     lock: props.SplitReducer.pane3.lock,
     collapse: props.SplitReducer.pane3.collapse
   },
   pane4: {
    windowCollapse: props.SplitReducer.pane4.windowCollapse 
   }
 });

 const handleClickk = () => {
   setOpenn(true);
   setAxis({
     x: x + 2,
     y: y - 6
   });
 }

 const handleClosee = () => {
   setOpenn(false);
 }

 const handleLock = (value) => {
   var update = stateData;
   update[value].lock = !stateData[value].lock;
   const data = {
     value: value,
     trigger: stateData[value].lock
   }
   props.setLock(data);
   props.handleLock(value);
   setStateData(update);
   setOpenn(false);
 }

 const handleMax = (value) => {
   var update = stateData;
   update[value].max = !stateData[value].max;
   const data = {
     value: value,
     trigger: stateData[value].max
   }
   props.setMax(data);
   props.handleMax(value);
   setStateData(update);
   setOpenn(false);
 }

 const handleMin = (value) => {
   var update = stateData;
   update[value].min = !stateData[value].min;
   const data = {
     value: value,
     trigger: stateData[value].min
   }
   props.setMin(data);
   props.handleMin(value);
   setStateData(update);
   setOpenn(false);
 }

 const handleCollapse = (value) => {
   var update = stateData;
   update[value].collapse = !stateData[value].collapse;
   const data = {
     value: value,
     trigger: stateData[value].collapse
   }
   props.setExpand(data);
   props.handleCollapse(value);
   setStateData(update);
   setOpenn(false);
 }

 const handleWindowSplit = () => {
    var update = stateData;
    update["pane4"].windowCollapse = !stateData["pane4"].windowCollapse;
    const data = {
      value: "pane4",
      trigger: stateData["pane4"].windowCollapse
    }
    props.setWindowCollapse(data);
    props.handleWindowSplit("pane4");
    setStateData(update);
    setOpenn(false);
 }

  return (
    <div>
      <div className={classes.appFrame}>
        <AppBar
          className={classes.appBar}
        >
          <Toolbar
            variant="dense"
            className="d-flex flex-row justify-content-between align-items-center"
          >
          <div style={{position: "relative", float: "left"}}>
            <div className={classes.button} >
              <Tooltip title="Screen Details">
                <Button variant="outlined" className={classes.outlineButton} onClick={handleClickk}>
                  Screen Details
                </Button>
              </Tooltip>
            </div>
            <Menu
              open={openn}
              onClose={handleClosee}
              anchorReference="anchorPosition"
              anchorPosition={
                axis !== null
            ? { top: axis.y, left: axis.x }
            : undefined}
              >
                <MenuList>
                  <MenuItem>
                    <ListItemText>Screen 1</ListItemText>
                    <Tooltip title="enable split view">
                      <Checkbox
                        checked={stateData["pane1"].collapse}
                        onChange={()=> handleCollapse("pane1")}
                        inputProps={{ 'aria-label': 'controlled' }}
                      />
                    </Tooltip>
                  </MenuItem>
                  <MenuItem>
                    <ListItemText>Screen 2</ListItemText>
                    <Tooltip title="enable split panel">
                      <Checkbox
                        checked={stateData["pane2"].collapse}
                        onChange={()=> handleCollapse("pane2")}
                        inputProps={{ 'aria-label': 'controlled' }}
                      />
                    </Tooltip>
                    <Tooltip title="maximize panel">
                      <Typography variant="body2">
                        <Add onClick={() => handleMax("pane2")}/>
                      </Typography>
                    </Tooltip>
                    <Tooltip title="minimize panel">
                      <Typography variant="body2">
                        <Remove onClick={() => handleMin("pane2")}/>
                      </Typography>
                    </Tooltip>
                    {
                      stateData["pane2"].lock ? (
                        <Tooltip title="lock panel">
                          <Typography variant="body2">
                            <Lock onClick={() => handleLock("pane2")}/>
                          </Typography>
                        </Tooltip>
                      ) : (
                        <Tooltip title="lock panel">
                          <Typography variant="body2">
                            <LockOpen onClick={() => handleLock("pane2")}/>
                          </Typography>
                        </Tooltip>
                      )
                    }
                  </MenuItem>
                  <MenuItem>
                    <ListItemText>Screen 3</ListItemText>
                    <Tooltip title="enable split panel">
                      <Checkbox
                        style={{float: "left"}}
                        checked={stateData["pane3"].collapse}
                        onChange={()=> handleCollapse("pane3")}
                      />
                    </Tooltip>
                    <Tooltip title="maximize panel">
                      <Typography variant="body2">
                          <Add onClick={()=> handleMax("pane3")} />
                      </Typography>
                    </Tooltip>
                    <Tooltip title="minimize panel">
                      <Typography variant="body2">
                        <Remove onClick={() => handleMin("pane3")}/>
                      </Typography>
                    </Tooltip>
                    {
                      stateData["pane1"].lock ? (
                        <Tooltip title="lock panel">
                          <Typography variant="body2">
                            <Lock onClick={()=> handleLock("pane3")}/>
                          </Typography>
                        </Tooltip>
                      ) : (
                        <Tooltip title="lock panel">
                          <Typography variant="body2">
                            <LockOpen onClick={()=> handleLock("pane3")}/>
                          </Typography>
                        </Tooltip>
                      )
                    }
                  </MenuItem>
                  <MenuItem>
                    <ListItemText>Extra Window</ListItemText>
                    <Tooltip title="enable extra window split">
                      <Checkbox
                        style={{float: "left"}}
                        checked={stateData["pane4"].windowCollapse}
                        onChange={()=> handleWindowSplit()}
                      />
                    </Tooltip>
                  </MenuItem>
                </MenuList>
              </Menu>
            </div>

            <Divider
              orientation="vertical"
              light={true}
              style={{ backgroundColor: "grey", fontSize: "1px" }}
              flexItem
            />
            <div className={classes.Simulationdetail}>
              <div className={classes.toolbarSection1}>
                <HtmlTooltip
                  title={
                    <Paper elevation={0} className="p-2">
                      <Typography
                        style={{ fontSize: "16px", fontWeight: "900" }}
                        align="center"
                      >
                        Details
                      </Typography>
                      <Divider className="mt-1 mb-1" />
                      <div className="d-flex align-items-center justify-content-between ">
                        <Typography
                          style={{ fontSize: "12px", fontWeight: "700" }}
                          varaint="subtitle2"
                        >
                          {"Simulation Name:"}
                        </Typography>{" "}
                        <span style={{ fontSize: "12px", fontWeight: "400" }}>
                          {simulate.getIn(["case", "SimulationName"])}
                        </span>
                      </div>
                      <Divider className="mt-1 mb-1" />
                      <div className="d-flex align-items-center justify-content-between ">
                        <Typography
                          style={{ fontSize: "12px", fontWeight: "700" }}
                          varaint="subtitle2"
                        >
                          {"Project Name:"}
                        </Typography>
                        <span style={{ fontSize: "12px", fontWeight: "400" }}>
                          {simulate.getIn(["project", "ProjectName"])}
                        </span>
                      </div>

                      <Divider className="mt-1 mb-1" />
                      <div className="d-flex align-items-center justify-content-between ">
                        <Typography
                          style={{ fontSize: "12px", fontWeight: "700" }}
                          varaint="subtitle2"
                        >
                          {"Start Date:"}
                        </Typography>{" "}
                        <span style={{ fontSize: "12px", fontWeight: "400" }}>
                          {moment(
                            simulate.getIn(["case", "StartDate"]).seconds * 1000 +
                            simulate.getIn(["case", "StartDate"]).nanoseconds /
                            1000000
                          )
                            .utc()
                            .format("YYYY-MM-DD HH:mm:ss.SSS")}
                        </span>
                      </div>

                      <Divider className="mt-1 mb-1" />
                      <div className="d-flex align-items-center justify-content-between ">
                        <Typography
                          style={{ fontSize: "12px", fontWeight: "700" }}
                          varaint="subtitle2"
                        >
                          {"End Date:"}
                        </Typography>{" "}
                        <span style={{ fontSize: "12px", fontWeight: "400" }}>
                          {moment(
                            simulate.getIn(["case", "EndDate"]).seconds * 1000 +
                            simulate.getIn(["case", "EndDate"]).nanoseconds /
                            1000000
                          )
                            .utc()
                            .format("YYYY-MM-DD HH:mm:ss.SSS")}
                        </span>
                      </div>

                      <Divider className="mt-1 mb-1" />
                      <div className="d-flex align-items-center justify-content-between ">
                        <Typography
                          style={{
                            fontSize: "12px",
                            fontWeight: "700",
                            marginRight: "4px",
                          }}
                          varaint="subtitle2"
                        >
                          {"Modified Date:"}
                        </Typography>
                        <span style={{ fontSize: "12px", fontWeight: "400" }}>
                          {moment(
                            simulate.getIn(["case", "LastModifiedOn"]).seconds *
                            1000 +
                            simulate.getIn(["case", "LastModifiedOn"])
                              .nanoseconds /
                            1000000
                          ).format("YYYY-MM-DD HH:mm:ss.SSS")}
                        </span>
                      </div>

                      <Divider className="mt-1 mb-1" />
                      {selectedSimulationConfig &&
                        (selectedSimulationConfig.name !== "" ? (
                          <Paper elevation={0}>
                            <div className="d-flex align-items-center justify-content-between ">
                              <Typography
                                style={{ fontSize: "12px", fontWeight: "700" }}
                                varaint="subtitle2"
                              >
                                {"Loaded from:"}
                              </Typography>
                              {selectedSimulationConfig.name}
                            </div>
                            <Divider className="mt-1 mb-1" />
                            <div className="d-flex align-items-center justify-content-between ">
                              <Typography
                                style={{ fontSize: "12px", fontWeight: "700" }}
                                varaint="subtitle2"
                              >
                                {"Updated"}
                              </Typography>
                              {selectedSimulationConfig.version}
                              {" times"}
                            </div>
                          </Paper>
                        ) : (
                          <React.Fragment></React.Fragment>
                        ))}
                    </Paper>
                  }
                >
                  <Chip
                    variant="outlined"
                    size="small"
                    style={{
                      color: "white",
                      borderColor: "white",
                      padding: "12px",
                      overflow: "hidden",
                      maxWidth: "140px",
                      textOverflow: "ellipsis",
                    }}
                    label={simulate.getIn(["case", "SimulationName"])}
                    clickable
                    color="primary"
                    icon={<InfoIcon />}
                  />
                </HtmlTooltip>
              </div>
            </div>
            <div className="ml-1 d-flex align-items-center justify-content-between ">
              <div style={{ display: shareSimulationFlag ? 'none' : 'block' }} className={classes.savediv}>
                <IconButton
                  edge="end"
                  size="small"
                  className={classes.button}
                  onClick={onShare}
                >
                  <Tooltip title="share Workspace">
                    <Button
                      variant="outlined"
                      size="small"
                      color="secondary"
                      className={classes.outlineButton}
                      startIcon={<ShareIcon />}
                    >
                      Share
                    </Button>
                  </Tooltip>
                </IconButton>
              </div>
            </div>
            <Divider
              orientation="vertical"
              light={true}
              style={{ backgroundColor: "grey", fontSize: "1px" }}
              flexItem
            />

            <div>
              <Tooltip title="Click to Expand">
                <Chip
                  variant="outlined"
                  size="small"
                  style={{ color: "white", borderColor: "white", padding: "12px" }}
                  label={"Station"}
                  clickable
                  onClick={handleClick}
                  color="primary"
                  icon={<GroundStation width={20} fill="#fa2" />}
                  deleteIcon={<ArrowDropDownIcon style={{ color: "#ffffff" }} />}
                  onDelete={handleClick}
                />
              </Tooltip>
              <StyledMenu
                id="customized-menu"
                anchorEl={anchorEl}
                keepMounted
                open={Boolean(anchorEl)}
                onClose={handleClose}
              >
                <StyledMenuItem>
                  <ListItemIcon>
                    <ViewGroundStation />
                  </ListItemIcon>
                </StyledMenuItem>
                <StyledMenuItem>
                  <ListItemIcon>
                    <AddGroundStation
                      projectid={props.simulate.getIn(["project", "id"])}
                      simulationid={props.simulate.getIn(["case", "id"])}
                    />
                  </ListItemIcon>
                </StyledMenuItem>
              </StyledMenu>
            </div>
            <Divider
              orientation="vertical"
              light={true}
              style={{ backgroundColor: "grey", fontSize: "1px" }}
              flexItem
            />
            <div className={classes.simulationRateContainer}>
              <Chip
                variant="outlined"
                label={`Rate:${SimConfiguration.simRate.value} ms`}
                className={classes.simRateChip}
                // onClick={handleClick}
                onDelete={handleSimRateEditClickOpen}
                deleteIcon={
                  <EditIcon
                    size="small"
                    style={{ color: "white", fontSize: "6px" }}
                  />
                }
              />
            </div>
            <Divider
              orientation="vertical"
              light={true}
              style={{ backgroundColor: "grey", fontSize: "1px" }}
              flexItem
            />
            <div className={classes.simulationActiondetail}>

              <ConfigurationTimedropdown shareSimulationFlag={shareSimulationFlag} setAnalysisSheetTab={setAnalysisSheetTab} />
            </div>

            <EditConfigDialog
              isDialogOpened={isOpen}
              handleCloseDialog={() => setIsOpen(false)}
              save={props.save}
            />
            <EditSimRateDialog
              isDialogOpened={simRateEditopen}
              handleCloseDialog={() => setSimRateEditopen(false)}
            />
            <ShareDialog
              isDialogOpened={shareOpen}
              handleCloseDialog={() => setShareOpen(false)}
              missionId={props.simulate.getIn(["project", "id"])}
              simulationId={props.simulate.getIn(["case", "id"])}
              userInfo={props.userinfo}
              userProfile={props.userprofile}
            />

          </Toolbar>
        </AppBar>
        </div>
    </div>
  );
};

const stateProp = (state) => ({
  socket: state.simulate.get("socket"),
  simulate: state.simulate,
  panelIsOpened: state.simulate.get("simulateLeftPanelOpened"),
  SimulationRunConfigList: state.simulate.get("SimulationRunConfigList"),
  simulationActiveConfig: state.simulate.get("simulationActiveConfig"),
  selectedSimulationConfig: state.simulate.get("selectedSimulationConfig"),
  saveSimulationState: state.simulate.get("simulate.save"),
  runSimulationState: state.simulate.get("simulate.run"),
  SimConfiguration: state.SimConfiguration,
  userinfo: state.firebase.auth,
  userprofile: state.firebase.profile,
  isHeaderCollapsed: state.settings.isHeaderCollapsed,
  SplitReducer: state.SplitReducer
});

const dispatchProps = {
  toggleSimulateLeftPanel,
  saveSimulation,
  runSimulation,
  saveSimulationCompleted,
  updateGroundstationList,
  setSelectSimulationConfig,
  minimapMarkWidth,
  minimapMarkLeft,
  minimapMarkHeight,
  minimapIsOpenTab,
  initializeModel, deleteModel, 
  addModel, updateModel, 
  zoomInModel, zoomOutModel, 
  setOffSet, canvasWidthHeight, 
   extraPositiveWidth, extraNegitiveWidth, 
   extraPositiveHeight, 
   extraNegitiveHeight,
   onDragStart, onDragEnd,
   setMax, 
   setMin, 
   setLock, 
   setExpand,
   setWindowCollapse
};

export default connect(stateProp, dispatchProps)(SimulationConfiguration);