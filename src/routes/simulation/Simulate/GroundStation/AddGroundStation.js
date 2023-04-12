import React from "react";
import { connect } from "react-redux";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import MuiDialogTitle from "@material-ui/core/DialogTitle";
import IconButton from "@material-ui/core/IconButton";
import Tooltip from "@material-ui/core/Tooltip";
import { withStyles } from "@material-ui/core/styles";
import CloseIcon from "@material-ui/icons/Close";
import Typography from "@material-ui/core/Typography";
import * as firebase from "firebase";
import Grid from "@material-ui/core/Grid";
import GroundStation from "./GroundStation.js";
import AddCircleOutlineIcon from "@material-ui/icons/AddCircleOutline";
import { withFormik, Form, Field, useField } from "formik";
import {
  TextField,
  FormControlLabel,
  Radio,
  Select,
  MenuItem,
  InputLabel,
  FormGroup,
  Input,
  CircularProgress,
  // Backdrop 
} from "@material-ui/core";
import * as Yup from "yup";
import FormHelperText from "@material-ui/core/FormHelperText";
import FormControl from "@material-ui/core/FormControl";
import { makeStyles } from "@material-ui/core/styles";
import { NotificationManager } from "react-notifications";
import { setGroundstationAddDialogBox, addNewGroundStationItem } from "Actions/GroundStationActions";
import GooglePlacesAutocomplete from "react-google-places-autocomplete";
import { geocodeByAddress, getLatLng } from "react-google-places-autocomplete";
import axios from "axios";
import { addGroundstation } from "Api/GroundstationAPI";

import { loadRunData, setIsLoading } from '../../../../actions/RunData';

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

const useStyles = makeStyles((theme) => ({
  root: {
    "& .MuiTextField-root": {
      margin: theme.spacing(1),
      width: "25ch",
    },
  },

  items: {
    display: "block",
    margin: theme.spacing(4),
  },
  units: {
    marginLeft: "30px",
    minWidth: 250,
  },

  formControl: {
    marginLeft: theme.spacing(2),
    minWidth: 120,
  },

  formControl_value: {
    minWidth: 120,
  },
  loader_overlay: {
    position: "absolute",
    backgroundColor: 'rgba(255,255,255, 0.8)',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 99,
    alignItems: 'center',
    overflow: 'hidden',
    margin: 'auto'
  }
}));

