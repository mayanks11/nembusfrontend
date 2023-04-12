import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { makeStyles } from "@material-ui/core/styles";
import Popover from "@material-ui/core/Popover";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import {
  saveSimulation,
  saveSimulationCompleted,
  setSimulationActiveConfig,
  setSelectSimulationConfig,
} from "../../../actions/Simulate";
import ArrowDropDownIcon from "@material-ui/icons/ArrowDropDown";
import Paper from "@material-ui/core/Paper";
import InputBase from "@material-ui/core/InputBase";
import IconButton from "@material-ui/core/IconButton";
import SearchIcon from "@material-ui/icons/Search";
import Divider from "@material-ui/core/Divider";
import ConfigurationItem from "./ConfigurationItem";
import SearchBar from "material-ui-search-bar";

import SimulateService from "../../../api/Simulate";

const useStyles = makeStyles((theme) => ({
  typography: {
    padding: theme.spacing(2),
  },
  input: {
    marginLeft: theme.spacing(1),
    flex: 1,
  },
  iconButton: {
    padding: 10,
  },
  paper: {
    padding: "2px",
    display: "flex",
    alignItems: "center",
    // width: 200,
    // margin:"auto"
  },
}));

function ConfigurationDropdownPopper(props) {
  // const { options, selected, saveSimulation, saveSimulationCompleted } = props;
  const {shareSimulationFlag} = props;
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = useState(null);
  const [filteredOptions, setFilteredOptions] = useState([]);

  const [openOfPopper, setOpenofPoper] = useState(false);

  const [options, setOptions] = useState([]);
  const [searchtext, setsearchtext] = useState("");
  const names = {
    simulationName: props.simulate.getIn(["case", "SimulationName"]),
    projectName: props.simulate.getIn(["project", "ProjectName"])
  }

  useEffect(() => {
    if (!props.SimulationRunconfiguration.isLoading && props.simulate.getIn(["case", "GitGraphVersion"]) === undefined) {
      setOptions(props.SimulationRunconfiguration.simulationRunConfigList);
    }
  }, [props.SimulationRunconfiguration.isLoading]);

  useEffect(()=>{
    const fetchData = async () => {
      const { simulate, userinfo } = props;
        const projectId = simulate.getIn(["project", "id"]);
        const CaseId = simulate.getIn(["case", "id"]);
        const email = userinfo.email;
        const gitGraph = await SimulateService.getGitGraph(projectId,CaseId,email);
        const filteredData = gitGraph.gitGraph.filter(item => {
          return item.nodetype === "Run";
        });
        // setOptions(props.SimulationRunconfiguration.simulationRunConfigList);
        setOptions(filteredData);
    }
    if(props.simulate.getIn(["case", "GitGraphVersion"])){
      fetchData();
    }
  },[]);

  useEffect(() => {
    const fetchData = async () =>{
      if (openOfPopper) {
        const { simulate, userinfo } = props;
        const projectId = simulate.getIn(["project", "id"]);
        const CaseId = simulate.getIn(["case", "id"]);
        const email = userinfo.email;
        const gitGraph = await SimulateService.getGitGraph(projectId,CaseId,email);
        const filteredData = gitGraph.gitGraph.filter(item => {
          return item.nodetype === "Run";
        });
        // setOptions(props.SimulationRunconfiguration.simulationRunConfigList);
        setOptions(filteredData);
      }
    }
    if(props.simulate.getIn(["case", "GitGraphVersion"])){
      fetchData();
    }
    else{
      setOptions(props.SimulationRunconfiguration.simulationRunConfigList);
    }
  }, [openOfPopper]);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
    setOpenofPoper(true);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setFilteredOptions(options);
    setOpenofPoper(false);
  };

  useEffect(() => {
    setFilteredOptions(options);
  }, [options]);

  const handleSearchInputChange = (query) => {
    let filteredData = options.filter((ele) => ele.name.includes(query));
    setFilteredOptions(filteredData);
  };

  const resetFilter = () => {
    setFilteredOptions(options);
  };

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  // if(props.SimulationRunconfiguration.isLoading){
  //   return(<div>Loading</div>)
  // }else{
  //   return(<div>Naushad</div>)
  // }

  return (
    <div>
      <Button
        // onClick={handleClick("bottom-start")}
        aria-describedby={id}
        variant="contained"
        color="primary"
        size="small"
        onClick={handleClick}
        className="d-flex text-white p"
      >
         Executed Simulations
        <ArrowDropDownIcon className="ml-1" />
      </Button>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
      >
        <div
          style={{
            maxHeight: "30vh",
            minWidth: "350px",
            padding: "8px",
            textAlign: "center",
          }}
        >
          <SearchBar
            value={searchtext}
            onChange={(newValue) => {
              setsearchtext(newValue);
              handleSearchInputChange(newValue);
            }}
            onRequestSearch={() => {
              handleSearchInputChange(searchtext);
            }}
            onCancelSearch={() => {
              resetFilter();
            }}
          />

          <Divider className="mt-2 mb-2" />

          {filteredOptions.length > 0 ? (
            filteredOptions.map((config) => (
              <React.Fragment key={config.createdAt}>
                <ConfigurationItem configObj={config}
                shareSimulationFlag={shareSimulationFlag}  
                setAnalysisSheetTab={props.setAnalysisSheetTab}
                names={names}
                />

                <Divider />
              </React.Fragment>
            ))
          ) : (
            <div
              style={{
                maxHeight: "30vh",
                minWidth: "200px",
                padding: "8px",
                textAlign: "center",
              }}
            >
              <p>No Run Simulations</p>
            </div>
          )}
        </div>
      </Popover>
    </div>
  );
}
const stateProp = (state) => ({
  SimulationConfigList: state.simulate.get("simulationConfigList"),
  selectedSimulationConfig: state.simulate.get("selectedSimulationConfig"),
  saveSimulationState: state.simulate.get("simulate.save"),
  SimulationRunconfiguration: state.SimulationRunconfiguration,
  simulate: state.simulate,
  userinfo: state.firebase.auth,
});

const dispatchProps = {
  setSelectSimulationConfig,
  saveSimulation,
  saveSimulationCompleted,
};

export default connect(stateProp, dispatchProps)(ConfigurationDropdownPopper);
