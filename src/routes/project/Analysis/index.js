/**
 * NEMBUS PROJECT 
 * ANALYSIS
 * Nirmalya Saha
 */

import React, { useState } from "react";
import { connect } from "react-redux";
import { makeStyles } from "@material-ui/core/styles";
import Drawer from "@material-ui/core/Drawer";
import AddIcon from "@material-ui/icons/AddCircle";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Button,
    Tabs,
    Tab
} from "@material-ui/core";
import { NotificationManager } from "react-notifications";
import Simulation from "../../simulation/Simulate/Simulation";
import SheetTab from "./SheetTab";
import "./style.scss";

import 'react-virtualized/styles.css';
import 'material-icons/css/material-icons.css';

const drawerWidth = "20%";

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      height: `calc(100vh - 96px)`,
    },
    [theme.breakpoints.down('sm')]: {
      height: `calc(100vh - 112px)`,
    },
    overflow: 'hidden',
  },
  rootCollapse: {
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      height: `calc(100vh - 48px)`,
    },
    [theme.breakpoints.down('sm')]: {
      height: `calc(100vh - 64px)`,
    },
    marginTop: theme.spacing(0),
    overflow: 'hidden',
    zIndex: -9,
  },
  searchContainer: {
    display: 'flex',
    alignItems: 'flex-end',
    gap: '1em',
  },
  tree: {
    marginTop: '1em',
  },
  ExpandButtonDisabled: {
    backgroundColor: 'transparent',
    border: '1px solid gray',
    opacity: '0.5',
  },
  ExpandButton: {
    backgroundColor: 'transparent',
    border: '1px solid gray',
    cursor: 'pointer',
    opacity: '1',
  },
 
  
  appFrame: {
    position: 'relative',
    display: 'flex',
    width: '100%',
    height: '100%',
  },
  appBar: {
    position: "absolute",
    transition: theme.transitions.create(["margin", "width"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    padding: 0,
    zIndex: theme.zIndex.drawer + 1,
    backgroundColor: "#464D69",
  },
  appBarShift: {
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["margin", "width"], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  "appBarShift-left": {
    marginLeft: drawerWidth,
  },
  "appBarShift-right": {
    marginRight: drawerWidth,
  },
  menuButton: {
    marginLeft: 12,
    marginRight: 20,
  },
  hide: {
    display: "none",
  },
  drawerPaper: {
    position: 'relative',
    height:"80vh",
    [theme.breakpoints.up('sm')]: {
      maxHeight: `calc(100vh - 48px)`,
    },
    [theme.breakpoints.down('sm')]: {
      maxHeight: `calc(100vh - 64px)`,
    },
    overflowY:'auto',
    zIndex: 0
  },
  drawerHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    height: '48px',
  },
  drawertext: {
    justifyContent: 'flex-left',
  },
  drawericon: {
    justifyContent: 'flex-end',
  },
  addNewSheetIconWrapper: {
    margin: theme.spacing(1),
    position: "relative",
  },
  content: {
    width: "100%",
    flexGrow: 1,
    backgroundColor: theme.palette.background.default,
    padding: theme.spacing(1),
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    height: "calc(100% - 28px)",
    marginTop: 10
  },

  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  innerWrapper: {
    display: 'flex',
    gap: '0',
  },
  drawerContainer: {
    overflow: "auto",
  },

  pane: {
    margin: theme.spacing(0, 0, 0, 0),
    height: "100%",
  },
  leftPane: {},
  centerPane: {
    alignItems: "stretch",
  },
  rightPane: {},
  reflexContainer: {
    flex: "1",
    alignItems: "stretch",
  },
  downloadcsv: {
    textAlign: 'right'
  },
}));


