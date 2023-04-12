import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  TextField,
  Button,
} from "@material-ui/core";
import { useFormik } from "formik";
import * as yup from "yup";
import SimulateService from "../../../api/Simulate";
import { NotificationManager } from "react-notifications";
import RctSectionLoader from "Components/RctSectionLoader/RctSectionLoader";

const validationSchema = yup.object({
  simulationName: yup
    .string()
    .trim()
    .required("Simulation Name is required"),
});

function EditSimulationDialog(props) {
  const { handleCloseDialog, rowData, handleTrigger } = props;

  const [maxWidth] = useState("sm");
  const [data, setData] = useState({});
  const [openDialog, setOpenDialog] = useState(false);

  useEffect(() => {
    if (rowData.isEditOpen) {
      setData(rowData.selectedData);
    }
    setOpenDialog(rowData.isEditOpen);
  }, [rowData.isEditOpen]);

  const [isLoading, setIsLoading] = React.useState(false);

  const handleClose = () => {
    handleCloseDialog();
  };

  const formik = useFormik({
    initialValues: {
      simulationName: data.simulation_name,
      simulationDescription: data.simulation_description,
    },
    validationSchema: validationSchema,
    enableReinitialize: true,
    onSubmit: async (values, { resetForm }) => {
      setIsLoading(true);

      const { simulationName, simulationDescription } = values;
      const { mission_id, simulation_id } = rowData.selectedData;

      const simulationsList = await SimulateService.getAllCasesForProject(
        mission_id
      );

      const simulationsList1 = simulationsList.filter(function(obj) {
        return obj.id !== simulation_id;
      });

      const simulationExists = simulationsList1.find(
        (c) =>
          c.SimulationName.trim().toLowerCase() ===
          simulationName.trim().toLowerCase()
      );

      if (simulationExists) {
        setIsLoading(false);
        NotificationManager.error(
          "Case Name Already Exists! Retry with Other Name"
        );
        resetForm();
      } else {
        const result2 = await SimulateService.updateSimulationDetails(
          mission_id,
          simulation_id,
          simulationName,
          simulationDescription
        );

        if (result2) {
          setIsLoading(false);
          NotificationManager.success(`Succesfully updated Simulation details`);
          resetForm();
          handleTrigger();
          handleClose();
        } else {
          NotificationManager.error(`Could not update, please try again`);
          setIsLoading(false);
          resetForm();
          handleTrigger();
          handleClose();
        }
      }
    },
  });
  const handleReset = (resetForm) => {
    resetForm();
    handleCloseDialog();
  };

  return (
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
          Update Config Details
        </DialogTitle>
        <DialogContent>
          <form
            onSubmit={formik.handleSubmit}
            //  onReset={formik.handleReset}
            autoComplete="off"
          >
            <Grid container spacing={3}>
              <Grid item xs={6} className="mt-3 mb-3">
                <TextField
                  fullWidth={true}
                  id="simulationName"
                  name="simulationName"
                  label="Simulation Name"
                  variant="outlined"
                  value={formik.values.simulationName}
                  onChange={formik.handleChange}
                  error={
                    formik.touched.simulationName &&
                    Boolean(formik.errors.simulationName)
                  }
                  helperText={
                    formik.touched.simulationName &&
                    formik.errors.simulationName
                  }
                />
              </Grid>
              <Grid item xs={6} className="mt-3 mb-3">
                <TextField
                  placeholder="Simulation Description"
                  id="simulationDescription"
                  name="simulationDescription"
                  label="Simulation Description"
                  variant="outlined"
                  value={formik.values.simulationDescription}
                  onChange={formik.handleChange}
                  error={
                    formik.touched.simulationDescription &&
                    Boolean(formik.errors.simulationDescription)
                  }
                  helperText={
                    formik.touched.simulationDescription &&
                    formik.errors.simulationDescription
                  }
                />
              </Grid>
            </Grid>
            <div className="d-flex flex-end justify-content-end align-items-center">
              <Button
                variant="contained"
                className="mt-3 mb-3 btn btn-primary"
                type="submit"
              >
                Update
              </Button>
              <Button
                onClick={handleReset.bind(null, formik.resetForm)}
                variant="contained"
                className="m-3 btn btn-danger"
                autoFocus
              >
                Cancel
              </Button>
            </div>
          </form>
        </DialogContent>
        <DialogActions>
        
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}
export default EditSimulationDialog;
