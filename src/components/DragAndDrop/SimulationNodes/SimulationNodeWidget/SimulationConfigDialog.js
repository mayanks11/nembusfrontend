import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { NotificationManager } from 'react-notifications';

import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import MuiDialogTitle from "@material-ui/core/DialogTitle";
import IconButton from "@material-ui/core/IconButton";
import BuildIcon from "@material-ui/icons/Build";
import Tooltip from "@material-ui/core/Tooltip";
import { withStyles, makeStyles } from "@material-ui/core/styles";
import CloseIcon from "@material-ui/icons/Close";
import Typography from "@material-ui/core/Typography";
import InfoOutlinedIcon from "@material-ui/icons/InfoOutline";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";

import { Actions } from "@jsonforms/core";
import { JsonFormsReduxContext, JsonFormsDispatch } from "@jsonforms/react";
import FolderIcon from "@material-ui/icons/Folder";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import TreeItem from "@material-ui/lab/TreeItem";
import TreeView from "@material-ui/lab/TreeView";
import {
  setBlockNameOfSelectConfig,
  setBlockSimulationTime,
  setIsUpdateBlock,
  setBlockParam,
} from 'Actions/SimulationConfigAction';

import { green } from "@material-ui/core/colors";
import { get, cloneDeep, set } from "lodash";

import { Box, CircularProgress, LinearProgress } from '@material-ui/core';
import Markdown from '../../../MarkdownComponent/Markdown.component';

import { storage } from 'firebase';

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
    display: "flex",
    alignItems: "center",
  },
  wrapper: {
    margin: theme.spacing(1),
    position: "relative",
  },
  buttonSuccess: {
    backgroundColor: green[500],
    "&:hover": {
      backgroundColor: green[700],
    },
  },
  fabProgress: {
    color: green[500],
    position: "absolute",
    top: -6,
    left: -6,
    zIndex: 1,
  },
  buttonProgress: {
    color: green[500],
    position: "absolute",
    top: "50%",
    left: "50%",
    marginTop: -12,
    marginLeft: -12,
  },
}));

