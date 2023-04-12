import React,{useEffect} from "react";
import { connect } from "react-redux";
import { Button, MenuItem, Tooltip, Typography } from "@material-ui/core";
import RctSectionLoader from "Components/RctSectionLoader/RctSectionLoader.js";
import CloneConfigDialog from "../Simulate/CloneConfigDialog.js";

const CloneConfigItem = (props) => {
  const { configObj, simData, names } = props;
  const [isCloneModalOpen, setIsCloneModalOpen] = React.useState(false);
//   const [isLoading, setIsLoading] = React.useState(false);
  const handleCloneModalOpen = () => {
    setIsCloneModalOpen(true);
  };
 
  return (
    <div>
      {/* {isLoading && <RctSectionLoader />} */}
      <div className="d-flex flex-row justify-content-between align-items-center p-2">
        <Typography style={{ fontSize: "12px" }}>{configObj.name}</Typography>
        <Typography style={{ fontSize: "12px" }}>
          {new Date(configObj.createdAt).toLocaleString()}
        </Typography>
        <div className="d-flex flex-row justify-content-between align-items-start">
          <Button
            variant="outlined"
            size="small"
            color="primary"
            onClick={() => handleCloneModalOpen()}
          >
            Clone
          </Button>
        </div>
      </div>
      <CloneConfigDialog
        isDialogOpened={isCloneModalOpen}
        handleCloseDialog={() => setIsCloneModalOpen(false)}
        configObj={configObj}
        simData={simData}
        names={names}
        projectId={simData.mission_id}
        caseId={simData.simulation_id}
      />
    </div>
  );
};

export default CloneConfigItem;
