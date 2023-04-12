import React, { useEffect } from "react";
import { connect } from "react-redux";
import {
  setNewConfigObject,
  saveSimulation,
  saveSimulationCompleted,
  setIsLoading,
  setSimulationRate,
} from "Actions/Simulate";
import { setSimulationConfiguration } from "Actions/SimConfigurationAction";
import Button from "@material-ui/core/Button";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  InputAdornment,
  IconButton,
  makeStyles,
  withStyles,
} from "@material-ui/core";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { useTheme } from "@material-ui/core/styles";
import SimulateService from "Api/Simulate";
import { NotificationManager } from "react-notifications";
import RctSectionLoader from "Components/RctSectionLoader/RctSectionLoader";
import { getSimulationConfig } from "Api/SimulationConfig";
const useStyles = makeStyles((theme) => ({
  simulationRateContainer: {
    padding: "1px 2px",
    display: "flex",
    flexWrap: "wrap",
    // color: "#ffffff",
  },

  simulationRate: {
    // color: "#ffffff",
    fontSize: "8px",
    // border: "1px solid #ffffff",
    // borderRadius: "16px",
  },

  cssLabel: {
    // color: "white",
    fontSize: "12px",
  },

  cssOutlinedInput: {
    "&$cssFocused $notchedOutline": {
      //   borderColor: `${theme.palette.white} !important`,
    },
  },

  cssFocused: {
    // color: "white",
  },

  notchedOutline: {
    borderWidth: "1px",
    borderRadius: "16px",
    // borderColor: "white !important",
  },
}));
const EditSimRateDialog = (props) => {
  const styles = useStyles();
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const {
    isDialogOpened,
    handleCloseDialog,
    simulate,
    setIsLoading,
    setSimulationRate,
    setSimulationConfiguration,
    SimConfiguration
  } = props;

  const projectId = simulate.getIn(["project", "id"]);
  const caseId = simulate.getIn(["case", "id"]);
  const configurationId = simulate.getIn(["case", "tempId"]);

  const [rate, setRate] = React.useState(20000);
  useEffect(() => {
    const curSimRate = SimConfiguration.simRate.value
    setRate(curSimRate);
  }, [isDialogOpened]);



  const handleClose = () => {
    handleCloseDialog();
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    let simRateObj = {
      value: rate,
      unit: "milliseconds",
    };
    setSimulationRate(simRateObj);
    getSimulationConfig({
      projectId: projectId,
      simulationId: caseId,
      configurationId:configurationId,
      setSimulationHandler:setSimulationConfiguration,
    });
    const result = await SimulateService.updateSimulationRateValue(
      projectId,
      caseId,
      configurationId,
      simRateObj
    );
    if (result) {
      NotificationManager.success(`Succesfully updated Simrate`);
      setIsLoading(false);
    } else {
      NotificationManager.error(`Could not update configuration`);
      setIsLoading(false);
    }
    handleCloseDialog(false);
  };
  const handleRateInputChange = (e) => {
    setRate(e.target.value);
  };
  return (
    <div>
      <Dialog
        fullScreen={fullScreen}
        open={isDialogOpened}
        onClose={handleCloseDialog}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogTitle id="responsive-dialog-title">
          {"Simulation Rate"}
        </DialogTitle>
        <DialogContent>
          <TextField
            id="mui-theme-provider-outlined-input"
            type="number"
            size="small"
            label="milli sec"
            value={rate}
            variant="outlined"
            onChange={handleRateInputChange}
            // disabled={true}
            className={styles.simulationRate}
            InputLabelProps={{
              classes: {
                root: styles.cssLabel,
                focused: styles.cssFocused,
              },
            }}
            InputProps={{
              classes: {
                root: styles.cssOutlinedInput,
                focused: styles.cssFocused,
                notchedOutline: styles.notchedOutline,
              },
              className: styles.simulationRate,
              inputMode: "numeric",
              inputProps: {
                min: 1,
              },
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleClose}
            color="secondary"
            variant="contained"
            className="mt-3 mb-3 btn btn-danger"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            color="primary"
            variant="contained"
            className="mt-3 mb-3"
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};
const stateProp = (state) => ({
  simulate: state.simulate,
  isPageLoading: state.simulate.get("isPageLoading"),
  SimConfiguration: state.SimConfiguration
});

const dispatchProps = {
  saveSimulationCompleted,
  setIsLoading,
  setSimulationRate,
  setSimulationConfiguration
};

// const forwaredInput = forwardRef(ToolBar)
export default connect(stateProp, dispatchProps)(EditSimRateDialog);
