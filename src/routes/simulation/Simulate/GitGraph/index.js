import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import { Backdrop, CircularProgress, TextField, Button } from "@material-ui/core";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Grid,
  TextareaAutosize,
  InputLabel,
} from "@material-ui/core";
import { Send } from '@material-ui/icons';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import { NotificationManager } from "react-notifications";
import { connect } from "react-redux";
const { Gitgraph } = require("@gitgraph/react");
import SimulateService from "../../../../api/Simulate";
import {
  setSelectSimulationConfig,
  setIsLoading,
} from "../../../../actions/Simulate";
import Data from './data';
import './style.css';

/**
 * Custom GitGraph Compoennt For User History
 * By Nirmalya Saha
 */

function GitGraph(props) {
  var array = [];
  var front = 0;
  var rear = 0;
  var run_tag = 0;

  const [view, setView] = useState("");
  const [load, setLoading] = useState(false);
  const [data, setData] = useState(null);
  const [currentid, setCurrentid] = useState("");
  const [focusAuthor, setFocusAuthor] = useState("");
  const [contextMenu, setContextMenu] = useState(null);
  const [commitState, setCommitState] = useState(null);
  const [isDialogOpened, setIsDialogOpened] = useState(false);
  const [commitName, setCommitName] = useState("");

  var x = null;
  var y = null;
      
  document.addEventListener('mousemove', onMouseUpdate, false);
  document.addEventListener('mouseenter', onMouseUpdate, false);
      
  function onMouseUpdate(e) {
    x = e.pageX;
    y = e.pageY;
    console.log(x, y);
  }

  const onChange = (commit) => {
    // props.commit(commit);
    // setView(commit.hash);
    // setLoading(true);
    setContextMenu(null);
    setCommitState(commit);
    setContextMenu(
      contextMenu === null
        ? {
            mouseX: x + 2,
            mouseY: y - 6,
          } : null
    );
  }

  const onView = () => {
    const commit = commitState;
    props.commit(commit);
    setView(commit.hash);
    setLoading(true);
    setContextMenu(null);
  }

  // const customBranchName = () => {
  //   const commit = commitState;
  //   setContextMenu(null);
  //   console.log("custom branchname", commit);
  // }

  const handleClose = () => {
    setContextMenu(null);
  };

  const onDownload = async () => {
    const commit = commitState;
    console.log("D...", commit, data);

    setIsLoading(true);

    const dummy = data.filter((item) => {
      return item.id === commit.hash;
    });

    const configObj = dummy[0];

    const { simulate, userinfo } = props;

    const projectId = simulate.getIn(["project", "id"]);
    const caseId = simulate.getIn(["case", "id"]);
    const configurationId = simulate.getIn(["case", "tempId"]);
    const email = userinfo.email;

    if (configObj) {
      const result2 = await SimulateService.updateTempConfigParameters(
        projectId,
        caseId,
        configurationId,
        configObj.parameters,
        configObj.runid,
        configObj.name,
        email,
        configObj.simRate?configObj.simRate:{value:60000,unit:'milli seconds'},
        configObj
      );

      console.log("parent finding", configObj, result2, dummy);

      if (result2) {
       
        props.setSelectSimulationConfig(result2);
        setIsLoading(false);
        NotificationManager.success(
          `Loaded Temp with  ${configObj.name} configuration`
        );
        onView();
      } else {
        setIsLoading(false);
        NotificationManager.error("Could not load configuration");
      }
    }



    setLoading(true);
    setContextMenu(null);
  }

  const onDataChange = (dummy) => {
    setData(dummy.gitGraph);
    setCurrentid(dummy.parent.parent);
    setView(dummy.parent.parent);
    setLoading(true);
  }

  const getData = async () => {
    const { simulate, userinfo } = props;
      const projectId = simulate.getIn(["project", "id"]);
      const CaseId = simulate.getIn(["case", "id"]);
      const email = userinfo.email;
      const gitGraph = await SimulateService.getGitGraph(projectId,CaseId,email);
      onDataChange(gitGraph);
      setLoading(true);
  }

  const onEditCommit = async () => {
    const commit = commitState;
    setIsDialogOpened(true);
    setCommitName(commit.subject);
    setContextMenu(null);
  }

  const handleDialogClose = () => {
    setIsDialogOpened(false);
  }

  const onHandleCommitChange = (event) => {
    setCommitName(event.target.value);
  }

  const onSubmitCommitNameUpdate = async () =>{
    const { simulate } = props;
    const commit = commitState;
    const projectId = simulate.getIn(["project", "id"]);
    const caseId = simulate.getIn(["case", "id"]);
    const setName = await SimulateService.setGitGraph(projectId, caseId, commit.hash, commitName);
    getData();
    setIsDialogOpened(false);
  }

  useEffect(()=>{
    getData();
  },[]);

  useEffect(()=>{
    setLoading(false);
    console.log("...", data,view,currentid);
  },[view, load]);

  useEffect(()=>{
    console.log("N...", props.author);
    // if(props.author !== "Authors"){
      setFocusAuthor(props.author);
      setLoading(true);
    // }
  },[props.author])

  if (load)
    return (
      <Backdrop open={load}>
        <CircularProgress color="inherit" />
      </Backdrop>
    );

  if(data === null){
    console.log(".....",data);
    return null;
  }
  return (
    <div>
      <Gitgraph options={{ author: "" }}>
        {(gitgraph) => {
          const root = data.filter((item) => {
            return item.branchinfog.parent === null;
          });
          array[rear] = root[0];
          rear++;
          while (front + 1 <= rear) {
            var length = array.length;
            while (length > 0) {
              const current = array[front++];
              console.log(current);
              if (current !== undefined) {
                const parent = data.filter((item) => {
                  return item.id === current.branchinfog.parent;
                });
                var branch1;
                if (parent.length > 0) {
                  branch1 = gitgraph.branch(parent[0].branchinfog.branchname);
                } else {
                  branch1 = gitgraph.branch("master");
                }
                var branch = gitgraph.branch({
                  name: current.branchinfog.branchname,
                  from: branch1
                });
                if(current.nodetype === "Run"){
                  var customTagStyle = {
                    bgColor: 'orange',
                    strokeColor: 'orange'
                  };

                  var viewTagStyle = {
                    bgColor: '#b1ffb1',
                    strokeColor: '#b1ffb1'
                  };

                  if(focusAuthor === "" || focusAuthor === "Authors"){
                    branch.commit({ subject: current.name,
                      body: "Runned and executed by " + current.createdBy + " of version: " + current.version,
                     dotText: '🌟',
                     author: current.createdBy,
                     hash: current.id,
                    //  onClick: onChange,
                     onMouseOver: onChange,
                     onMessageClick: onChange })
                    .tag({ name: `Run ${run_tag}`, style: customTagStyle });
                    run_tag++;
                  }
                  else{
                    if(current.createdBy === focusAuthor){
                      branch.commit({ subject: current.name,
                        body: "Runned and executed by " + current.createdBy + " of version: " + current.version,
                       dotText: '🌟',
                       author: current.createdBy,
                       hash: current.id,
                      //  onClick: onChange,
                       onMouseOver: onChange,
                       onMessageClick: onChange })
                      .tag({ name: `Run ${run_tag}`, style: customTagStyle });
                      run_tag++;
                    }
                  }
                  
                  
                }
                else if(current.nodetype === "Save"){
                  var customTagStyle = {
                    bgColor: 'orange',
                    strokeColor: 'orange'
                  };

                  var viewTagStyle = {
                    bgColor: '#b1ffb1',
                    strokeColor: '#b1ffb1'
                  };

                  if(focusAuthor === "" || focusAuthor === "Authors"){
                    branch.commit({ subject: current.name, 
                      body: "Saved simulation by " + current.createdBy + " of version: " + current.version,
                    author: current.createdBy,
                    hash: current.id,
                    // onClick: onChange,
                    onMouseOver: onChange,
                    onMessageClick: onChange });
                  }
                  else{
                    if(current.createdBy === focusAuthor){
                      branch.commit({ subject: current.name, 
                        body: "Saved simulation by " + current.createdBy + " of version: " + current.version,
                      author: current.createdBy,
                      hash: current.id,
                      // onClick: onChange,
                      onMouseOver: onChange,
                      onMessageClick: onChange });
                    }
                  }


                }
                else{
                  var customTagStyle = {
                    bgColor: 'orange',
                    strokeColor: 'orange'
                  };

                  var viewTagStyle = {
                    bgColor: '#b1ffb1',
                    strokeColor: '#b1ffb1'
                  };

                  if(focusAuthor === "" || focusAuthor === "Authors"){
                    branch.commit({ subject: "Cloned Simulation", 
                      body: current.name,
                    author: current.createdBy,
                    hash: current.id,
                    // onClick: onChange,
                    onMouseOver: onChange,
                    onMessageClick: onChange });
                  }
                  else{
                    if(current.createdBy === focusAuthor){
                      branch.commit({ subject: "Cloned Simulation", 
                        body: current.name,
                      author: current.createdBy,
                      hash: current.id,
                      // onClick: onChange,
                      onMouseOver: onChange,
                      onMessageClick: onChange });
                    }
                  }
                }
                //current tag
                if (currentid === current.id) {
                  if(focusAuthor === "" || focusAuthor === "Authors"){
                    branch.tag({ name: "current", style: customTagStyle });
                  }else{
                    if(focusAuthor === current.createdBy){
                      branch.tag({ name: "current", style: customTagStyle });
                    }
                  }
                  
                }
                if(view === current.id){
                  if(focusAuthor === "" || focusAuthor === "Authors"){
                    branch.tag({ name: "view", style: viewTagStyle });
                  }else{
                    if(focusAuthor === current.createdBy){
                      branch.tag({ name: "view", style: viewTagStyle });
                    }
                  }
                }
                current.branchinfog.child = [...current.branchinfog.child].sort(
                  (a, b) => a.time - b.time
                );
                current.branchinfog.child = [
                  ...current.branchinfog.child
                ].sort((a, b) => (a.nodetype >= b.nodetype ? 1 : -1));
                for (var i = 0; i < current.branchinfog.child.length; i++) {
                  const enqueue = data.filter((item) => {
                    return item.id === current.branchinfog.child[i].id;
                  });
                  array[rear] = enqueue[0];
                  rear = rear + 1;
                }
              }
              length--;
            }
          }
        }}
      </Gitgraph>

      <Menu
        open={contextMenu !== null}
        onClose={handleClose}
        anchorReference="anchorPosition"
        anchorPosition={
          contextMenu !== null
            ? { top: contextMenu.mouseY, left: contextMenu.mouseX }
            : undefined
        }
      >
        <MenuItem onClick={onView}>View</MenuItem>
        <MenuItem onClick={onDownload}>Checkout Commit</MenuItem>
        {/* <MenuItem>
          <div>
            <TextField size="small" id="outlined-basic" label="Custom BranchName" variant="outlined" style={{marginRight: "10px"}}/>
            <Button size="medium" onClick={customBranchName} variant="contained" endIcon={<Send />}>
              Submit
            </Button>
          </div>
        </MenuItem> */}

        <MenuItem onClick={onEditCommit}>
          Update Commit Details
        </MenuItem>
      </Menu>

        <React.Fragment>
            <Dialog
          fullWidth={true}
          maxWidth={"sm"}
          open={isDialogOpened}
          onClose={handleDialogClose}
          aria-labelledby="max-width-dialog-title"
        >
          <DialogTitle id="max-width-dialog-title">
            Update Commit Details
          </DialogTitle>
          <DialogContent>
            {
              commitName === "Cloned Simulation" ? (
                <TextField
                    fullWidth
                    id="name"
                    name="name"
                    label="Commit Name"
                    variant="outlined"
                    value={commitName}
                    InputProps={{
                      readOnly: true,
                    }}
                    onChange={onHandleCommitChange}
                  />
              ) : commitName === "" ? (
                <TextField
                    error
                    helperText = "Please enter commit name"
                    fullWidth
                    id="name"
                    name="name"
                    label="Commit Name"
                    variant="outlined"
                    value={commitName}
                    onChange={onHandleCommitChange}
                  />
              ) : (
                <TextField
                    fullWidth
                    id="name"
                    name="name"
                    label="Commit Name"
                    variant="outlined"
                    value={commitName}
                    onChange={onHandleCommitChange}
                  />
              )
            }
                  
              <div className="d-flex flex-end justify-content-end align-items-center">

                {
                  // @ts-ignore
                  commitName === "" ?  null :
                  commitName === "Cloned Simulation" ? null : (
                    <Button
                      color="primary"
                      variant="contained"
                      className="mt-3 mb-3"
                      onClick={onSubmitCommitNameUpdate}
                    >
                      Update
                    </Button>
                  )
                }              
              <Button
                onClick={handleDialogClose}
                variant="contained"
                className="m-3 btn btn-danger"
                autoFocus
              >
                Cancel
              </Button>
              </div> 
          </DialogContent>
          <DialogActions></DialogActions>
        </Dialog>
      </React.Fragment>
    </div>
  );
}

const stateProp = (state) => ({
  simulate: state.simulate,
  userinfo: state.firebase.auth,
});

const dispatchProps = {
  setSelectSimulationConfig,
  setIsLoading,
};

export default connect(stateProp, dispatchProps)(GitGraph);