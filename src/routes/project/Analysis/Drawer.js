/**
 * NEMBUS PROJECT 
 * DRAWER FOR
 * DATA ANALYSIS REPORT
 * B2C
 * Nirmalya Saha
 */

import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import PropTypes, { element } from 'prop-types';
import { forwardRef } from "react";
import axios from "axios";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import Drawer from "@material-ui/core/Drawer";
import AddIcon from "@material-ui/icons/AddCircle";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Tabs,
    Tab,
    Tooltip,
    Badge,
    Table, 
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    TableContainer,
    Paper,
    Box,
    IconButton,
    FormControl,
    InputLabel,
    Select,
    MenuItem
} from "@material-ui/core";
import MuiAccordion from '@material-ui/core/Accordion';
import MuiAccordionSummary from '@material-ui/core/AccordionSummary';
import MuiAccordionDetails from '@material-ui/core/AccordionDetails';
import PersonPinIcon from '@material-ui/icons/PersonPin';
import { ExpandMore, Delete, Info } from '@material-ui/icons';
import FirstPageIcon from "@material-ui/icons/FirstPage";
import KeyboardArrowLeft from "@material-ui/icons/KeyboardArrowLeft";
import KeyboardArrowRight from "@material-ui/icons/KeyboardArrowRight";
import LastPageIcon from "@material-ui/icons/LastPage";
import AddBox from "@material-ui/icons/AddBox";
import ArrowDownward from "@material-ui/icons/ArrowDownward";
import Check from "@material-ui/icons/Check";
import ChevronLeft from "@material-ui/icons/ChevronLeft";
import ChevronRight from "@material-ui/icons/ChevronRight";
import Clear from "@material-ui/icons/Clear";
import DeleteOutline from "@material-ui/icons/Delete";
import Edit from "@material-ui/icons/Edit";
import FilterList from "@material-ui/icons/FilterList";
import FirstPage from "@material-ui/icons/FirstPage";
import LastPage from "@material-ui/icons/LastPage";
import Remove from "@material-ui/icons/Remove";
import SaveAlt from "@material-ui/icons/Save";
import Search from "@material-ui/icons/Search";
import ViewColumn from "@material-ui/icons/ViewColumn";
import GooglePlacesAutocomplete from "react-google-places-autocomplete";
import SearchBar from "material-ui-search-bar";
import MaterialTable, { MTableToolbar } from "material-table";
import {
  materialRenderers,
  materialCells
} from '@jsonforms/material-renderers';
import { JsonForms } from '@jsonforms/react';
import { NotificationManager } from "react-notifications";
import SheetTab from "./SheetTab";
import RctSectionLoader from 'Components/RctSectionLoader/RctSectionLoader';
import NembusProjectAdapter from "../../../adapterServices/NembusProjectAdapter";
import NembusProjectService from "../../../api/NembusProject";

import "./style.scss";
import 'react-virtualized/styles.css';
import 'material-icons/css/material-icons.css';

