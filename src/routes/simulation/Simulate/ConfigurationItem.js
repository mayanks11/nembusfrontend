import React from "react";
import { connect } from "react-redux";
import { Button, MenuItem, Tooltip, Typography } from "@material-ui/core";
import EditIcon from "@material-ui/icons/Edit";
import DeleteIcon from "@material-ui/icons/Delete";
import GetAppIcon from "@material-ui/icons/GetApp";
import CloneConfigDialog from "./CloneConfigDialog.js";
import EditConfigDialog from "./EditConfigDialog.js";
import DeleteConfigDialog from "./DeleteConfigDialog.js";
import {
  saveSimulation,
  saveSimulationCompleted,
  setSimulationActiveConfig,
  setSelectSimulationConfig,
} from "../../../actions/Simulate";
import SimulateService from "../../../api/Simulate";
import { NotificationManager } from "react-notifications";
import CircularProgress from "@material-ui/core/CircularProgress";
import RctPageLoader from "Components/RctPageLoader/RctPageLoader.js";
import RctSectionLoader from "Components/RctSectionLoader/RctSectionLoader.js";
import DownloadConfigDialog from "./DownloadConfigDialog.js";
import SimulationService from "Api/Simulate";

const ConfigurationItem = (props) => {
  const { configObj, simulate,shareSimulationFlag, names } = props;
  const [isCloneModalOpen, setIsCloneModalOpen] = React.useState(false);
  const [isEditOpen, setIsEditOpen] = React.useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = React.useState(false);
  const [isDownloadOpen, setIsDownloadOpen] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [simData, setSimData] = React.useState({
    simulation_name: simulate.getIn(["case", "SimulationName"]),
    simulation_description: simulate.getIn(["case", "SimulationDescription"]),
    simulationStartDate: simulate.getIn(["case", "StartDate"]),
    simulationEndDate: simulate.getIn(["case", "EndDate"]),
  });
  const projectId = simulate.getIn(["project", "id"]);
  const caseId = simulate.getIn(["case", "id"]);
  const [trigger, setTrigger] = React.useState(true);
  

  const handleCloneModalOpen = () => {
    setIsCloneModalOpen(true);
  };

  const handleEditOpen = () => {
    setIsEditOpen(!isEditOpen);
  };
  const handleDeleteOpen = () => {
    setIsDeleteOpen(!isDeleteOpen);
  };
  const handleOnLoadConfig = async () => {
    setIsDownloadOpen(!isDownloadOpen);
  };
  return (
    // <Tooltip title={new Date(configObj.createdAt).toLocaleString()}>
    <React.Fragment>
      {isLoading && <RctSectionLoader />}
      <div className="d-flex flex-row justify-content-between align-items-center p-2">
        <Typography style={{ fontSize: "12px" }}>{configObj.name}</Typography>
        <Typography style={{ fontSize: "12px" }}>
          {new Date(configObj.createdAt).toLocaleString()}
        </Typography>
        <div className="d-flex flex-row justify-content-between align-items-center">
          <Button
            variant="outlined"
            size="small"
            color="primary"
            onClick={() => handleCloneModalOpen()}
          >
            Clone
          </Button>
          {/* <EditIcon onClick={() => handleEditOpen()} />
         {!(shareSimulationFlag) && <DeleteIcon onClick={() => handleDeleteOpen()} /> }  */}
          <GetAppIcon onClick={() => handleOnLoadConfig()} />
        </div>
      </div>
      <CloneConfigDialog
        isDialogOpened={isCloneModalOpen}
        handleCloseDialog={() => setIsCloneModalOpen(false)}
        configObj={configObj}
        projectId={projectId}
        caseId={caseId}
        simData={simData}
        names={names}
        setAnalysisSheetTab={props.setAnalysisSheetTab}
        shareSimulationFlag={shareSimulationFlag}
      />
      {/* <EditConfigDialog
        isDialogOpened={isEditOpen}
        handleCloseDialog={() => setIsEditOpen(false)}
        configObj={configObj}
        // save={props.save}
      />
      <DeleteConfigDialog
        isDialogOpened={isDeleteOpen}
        handleCloseDialog={() => setIsDeleteOpen(false)}
        configObj={configObj}
      /> */}
      <DownloadConfigDialog
        isDialogOpened={isDownloadOpen}
        handleCloseDialog={() => setIsDownloadOpen(false)}
        configObj={configObj}
      />
    </React.Fragment>
  );
};
const stateProp = (state) => ({
  simulate: state.simulate,
  SimulationConfigList: state.simulate.get("simulationConfigList"),
  selectedSimulationConfig: state.simulate.get("selectedSimulationConfig"),
  saveSimulationState: state.simulate.get("simulate.save"),
});

const dispatchProps = {
  setSelectSimulationConfig,
  saveSimulation,
  saveSimulationCompleted,
};

export default connect(stateProp, dispatchProps)(ConfigurationItem);
