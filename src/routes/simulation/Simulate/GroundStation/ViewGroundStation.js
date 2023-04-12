import React from "react";
import { connect } from "react-redux";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import MuiDialogTitle from "@material-ui/core/DialogTitle";
import IconButton from "@material-ui/core/IconButton";
// import DeleteIcon from "@material-ui/icons/Build";
import Tooltip from "@material-ui/core/Tooltip";
import { withStyles } from "@material-ui/core/styles";
import CloseIcon from "@material-ui/icons/Close";
import Typography from "@material-ui/core/Typography";
// import InfoOutlinedIcon from "@material-ui/icons/InfoOutline";
// import Grid from "@material-ui/core/Grid";
// import TextField from "@material-ui/core/TextField";
// import GroundStation from "./GroundStation.js";
// import ChevronRightIcon from "@material-ui/icons/ChevronRight";
// import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import GroundStationview from "./GroundstationDisplayTabel";
import VisibilityIcon from '@material-ui/icons/Visibility';

const styles = (theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(2),
  },
  closeButton: {
    position: "absolute",
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
  },
});

const DialogTitle = withStyles(styles)((props) => {
  const { children, classes, onClose, ...other } = props;
  return (
    <MuiDialogTitle disableTypography className={classes.root} {...other}>
      <Typography variant="h5" align="center">
        {children}
      </Typography>
      {onClose ? (
        <IconButton
          aria-label="close"
          className={classes.closeButton}
          onClick={onClose}
        >
          <CloseIcon />
        </IconButton>
      ) : null}
    </MuiDialogTitle>
  );
});

function ViewGroundStation(props) {
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = (scrollType) => () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  const descriptionElementRef = React.useRef(null);
  React.useEffect(() => {
    if (open) {
      const { current: descriptionElement } = descriptionElementRef;
      if (descriptionElement !== null) {
        descriptionElement.focus("background-color", "#FF0000");
      }
    }
  }, [open]);

  const handleChange = (event) => {
    const updatedblockName = event.target.value.trim();
  };

  const handleUpdate = () => {
    setOpen(false);
  };

  return (
    <div>
      <Tooltip title="View Ground Station">
        <div
          className="d-flex justify-content-center align-items-center"
          onClick={handleClickOpen("paper")}
        >
          {/* <IconButton size="small"> */}
            <VisibilityIcon width={24} fill="#fa2" />
          {/* </IconButton> */}
          <Typography variant="body1" className=" ml-2">View Ground Station</Typography>
        </div>
      </Tooltip>
      <Dialog
        fullWidth={true}
        maxWidth="md"
        open={open}
        onClose={handleClose}
        scroll={"paper"}
        aria-labelledby="scroll-dialog-title"
        aria-describedby="scroll-dialog-description"
      >
        <DialogTitle id="scroll-dialog-title" onClose={handleClose}>
          Ground Station Details
        </DialogTitle>
        <DialogContent dividers="paper">
          <DialogContentText
            id="scroll-dialog-description"
            ref={descriptionElementRef}
            tabIndex={-1}
          >
            View the List of Ground Stations , Click edit,delete icons inorder
            to update,delete records respectively.
          </DialogContentText>
          <GroundStationview />
        </DialogContent>
      </Dialog>
    </div>
  );
}

const stateProp = (state) => ({
  SimulationConfigReducer: state.SimulationConfigReducer,
});

const dispatchProps = {};

export default connect(stateProp, dispatchProps)(ViewGroundStation);
