import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import moment from "moment";
import {
  saveCzmlData,
  changeTab,
  setRunSimulationConfigList,
  clearRunSimulationConfigList,
  setLoadingOfRunConfiguration,
} from "../../../actions/Simulate";

import { setStartTour, setEndTour } from "../../../actions/TourActions";

import { setSimulationConfiguration } from "Actions/SimConfigurationAction";

// import Tab from './Tab';
import Parameters from "./Parameters";
import Simulation from "./Simulation";
import PostAnalysis from "./PostAnalysis";
import "./index.scss";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import PropTypes from "prop-types";
import { Typography, Button } from "@material-ui/core";
import Box from "@material-ui/core/Box";
import Joyride, { ACTIONS, EVENTS, LIFECYCLE, STATUS } from "react-joyride";
import step from "../../../reducers/tourstepscollection/simulation_configuration";
import { Actions } from "@jsonforms/core";
import {
  getSimulationAnalysisSnapshot,
  getSimulationAnalysis,
} from "../../../api/PostAnalysis";

import { getSimulationConfig } from "Api/SimulationConfig";
import SimulateService from "Api/Simulate";
import {
  setAnalysisCollection,
  addNewAnalysisCollection,
  removeAnalysisCollection,
  modifyAnalysisCollection,
  resetAnalysisCollection,
} from "Actions/SimAnalysisActions";
import { setGroundStationList, resetGroundStationList } from "Actions/GroundStationActions"
// rct card box
import RctCollapsibleCard from "Components/RctCollapsibleCard/RctCollapsibleCard";

import { useImmer } from "use-immer";

import { getGroundstationList } from "Api";

import ReflexControlsDemo from './ControlledElement'
import { toggleHeader } from "Actions/AppSettingsActions";
import HeaderCollapsableButton from "Components/Header/HeaderCollapsableButton";

import GitGraph from './GitGraph/index';
import Split from './GitGraph/split';

// import LocalBaseService from '../../../localbase/api.js';

import * as firebase from "firebase";
import { loadRunData, setIsLoading } from '../../../actions/RunData';

import { SplitPane } from "react-collapse-pane";

const useStyles = makeStyles((theme) => ({
  mypaper: {
    padding: "12px",
    border: "1px solid grey",
  },

  projectName: {
    overflow: "hidden",
    whiteSpace: "nowrap",
    textOverflow: "ellipsis",
    width: "150px",
    "&:hover": {
      overflow: "visible",
    },
  },
  root: {
    [theme.breakpoints.up('sm')]: {
      height: `calc(100vh - 48px)`,
    },
    [theme.breakpoints.down('sm')]: {
      height: `calc(100vh - 64px)`,
    },
    overflow: "hidden"
  },
  rootCollapse: {
    [theme.breakpoints.up('sm')]: {
      height: "100vh",
    },
    [theme.breakpoints.down('sm')]: {
      height: "100vh",
    },
    overflow: "hidden"
  },

  tabPanel: {
    [theme.breakpoints.up('sm')]: {
      height: `calc(100vh - 96px)`,
    },
    [theme.breakpoints.down('sm')]: {
      height: `calc(100vh - 112px)`,
    },
    overflow: "hidden"
  },
  tabPanelCollapse: {
    [theme.breakpoints.up('sm')]: {
      height: `calc(100vh - 48px)`,
    },
    [theme.breakpoints.down('sm')]: {
      height: `calc(100vh - 64px)`,
    },
    overflow: "hidden"
  }
}));

const AntTabs = withStyles({
  root: {
    borderBottom: "1px solid #e8e8e8",
  },
  indicator: {
    display: "flex",
    justifyContent: "center",
    backgroundColor: "transparent",
    "& > span": {
      maxWidth: 40,
      width: "100%",
      backgroundColor: "#635ee7",
    },
  },
})((props) => <Tabs {...props} TabIndicatorProps={{ children: <span /> }} />);

const AntTab = withStyles((theme) => ({
  root: {
    textTransform: "none",
    minWidth: 72,
    // fontWeight: theme.typography.fontWeightRegular,
    marginRight: theme.spacing(4),

    "&:hover": {
      color: "#40a9ff",
      opacity: 1,
    },
    "&$selected": {
      color: "#5D92F4",
      //   fontWeight: theme.typography.fontWeightMedium,
    },
    "&:focus": {
      color: "#5D92F4",
    },
  },
  selected: {},
}))((props) => <Tab disableRipple {...props} />);

