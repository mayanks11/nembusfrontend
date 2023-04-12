import React from "react";
import { connect } from "react-redux";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import SimulateService from "../../../api/Simulate";
import { NotificationManager } from "react-notifications";
import {
  setNewConfigObject,
  saveSimulation,
  saveSimulationCompleted,
  setIsLoading
} from "../../../actions/Simulate";
import RctSectionLoader from "Components/RctSectionLoader/RctSectionLoader";

function DeleteConfigDialog(props) {
  const {
    isDialogOpened,
    handleCloseDialog,
    configObj,
    simulate,
    setIsLoading
  } = props;
  // const [isLoading, setIsLoading] = React.useState(false);

  const handleClose = () => {
    //setOpen(false);
    handleCloseDialog(false);
  };
  const handleSubmit = async () => {
    setIsLoading(true);
    const projectId = simulate.getIn(["project", "id"]);
    const caseId = simulate.getIn(["case", "id"]);
    if (configObj) {
      const result = await SimulateService.deleteRunConfiguration(
        projectId,
        caseId,
        configObj.id
      );
      setIsLoading(false);
      handleCloseDialog(false);
    }
  };

  return (
    <div>
      <Dialog
        open={isDialogOpened}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        {/* {isLoading && <RctSectionLoader />} */}
        {/* <DialogTitle id="alert-dialog-title">
          {"Use Google's location service?"}
        </DialogTitle> */}
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
          Are You Sure To Delete?
          </DialogContentText>
        </DialogContent>
        <DialogActions className="d-flex flex-end justify-content-end align-items-center">
          <Button
            onClick={handleSubmit}
            color="primary"
            variant="contained"
            className="mt-3 mb-3"
          >
            Yes
          </Button>
          <Button
            onClick={handleClose}
            // color="secondary"
            variant="contained"
            className="mt-3 mb-3 btn btn-danger"
          >
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

const stateProp = (state) => ({
  simulate: state.simulate,
  isPageLoading: state.simulate.get("isPageLoading"),
});

const dispatchProps = {
  saveSimulation,
  saveSimulationCompleted,
  setNewConfigObject,
  setIsLoading,
};

export default connect(stateProp, dispatchProps)(DeleteConfigDialog);
