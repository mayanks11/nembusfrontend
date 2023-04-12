import React, { useEffect, useState } from "react";
import { Button, TextField } from "@material-ui/core";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import SimulateService from "../../../api/Simulate";
import { NotificationManager } from "react-notifications";
import RctSectionLoader from "Components/RctSectionLoader/RctSectionLoader";

function DeleteSimulationDialog(props) {
  const { handleCloseDialog, rowData, handleTrigger } = props;

  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState(rowData.selectedData);
  const [confirmSimulationName, setConfirmSimulationName] = useState("");

  useEffect(() => {
    if (rowData.isDeleteOpen) {
      setData(rowData.selectedData);
    }
  }, [rowData.isDeleteOpen]);

  const handleClose = () => {
    setConfirmSimulationName("");
    handleCloseDialog();
  };
  const handleSubmit = async () => {
    const { mission_id, simulation_id, simulation_name } = rowData.selectedData;

    if (confirmSimulationName === simulation_name) {
      setIsLoading(true);
      const result = await SimulateService.deleteSimulation(
        mission_id,
        simulation_id
      );

      if (result) {
        setIsLoading(false);
        NotificationManager.success(`Succesfully deleted Simulation`);
        handleTrigger();
        handleClose();
      } else {
        NotificationManager.error(`Could not delete, please try again`);
        setIsLoading(false);
        handleTrigger();
        handleClose();
      }
    } else {
      NotificationManager.error(
        `Could not delete,Enter Simulation Name to delete`
      );
      setConfirmSimulationName("");
      // setIsLoading(false);
      // handleTrigger();
      // handleClose();
    }
  };
  const handleTextChange = (e) => {
    setConfirmSimulationName(e.target.value);
  };
  return (
    <div>
      <Dialog
        open={rowData.isDeleteOpen}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        {isLoading && <RctSectionLoader />}
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are You Sure To Delete?If Sure Please type{" "}
            <b style={{fontWeight:900}}> {`${rowData.selectedData.simulation_name}`} </b> to confirm.
          </DialogContentText>
          <TextField
            fullWidth={true}
            id="simulationName"
            name="simulationName"
            label="Confirm Simulation Name"
            variant="outlined"
            value={confirmSimulationName}
            onChange={handleTextChange}
          />
        </DialogContent>
        <DialogActions className="d-flex flex-end justify-content-end align-items-center">
          <Button
            onClick={handleSubmit}
            variant="contained"
            className="mt-3 mb-3 btn btn-primary"
          >
            Yes
          </Button>
          <Button
            onClick={handleClose}
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

export default DeleteSimulationDialog;
