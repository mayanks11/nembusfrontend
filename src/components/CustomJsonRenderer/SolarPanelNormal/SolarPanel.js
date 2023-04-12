import React, { useEffect, useState } from "react";
import { forwardRef } from "react";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import { useImmer } from "use-immer";
import InputAdornment from "@material-ui/core/InputAdornment";
import OutlinedInput from "@material-ui/core/OutlinedInput";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import FormHelperText from "@material-ui/core/FormHelperText";
import Typography from "@material-ui/core/Typography";
import InfoIcon from "@material-ui/icons/Info";
import Tooltip from "@material-ui/core/Tooltip";
import { withStyles, makeStyles } from "@material-ui/core/styles";

const rad2deg = Math.PI / 180;

const HtmlTooltip = withStyles((theme) => ({
  tooltip: {
    backgroundColor: "#f5f5f9",
    color: "rgba(0, 0, 0, 0.87)",
    maxWidth: 220,
    fontSize: theme.typography.pxToRem(12),
    border: "1px solid #dadde9",
  },
}))(Tooltip);

const SolarPanelNormalTable = (props) => {
  console.log("TESTEER------------->", props);

  const [normalValue, updatenormalValue] = useImmer({
    name: "",
    phi: 0,
    theta: 0,
    area: 10000,
    efficiency:100
  });

  useEffect(() => {
    console.log("updated ==========>", props.data);

    if (props.data) {
      updatenormalValue((draft) => {
        draft.name = props.data.name;
        draft.phi = props.data.phi;
        draft.theta = props.data.theta;
        draft.area = props.data.area;
        draft.efficiency = props.data.efficiency;
      });
    }
  }, []);

  useEffect(() => {
    console.log("updated ==========>");
    props.handleChange(props.path, normalValue);
  }, [normalValue]);

  const handleChange = (prop) => (event) => {
    const value = event.target.value;

    // console.log("value ",value)
    if (value) {
      console.log("not empty value only ", value);
    }

    switch (prop) {
      case "name":
        updatenormalValue((draft) => {
          draft.name = value;
        });
        break;

      case "phi":
        updatenormalValue((draft) => {
          if (value) {
            draft.phi = parseFloat(value);
          } else {
            draft.phi = parseFloat(null);
          }
        });
        break;

      case "theta":
        updatenormalValue((draft) => {
          if (value) {
            draft.theta = parseFloat(value);
          } else {
            draft.theta = parseFloat(null);
          }
        });
        break;

      case "area":
        updatenormalValue((draft) => {
          if (value) {
            draft.area = parseFloat(value);
          } else {
            draft.area = parseFloat(null);
          }
        });
        break;
        case "efficiency":
          updatenormalValue((draft) => {
            if (value) {
              draft.efficiency = parseFloat(value);
            } else {
              draft.efficiency = parseFloat(null);
            }
          });
          break;
    }
  };

  return (
    <div>
      <Grid container direction="column" spacing={3}>
        <Grid item container direction="row" spacing={2}>
          <Grid item>
            <HtmlTooltip
              title={
                <React.Fragment>
                  <Typography color="inherit">Theta and Phi</Typography>
                  <img
                    width="220"
                    src={require('Assets/dvrimages/solar_panel.png')}
                    
                  />
                </React.Fragment>
              }
            >
              <InfoIcon />
            </HtmlTooltip>
          </Grid>
          <Grid item xs={10}>
            <FormControl fullWidth variant="outlined">
              <InputLabel htmlFor="name-of-panel">Name</InputLabel>
              <OutlinedInput
                type="text"
                id="name-of-panel"
                value={normalValue.name}
                onChange={handleChange("name")}
                labelWidth={40}
              />
            </FormControl>
          </Grid>
        </Grid>

        <Grid item container direction="row" spacing={2}>
          <Grid item xs={4}>
            <FormControl fullWidth variant="outlined" style={{ padding: 0 }}>
              <InputLabel htmlFor="name-of-panel">Theta</InputLabel>
              <OutlinedInput
                type="number"
                id="name-of-panel"
                value={normalValue.theta}
                onChange={handleChange("theta")}
                endAdornment={
                  <InputAdornment position="end">deg</InputAdornment>
                }
                labelWidth={40}
                required
              />
              <FormHelperText id="standard-weight-helper-text">
                {"0<=Theta<=180"}
              </FormHelperText>
            </FormControl>
          </Grid>
          <Grid item xs={4} >
            <FormControl fullWidth variant="outlined">
              <InputLabel htmlFor="name-of-panel">Phi</InputLabel>
              <OutlinedInput
                type="number"
                id="name-of-panel"
                value={normalValue.phi}
                onChange={handleChange("phi")}
                endAdornment={
                  <InputAdornment position="end">deg</InputAdornment>
                }
                labelWidth={30}
                required={true}
              />
              <FormHelperText id="standard-weight-helper-text">
                {"0<=Phi<=360"}
              </FormHelperText>
            </FormControl>
          </Grid>
          <Grid item xs={4}>
            <FormControl fullWidth variant="outlined">
              <InputLabel htmlFor="name-of-panel">Area</InputLabel>
              <OutlinedInput
                type="number"
                id="name-of-panel"
                value={normalValue.area}
                onChange={handleChange("area")}
                endAdornment={
                  <InputAdornment position="end">mm^2</InputAdornment>
                }
                labelWidth={40}
                required={true}
              />
              <FormHelperText id="standard-weight-helper-text">
                {"Area of panel"}
              </FormHelperText>
            </FormControl>
          </Grid>
        </Grid>

        <Grid item container direction="row" spacing={2}>

        <Grid item>
          <FormControl variant="outlined">
            <InputLabel htmlFor="name-of-panel">Efficiency</InputLabel>
            <OutlinedInput
              type="number"
              id="name-of-panel"
              value={normalValue.efficiency}
              onChange={handleChange("efficiency")}
              endAdornment={<InputAdornment position="end">%</InputAdornment>}
              labelWidth={70}
              required={true}
            />
            <FormHelperText id="standard-weight-helper-text">
              {"Efficiency"}
            </FormHelperText>
          </FormControl>
        </Grid>
        <Grid item xs={1}>
          <Typography variant="caption">
            {`Normal(x,y,z)= [${parseFloat(
              Math.cos(rad2deg * normalValue.phi) *
                Math.sin(rad2deg * normalValue.theta)
            ).toFixed(3)},${parseFloat(
              Math.sin(rad2deg * normalValue.phi) *
                Math.sin(rad2deg * normalValue.theta)
            ).toFixed(3)},${parseFloat(
              Math.cos(rad2deg * normalValue.theta)
            ).toFixed(3)}]`}
          </Typography>
        </Grid>


        </Grid>

       
      </Grid>
    </div>
  );
};

export default SolarPanelNormalTable;