function SimulationConfigDialog(props) {
  const [open, setOpen] = React.useState(false);
  const classes = useStyles();
  const [isloading, setIsLoading] = React.useState(false);

  // const [mdText, setmdText] = useState(false)
  const [mdloading, setMdLoading] = React.useState(true);
  const [mderror, setMdError] = React.useState(false);
  const [mdDesc, setmdDesc] = useState('');

  const [blockname, setBlockName] = React.useState(
    get(props.nodealloptions, ['extras', 'blockType', 'name'], '')
  );
  const [isblocknameerror, setIsBlockNameError] = React.useState(false);
  const [simulationTime, setSimulationTime] = React.useState(-1);
  const [SimTimeErrMessage, setSimTimeErrMessage] = React.useState("");
  const updateInformation = `The Button will temprorary Update the block and Please save the worksheet`;

  const [schema, setSchema] = React.useState({});
  const [uischema, setUischema] = React.useState({});
  const [javaformdata, setJavaformData] = React.useState({});
  const [javaformupdatedata, setJavaformUpdateData] = React.useState({});

  // markdown file implementation

  useEffect(() => {

    const docVersion = get(
      props.nodealloptions,
      ['extras', 'blockType', 'documentversion'],
      ''
    )

    console.log('documentVersion', docVersion);
    const markdownFiles = storage()
      .ref()
      .child('BlockInformation');


    const folderPath = get(
      props.nodealloptions,
      ['extras', 'blockType', 'description'],
      ''
    );

    const file = markdownFiles.child(folderPath);

    if(docVersion === 0) {
      file.getDownloadURL().then((url) => {
        fetch(url)
          .then((res) => res.text())
          .then((data) => {
            setmdDesc(data);
            setMdLoading(false);
          })
          .catch((err) => {
            setMdLoading(false);
            setMdError(true);
            console.error(err);
          });
      });
    } else {
      setmdDesc(folderPath)
      setMdLoading(false)
    }
  }, [])

  const nodetype = get(
    props.nodealloptions,
    ['extras', 'blockType', 'type'],
    ''
  );

  console.log('nodetype', nodetype, props.nodealloptions);

  const subType = get(
    props.nodealloptions,
    ['extras', 'blockType', 'subtype'],
    ''
  );

  const handleClickOpen = () => () => {
    setIsLoading(true);


    props.diagramEngine.setLocked(true);

    const Schema = get(props.nodealloptions, [
      "extras",
      "blockType",
      "datas",
      "schema",
    ]);

    const Uischema = get(props.nodealloptions, [
      "extras",
      "blockType",
      "datas",
      "uischema",
    ]);

    const data = get(props.nodealloptions, ["extras", "params"]);

    setSchema(Schema);
    setUischema(Uischema);
    setJavaformData(data);
    props.JsonFormsAction(data, Schema, Uischema);
    setTimeout(() => {
      setIsLoading(false);
      console.log("Loading the data");
    }, 1);

    setOpen(true);
  };

  const handleClose = () => {
    setIsBlockNameError(false);
    setOpen(false);
    props.engine.repaintCanvas();
    props.diagramEngine.setLocked(false);
    
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
    if (updatedblockName) {
      setBlockName(updatedblockName);
      setIsBlockNameError(false);
    } else {
      setIsBlockNameError(true);
    }
  };

  const handleChangeSimulationTime = (event) => {
    const SimulationTime = event.target.value;
    const parsed = Number.parseFloat(SimulationTime);

    console.log(
      "Number.isInteger(SimulationTime)",
      Number.isInteger(parsed),
      SimulationTime,
      parsed
    );
    if (Number.isInteger(parsed) && !(parsed < 0)) {
      setSimulationTime(parsed);
      setSimTimeErrMessage("");
    } else {
      if (isNaN(parsed)) {
        setSimTimeErrMessage("Cannot be empty");
      } else if (parsed < 0) {
        setSimTimeErrMessage("Sampling Value Cannot be less than Zero");
      } else if (!Number.isInteger(parsed)) {
        setSimTimeErrMessage("Sampling Value should be integer");
      }
    }
  };

  const handleUpdate = () => {
    if (
      !isblocknameerror &&
      props.jsonfromstate.errors.length === 0 &&
      SimTimeErrMessage.length == 0
    ) {
      set(props.nodealloptions, ["extras", "blockType", "name"], blockname);

      props.setNodeName(blockname);

      if (simulationTime => 0) {
        set(
          props.nodealloptions,
          [
            "extras",
            "blockType",
            "datas",
            "simulationdetail",
            "updatingFrequency",
            "value",
          ],
          simulationTime
        );
      }

      props.nodealloptions.extras.params = cloneDeep(props.jsonfromstate.data);

      console.log(
        "props.jsonfromstate_data",
        props.jsonfromstate.data,
        blockname,
        simulationTime
      );
      

      console.log("diagramEngine", props.nodealloptions);

        
      setOpen(false);
      props.diagramEngine.setLocked(false);
      console.log(props.diagramEngine.isLocked())
      props.engine.repaintCanvas();
      props.diagramEngine.editComponent(props.nodealloptions);

    } else {
      setBlockName(
        props.SimulationConfigReducer.getIn([
          "Selectedblock",
          "options",
          "extras",
          "blockType",
          "name",
        ])
      );
      NotificationManager.error(`Cannot update the Block ${blockname}`);
    }
  };

  return (
    <div>
      <Tooltip title="Click to Configure" placement="right">
        <IconButton color="primary" aria-label="Build">
          <BuildIcon onClick={handleClickOpen()} />
        </IconButton>
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
          {`Type:${nodetype} (${subType})`}
        </DialogTitle>
        <DialogContent dividers="paper">
          <DialogContentText
            id="scroll-dialog-description"
            ref={descriptionElementRef}
            tabIndex={-1}
          >
            {props.SimulationConfigReducer.size ? (
              <TreeView
                className="height: 240"
                defaultCollapseIcon={<ExpandMoreIcon />}
                defaultExpandIcon={<ChevronRightIcon />}
              >
                <TreeItem
                  nodeId="1"
                  label={
                    <Grid
                      container
                      spacing={1}
                      direction="row"
                      alignItems="Center"
                    >
                      <Grid item style={{ paddingTop: 8 }}>
                        <InfoOutlinedIcon color="primary" />
                      </Grid>
                      <Grid item xs>
                        <Typography variant="h6">Description</Typography>
                      </Grid>
                    </Grid>
                  }
                >
                  {mderror && (
                    <Box
                      display="flex"
                      justifyContent="center"
                      alignItems="center"
                    >
                      <Typography position="absolute">
                        Couldn't fetch description
                      </Typography>
                    </Box>
                  )}
                  {mdloading ? (
                    <Box
                      display="flex"
                      justifyContent="center"
                      alignItems="center"
                    >
                      <CircularProgress />
                      <Typography position="absolute">
                        Loading description
                      </Typography>
                    </Box>
                  ) : (
                    <Markdown>{mdDesc}</Markdown>
                  )}
                </TreeItem>
              </TreeView>
            ) : (
              ""
            )}
          </DialogContentText>
          <TextField
            id="standard-multiline-flexible"
            label="Block Name"
            multiline
            rowsMax={4}
            error={isblocknameerror}
            fullWidth
            defaultValue={get(
              props.nodealloptions,
              ["extras", "blockType", "name"],
              ""
            )}
            helperText="Please Enter block Name"
            type="string"
            margin="dense"
            autoFocus={true}
            required={true}
            placeholder="Enter you input"
            id="mui-theme-provider-outlined-input2"
            onChange={handleChange}
          />

          {get(props.nodealloptions, ["extras", "blockType", "type"]) ===
          "Propagator" ? (
            ""
          ) : (
            <Grid container spacing={3}>
              <Grid item xs={6} sm={8}>
                <TextField
                  id="standard-multiline-flexible"
                  label="Sample Time"
                  error={SimTimeErrMessage.length > 0 ? true : false}
                  fullWidth
                  defaultValue={get(
                    props.nodealloptions,
                    [
                      "extras",
                      "blockType",
                      "datas",
                      "simulationdetail",
                      "updatingFrequency",
                      "value",
                    ],
                    0
                  )}
                  helperText={
                    SimTimeErrMessage.length > 0
                      ? SimTimeErrMessage
                      : "Enter Sampling Time ,0 means inherent Simulation sampling time "
                  }
                  type="number"
                  margin="dense"
                  autoFocus={true}
                  required={true}
                  placeholder="Enter you input"
                  id="simulation sampling"
                  onChange={handleChangeSimulationTime}
                />
              </Grid>
              <Grid item xs={6} sm={4}>
                <TextField
                  id="standard-multiline-flexible"
                  label="Unit"
                  fullWidth
                  defaultValue={get(props.nodealloptions, [
                    "extras",
                    "blockType",
                    "datas",
                    "simulationdetail",
                    "updatingFrequency",
                    "unit",
                  ])}
                  margin="dense"
                  autoFocus={true}
                  required={true}
                  InputProps={{
                    readOnly: true,
                  }}
                  id="simulation sampling"
                  onChange={() => {
                    console.log("Testing");
                  }}
                />
              </Grid>
            </Grid>
          )}

          {isloading ? (
            <div>
              <div>Loading the form</div>
              <div style={{ display: "flex", justifyContent: "center" }}>
                <CircularProgress color="secondary" disableShrink />
              </div>
            </div>
          ) : (
            <JsonFormsReduxContext>
              <JsonFormsDispatch />
            </JsonFormsReduxContext>
          )}
        </DialogContent>
        <DialogActions>
          <Tooltip title={updateInformation}>
            <Button variant="contained" onClick={handleUpdate} color="primary">
              Update
            </Button>
          </Tooltip>
          <Button variant="contained" onClick={handleClose} color="secondary">
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

const stateProp = (state) => ({
  SimulationConfigReducer: state.SimulationConfigReducer,
  jsonfromstate: state.jsonforms.core,
});

const mapDispatchToProps = (dispatch) =>
  bindActionCreators(
    {
      setBlockNameOfSelectConfig,
      setBlockSimulationTime,
      setIsUpdateBlock,
      setBlockParam,
      JsonFormsAction: (data, schema, uischema) =>
        dispatch(Actions.init(data, schema, uischema)),
    },
    dispatch
  );

export default connect(stateProp, mapDispatchToProps)(SimulationConfigDialog);