function TabPanel(props) {
  const { children, value, index, isHeaderCollapsed,...other} = props;
  const classes = useStyles()
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
      className={isHeaderCollapsed ? classes.tabPanel : classes.tabPanelCollapse}
    >
      {value === index && (
        <Box p={1}>
          {children}
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
  isHeaderCollapsed: PropTypes.bool
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}


const Simulate = (props) => {
  const {
    activeTab,
    saveCzmlData,
    socket,
    projectId,
    simulationId,
    tempCongfigId,
    analysisData,
    simulate,
    userinfo,
    changeTab,
    isTourRunning,
    setEndTour,
    setAnalysisCollection,
    addNewAnalysisCollection,
    removeAnalysisCollection,
    modifyAnalysisCollection,
    resetAnalysisCollection,
    setSimulationConfiguration,
    isHeaderCollapsed,
    toggleHeader,
    loadRunData,
    setIsLoading
  } = props;
  const classes = useStyles();
  const [value, setValue] = React.useState(0);

  const [parameterId, SetPatameterid] = useState(null);
  const [isHistoryTab, setIsHistoryTab] = useState(false);
  const [onResizeTrig, SetOnResizerTrig] = useImmer({ tigger: 0, size: [] });

  const [analysisTab, setAnalysisTab] = useImmer({
    simulationAnalysisCollection: [],
    isloaded: false,
  });

  function setRunConfigurations(data) {
    if (data.length) {
      let configurations = data.sort((b, a) => a.createdAt - b.createdAt);

      props.setLoadingOfRunConfiguration(true);
      props.clearRunSimulationConfigList();
      props.setRunSimulationConfigList(configurations);
      props.setLoadingOfRunConfiguration(false);
    } else {
      props.setLoadingOfRunConfiguration(true);
      props.clearRunSimulationConfigList();
      props.setLoadingOfRunConfiguration(false);
    }
  }

  const handleChange = (event, newValue) => {
    setValue(newValue);
    changeTab(newValue);
  };

  const getRunData = async () => {
    setIsLoading(true);
    try {
      const getAnalysisFile = firebase
        .app()
        .functions('us-central1')
        .httpsCallable('generateAnalysisTree');

      let data = await getAnalysisFile({
        projectid: projectId,
        simulationid: simulationId,
      });
      console.log("RunData", data);
      loadRunData(data);

    } catch (error) {
      loadRunData(null);
      setIsLoading(false);
    }
  };

  useEffect(()=>{
    const check = async () => {
      const projectId = simulate.getIn(["project", "id"]);
      const caseId = simulate.getIn(["case", "id"]);
      const email = userinfo.email;
  
      const gitGraph = await SimulateService.checkOldGitData(projectId, caseId);
      if(gitGraph.data.GitGraphVersion !== undefined) {
        setIsHistoryTab(true);
      } else {
        setIsHistoryTab(false);
        changeTab(0);
      }
    }
    check();
  },[]);

  useEffect(() => {
    
    return () => {
      resetAnalysisCollection();
      props.resetGroundStationList();
      toggleHeader(true);
    };
  }, []);

  useEffect(() => {
    if (projectId && simulationId) {
      const setAnalysisData = async () => {
        let analysisCollection = [];
        await getSimulationAnalysisSnapshot(
          projectId,
          simulationId,
          (snapshot) => {
            snapshot.docChanges().forEach((change) => {
              if (change.type === "added") {
                addNewAnalysisCollection({
                  id: change.doc.id,
                  ...change.doc.data(),
                });
              }
              if (change.type === "removed") {
                removeAnalysisCollection({
                  id: change.doc.id,
                  ...change.doc.data(),
                });
              }
              if (change.type === "modified") {
                modifyAnalysisCollection({
                  id: change.doc.id,
                  ...change.doc.data(),
                });
              }
            });
          }
        );
      };
      setAnalysisData();
      getSimulationAnalysis(projectId, simulationId, setAnalysisTab);
      const getGroundStationData = async () => {
        let response = await getGroundstationList(projectId, simulationId);
        props.setGroundStationList(response);
      }
      getGroundStationData();
    }

    if (projectId && simulationId) {
      SimulateService.getRunConfigurationSnapshot(
        projectId,
        simulationId,
        (snapshot) => {
          var configurations = [];
          snapshot.forEach((s) => {
            configurations.push({
              id: s.id,
              ...s.data(),
            });
          });
          // this.props.setSelectSimulationConfig(tempConfig);
          setRunConfigurations(configurations);
          getRunData();
        }
      );
    }
  }, [projectId, simulationId]);

  useEffect(() => {
    if (projectId && simulationId && tempCongfigId) {
      getSimulationConfig({
        projectId: projectId,
        simulationId: simulationId,
        configurationId: tempCongfigId,
        setSimulationHandler: setSimulationConfiguration,
      });
    }
  }, [projectId, simulationId, tempCongfigId]);

  const getHelpers = () => { };
  const handleJoyrideCallback = (data) => {
    const { action, index, status, type } = data;
    if ([STATUS.FINISHED, STATUS.SKIPPED].includes(status)) {
      // Need to set our running state to false, so we can restart if we click start again.
      setEndTour();
    }
  };
  const handleTestClick = () => {
    toggleHeader(!isHeaderCollapsed)
  }
  return (
    <div className={isHeaderCollapsed ? classes.root : classes.rootCollapse}>
      <Joyride
        run={isTourRunning}
        steps={step}
        continuous={true}
        scrollToFirstStep={true}
        showProgress={true}
        showSkipButton={true}
        callback={handleJoyrideCallback}
        styles={{
          options: {
            arrowColor: "#e3ffeb",
            backgroundColor: "#e3ffeb",
            overlayColor: "rgba(79, 26, 0, 0.4)",
            primaryColor: "#000",
            textColor: "#004a14",
            width: 400,
            zIndex: 1000,
          },
        }}
      />
      <AntTabs
        value={activeTab}
        onChange={handleChange}
        aria-label="ant example"
        style={{ position: "relative" }}
      >
        <AntTab label="Configuration" id="parameters_tab" />
        <AntTab label="Simulation" id="simulation_tab" />
        <AntTab label="Analysis" id="analysis_tab" />
        {
          isHistoryTab ? (
            <AntTab label="History" id="history_tab"/>
           ) : null
        } 
        {/* <HeaderCollapsableButton /> */}
      </AntTabs>
      <TabPanel value={activeTab} index={0} isHeaderCollapsed={isHeaderCollapsed}>
        {/* Added setAnalysisSheetTab={setAnalysisTab} for resetting plotAnalysi 
        during clonning 
        
        */}
        <Parameters socket={socket} setAnalysisSheetTab={setAnalysisTab} />
      </TabPanel>
      <TabPanel value={activeTab} index={1} isHeaderCollapsed={isHeaderCollapsed}>
        {/* <ReflexControlsDemo /> */}
        <Simulation socket={socket} saveCzmlData={saveCzmlData} />


      </TabPanel>
      <TabPanel value={activeTab} index={2} isHeaderCollapsed={isHeaderCollapsed}>
        <PostAnalysis
          props={props}
          analysisSheetinfo={analysisTab}
          setAnalysisSheetTab={setAnalysisTab}
        />
      </TabPanel>
      {
        isHistoryTab ? (
          <TabPanel value={activeTab} index={3} isHeaderCollapsed={isHeaderCollapsed}>
            <Split socket={socket} saveCzmlData={saveCzmlData} projectId={simulate.getIn(["project", "id"])} caseId={simulate.getIn(["case", "id"])} email={userinfo.email}/>
          </TabPanel>
        ) : null
      }
    </div>
  );
};

const mapStateToProps = (state) => ({
  simulate: state.simulate,
  userinfo: state.firebase.auth,
  activeTab: state.simulate.get("activeTab"),
  // isParameter: state.simulate.get("activeTab") === "p",
  socket: state.simulate.get("socket"),
  isTourRunning: state.TourReducer.isTourRunning,
  projectId: state.simulate.getIn(["project", "id"]),
  simulationId: state.simulate.getIn(["case", "id"]),
  tempCongfigId: state.simulate.getIn(["case", "tempId"]),
  isHeaderCollapsed: state.settings.isHeaderCollapsed
});

const mapDispatchToProps = {
  saveCzmlData,
  changeTab,
  setEndTour,
  setRunSimulationConfigList,
  setLoadingOfRunConfiguration,
  clearRunSimulationConfigList,
  setAnalysisCollection,
  addNewAnalysisCollection,
  removeAnalysisCollection,
  modifyAnalysisCollection,
  resetAnalysisCollection,
  setSimulationConfiguration,
  resetGroundStationList,
  setGroundStationList,
  toggleHeader,
  loadRunData,
  setIsLoading
};

export default connect(mapStateToProps, mapDispatchToProps)(Simulate);
