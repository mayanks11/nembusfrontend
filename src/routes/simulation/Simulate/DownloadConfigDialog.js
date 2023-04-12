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
  setSelectSimulationConfig,
  setIsLoading,
} from "../../../actions/Simulate";
import RctSectionLoader from "Components/RctSectionLoader/RctSectionLoader";

function DownloadConfigDialog(props) {
  const {
    isDialogOpened,
    handleCloseDialog,
    configObj,
    simulate,
    userinfo,
    isPageLoading,
    setIsLoading,
  } = props;
  //   const [isLoading, setIsLoading] = React.useState(false);

  const handleClose = () => {
    //setOpen(false);
    handleCloseDialog(false);
  };
  const handleSubmit = async () => {
    setIsLoading(true);
    handleCloseDialog(false);

    const projectId = simulate.getIn(["project", "id"]);
    const caseId = simulate.getIn(["case", "id"]);

    const configurationId = simulate.getIn(["case", "tempId"]);

    const tempConfigList = simulate.getIn(["case","tempConfigList"]);

    const email = userinfo.email;

    if (configObj) {
      const result2 = await SimulateService.updateTempConfigParameters(
        projectId,
        caseId,
        configurationId,
        configObj.parameters,
        configObj.runid,
        configObj.name,
        email,
        configObj.simRate?configObj.simRate:{value:60000,unit:'milli seconds'},
        configObj
      );

      console.log("parent finding", configObj);

      if (result2) {
       
        props.setSelectSimulationConfig(result2);
        setIsLoading(false);
        NotificationManager.success(
          `Loaded Temp with  ${configObj.name} configuration`
        );
      } else {
        setIsLoading(false);
        NotificationManager.error("Could not load configuration");
      }
    }

    // const projectId = simulate.getIn(["project", "id"]);
    // const caseId = simulate.getIn(["case", "id"]);
    // if (configObj) {
    //   const result = await SimulateService.deleteRunConfiguration(
    //     projectId,
    //     caseId,
    //     configObj.id
    //   );
    // }
  };

  return (
    <div>
      <Dialog
        open={isDialogOpened}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        {/* {isPageLoading && <RctSectionLoader />} */}
        {/* <DialogTitle id="alert-dialog-title">
          {"Use Google's location service?"}
        </DialogTitle> */}
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure to loose current configuration data?
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
  userinfo: state.firebase.auth,
  isPageLoading: state.simulate.get("isPageLoading"),
});

const dispatchProps = {
  saveSimulation,
  saveSimulationCompleted,
  setNewConfigObject,
  setSelectSimulationConfig,
  setIsLoading,
};

export default connect(stateProp, dispatchProps)(DownloadConfigDialog);