function AddGroundStation({
  setGroundstationAddDialogBox,
  GroundstationState,
  // Props from formik
  values,
  touched,
  errors,
  isSubmitting,
  handleChange,
  resetForm,
  setFieldValue,
  handleBlur,
  handleSubmit,
  packages,
  parentStartDate,
  parentEndDate,
}) {
  const classes = useStyles();
  const handleClickOpen = () => () => {
    setGroundstationAddDialogBox(true);
  };

  const handleClose = () => {
    setGroundstationAddDialogBox(false);
    resetForm();
  };

  const descriptionElementRef = React.useRef(null);
  React.useEffect(() => {
    if (GroundstationState.isGroundstationAddFormOpen) {
      const { current: descriptionElement } = descriptionElementRef;
      if (descriptionElement !== null) {
        descriptionElement.focus("background-color", "#FF0000");
      }
    }
  }, [GroundstationState.isGroundstationAddFormOpen]);

  const [address, setAddress] = React.useState(null);
  const [trigger, setTrigger] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);

  React.useEffect(() => {
    const func = async () => {
      try {
        setIsLoading(true);
        const addressLabel = address.label;
        const results = await geocodeByAddress(addressLabel);
        const latLongObj = await getLatLng(results[0]);
        const { lat, lng } = latLongObj;
        const getElevationData = firebase
          .app()
          .functions("us-central1")
          .httpsCallable("getElevationData");
        let elevationObj = await getElevationData({
          lat: lat,
          lng: lng,
        });

        if (elevationObj) {
          values.groundstationname = addressLabel;
          values.latitude.value = lat;
          values.longitude.value = lng;
          values.latitude.unit = "degree";
          values.longitude.unit = "degree";
          values.height.value = elevationObj.data.data.results[0].elevation;
          values.height.unit = "meter";
          setIsLoading(false);
          NotificationManager.success("data loaded succesfully");
        } else {
          NotificationManager.error("something wrong");
        }

        setTrigger(!trigger);
      } catch (error) {
        console.log(error);
      }
    };
    if (address !== {} && address !== null) {
      func();
    }
  }, [address]);
  React.useEffect(() => {
    //donothing
  }, [trigger]);

  return (
    <div  >
      {/* <Tooltip title="Add Ground Station">
        <IconButton size="small" onClick={handleClickOpen("paper")}>
          <AddCircleOutlineIcon />
        </IconButton>
      </Tooltip> */}
      <Tooltip title="Add Ground Station">
        <div
          className="d-flex justify-content-center align-items-center"
          onClick={handleClickOpen("paper")}
        >
          {/* <IconButton size="small"> */}
          <AddCircleOutlineIcon width={24} fill="#fa2" />
          {/* </IconButton> */}
          <Typography variant="body1" className=" ml-2">Add Ground Station</Typography>
        </div>
      </Tooltip>
      <Dialog
        fullWidth={true}
        maxWidth="sm"
        open={GroundstationState.isGroundstationAddFormOpen}
        onClose={handleClose}
        scroll={"paper"}
        aria-labelledby="scroll-dialog-title"
        aria-describedby="scroll-dialog-description"

      >
        <DialogTitle id="scroll-dialog-title" onClose={handleClose}>
          Add Ground Station
        </DialogTitle>

        <div className="p-4">
          {/* <DialogContentText
            id="scroll-dialog-description"
            ref={descriptionElementRef}
            tabIndex={-1}
          >
            Here User can Add Ground station ,
          </DialogContentText> */}
          <GooglePlacesAutocomplete
            apiKey="AIzaSyC0LUuVZifavxE36jurxzPRLPNH_69YwPY"
            // apiOptions={{ language: 'fr', region: 'fr' }}
            onLoadFailed={(error) =>
              console.error("Could not inject Google script", error)
            }
            selectProps={{
              placeholder: "Search for ground station",
              isClearable: true,
              value: address,
              onChange: (val) => {
                setAddress(val);
              },
            }}
          />
        </div>
        {isLoading && (
          <div className={`d-flex justify-content-center align-items-center ${classes.loader_overlay}`}  >
            {/* <Backdrop open={open}  > */}

            <CircularProgress />


            {/* </Backdrop> */}

          </div>
        )}
        <Form onSubmit={handleSubmit} >
          <DialogContent dividers="paper">
            <Grid container spacing={3} >
              <Grid item xs={12}>
                <FormControl fullWidth variant="outlined">
                  {/* <InputLabel htmlFor="groundstationname">
                    Ground Station Name
                  </InputLabel> */}
                  <Input
                    type="text"
                    name="groundstationname"
                    id="groundstationname"
                    value={values.groundstationname}
                    placeholder=" Write Ground Station Name"
                    error={
                      !!(errors.groundstationname && touched.groundstationname)
                    }
                    onChange={handleChange}
                    onBlur={handleBlur}
                    required={true}
                  />

                  <FormHelperText
                    id="ground-station-name-helptext-id"
                    error={
                      !!(errors.groundstationname && touched.groundstationname)
                    }
                  >
                    {!!(errors.groundstationname && touched.groundstationname)
                      ? errors.groundstationname
                      : "GroundStation Name"}
                  </FormHelperText>
                </FormControl>
              </Grid>
            </Grid>
            {/* Lattitude */}
            <Grid container spacing={3}>
              <Grid item xs={9}>
                <FormControl fullWidth className={classes.formControl_value}>
                  {/* <InputLabel htmlFor="latitude">Latitude</InputLabel> */}
                  <Input
                    type="number"
                    name="latitude.value"
                    id="latitudeValue"
                    value={values.latitude.value}
                    placeholder=" Enter the Latitude"
                    error={
                      errors.latitude && touched.latitude
                        ? !!(errors.latitude.value && touched.latitude.value)
                        : false
                    }
                    onChange={handleChange}
                    onBlur={handleBlur}
                    required={true}
                  />
                  <FormHelperText
                    id="lattitude-helper-text"
                    error={
                      errors.latitude && touched.latitude
                        ? !!(errors.latitude.value && touched.latitude.value)
                        : false
                    }
                  >
                    {errors.latitude && touched.latitude
                      ? errors.latitude.value
                      : "Enter Latitude"}
                  </FormHelperText>
                </FormControl>
              </Grid>
              <Grid item xs={3}>
                <FormControl className={classes.formControl}>

                  <Select
                    labelId="latitude-unit-simple-select-label"
                    id="latitude-unit-simple-select"
                    value={values.latitude.unit}
                    name="latitude.unit"
                    onChange={handleChange}
                    onBlur={handleBlur}
                  >
                    <MenuItem value="degree">degree</MenuItem>
                    <MenuItem value="radian">radian</MenuItem>
                  </Select>
                  {/* <InputLabel id="latitude-unit-label">Unit</InputLabel> */}
                </FormControl>
              </Grid>
            </Grid>
            {/* longitude */}
            <Grid container spacing={3}>
              <Grid item xs={9}>
                <FormControl fullWidth className={classes.formControl_value}>
                  {/* <InputLabel htmlFor="longitude">Longitude</InputLabel> */}
                  <Input
                    type="number"
                    name="longitude.value"
                    id="longitudeValue"
                    value={values.longitude.value}
                    placeholder=" Enter the Longitude"
                    error={
                      errors.longitude && touched.longitude
                        ? !!(errors.longitude.value && touched.longitude.value)
                        : false
                    }
                    onChange={handleChange}
                    onBlur={handleBlur}
                    required={true}
                  />
                  <FormHelperText
                    id="longitude-helper-text"
                    error={
                      errors.longitude && touched.longitude
                        ? !!(errors.longitude.value && touched.longitude.value)
                        : false
                    }
                  >
                    {errors.longitude && touched.longitude
                      ? errors.longitude.value
                      : "Enter Longitude"}
                  </FormHelperText>
                </FormControl>
              </Grid>
              <Grid item xs={3}>
                <FormControl className={classes.formControl}>

                  <Select
                    labelId="longitude-unit-simple-select-label"
                    id="longitude-unit-simple-select"
                    value={values.longitude.unit}
                    name="longitude.unit"
                    onChange={handleChange}
                    onBlur={handleBlur}
                  >
                    <MenuItem value="degree">degree</MenuItem>
                    <MenuItem value="radian">radian</MenuItem>
                  </Select>
                  {/* <InputLabel id="longitude-unit-label">Unit</InputLabel> */}
                </FormControl>
              </Grid>
            </Grid>

            {/* height */}
            <Grid container spacing={3}>
              <Grid item xs={9}>
                <FormControl fullWidth className={classes.formControl_value}>
                  {/* <InputLabel htmlFor="height">Height</InputLabel> */}
                  <Input
                    type="number"
                    name="height.value"
                    id="heightValue"
                    value={values.height.value}
                    placeholder=" Enter the Height"
                    error={
                      errors.height && touched.height
                        ? !!(errors.height.value && touched.height.value)
                        : false
                    }
                    onChange={handleChange}
                    onBlur={handleBlur}
                    required={true}
                  />
                  <FormHelperText
                    id="height-helper-text"
                    error={
                      errors.height && touched.height
                        ? !!(errors.height.value && touched.height.value)
                        : false
                    }
                  >
                    {errors.height && touched.height
                      ? errors.height.value
                      : "The height,above the ellipsoid."}
                  </FormHelperText>
                </FormControl>
              </Grid>
              <Grid item xs={3}>
                <FormControl className={classes.formControl}>
                  <Select
                    labelId="height-unit-simple-select-label"
                    id="height-unit-simple-select"
                    value={values.height.unit}
                    name="height.unit"
                    onChange={handleChange}
                    onBlur={handleBlur}
                  >
                    <MenuItem value="meter">meter</MenuItem>
                    <MenuItem value="kilometer">kilometer</MenuItem>
                  </Select>
                  {/* <InputLabel id="height-unit-label">Unit</InputLabel> */}
                </FormControl>
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Tooltip title="Add Ground station">
              <Button
                variant="contained"
                type="submit"
                color="primary"
                disabled={isSubmitting}
              >
                {isSubmitting && (
                  <CircularProgress
                    size={10}
                    color="inherit"
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  />
                )}
                Submit
              </Button>
            </Tooltip>
            <Button
              variant="contained"
              onClick={handleClose}
              color="secondary"
              disabled={isSubmitting}
            >
              Cancel
            </Button>
          </DialogActions>
        </Form>
      </Dialog>
    </div>
  );
}

