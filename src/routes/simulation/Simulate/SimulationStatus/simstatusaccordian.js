import React from "react";
import { connect } from "react-redux";
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import {get} from "lodash";

import Typography from "@material-ui/core/Typography";
import SimProgress from "./simprogress";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1
  },
  paper: {
    padding: theme.spacing(0)
  }
}));

function  SimulationSummary({simulationStatus}) {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Grid container spacing={0}>
        <Grid item xs={8}  container>
          <Grid item xs container direction="column" spacing={0}>
            <Grid item xs>
              <Typography  variant="subtitle1" color="secondary">
                Status
              </Typography>
              <Typography variant="body2" gutterBottom color="secondary">
                {simulationStatus}
              </Typography>
            </Grid>
          </Grid>
         
        </Grid>
        <Grid  item xs={4} >
            <div style={{paddingTop:5}}>
            <SimProgress/>
            </div>
              
          </Grid>
      </Grid>
    </div>
  );
}


const mapState = (state) => ({

    simulationStatus: get(state.simengine, ["current_engine_states", "status"]),
  });
  

  
  export default connect(mapState, null)(SimulationSummary);