const drawerWidth = "100%";

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      height: `calc(100vh - 25px)`,
    },
    [theme.breakpoints.down('sm')]: {
      height: `calc(100vh - 25px)`,
    },
    // overflow: 'hidden',
  },
  table: {
    minWidth: 150
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
    height:"100vh",
    // [theme.breakpoints.up('sm')]: {
    //   maxHeight: `calc(100vh - 48px)`,
    // },
    // [theme.breakpoints.down('sm')]: {
    //   maxHeight: `calc(100vh - 64px)`,
    // },
    // overflowY:'auto',
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

const useStyles1 = makeStyles((theme) => ({
  root: {
    flexShrink: 0,
    marginLeft: theme.spacing(2.5),
  },
}));

const tableIcons = {
  Add: forwardRef((props, ref) => <AddBox {...props} ref={ref} />),
  Check: forwardRef((props, ref) => <Check {...props} ref={ref} />),
  Clear: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
  Delete: forwardRef((props, ref) => <DeleteOutline {...props} ref={ref} />),
  DetailPanel: forwardRef((props, ref) => (
    <ChevronRight {...props} ref={ref} />
  )),
  Edit: forwardRef((props, ref) => <Edit {...props} ref={ref} />),
  Export: forwardRef((props, ref) => <SaveAlt {...props} ref={ref} />),
  Filter: forwardRef((props, ref) => <FilterList {...props} ref={ref} />),
  FirstPage: forwardRef((props, ref) => <FirstPage {...props} ref={ref} />),
  LastPage: forwardRef((props, ref) => <LastPage {...props} ref={ref} />),
  NextPage: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
  PreviousPage: forwardRef((props, ref) => (
    <ChevronLeft {...props} ref={ref} />
  )),
  ResetSearch: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
  Search: forwardRef((props, ref) => <Search {...props} ref={ref} />),
  SortArrow: forwardRef((props, ref) => <ArrowDownward {...props} ref={ref} />),
  ThirdStateCheck: forwardRef((props, ref) => <Remove {...props} ref={ref} />),
  ViewColumn: forwardRef((props, ref) => <ViewColumn {...props} ref={ref} />),
};

function TablePaginationActions(props) {
  const classes = useStyles1();
  const theme = useTheme();

  const { count, page, rowsPerPage, onChangePage } = props;

  const handleFirstPageButtonClick = (event) => {
    onChangePage(event, 0);
  };

  const handleBackButtonClick = (event) => {
    onChangePage(event, page - 1);
  };

  const handleNextButtonClick = (event) => {
    onChangePage(event, page + 1);
  };

  const handleLastPageButtonClick = (event) => {
    onChangePage(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
  };

  return (
    <div className={classes.root}>
      <IconButton
        onClick={handleFirstPageButtonClick}
        disabled={page === 0}
        aria-label="first page"
      >
        {theme.direction === "rtl" ? <LastPageIcon /> : <FirstPageIcon />}
      </IconButton>
      <IconButton
        onClick={handleBackButtonClick}
        disabled={page === 0}
        aria-label="previous page"
      >
        {theme.direction === "rtl" ? (
          <KeyboardArrowRight />
        ) : (
          <KeyboardArrowLeft />
        )}
      </IconButton>
      <IconButton
        onClick={handleNextButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="next page"
      >
        {theme.direction === "rtl" ? (
          <KeyboardArrowLeft />
        ) : (
          <KeyboardArrowRight />
        )}
      </IconButton>
      <IconButton
        onClick={handleLastPageButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="last page"
      >
        {theme.direction === "rtl" ? <FirstPageIcon /> : <LastPageIcon />}
      </IconButton>
    </div>
  );
}

TablePaginationActions.propTypes = {
  count: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
  page: PropTypes.number.isRequired,
  rowsPerPage: PropTypes.number.isRequired,
};

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <div style={{ margin: "20px" }}>
          {children}
        </div>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

const DrawerPanel = (props) => { 
    const classes = useStyles();
    const projectId = window.location.pathname.split('/')[3];
    const pageSize = 5;

    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isLocationDialogOpen, setIsLocationDialogOpen] = useState(false);
    const [isTLEDialogOpen, setIsTLEDialogOpen] = useState(false);
    const [isInfoDialogOpen, setIsInfoDialogOpen] = useState(false);
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
    const [jsonMetaData, setJsonMetaData] = useState([]);
    const [activeJsonForm, setActiveJsonForm] = useState(null);
    const [jsonData, setJsonData] = useState({});
    const [jsonDataError, setJsonDataError] = useState(null);
    const [expanded1, setExpanded1] = useState(true);
    const [expanded2, setExpanded2] = useState(false);
    const [address, setAddress] = useState(null);
    const [rows, setRows] = useState([]);
    const [countryLevel, setCountryLevel] = useState([]);
    const [stateLevel, setStateLevel] = useState([]);
    const [selectedLevel0, setSelectedLevel0] = useState('');
    const [selectedLevel1, setSelectedLevel1] = useState('');
    const [interestedLocation, setInterestedLocation] = useState([]);
    const [searchedInterestedLocation, setSearchedInterestedLocation] = useState("");
    const [TLETabs, setTLETabs] = useState(0);
    const [TLEOrbitSearch, setTLEOrbitSearch] = useState("");
    const [page, setPage] = useState(0);
    const [TLEOrbitCount, setTLEOrbitCount] = useState(0);
    const [TLEOrbitSatData, setTLEOrbitSatData] = useState([]);
    const [selectedTLEOrbitRow, setSelectedTLEOrbitRow] = useState([]);
    const [TLERows, setTLERows] = useState([]);
    const [TLEOrbits, setTLEOrbits] = useState([]);
    const [searchedTLEOrbits, setSearchedTLEOrbits] = useState("");
    const [orbitInfo, setOrbitInfo] = useState(null);
    const [orbitInfoLoad, setOrbitInfoLoad] = useState(false);
    const [TLEDialogLoad, setTLEDialogLoad] = useState(false);
    const [dialogLocationLoad, setDialogLocationLoad] = useState(false);
    const [interestedLocationLoad, setInterestedLocationLoad] = useState(false);
    const [TLEOrbitLoad, setTLEOrbitLoad] = useState(false);
    const [load, setLoad] = useState(false);

    useEffect(()=>{
      const getData = async () => {
        setLoad(true);
        const data = await NembusProjectAdapter.getAnalysisFormMetaDataAdapter();
        setJsonMetaData(data.data);
        getInterestedLocationSnapshots();
        getInterestedLocation();
        getSateliteOrbitTLE();
        getAllSatelliteInformation();
        setLoad(false);
      }
      getData();
    },[]);

    // useEffect(()=>{
    //   const fetchSatData = async () => {
    //     try {
    //       setTLEDialogLoad(true);
    //       var apiSatData;
    //       if(page === -1) {
    //         apiSatData = await axios.get(`https://tle.ivanstanojevic.me/api/tle/?page=${page + 2}&page-size=${pageSize}`);
    //       } else {
    //         apiSatData = await axios.get(`https://tle.ivanstanojevic.me/api/tle/?page=${page + 1}&page-size=${pageSize}`);
    //       }
    //       const resultsArray = apiSatData.data.member;
    //       setTLEOrbitCount(apiSatData.data.totalItems);
    //       setTLEOrbitSatData([...resultsArray]);
    //       setTLEDialogLoad(false);
    //     } catch(error) {
    //       setTLEOrbitSatData([]);
    //       NotificationManager.error("Couldnot fetch orbit data.");
    //       setTLEDialogLoad(false);
    //     }
    //   }

    //   const fetchSatDataSearch = async () => {
    //     try {
    //       setTLEDialogLoad(true);
    //       var apiSatData;
    //       if(page === -1) {
    //         apiSatData = await axios.get(
    //           `https://tle.ivanstanojevic.me/api/tle/?page=${page + 2}&page-size=${pageSize}&search=${TLEOrbitSearch}`
    //         );
    //       } else {
    //         apiSatData = await axios.get(
    //           `https://tle.ivanstanojevic.me/api/tle/?page=${page + 1}&page-size=${pageSize}&search=${TLEOrbitSearch}`
    //         );
    //       }
    //       const resultsArray = apiSatData.data.member;
    //       setTLEOrbitCount(apiSatData.data.totalItems);
    //       setTLEOrbitSatData([...resultsArray]);
    //       setTLEDialogLoad(false);
    //     } catch (error) {
    //       setTLEOrbitSatData([]);
    //       NotificationManager.error("Couldnot fetch orbit data.");
    //       setTLEDialogLoad(false);
    //     }
    //   };

    //   if(TLEOrbitSearch !== "") {
    //     fetchSatDataSearch();
    //   } else {
    //     fetchSatData();
    //   }
    // },[page]);

    // useEffect(() => {
    //   const fetchSatData = async () => {
    //     try {
    //       setTLEDialogLoad(true);
    //       const apiSatData = await axios.get(
    //         `https://tle.ivanstanojevic.me/api/tle/?page=${1}&page-size=${pageSize}&search=${TLEOrbitSearch}`
    //       );
    //       const resultsArray = apiSatData.data.member;
    //       setTLEOrbitCount(apiSatData.data.totalItems);
    //       setTLEOrbitSatData([...resultsArray]);
    //       setTLEDialogLoad(false);
    //       setPage(0);
    //       console.log("page-search", TLEOrbitSearch);
    //     } catch (error) {
    //       setTLEOrbitSatData([]);
    //       NotificationManager.error("Couldnot fetch orbit data.");
    //       setTLEDialogLoad(false);
    //     }
    //   };
  
    //   fetchSatData();
    // }, [TLEOrbitSearch]);

    const onPageRefresh = async () => {
      try {
          setTLEDialogLoad(true);
          var apiSatData;
          if(page === -1){
            apiSatData = await axios.get(`https://tle.ivanstanojevic.me/api/tle/?page=${page + 2}&page-size=${pageSize}`);
          } else {
          apiSatData = await axios.get(`https://tle.ivanstanojevic.me/api/tle/?page=${page + 1}&page-size=${pageSize}`);
          }
          const resultsArray = apiSatData.data.member;
          setTLEOrbitCount(apiSatData.data.totalItems);
          setTLEOrbitSatData([...resultsArray]);
          setTLEDialogLoad(false);
      } catch(error) {
        setTLEOrbitSatData([]);
        NotificationManager.error("Couldnot fetch orbit data.");
        setTLEDialogLoad(false);
      }
    }

    const getAllSatelliteInformation = async () => {
      try {
        setTLEDialogLoad(true);
        const data = await NembusProjectAdapter.getAllSatelliteInformationAdapter();
        setTLEOrbitCount(data.length);
        setTLEOrbitSatData([...data]);
        setTLEDialogLoad(false);
      } catch(error) {
        setTLEOrbitSatData([]);
        NotificationManager.error("Couldnot fetch orbit data.");
        setTLEDialogLoad(false);
      }
    }

    const getInterestedLocationSnapshots = async () => {
      await NembusProjectService.getProjectInterestedLocationSnapshots(
        projectId,
        async (snapshot) => {
          // const data = await NembusProjectAdapter.getPorjectDataInterestedLocationAdapter(projectId);
          // console.log("change-data", data.data);
          const data = await NembusProjectAdapter.getGeoJsonCoordinatesInterestedLocationAdapter(projectId);
          console.log("change-data", data);
        }
      );
    }

    const getInterestedLocation = async () => {
      setLoad(true);
      const data = await NembusProjectAdapter.getPorjectDataInterestedLocationAdapter(projectId);
      setRows(data.data);
      setInterestedLocation(data.data);
      setLoad(false);
    }

    const getSateliteOrbitTLE = async () => {
      setLoad(true);
      const data = await NembusProjectAdapter.getProjectDataTLEOrbitAdapter(projectId);
      setTLERows(data.data);
      setTLEOrbits(data.data);
      setLoad(false);
    }

    const handleChange = (panel) => {
      if(panel === "panel1") {
        setExpanded1(!expanded1);
      } else {
        setExpanded2(!expanded2);
      }
    };

    const handleSheetChange = (event, sheet) => {
      setActiveSheet(sheet);
    };

    const handleDialogOpen = (element) => {
        setIsDialogOpen(true);
        setActiveJsonForm(element);
        setJsonData({});
        setJsonDataError(null);
    }

    const handleDialogClose = () => {
        setIsDialogOpen(false);
        setJsonDataError(null);
        setJsonData({});
    }

    const handleLocationDialogOpen = async () => {
      setDialogLocationLoad(true);
      setIsLocationDialogOpen(true);
      const data = await NembusProjectAdapter.getCountryListAdapter();
      setCountryLevel(data.data);
      setDialogLocationLoad(false);
    }

    const handleLocationDialogClose = () => {
      setIsLocationDialogOpen(false);
      setCountryLevel([]);
      setStateLevel([]);
      setSelectedLevel0('');
      setSelectedLevel1('');
    }

    const handleSelectedLevel0 = async (event) => {
      setDialogLocationLoad(true);
      setSelectedLevel0(event.target.value);
      const data = await NembusProjectAdapter.getCountrylevel1StateListAdapter(event.target.value);
      var array = [];
      var uniqueTags = [];
      data.data.map(element => {
          if(uniqueTags.indexOf(element.name) === -1) {
            uniqueTags.push(element.name);
            array.push(element);
          } else {
            element.name = `${element.name}, ${element.GID_0}`;
            uniqueTags.push(element.name);
            array.push(element);
          }
      });
      setStateLevel(array);
      setSelectedLevel1('');
      setDialogLocationLoad(false);
    }

    const handleSelectedLevel1 = (event) => {
      if(event.target.value !== undefined) {
        setSelectedLevel1(event.target.value);
      }
    }

    const requestSearch = (searchedVal) => {
      if(searchedVal === "") {
        setRows(interestedLocation);
      } else {
        const filteredRows = interestedLocation.filter((row) => {
          return row.label.toLowerCase().includes(searchedVal.toLowerCase());
        });
        setRows(filteredRows);
      }
    };
  
    const cancelSearch = () => {
      setSearchedInterestedLocation("");
      requestSearch(searchedInterestedLocation);
    };

    const requestTLEOrbitSearch = (searchedVal) => {
      if(searchedVal === "") {
        setTLERows(TLEOrbits);
      } else {
        const filteredRows = TLEOrbits.filter((row) => {
          return row.satelliteName.toLowerCase().includes(searchedVal.toLowerCase());
        });
        setTLERows(filteredRows);
      }
    };
  
    const cancelTLEOrbitSearch = () => {
      setSearchedTLEOrbits("");
      requestTLEOrbitSearch(searchedTLEOrbits);
    };

    const onDeleteRow = async (element) => {
      setInterestedLocationLoad(true);
      const result = await NembusProjectAdapter.deleteProjectDataInterestedLocationAdapter(projectId, element.id);
      if(result === true) {
        getInterestedLocation();
      }
      setInterestedLocationLoad(false);
    }

    const onReportSubmit = () => {
      if(jsonDataError !== null && jsonDataError.length === 0) {
        NotificationManager.success("Report Clicked.");
      } else if(jsonDataError !== null && jsonDataError.length > 0) {
        NotificationManager.error(`${jsonDataError[0].dataPath} ${jsonDataError[0].message}`);
      } else {
        NotificationManager.error("Some Error Occured");
      }
    }

    const onInterestedLocationSubmit = async () => {
      if(selectedLevel0 !== '') {
        var filterHelper = selectedLevel0;
        if(selectedLevel1 !== '') {
          filterHelper = `${filterHelper}, ${selectedLevel1}`;
        }
        const filter = interestedLocation.filter((current) => {
          return current.label === filterHelper;
        });
        if(filter.length === 0) {
          setLoad(true);
          setIsLocationDialogOpen(false);
          const result = await NembusProjectAdapter.addPorjectDataInterestedLocationAdapter(projectId, selectedLevel0, selectedLevel1);
          if(result === true) {
            getInterestedLocation();
          }
          setCountryLevel([]);
          setStateLevel([]);
          setSelectedLevel0('');
          setSelectedLevel1('');
          setLoad(false);
        } else {
          NotificationManager.error(`${filterHelper} is already added in your interested locations.`)
        }
      } else {
        NotificationManager.error("Please select your interested loaction.")
      }
    }

    //TLE functions
    const handleTLEDialogOpen = async () => {
      setPage(0);
      setSelectedTLEOrbitRow([]);
      setTLEOrbitSearch("");
      setIsTLEDialogOpen(true);
      await getAllSatelliteInformation();
    }

    const handleTLEDialogClose = () => {
      setPage(0);
      setSelectedTLEOrbitRow([]);
      setTLEOrbitSearch("");
      setIsTLEDialogOpen(false);
    }

    const handleTLETabsChange = (event, newValue) => {
      setTLETabs(newValue);
    }

    const checkTLEOrbitRowSelected = (rowData) => {
      var result = false;
      selectedTLEOrbitRow.map((element, index) => {
        if(element.noradId === rowData.noradId) {
          result = true;
        }
      });
      return result;
    }

    const onChangeTLEOrbitSearch = (event) => {
      setTLEOrbitSearch(event.target.value);
    }

    const handleChangePage = (event, newPage) => {
      setPage(newPage);
    };

    const onTLESubmit = async () => {
      if(selectedTLEOrbitRow.length > 0) {
        setLoad(true);
        setIsTLEDialogOpen(false);
        const result = await NembusProjectAdapter.addProjectDataTLEOrbitAdapter(projectId, selectedTLEOrbitRow);
        if(result === true) {
          getSateliteOrbitTLE();
        }
        setSelectedTLEOrbitRow([]);
        setTLEOrbitSearch("");
        setPage(0);
        setLoad(false);
      } else {
        NotificationManager.error("Please select satellite orbit")
      }
    }

    const onDeleteTLEOrbitRow = async (element) => {
      setTLEOrbitLoad(true);
      const result = await NembusProjectAdapter.deleteProjectDataTLEOrbitAdapter(projectId, element.docId);
      if(result === true) {
        getSateliteOrbitTLE();
      }
      setTLEOrbitLoad(false);
    }

    const handleOnTLEOrbitRowClicked = async (_selectedTLEOrbitRow) => {
      const filter = selectedTLEOrbitRow.filter((current) => {
        return _selectedTLEOrbitRow.noradId === current.noradId
      });
      const filter2 = TLERows.filter((current) => {
        return current.noradId === _selectedTLEOrbitRow.noradId
      });

      if(filter.length > 0) {
        setSelectedTLEOrbitRow(current => current.filter(item => item.noradId !== _selectedTLEOrbitRow.noradId))
      } else {
        if(filter2.length > 0) {
          NotificationManager.warning("Satellite orbit already added. This will override with new data.")
        }
        setSelectedTLEOrbitRow(current => [...current, _selectedTLEOrbitRow]);
      }
      e.preventDefault();
    }

    const onOpenInfo = (element) => {
      const fetchSatData = async () => {
            try {
              setOrbitInfoLoad(true);
              const apiSatData = await axios.get(
                `https://tle.ivanstanojevic.me/api/tle/?page=${1}&page-size=${1}&search=${element.noradId}`
              );
              console.log(apiSatData);
              var obj = element;
              obj.line1 = apiSatData.data.member[0].line1;
              obj.line2 = apiSatData.data.member[0].line2;
              obj.date = apiSatData.data.member[0].date;
              setOrbitInfo(obj);
              setOrbitInfoLoad(false);
              setIsInfoDialogOpen(true);
            } catch (error) {
              setOrbitInfo(null);
              setOrbitInfoLoad(false);
              setIsInfoDialogOpen(false);
              NotificationManager.error("Couldnot fetch orbit data.");
              console.log(error)
            }
          };
      
          fetchSatData();
    }

    const onCloseInfo = () => {
      setOrbitInfo(null);
      setIsInfoDialogOpen(false);
    }

  return (
    <div
    id="analysis"
    className={classes.root }
  >
  {load && <RctSectionLoader />} 
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
                  {sheets && props.navIcon === true &&
                    sheets.map((sheet, index) => (
                      <Tooltip title={sheet.sheetName}>
                        <Tab
                          style={{ maxWidth: "80px", minWidth: "60px"}}
                          value={sheet}
                          icon={<PersonPinIcon />}
                        />
                      </Tooltip>
                    ))}

                    {sheets && props.navIcon === false &&
                    sheets.map((sheet, index) => (
                      <Tab
                        style={{ maxWidth: "80px", minWidth: "60px"}}
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
            <div style={{ textAlign: "center" }}>
              <MuiAccordion square expanded={expanded1 === true}>
                <MuiAccordionSummary expandIcon={
                  <Tooltip title={expanded1 === true ? "collapse" : "expand"} placement='bottom'>
                    <ExpandMore onClick={() => handleChange('panel1')}/>
                  </Tooltip>
                } 
                aria-controls="panel1d-content" id="panel1d-header">
                  <h3 style={{ marginTop: "15px", cursor: "pointer" }} onClick={handleLocationDialogOpen} color="inherit">Add Interested Location {" "} 
                    <Tooltip title={`${interestedLocation.length} locations added`} placement='bottom'>
                      <Badge badgeContent={interestedLocation.length} color="primary">
                        <AddIcon fontSize="small" />
                      </Badge>
                    </Tooltip>
                  </h3>
                </MuiAccordionSummary>
                <MuiAccordionDetails>
                  <Paper style={{ overflowX: "auto" }}>
                    {interestedLocationLoad && <RctSectionLoader />} 
                    <SearchBar
                      value={searchedInterestedLocation}
                      onChange={(searchVal) => requestSearch(searchVal)}
                      onCancelSearch={() => cancelSearch()}
                    />
                    
                    <TableContainer component={Paper} style={{ overflowY: "auto" }}>
                      <Table className={classes.table} aria-label="simple table">
                        <TableHead>
                          <TableRow>
                            <TableCell>Name</TableCell>
                            <TableCell align="right">Actions</TableCell>
                          </TableRow>
                        </TableHead>
                        {
                          !load && !interestedLocationLoad && rows.length === 0 ? (
                            <TableBody>
                              <p style={{ color: "red" }}>No records found</p>
                            </TableBody>
                          ) : (
                            <TableBody>
                              {rows.map((element, index) => (
                                <TableRow key={element.label}>
                                    <TableCell component="th" scope="row">
                                      {element.label}
                                    </TableCell>
                                    <TableCell align="right"> 
                                      <Tooltip title={`delete location`} placement='bottom'>
                                        <Delete style={{ cursor: "pointer" }} onClick={() => onDeleteRow(element)}/> 
                                      </Tooltip>
                                    </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          )
                        }
                      </Table>
                    </TableContainer>
                  </Paper>
                </MuiAccordionDetails>
              </MuiAccordion>
              <MuiAccordion square expanded={expanded2 === true}>
                <MuiAccordionSummary expandIcon={
                  <Tooltip title={expanded2 === true ? "collapse" : "expand"} placement='bottom'>
                    <ExpandMore onClick={() => handleChange('panel2')}/>
                  </Tooltip>
                } aria-controls="panel2d-content" id="panel2d-header">
                  <h3 style={{ cursor: "pointer" }} onClick={handleTLEDialogOpen} color="inherit">Add Satellite Orbit {" "} 
                  <Tooltip title={"Badge"} placement='bottom'>
                    <Badge badgeContent={TLEOrbits.length} color="primary"> 
                      <AddIcon fontSize="small" />
                    </Badge>
                  </Tooltip>
                  </h3>
                </MuiAccordionSummary>
                <MuiAccordionDetails>
                  <Paper style={{ overflowX: "auto" }}>
                    {TLEOrbitLoad && <RctSectionLoader />} 
                    <SearchBar
                      value={searchedTLEOrbits}
                      onChange={(searchVal) => requestTLEOrbitSearch(searchVal)}
                      onCancelSearch={() => cancelTLEOrbitSearch()}
                    />
                    <TableContainer component={Paper} style={{ overflowY: "auto" }}>
                      <Table className={classes.table} aria-label="simple table">
                        <TableHead>
                          <TableRow>
                            <TableCell>Id</TableCell>
                            <TableCell>Name</TableCell>
                            <TableCell align="right">Actions</TableCell>
                          </TableRow>
                        </TableHead>
                        {
                          !load && !TLEOrbitLoad && TLERows.length === 0 ? (
                            <TableBody>
                              <p style={{ color: "red" }}>No records found</p>
                            </TableBody>
                          ) : (
                            <TableBody>
                              {TLERows.map((element, index) => (
                                <TableRow key={element.noradId}>
                                    <TableCell component="th" scope="row">
                                      {element.noradId}
                                    </TableCell>
                                    <TableCell align="right"> 
                                      {element.satelliteName}
                                    </TableCell>
                                    <TableCell align="right">
                                    <div style={{ display: "flex" }}>
                                      <Tooltip title={`Satellite orbit info`} placement='bottom'>
                                        <Info onClick={() => onOpenInfo(element)} style={{ cursor: "pointer", flex: "1" }}/> 
                                      </Tooltip>
                                      <Tooltip title={`delete satellite orbit`} placement='bottom'>
                                        <Delete style={{ cursor: "pointer", marginLeft: "1px" }} onClick={() => onDeleteTLEOrbitRow(element)}/> 
                                      </Tooltip>
                                    </div> 
                                    </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          )
                        }
                      </Table>
                    </TableContainer>
                  </Paper>
                </MuiAccordionDetails>
              </MuiAccordion>
            </div>
          ) : activeSheet.sheetName === "Analysis" && jsonMetaData && jsonMetaData.length > 0 ? (
            jsonMetaData.map((element, index) => {
              return <h2 style={{ marginTop: "30px", cursor: "pointer", textAlign: "center" }} onClick={() => handleDialogOpen(element)} color="inherit">{element && `${element.formTitle } ` }<AddIcon fontSize="small" /></h2>
            })
          ) : null
        }
      </Drawer>
    </div>
    <React.Fragment>
            <Dialog
               fullWidth={true}
               maxWidth={"sm"}
               open={isDialogOpen}
               onClose={handleDialogClose}
               aria-labelledby="max-width-dialog-title"
            >
               <DialogTitle style={{ display: "flex", alignItems: "center", justifyContent: "center" }} id="max-width-dialog-title">
                {activeJsonForm && `${activeJsonForm.formTitle }`}
               </DialogTitle>
               <DialogContent>
                  {
                    jsonMetaData && (
                      <JsonForms
                        schema={activeJsonForm && activeJsonForm.schema}
                        uischema={activeJsonForm && activeJsonForm.uiSchema}
                        data={jsonData}
                        renderers={materialRenderers}
                        cells={materialCells}
                        onChange={({ data, errors }) => {
                            setJsonData(data);
                            setJsonDataError(errors);
                          }}
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

    <React.Fragment>
            <Dialog
               fullWidth={true}
               maxWidth={"sm"}
               open={isLocationDialogOpen}
               onClose={handleLocationDialogClose}
               aria-labelledby="max-width-dialog-title"
            >
              {countryLevel.length > 0 && dialogLocationLoad && <RctSectionLoader />} 
               <DialogTitle style={{ display: "flex", alignItems: "center", justifyContent: "center" }} id="max-width-dialog-title">
                  Add Interested Location
               </DialogTitle>
               <DialogContent>
                  <FormControl variant="outlined" style={{ minWidth: "100%" }}>
                    <InputLabel id="demo-simple-select-outlined-label">Level 0</InputLabel>
                    <Select
                      labelId="demo-simple-select-outlined-label"
                      id="demo-simple-select-outlined"
                      value={selectedLevel0}
                      onChange={handleSelectedLevel0}
                      label="Level 0"
                    >
                      {
                        countryLevel.map((item, index) => {
                          return <MenuItem value={item}>{item}</MenuItem>
                        })
                      }
                    </Select>
                  </FormControl>

                      <FormControl variant="outlined" style={{ minWidth: "100%", marginTop: "20px" }}>
                        <InputLabel id="demo-simple-select-outlined-label">Level 1</InputLabel>
                        <Select
                          labelId="demo-simple-select-outlined-label"
                          id="demo-simple-select-outlined"
                          value={selectedLevel1}
                          onChange={handleSelectedLevel1}
                          label="Level 1"
                        >
                          {stateLevel.length === 0 && <MenuItem>No Records</MenuItem>}
                          {
                            stateLevel.map((item, index) => {
                              return <MenuItem value={item.name}>{item.name}</MenuItem>
                            })
                          }
                        </Select>
                      </FormControl>


                  <div style={{ marginTop: "65px" }} className="d-flex flex-end justify-content-end align-items-center">
                        <Button
                           color="primary"
                           variant="contained"
                           className="mt-3 mb-3"
                           onClick={onInterestedLocationSubmit}
                        >
                           Submit
                        </Button>            
                  <Button
                     onClick={handleLocationDialogClose}
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

    <React.Fragment>
            <Dialog
               fullWidth={true}
               maxWidth={"md"}
               open={isTLEDialogOpen}
               onClose={handleTLEDialogClose}
               aria-labelledby="max-width-dialog-title"
            >
              {TLEOrbitSatData.length === 0 && TLEDialogLoad && <RctSectionLoader />} 
               <DialogTitle style={{ display: "flex", alignItems: "center", justifyContent: "center" }} id="max-width-dialog-title">
                  Add Satellite Orbit
               </DialogTitle>
               <DialogContent>
                  <div>
                    <Box sx={{ width: '100%' }}>
                      <Box style={{ backgroundColor: "#cbcbdd" }} sx={{ borderBottom: 1, borderColor: 'divider' }}>
                        <Tabs value={TLETabs} onChange={handleTLETabsChange} aria-label="basic tabs example">
                          <Tab label="Add Satellite by Name" {...a11yProps(0)} />
                          <Tab label="Add Satellite by Constellation" {...a11yProps(1)} />
                        </Tabs>
                      </Box>
                      <TabPanel value={TLETabs} index={0}>
                        {/* <TextField
                          id="standard-basic"
                          label="Search Orbit"
                          placeholder="Search by Satellite id or Name"
                          onChange={onChangeTLEOrbitSearch}
                          variant="outlined"
                          helperText="Search by Satellite id or Name"
                          fullWidth
                        /> */}

                        {TLEOrbitSatData.length >= 0 && (
                          <MaterialTable
                            isLoading={TLEDialogLoad === true ? true : false}
                            icons={tableIcons}
                            columns={[
                              { title: "Id", field: "noradId", 
                              cellStyle: {
                                paddingLeft: '6px',
                                paddingRight: '2px'
                              }},
                              { title: "Name", field: "satelliteName", cellStyle: {
                                  paddingLeft: '2px',paddingRight: '2px',
                                }
                              },
                              {
                                title: "Operator",
                                field: "Operator",
                                cellStyle: {
                                  paddingLeft: '2px',
                                  paddingRight: '2px'
                                }
                              },
                              {
                                title: "Type",
                                field: "Type / Application",
                                cellStyle: {
                                  paddingLeft: '2px',
                                  paddingRight: '2px'
                                }
                              },
                              {
                                title: "Country",
                                field: "MainNation",
                                cellStyle: {
                                  paddingLeft: '2px',paddingRight: '2px',
                                },
                              },
                              // { title: "Date of Epoch", field: "date", width: "0.75%",
                              // cellStyle: {
                              //   paddingLeft: '6px',
                              //   paddingRight: '2px'
                              // }},
                            ]}
                            data={TLEOrbitSatData}
                            options={{
                              // toolbar: false,
                              search: true,
                              selection: true,
                              showTitle: false,
                              grouping: true,
                              filtering: true,
                              rowStyle: (rowData) => ({
                                backgroundColor:
                                selectedTLEOrbitRow.length > 0 && checkTLEOrbitRowSelected(rowData)
                                    ? "#b2ffb2"
                                    : "#FFF",
                              }),
                            }}
                            onRowClick={(evt, _selectedTLEOrbitRow) => {
                              handleOnTLEOrbitRowClicked(_selectedTLEOrbitRow);
                            }}
                            onSelectionChange={(data, _selectedTLEOrbitRow) => {
                              handleOnTLEOrbitRowClicked(_selectedTLEOrbitRow);
                            }}
                            // components={{
                            //   Pagination: (props) => (
                            //     <TablePagination
                            //       component="div"
                            //       colSpan={props.colSpan}
                            //       count={TLEOrbitCount}
                            //       rowsPerPageOptions={[5]}
                            //       rowsPerPage={pageSize}
                            //       page={page === -1 ? page + 1 : page}
                            //       onChangePage={handleChangePage}
                            //       ActionsComponent={TablePaginationActions}
                            //     />
                            //   ),
                            //   Toolbar: (props) => (
                            //     <div>
                            //       <MTableToolbar
                            //         {...props}
                            //       />
                            //     </div>
                            //   ),
                            // }}
                            localization={{
                              body: {
                                  emptyDataSourceMessage: (
                                      <p>Couldnot fetch satellite orbit data. <Button color="primary" onClick={getAllSatelliteInformation}>Refresh</Button></p>
                                  ),
                              },
                            }}
                          />
                        )}
                      </TabPanel>
                      <TabPanel value={TLETabs} index={1}>
                        To be added..
                      </TabPanel>
                    </Box> 
                  </div>                     
                  <div style={{ marginTop: "65px" }} className="d-flex flex-end justify-content-end align-items-center">
                        <Button
                           color="primary"
                           variant="contained"
                           className="mt-3 mb-3"
                           onClick={onTLESubmit}
                        >
                           Submit
                        </Button>            
                  <Button
                     onClick={handleTLEDialogClose}
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

    <React.Fragment>
            <Dialog
               fullWidth={true}
               maxWidth={"md"}
               open={isInfoDialogOpen}
               onClose={onCloseInfo}
               aria-labelledby="max-width-dialog-title"
            >
              {orbitInfo === null && orbitInfoLoad && <RctSectionLoader />}
               <DialogTitle style={{ display: "flex", alignItems: "center", justifyContent: "center" }} id="max-width-dialog-title">
                  Satellite Orbit Information
               </DialogTitle>
               <DialogContent>
                  
               <TableContainer component={Paper} style={{overflowX: "auto" }}>
                      <Table className={classes.table} aria-label="simple table">
                        <TableHead>
                          <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell align="right">Name</TableCell>
                            <TableCell align="right">Operator</TableCell>
                            <TableCell align="right">Country</TableCell>
                            <TableCell align="right">Line 1</TableCell>
                            <TableCell align="right">Line 2</TableCell>
                            <TableCell align="right">Date Of Epoch</TableCell>
                          </TableRow>
                        </TableHead>
                        {
                          orbitInfo === null ? (
                            <TableBody>
                              <p style={{ color: "red" }}>No records found</p>
                            </TableBody>
                          ) : (
                            <TableBody>
                              <TableRow key={orbitInfo.satelliteId}>
                                <TableCell component="th" scope="row">
                                  {orbitInfo.noradId}
                                </TableCell>
                                <TableCell align="right">
                                  {orbitInfo.satelliteName}
                                </TableCell>
                                <TableCell align="right">
                                  {orbitInfo.Operator}
                                </TableCell>
                                <TableCell align="right">
                                  {orbitInfo.MainNation}
                                </TableCell>
                                <TableCell align="right">
                                  {orbitInfo.line1}
                                </TableCell>
                                <TableCell align="right">
                                  {orbitInfo.line2}
                                </TableCell>
                                <TableCell align="right">
                                  {orbitInfo.date}
                                </TableCell>
                              </TableRow>
                            </TableBody>
                          )
                        }
                      </Table>
                    </TableContainer>

                  <div style={{ marginTop: "65px" }} className="d-flex flex-end justify-content-end align-items-center">           
                    <Button
                      color="primary"
                      onClick={onCloseInfo}
                      variant="contained"
                      className="m-3 btn"
                      autoFocus
                    >
                      Close
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

export default connect(mapStateToProps, mapDispatchToProps)(DrawerPanel);