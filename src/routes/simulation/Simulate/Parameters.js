import React, { useState, useEffect, useLayoutEffect, useRef  } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import classNames from "classnames";
import {
  Drawer,
  AppBar,
  Toolbar,
  List,
  Menu,
  MenuItem,
  Typography,
  Divider,
  IconButton,
  Chip,
  Tooltip,
  Button,
  ListItemIcon,
  Paper
} from "@material-ui/core";
import { Redirect } from "react-router-dom";
import InfoIcon from "@material-ui/icons/Info";
import EditIcon from "@material-ui/icons/Edit";
import MenuIcon from "@material-ui/icons/Menu";
import DirectionsRunIcon from "@material-ui/icons/DirectionsRun";
import SaveIcon from "@material-ui/icons/Save";
import ShareIcon from "@material-ui/icons/Share";
import ReplayIcon from "@material-ui/icons/Replay";
import { makeStyles, withStyles, useTheme } from "@material-ui/core/styles";
import moment from "moment";
import CloseIcon from "@material-ui/icons/Close";
import SimulationIcon from "@material-ui/icons/Public";
import ConfigurationTimedropdown from "./ConfigurationTimedropdown.js";
import ViewGroundStation from "./GroundStation/ViewGroundStation";
import AddGroundStation from "./GroundStation/AddGroundStation";
import CircularProgress from "@material-ui/core/CircularProgress";
import StopIcon from "@material-ui/icons/Stop";
import GroundStation from "../Simulate/GroundStation/GroundStation.js";
import { addGroundstation } from "Api/GroundstationAPI";
import ArrowDropDownIcon from "@material-ui/icons/ArrowDropDown";
import SimulateService from "Api/Simulate";
import { setSelectSimulationConfig } from "Actions/Simulate";
import EditConfigDialog from "./EditConfigDialog.js";
import EditSimRateDialog from "./EditSimRateDialog.js";

import RctSectionLoader from "Components/RctSectionLoader/RctSectionLoader";
import { BlockCollection } from './BlockCollection'
import { updateGroundstationList } from "Actions/AddingGroundstation";
import DragAndDropWidget from "Components/DragAndDrop/BodyWidget";
import {
  toggleSimulateLeftPanel,
  saveSimulation,
  runSimulation,
  saveSimulationCompleted,
} from "Actions/Simulate";
import ShareDialog from './ShareSimulation/ShareDialog';
import { auth } from "../../../firebase";
import { minimapMarkWidth, minimapMarkLeft, minimapMarkHeight, minimapIsOpenTab } from '../../../actions/Minimap';
import DiagramEngine from "Components/DragAndDrop/Diagram/DiagramEngine";

import { NotificationManager } from "react-notifications";

import { initializeModel, deleteModel, 
  addModel, updateModel, 
  zoomInModel, zoomOutModel, 
  setOffSet, canvasWidthHeight, 
   extraPositiveWidth, extraNegitiveWidth, 
   extraPositiveHeight, 
   extraNegitiveHeight,
   onDragStart, onDragEnd } from '../../../actions/Minimap';

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
    // width: "200px",
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
    // [theme.breakpoints.up("sm")]: {
    //   height: "calc(100% - 64px)",
    //   marginTop: 64,
    // },
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
    // marginRight: theme.spacing(2),
    // marginLeft: "5px",
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
    // marginLeft: "auto",
    display: "inherit",
  },
  toolbarSection1: {
    position: "relative",
    // marginLeft: "10px",
    color: "white",
    display: "flex",
    overflow: "hidden",
    maxWidth: "160px",
    textOverflow: "ellipsis",
    "&:hover": {
      overflow: "visible",
      // white-space: normal,
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
      // white-space: normal,
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
    // border: "1px solid #ffffff",
    // borderRadius: "16px",
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
    // width: " 35px",
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
    // textDecoration:"underline",
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
    // textDecoration:"underline",
    // "&:hover": {
    //   fontWeight: "600",
    // },
  },

}));