const AddGroudnstatinValidataionSchema = Yup.object().shape({
  groundstationname: Yup.string()
    .trim()
    .required("Ground station required"),
  latitude: Yup.object().shape({
    value: Yup.number()
      .required("Lattitude is Required")
      .when("unit", {
        is: "radian",
        then: Yup.number()
          .min(-(Math.PI / 2), "Latitude should be greather than -PI/2")
          .max(Math.PI / 2, "Latitude should be lesser than PI/2"),
        otherwise: Yup.number()
          .min(-90, "Latitude should be greather than -90")
          .max(90, "Latitude should be lesser than 90"),
      }),
  }),
  longitude: Yup.object().shape({
    value: Yup.number()
      .required("Lattitude is Required")
      .when("unit", {
        is: "radian",
        then: Yup.number()
          .min(-Math.PI, "Latitude should be greather than -PI")
          .max(Math.PI, "Latitude should be lesser than PI"),
        otherwise: Yup.number()
          .min(-180, "Latitude should be greather than -180")
          .max(180, "Latitude should be lesser than 180"),
      }),
  }),
  height: Yup.object().shape({
    value: Yup.number()
      .required("Height is required")
      .min(0, "Height should be be greater then 0"),
  }),
});

const AddGroundStationFormik = withFormik({
  mapPropsToValues: () => ({
    groundstationname: "",
    latitude: {
      unit: "radian",
    },
    longitude: {
      unit: "radian",
    },
    height: {
      unit: "meter",
    },
  }),

  // Custom sync validation
  validationSchema: AddGroudnstatinValidataionSchema,
  handleSubmit: async (
    values,
    { props, setSubmitting, resetForm, setFieldValue }
  ) => {
    let response = await addGroundstation(
      values,
      props.projectid,
      props.simulationid,
    );
    props.setGroundstationAddDialogBox(false)

    props.addNewGroundStationItem(response);

    if(response){
      props.setIsLoading(true);
      const projectIdd = props.simulate.getIn(["project", "id"]);
      const simulationIdd = props.simulate.getIn(["case", "id"]);
  
      try {
        const getAnalysisFile = firebase
          .app()
          .functions('us-central1')
          .httpsCallable('generateAnalysisTree');
  
        let data = await getAnalysisFile({
          projectid: projectIdd,
          simulationid: simulationIdd,
        });
        console.log("RunData", data, response);
        props.loadRunData(data);
  
      } catch (error) {
        props.loadRunData(null);
        props.setIsLoading(false);
      }
    }
  },
  displayName: "Add GroundStation",
})(AddGroundStation);

const stateProp = (state) => ({
  simulate: state.simulate,
  SimulationConfigReducer: state.SimulationConfigReducer,
  // GroundstationState: state.groundStationState,
  GroundstationState: state.GroundStationDetails
});

const dispatchProps = {
  setGroundstationAddDialogBox,
  addNewGroundStationItem,
  loadRunData,
  setIsLoading
};

export default connect(stateProp, dispatchProps)(AddGroundStationFormik);
