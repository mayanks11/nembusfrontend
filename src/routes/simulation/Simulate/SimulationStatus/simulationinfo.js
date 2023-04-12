import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { connect } from "react-redux";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import { get } from "lodash";

import Grid from "@material-ui/core/Grid";
import ExpandLess from "@material-ui/icons/ExpandLess";
import ExpandMore from "@material-ui/icons/ExpandMore";
import Collapse from "@material-ui/core/Collapse";
import { Typography } from "@material-ui/core";
const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    maxWidth: 200,
  },
  nested: {
    paddingLeft: theme.spacing(2),
  },
  demo: {
    backgroundColor: theme.palette.background.paper,
  },
  list: {
    paddingTop: 1,
  },
  listitems: {
    paddingLeft: 5,
    paddingRight: 5,
  },
}));

function generate(element) {
  return [0, 1, 2].map((value) =>
    React.cloneElement(element, {
      key: value,
    })
  );
}

function SimulationInfo({ simulationInfo, simulationError }) {
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);

  const handleClick = () => {
    setOpen(!open);
  };

  return (
    <div className={classes.root}>
      <div className={classes.demo}>
        <List dense={true} className={classes.list}>
          <ListItem className={classes.listitems}>
            <ListItemText
              primary="Project Name"
              secondary={
                <Typography variant="caption" noWrap={false}>
                  {get(simulationInfo, ["project_name"], "")}
                </Typography>
              }
            />
          </ListItem>
          <ListItem className={classes.listitems}>
            <ListItemText
              primary="Simulation Name"
              secondary={
                <Typography variant="caption" noWrap={false}>
                  {get(simulationInfo, ["simulation_name"], "")}
                </Typography>
              }
            />
          </ListItem>

          <ListItem className={classes.listitems}>
            <ListItemText
              primary="Configuration Name"
              secondary={
                <Typography variant="caption" noWrap={false}>
                  {get(simulationInfo, ["configuration_name"], "")}
                </Typography>
              }
            />
          </ListItem>

          <ListItem className={classes.listitems} button onClick={handleClick}>
            <ListItemText primary="Error" />
            {open ? <ExpandLess /> : <ExpandMore />}
          </ListItem>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <List component="div" disablePadding dense={true}>
              {simulationError.map((data,index) => {
                return (
                  <ListItem className={classes.nested}>
                    <ListItemText
                      key={index}
                      primary={`Error ${index+1}`}
                      secondary={data}
                    />
                  </ListItem>
                );
              })}
            </List>
          </Collapse>
        </List>
      </div>
    </div>
  );
}

const mapState = (state) => ({
  simulationProgress: get(state.simengine, [
    "current_engine_states",
    "simulation_done",
  ]),

  simulationInfo: get(state.simengine, [
    "current_engine_states",
    "running_info",
  ]),

  simulationError: get(
    state.simengine,
    ["current_engine_states", "erorr_message"],
    []
  ),

  
});

export default connect(mapState, null)(SimulationInfo);
