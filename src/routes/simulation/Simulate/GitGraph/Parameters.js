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
import ConfigurationTimedropdown from "../ConfigurationTimedropdown.js";
import ViewGroundStation from "../GroundStation/ViewGroundStation";
import AddGroundStation from "../GroundStation/AddGroundStation";
import CircularProgress from "@material-ui/core/CircularProgress";
import StopIcon from "@material-ui/icons/Stop";
import GroundStation from "../../Simulate/GroundStation/GroundStation.js";
import { addGroundstation } from "Api/GroundstationAPI";
import ArrowDropDownIcon from "@material-ui/icons/ArrowDropDown";
import SimulateService from "Api/Simulate";
import { setSelectSimulationConfig } from "Actions/Simulate";
import EditConfigDialog from "../EditConfigDialog.js";
import EditSimRateDialog from "../EditSimRateDialog.js";

import RctSectionLoader from "Components/RctSectionLoader/RctSectionLoader";
import { BlockCollection } from '../BlockCollection'
import { updateGroundstationList } from "Actions/AddingGroundstation";
import DragAndDropWidget from "Components/DragAndDrop/simulationConfigViewOnly";
import {
  toggleSimulateLeftPanel,
  saveSimulation,
  runSimulation,
  saveSimulationCompleted,
} from "Actions/Simulate";
import ShareDialog from '../ShareSimulation/ShareDialog';
import { auth } from "../../../../firebase";
import { minimapMarkWidth, minimapMarkLeft, minimapMarkHeight, minimapIsOpenTab } from '../../../../actions/Minimap';
import DiagramEngine from "Components/DragAndDrop/Diagram/DiagramEngine";

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
    commit,
    commitLoading,
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

  useEffect(()=>{
    console.log("commit2", commit, commitLoading);
  },[commit, commitLoading]);

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


 


    const { innerWidth: width, innerHeight: height } = window;
    console.log("Mark 3",innerWidth,innerHeight)
    const ref = useRef(null);
    // const refdrawer = useRef(null)
    const [width2, setWidth2] = useState(0);
    const [height2, setHeight2] = useState(0);

    useEffect(() => {
      setWidth2(ref.current.offsetWidth);
      setHeight2(ref.current.getBoundingClientRect());
     

     minimapMarkLeft(0);
     minimapMarkHeight(0);
    }, [ref.current]);

    




  return (
    <div className={isHeaderCollapsed?classes.root:classes.rootCollapse}>

      {
        !isLoading &&
        <RctSectionLoader />
      }
      <div className={classes.appFrame}  ref={ref}>
    
          <DragAndDropWidget runSimulationFlag={null}
            saveSimulationFlag={null}
            setSaveSimulationFlag={null}
            dragAndDropApp={dragAndDropApp}
            socket={null}
            commit={commit}
            commitLoading={commitLoading}
          />
        

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