const HtmlTooltip = withStyles((theme) => ({
  tooltip: {
    backgroundColor: "#ffffff",
    color: "rgba(0, 0, 0, 0.87)",
    maxWidth: 300,
    fontSize: theme.typography.pxToRem(12),
    borderRadius: "12px",
    // border: "1px solid #dadde9",
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
    panelIsOpened,
    toggleSimulateLeftPanel,
    saveSimulation,
    runSimulation,
    saveSimulationCompleted,
    stopSimulation,
    selectedSimulationConfig,
    simulationActiveConfig,
    SimConfiguration,
    setAnalysisSheetTab,
    isHeaderCollapsed,
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
   onDragStart, onDragEnd
  } = props;

  const updatenode = (option,data)=>{
    console.log("updatenode", option, data);
    switch (option){
      case 'INILIZE_MINIMAP':
       initializeModel(data);
        break;
      case 'ADD_NODE':
       addModel(data)
        break;
      case 'DELETE_NODE':
       deleteModel(data);
        break;
      case 'UPDATE_NODE':
       updateModel(data);
        break;
      case 'ZOOM_IN':
       zoomInModel(data);
        // setScaleDelta(0.25);
        break;
      case 'ZOOM_OUT':
       zoomOutModel(data);
        // setScaleDelta(-0.25);
        break;
      case 'GET_ZOOM_LEVELS':
        returnMinimapReducer.zoomLevels;
        break;
      case 'SET_OFFSET':
       setOffSet(data);
        break;
      case 'MINIMAP_CANVAS_WIDTH_HEIGHT':
       canvasWidthHeight(data);
        break;
      case 'MINIMAP_MARK_WIDTH':
       minimapMarkWidth(data);
        break;
      case 'MINIMAP_MARK_LEFT':
       minimapMarkLeft(data);
        break;
      case 'MINIMAP_MARK_HEIGHT':
       minimapMarkHeight(data);
        break;
      case 'MINIMAP_IS_OPEN_TAB':
       minimapIsOpenTab(data);
        break;
      case 'MINIMAP_EXTRA_POSITIVE_WIDTH':
       extraPositiveWidth(data);
        break;
      case 'MINIMAP_EXTRA_NEGITIVE_WIDTH':
       extraNegitiveWidth(data);
        break;
      case 'MINIMAP_EXTRA_POSITIVE_HEIGHT':
       extraPositiveHeight(data);
        break;
      case 'MINIMAP_EXTRA_NEGITIVE_HEIGHT':
       extraNegitiveHeight(data);
        break;
      case 'START_VIEW_DRAG':
        console.log("DragStart", data);
       onDragStart(data);
        break;
      case 'END_VIEW_DRAG': 
      console.log("DragStart", data);
       onDragEnd(data);
        break;
      case 'GET_MINIMAP':
        console.log("testN",MinimapReducer);
        returnMinimapReducer;
        break;
      

    }
  }

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

  const handleOpen = () => {
    setIsOpen(!isOpen);
  };


  const handleDrawerOpen = () => {
    minimapIsOpenTab(!open);
    setOpen(!open);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const handleChangeAnchor = (event) => {
    setAnchor(event.target.value);
  };
  const handleSimRateEditClickOpen = () => {
    setSimRateEditopen(true);
  };

  const handleSimRateEditClose = () => {
    setSimRateEditopen(false);
  };

  const runSimulationHandler = async () => {
    runSimulation(true);
    setRunSimulationFlag(true);
    // props.run();


  };

  const stopSimulationHadnler = () => {
    // setRunSimulationFlag(false);
    // runSimulation(false);
    // stopSimulation();


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



  const drawer = (
    <Drawer
      variant="persistent"
      className={classes.drawer}
      classes={{
        paper: classes.drawerPaper,
      }}
      anchor={anchor}
      open={open}

    >
      <Toolbar variant="dense" />

      <div className={classes.drawerContainer}>
        <BlockCollection />
      </div>

    </Drawer>
  );

  let before = null;
  let after = null;

  if (anchor === "left") {
    before = drawer;
  } else {
    after = drawer;
  }

  const caseId = simulate.getIn(["case", "id"]);

  if (!caseId) {
    return <Redirect to={"/app/simulation/mysimulation"} />;
  }

  if (!socket || !socket.connected) {
    return <div>Connectivity issue</div>;
  }

  const [dragAndDropApp, setDragAndDropApp] = React.useState(
    new DiagramEngine(updatenode));

  useEffect(() => {
    SetIsLoading(true);
    const stakeHolderList = props.simulate.getIn(["case", "StackholderList"]);
    const uid = props.userinfo.uid;
    // console.log("tempConfigggList", stakeHolderList);
    if (stakeHolderList) {
      stakeHolderList.map((key, value) => {
        // console.log("key", key, value)
        if (value === uid && key === "edit") {
          setShareSimulationFlag(true)
        }
      })
    }
  }, []);


  // const handleGetClick = async () => {
  //   let result = await LocalBaseService.getPacketId();
  //   // let result = await LocalBaseService.getPacketIdByPhysicalUnitType();
  //   console.log("result",result);
  // }


    const { innerWidth: width, innerHeight: height } = window;
    console.log("Mark 3",innerWidth,innerHeight)
    const ref = useRef(null);
    const refdrawer = useRef(null)
    const [width2, setWidth2] = useState(0);
    const [height2, setHeight2] = useState(0);

    useEffect(() => {
      setWidth2(ref.current.offsetWidth);
      setHeight2(ref.current.getBoundingClientRect());
      console.log("Mark 4",width2,height2,ref.current,refdrawer.current.getBoundingClientRect().left)
      console.log("Mark 6",refdrawer.current.getBoundingClientRect())
     minimapMarkLeft(refdrawer.current.getBoundingClientRect().left);
     minimapMarkHeight(refdrawer.current.getBoundingClientRect().height);
    }, [ref.current]);

    useEffect(() => {
      setWidth2(ref.current.offsetWidth);
      setHeight2(ref.current.getBoundingClientRect());
      console.log("Mark 5",refdrawer.current.getBoundingClientRect(),get(refdrawer,'current.offsetWidth',-1))
      // console.log("Mark 4",width2,height2,ref.current)
      minimapMarkWidth(refdrawer.current.getBoundingClientRect().width);
    }, [get(refdrawer,'current.offsetWidth',-1)]);




  return (
    <div className={isHeaderCollapsed?classes.root:classes.rootCollapse}>

      {
        !isLoading &&
        <RctSectionLoader />
      }
      <div className={classes.appFrame}  ref={ref}>
        <AppBar
          className={classes.appBar}
        >
          <Toolbar
            variant="dense"
            className="d-flex flex-row justify-content-between align-items-center"
          >
            <div className={classes.toolbarinfo}>
              <IconButton
                color="inherit"
                aria-label="open drawer"
                onClick={handleDrawerOpen}
                className={classes.menuButton}
              >
                {open ? (
                  <CloseIcon fontSize="small" />
                ) : (
                  <MenuIcon fontSize="small" />
                )}
              </IconButton>
              <Typography variant="subtitle2" >
                Block Collection
              </Typography>
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

                      {/* {selectedSimulationConfig.name} */}
                    </Paper>
                  }
                >
                  <Chip
                    variant="outlined"
                    size="small"
                    // avatar={<Avatar>M</Avatar>}
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
                    // onDelete={handleDelete}
                    icon={<InfoIcon />}
                  />
                  {/* <Typography
                className={classes.projectName}
                variant="subtitle1"
                noWrap
              >
                Details
              </Typography> */}
                </HtmlTooltip>
              </div>
            </div>
            <div className="ml-1 d-flex align-items-center justify-content-between ">
              <div style={{ display: shareSimulationFlag ? 'none' : 'block' }} className={classes.savediv}>
                <IconButton
                  edge="end"
                  size="small"
                  className={classes.button}
                  // onClick={() => setShareOpen(true)}
                  onClick={onShare}
                >
                  <Tooltip title="share Workspace">
                    <Button
                      variant="outlined"
                      size="small"
                      color="secondary"
                      // disabled={saveSimulationFlag}
                      className={classes.outlineButton}
                      // style={{ border: "1px solid #ffffff",color:"#ffffff",borderRadius:"12px" }}
                      startIcon={<ShareIcon />}
                    >
                      Share
                    </Button>
                    {/* <SaveIcon /> */}
                  </Tooltip>

                  {/* {props.saveSimulationState && (
                <CircularProgress size={35} className={classes.saveProgress} />
              )} */}
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
                  // avatar={<Avatar>M</Avatar>}
                  style={{ color: "white", borderColor: "white", padding: "12px" }}
                  label={"Station"}
                  clickable
                  onClick={handleClick}
                  color="primary"
                  // onDelete={handleDelete}
                  icon={<GroundStation width={20} fill="#fa2" />}
                  deleteIcon={<ArrowDropDownIcon style={{ color: "#ffffff" }} />}
                  onDelete={handleClick}
                />
                {/* <Button
              className="ml-3"
              // onMouseOver={handleClick}
              onClick={handleClick}
            >
              <div className={classes.groundstationdetail}>
                <GroundStation width={10} fill="#fa2" />
                <Typography className={classes.btnText} variant="button" noWrap>
                  {" "}
                  Ground Station
                </Typography>
                <ArrowDropDownIcon style={{ color: "#ffffff" }} />
              </div>
            </Button> */}
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
                    // handleSubmit={addGroundstation}
                    // handleaddGroundstationList={props.updateGroundstationList}
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
            <div className="d-flex align-items-center justify-content-between ">
              <div display="block" className={classes.savediv}>
                <IconButton
                  edge="end"
                  size="small"
                  className={classes.button}
                  disabled={props.saveSimulationState}
                  onClick={() => setSaveSimulationFlag(true)}
                >
                  <Tooltip title="Save Workspace">
                    <Button
                      variant="outlined"
                      size="small"
                      color="secondary"
                      disabled={saveSimulationFlag}
                      className={classes.outlineButton}
                      // style={{ border: "1px solid #ffffff",color:"#ffffff",borderRadius:"12px" }}
                      startIcon={saveSimulationFlag ? <CircularProgress color="secondary" size={20} /> : <SaveIcon />}
                    >
                      Save
                    </Button>
                    {/* <SaveIcon /> */}
                  </Tooltip>

                  {/* {props.saveSimulationState && (
                <CircularProgress size={35} className={classes.saveProgress} />
              )} */}
                </IconButton>
              </div>

              <IconButton
                edge="end"
                size="small"
                className={classes.button}
                onClick={() =>
                  props.runSimulationState
                    ? stopSimulationHadnler()
                    : runSimulationHandler()
                }
              >
                {props.runSimulationState ? (
                  <Tooltip title="Stop">
                    <Button
                      variant="outlined"
                      size="small"
                      color="secondary"
                      className={classes.outlineButton}
                      startIcon={<StopIcon style={{ color: "#B22222" }} />}
                    >
                      Stop
                    </Button>
                  </Tooltip>
                ) : (
                  <Tooltip title="Execute Loaded Workspace">
                    <Button
                      variant="outlined"
                      size="small"
                      color="secondary"
                      className={classes.outlineButton}
                      startIcon={<DirectionsRunIcon />}
                    >
                      Run
                    </Button>
                    {/* <DirectionsRunIcon /> */}
                  </Tooltip>
                )}
              </IconButton>
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
         <Drawer
      variant="persistent"
      className={classes.drawer}
      classes={{
        paper: classes.drawerPaper,
      }}
      anchor={anchor}
      open={open}

      ref={refdrawer}

    >
      <Toolbar variant="dense" />

      <div className={classes.drawerContainer}>
        <BlockCollection />
      </div>

    </Drawer>
        <main
          className={classNames(classes.content, classes[`content-${anchor}`], {
            [classes.contentShift]: open,
            [classes[`contentShift-${anchor}`]]: open,
          })}
        >
          <DragAndDropWidget runSimulationFlag={runSimulationFlag}
            saveSimulationFlag={saveSimulationFlag}
            setSaveSimulationFlag={setSaveSimulationFlag}
            dragAndDropApp={dragAndDropApp}
            socket={socket}
          />
        </main>

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
  isHeaderCollapsed: state.settings.isHeaderCollapsed
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
   onDragStart, onDragEnd
};

// const forwaredInput = forwardRef(ToolBar)
export default connect(stateProp, dispatchProps)(SimulationConfiguration);