const Analysis = (props) => { 
    const classes = useStyles();

    const [reportName, setReportName] = useState('');
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [reportError, setReportError] = useState(false);
    const [sheets, setSheets] = useState([{
      sheetName: "Data"
    },
    {
      sheetName: "Analysis"
    },
    {
      sheetName: "Report"
    }]);
    const [activeSheet, setActiveSheet] = useState(sheets[0]);

    const handleSheetChange = (event, sheet) => {
      setActiveSheet(sheet);
    };

    const handleDialogOpen = () => {
        setReportName('');
        setReportError(false);
        setIsDialogOpen(true);
    }

    const handleDialogClose = () => {
        setReportName('');
        setReportError(false);
        setIsDialogOpen(false);
    }

    const onReportNameChange = (event) => {
        setReportName(event.target.value);
    }

    const onReportSubmit = () => {
        if(reportName === '') {
          setReportError(true);
          NotificationManager.error("Please provide required details.");
        } else {
          setIsDialogOpen(false);
          NotificationManager.success("Report Submit Clicked.");
          setReportError(false);
          setReportName('');
        }
    }


  return (
    <div
    id="analysis"
    className={classes.root }
  >
    <div className={classes.innerWrapper}>
      <Drawer
        id="analysisDrawer"
        className={classes.drawerPaper}
        variant="permanent"
        classes={{
          paper: classes.drawerPaper,
        }}
      >
        <div className="sheetsContainer">
              <div className="sheetTabs">
                <Tabs
                  value={activeSheet}
                  onChange={handleSheetChange}
                  variant="scrollable"
                  scrollButtons="on"
                >
                  {sheets &&
                    sheets.map((sheet, index) => (
                      <Tab
                        style={{ maxWidth: "80px"}}
                        value={sheet}
                        label={
                          <SheetTab
                            sheet={sheet}
                            index={index}
                          />
                        }
                      />
                    ))}
                </Tabs>
              </div>
        </div>
        
        {
          activeSheet.sheetName === "Data" ? (
            <div>
            <h2 style={{ marginTop: "30px", cursor: "pointer" }}  color="inherit">Add Interested Location {" "} <AddIcon fontSize="small" /></h2>
            <h2 style={{ marginTop: "30px", cursor: "pointer" }}  color="inherit">Find Two Line Element {" "} <AddIcon fontSize="small" /></h2>
            </div>
          ) : activeSheet.sheetName === "Analysis" ? (
            <h2 style={{ marginTop: "30px", cursor: "pointer" }} onClick={handleDialogOpen} color="inherit">Find Satelite {" "} <AddIcon fontSize="small" /></h2>
          ) : null
        }
      </Drawer>

      <main id="mainContent" className={classes.content}>
        <React.Fragment>
          <Simulation socket={props.socket} saveCzmlData={props.saveCzmlData}/>
        </React.Fragment>
      </main>
    </div>
    <React.Fragment>
            <Dialog
               fullWidth={true}
               maxWidth={"sm"}
               open={isDialogOpen}
               onClose={handleDialogClose}
               aria-labelledby="max-width-dialog-title"
            >
               <DialogTitle id="max-width-dialog-title">
                  Find Satelite
               </DialogTitle>
               <DialogContent>
                  {
                      reportName === '' && reportError === true ? (
                     <TextField
                        style={{ marginBottom: "10px" }}
                        error
                        helperText = "Please enter report Name"
                        fullWidth
                        id="report"
                        name="report"
                        label="Report Name"
                        variant="outlined"
                        value={reportName}
                        onChange={onReportNameChange}
                        />
                  ) : (
                     <TextField
                        style={{ marginBottom: "10px" }}
                        fullWidth
                        id="report"
                        name="report"
                        label="Report Name"
                        variant="outlined"
                        value={reportName}
                        onChange={onReportNameChange}
                        />
                  )
                  }
                        
                  <div className="d-flex flex-end justify-content-end align-items-center">
                        <Button
                           color="primary"
                           variant="contained"
                           className="mt-3 mb-3"
                           onClick={onReportSubmit}
                        >
                           Submit
                        </Button>            
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
};

const mapStateToProps = (state) => ({
});

const mapDispatchToProps = {
 };

export default connect(mapStateToProps, mapDispatchToProps)(Analysis);