import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  TextField,
  Button,
  Divider,
} from "@material-ui/core";
import { connect } from "react-redux";
import { NotificationManager } from "react-notifications";
import RctSectionLoader from "Components/RctSectionLoader/RctSectionLoader";
import ConfigurationItem from "../Simulate/ConfigurationItem";
import SimulationService from "Api/Simulate";
import { setSelectSimulationConfig } from "Actions/Simulate";
import { setRunSimulationConfigList } from "Actions/Simulate";
import CloneConfigItem from "./CloneConfigItem";
import CloseIcon from "@material-ui/icons/Close";
import { makeStyles } from "@material-ui/core/styles";

import SimulateService from "../../../api/Simulate";

const useStyles = makeStyles((theme) => ({
  closeIcon: {
    color: "#677080",
    cursor: "pointer",
    fontWeight:500,
    "&:hover": {
      backgroundColor: "#d10003",
      borderRadius:"5px",
      color: "#ffffff",
      fontWeight:200,
    },
  },
}));

const CloneSimulationDialog = (props) => {
  const {
    handleCloseDialog,
    rowData,
    handleTrigger,
    simulate,
    userinfo,
    simulationRunConfigList,
  } = props;

  const [maxWidth] = useState("sm");
  const [data, setData] = useState({});
  const [openDialog, setOpenDialog] = useState(false);
  const [options, setOptions] = useState([]);

  //   const [dataIsUpdated, setDataIsUpdated] = useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [name, setName] = useState(null);

  useEffect(() => {
    if (rowData.isCloneOpen) {
      setData(rowData.selectedData);
    }
    setOpenDialog(rowData.isCloneOpen);
    const setConfigurations = async () => {
      let configurations = [];
      if (rowData.selectedData.mission_id) {
        setIsLoading(true);
        const names = await SimulateService.getSimulationNames(rowData.selectedData.mission_id,rowData.selectedData.simulation_id);
        await SimulationService.getRunConfigurationSnapshot(
          rowData.selectedData.mission_id,
          rowData.selectedData.simulation_id,
          (snapshot) => {
            snapshot.forEach((s) => {
              configurations.push({
                id: s.id,
                ...s.data(),
              });
            });
            setOptions(configurations);
            setName(names);
            setIsLoading(false);
          }
        );
      }
    };
    const fetchData = async () =>{
        setIsLoading(true);
        const email = userinfo.email;
        const gitGraph = await SimulateService.getGitGraph(rowData.selectedData.mission_id,rowData.selectedData.simulation_id,email);
        const names = await SimulateService.getSimulationNames(rowData.selectedData.mission_id,rowData.selectedData.simulation_id);
        const filteredData = gitGraph.gitGraph.filter(item => {
          return item.nodetype === "Run";
        });
        setOptions(filteredData);
        setName(names);
        setIsLoading(false);
        console.log("Ndata", filteredData, rowData.selectedData.mission_id, rowData.selectedData.simulation_id);
    }
    const getData = async () =>{
      const data = await SimulateService.checkOldGitData(rowData.selectedData.mission_id,rowData.selectedData.simulation_id);
      console.log("NN", rowData.selectedData.mission_id, rowData.selectedData.simulation_id)
      if(data.data.GitGraphVersion !== undefined){
        fetchData();
      }
      else{
        setConfigurations();
      }
    }
    getData();
  }, [rowData.isCloneOpen]);

  const handleClose = () => {
    handleCloseDialog();
  };
  useEffect(() => {}, [data]);
  const classes = useStyles();
  return (
    <div>
      <React.Fragment>
        <Dialog
          fullWidth={true}
          maxWidth={maxWidth}
          open={openDialog}
          onClose={handleClose}
          aria-labelledby="max-width-dialog-title"
          disableBackdropClick
        >
          {isLoading && <RctSectionLoader />}

          <DialogTitle id="max-width-dialog-title">
            <div className="d-flex flex-row justify-content-between">
              <div></div>
              <h3>Run Configuration Details</h3>
              <CloseIcon onClick={handleClose} className={classes.closeIcon} />
            </div>
          </DialogTitle>
          <DialogContent>
            {options.length > 0 ? (
              options.map((config) => (
                <React.Fragment key={config.createdAt}>
                  <CloneConfigItem
                    configObj={config}
                    simData={rowData.selectedData}
                    names={name}
                  />

                  {/* <ConfigurationItem configObj={config} /> */}

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
          </DialogContent>
          <DialogActions>
            <Button
              onClick={handleClose}
              variant="contained"
              className="m-3 btn btn-danger"
              autoFocus
            >
              Cancel
            </Button>
          </DialogActions>
        </Dialog>
      </React.Fragment>
    </div>
  );
};

const stateProp = (state) => ({
  SimulationRunconfiguration: state.SimulationRunconfiguration,
  simulationRunConfigList: state.simulate.get("simulationRunConfigList"),
  simulate: state.simulate,
  userinfo: state.firebase.auth,
});

const dispatchProps = {
  setSelectSimulationConfig,
  setRunSimulationConfigList,
};

// const forwaredInput = forwardRef(ToolBar)
export default connect(stateProp, dispatchProps)(CloneSimulationDialog);
