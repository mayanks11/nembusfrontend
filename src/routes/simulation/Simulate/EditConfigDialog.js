import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import ReactDOM from "react-dom";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Grid,
  TextareaAutosize,
  InputLabel,
  TextField,
  Button,
  CircularProgress,
} from "@material-ui/core";
import { useFormik } from "formik";
import * as yup from "yup";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import {
  setNewConfigObject,
  saveSimulation,
  saveSimulationCompleted,
  setIsLoading
} from "../../../actions/Simulate";
import SimulateService from "../../../api/Simulate";
import { NotificationManager } from "react-notifications";
import RctSectionLoader from "Components/RctSectionLoader/RctSectionLoader";
// import TextareaAutosize from '@material-ui/core/TextareaAutosize';

const validationSchema = yup.object({
  configName: yup.string()
  .trim()
  .required("Config Name is required"),
  // configDescription: yup
  //   .string("Enter your config description")
  //   .min(8, "configDescription should be of minimum 8 characters length")
  //   .required("configDescription is required"),
});

const useStyles = makeStyles((theme) => ({
  saveProgress: {
    position: "relative",
    top: 0,
    left: -29,
    zIndex: 7,
  },
}));

function EditConfigDialog(props) {
  const {
    isDialogOpened,
    handleCloseDialog,
    setNewConfigObject,
    simulate,
    configObj,
    setIsLoading
  } = props;
  useEffect(() => {
    handleClickOpen();
  }, []);
  const styles = useStyles();

  //const [open, setOpen] = React.useState(false);
  const [fullWidth, setFullWidth] = React.useState(true);
  const [maxWidth] = React.useState("sm");
  const inputLabel = React.useRef(null);
  // const [isLoading, setIsLoading] = React.useState(false);
  

  const handleClickOpen = () => {
    //setOpen(true);
    //setTimeout(() => setOpen(false), 16000);
  };

  const handleClose = () => {
    //setOpen(false);
    handleCloseDialog(false);
  };

  /* const handleMaxWidthChange = event => {
    setMaxWidth(event.target.value);
  }; */

  const handleFullWidthChange = (event) => {
    setFullWidth(event.target.checked);
  };
  const formik = useFormik({
    initialValues: {
      configName: configObj ? (configObj.name?configObj.name : " "):" ",
      configDescription: configObj
        ? (configObj.description?configObj.description: " "):" "
        
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      setIsLoading(true);
      const projectId = simulate.getIn(["project", "id"]);
      const caseId = simulate.getIn(["case", "id"]);
      const { configName, configDescription } = values;
      // const configurationId = simulate.getIn(["case", "tempId"]);

      // const result = await SimulateService.getConfigurationDetails(
      //   projectId,  ${configObj.name}
      //   caseId,
      //   configObj.id
      // );
      console.log("resultttttttggggggg", configObj);
      // if (configObj) {
        const result2 = await SimulateService.updateRunConfigurationDetails(
          projectId,
          caseId,
          configObj.id,
          configName,
          configDescription
        );

        if (result2) {
         
          NotificationManager.success(
            `Succesfully updated configuration details`
          );
          setIsLoading(false);
        } else {
          NotificationManager.error(`Could not update configuration`);
          setIsLoading(false)
        }
      // }
      // else{
      //   NotificationManager.error(`Could not update configuration`);
      // }

      handleCloseDialog(false);
    },
  });

  return (
    <React.Fragment>
            <Dialog
        fullWidth={fullWidth}
        maxWidth={maxWidth}
        open={isDialogOpened}
        onClose={handleClose}
        aria-labelledby="max-width-dialog-title"
      >
        {/* {isLoading && <RctSectionLoader />} */}

        <DialogTitle id="max-width-dialog-title">
          Update Config Details
        </DialogTitle>
        <DialogContent>
          <form onSubmit={formik.handleSubmit} autoComplete="off">
            <Grid container spacing={3}>
              <Grid item xs={6} className="mt-3 mb-3">
                <TextField
                  fullWidth
                  id="configName"
                  name="configName"
                  label="Config Name"
                  variant="outlined"
                  value={formik.values.configName}
                  onChange={formik.handleChange}
                  error={
                    formik.touched.configName &&
                    Boolean(formik.errors.configName)
                  }
                  helperText={
                    formik.touched.configName && formik.errors.configName
                  }
                />
              </Grid>
              <Grid item xs={6} className="mt-3 mb-3">
                {/* <InputLabel
                  style={{ fontSize: "12px" }}
                  //   className={classes.inputLabel}
                  ref={inputLabel}
                  id="demo-simple-select-outlined-label"
                >
                  Loaded config
                </InputLabel> */}
                {/* <TextareaAutosize aria-label="minimum height" minRows={3} placeholder="Enter Description" />; */}

                <TextField
                  placeholder="Config Description"
                  id="configDescription"
                  name="configDescription"
                  label="Config Description"
                  variant="outlined"
                  value={formik.values.configDescription}
                  onChange={formik.handleChange}
                  error={
                    formik.touched.configDescription &&
                    Boolean(formik.errors.configDescription)
                  }
                  helperText={
                    formik.touched.configDescription &&
                    formik.errors.configDescription
                  }
                />
                {/* <TextField
                  fullWidth
                  id="configDescription"
                  name="configDescription"
                  label="configDescription"
                  value={formik.values.configDescription}
                  onChange={formik.handleChange}
                  error={
                    formik.touched.configDescription &&
                    Boolean(formik.errors.configDescription)
                  }
                  helperText={
                    formik.touched.configDescription &&
                    formik.errors.configDescription
                  }
                />{" "} */}
              </Grid>
            </Grid>
            <div className="d-flex flex-end justify-content-end align-items-center">
            {configObj &&<Button
              color="primary"
              variant="contained"
              className="mt-3 mb-3"
              type="submit"
            >
              Update
              {props.saveSimulationState && (
                <CircularProgress size={35} className={styles.saveProgress} />
              )}
            </Button>
            }
            
            <Button
              onClick={handleClose}
              variant="contained"
              className="m-3 btn btn-danger"
              // color="secondary"
              autoFocus
            >
              Cancel
            </Button>
            </div> 
          </form>
        </DialogContent>
        <DialogActions></DialogActions>
      </Dialog>
    </React.Fragment>
  );
}
const stateProp = (state) => ({
  newConfigObject: state.simulate.get("newConfigObject"),
  saveSimulationState: state.simulate.get("simulate.save"),
  simulate: state.simulate,
  isPageLoading: state.simulate.get("isPageLoading"),
});

const dispatchProps = {
  saveSimulation,
  saveSimulationCompleted,
  setNewConfigObject,
  setIsLoading,
};

// const forwaredInput = forwardRef(ToolBar)
export default connect(stateProp, dispatchProps)(EditConfigDialog);
