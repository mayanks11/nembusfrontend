import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { JsonForms } from "@jsonforms/react";
import { bindActionCreators } from "redux";
import { auth, fireStore } from "Firebase/index";
import {
  materialRenderers,
  materialCells,
} from "@jsonforms/material-renderers";
import { Actions } from "@jsonforms/core";
import { get, isEmpty, cloneDeep ,has, clone} from "lodash";
import PropTypes from "prop-types";
import { withStyles, makeStyles, useTheme } from "@material-ui/core/styles";
import classNames from "classnames";
import Drawer from "@material-ui/core/Drawer";
import Toolbar from "@material-ui/core/Toolbar";
import List from "@material-ui/core/List";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import { useToggle } from "react-use";
import * as firebase from "firebase";
// import {getDocs} from "firebase/firestore";
import { setAnalysisCollection } from "../../../../../actions/SimAnalysisActions";
import {
  UpdatetheAnlysis,
  removetheDropPath,
  setErrorStatus,
} from "Api/PostAnalysis";
// import "react-reflex/styles.css";
// import { ReflexContainer, ReflexSplitter, ReflexElement } from "react-reflex";
import TreeView from "@material-ui/lab/TreeView";
import useStateRef from "react-usestateref";
import Chart from "./egraphs.js";
import {
  Menu,
  MenuItem,
  Button,
  CircularProgress,
  Tabs,
  Tab,
  AppBar,
  Modal,
  Backdrop,
  Tooltip,
} from "@material-ui/core";
import EditIcon from "@material-ui/icons/Edit";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import ExpandIcon from './ExpandIcon';
import CollapseIcon from './CollapseIcon';
import ClearAllIcon from "@material-ui/icons/ClearAll";
import ExpandRoundedIcon from '@material-ui/icons/UnfoldMore';
import CloseIcon from "@material-ui/icons/Close";
import TextField from "@material-ui/core/TextField";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import TreeItem from "@material-ui/lab/TreeItem";
import AddIcon from "@material-ui/icons/AddCircle";
import { JsonFormsReduxContext, JsonFormsDispatch } from "@jsonforms/react";
import { NotificationManager } from "react-notifications";
import "./style.scss";
import SheetTab from "./SheetTab";
import SearchBar from "material-ui-search-bar";
// import { applyProps } from "react-three-fiber";
import { useFirebase } from "react-redux-firebase";
import { LinearProgress } from "@material-ui/core";
import SvgIcon from '@material-ui/core/SvgIcon';
import { dragImg } from './dragImage.png';
import SimulationService from "Api/Simulate";
import { useImmer } from 'use-immer';
import DataTable from './DataTable';
import {
  SplitPane,
  SplitPaneProps,
  ResizerOptions,
  CollapseOptions,
  SplitPaneHooks,
} from "react-collapse-pane";

import VisibilityReportTester from "Components/CustomJsonRenderer/VisibilityReport/VisibilityReportTester";
import VisibilityReportControl from "Components/CustomJsonRenderer/VisibilityReport/VisibilityReportControl";

const renderers = [
    ...materialRenderers,
    //register custom renderers
    { tester: VisibilityReportTester, renderer: VisibilityReportControl },];
import { useDrag, useDrop } from 'react-dnd';
import { ItemTypes } from './tree/Constants';
import DisplayAnlysisTree from './tree/ViewTree';
import 'react-virtualized/styles.css';
import 'material-icons/css/material-icons.css';

import { TreeViewLabel } from './TreeViewLabel';

import axios from "axios";

export const HighlightedText = (props) => {
  return props.text && props.label.includes(props.text) ? (
    <mark style={{ backgroundColor: 'yellow' }}>{props.label}</mark>
  ) : (
    props.label
  );
};



const drawerWidth = "20%";

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    // zIndex: -9,
    [theme.breakpoints.up('sm')]: {
      height: `calc(100vh - 96px)`,
    },
    [theme.breakpoints.down('sm')]: {
      height: `calc(100vh - 112px)`,
    },
    // marginTop: theme.spacing(0),
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
    // width: drawerWidth,
    [theme.breakpoints.up('sm')]: {
      maxHeight: `calc(100vh - 48px)`,
    },
    [theme.breakpoints.down('sm')]: {
      maxHeight: `calc(100vh - 64px)`,
    },
    overflowY:'auto'
    
   
    // padding : "1rem"
  },
  drawerHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    // padding: "0 8px",
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
    marginTop: 10,
    // [theme.breakpoints.up("sm")]: {
    //   height: "calc(100% - 48px)",
    //   marginTop: 48,
    // },
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
    // minHeight: '87vh',
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


const PreAnalysisDrawer = (props) => {
  const classes = useStyles();
  // const theme = useTheme();
  // const projectId = 'FU5iLIZ9YNy6bk8w8kgg'
  // const simulationId = 'DBIyMtK1XTwA1d1NDYHP'
  const [open, setOpen] = useState(false);
  // const firebaseContext = useFirebase()
  const [formData, setFormData] = useState({
    sheet_id: null,
    data: null,
    schema: null,
    uischema: null,
  });

  const [formError, setFormError] = useState([])
  const {
    simulate,
    RunDataReducer,
    setAnalysisCollection,
    analysisReduxData_Reducer,
    analysisSheetinfo,
    setAnalysisSheetTab,
    // isHeaderCollapsed,
  } = props;

  const simulationId = simulate.getIn(["case", "id"]);
  const projectId = simulate.getIn(["project", "id"]);

  const [formDataArray, setFormDataArray] = useState([]);


  const [jsonFile, setJsonFile] = useState([]);
  // const [dropItem, setDropItem, dropItemRef] = useStateRef({});
  const [dropItem, setDropItem] = useState(null);
  const [dropItemsArray, setDropItemsArray,dropItemsArrayRef] = useStateRef([]);
  const [anchor, setanchor] = useState("left");
  const [searchtext, setsearchtext] = useState("");
  const [anchorEl, setAnchorEl] = useState(null);
  const [sheets, setSheets] = useState([]);
  const [sheetsLoading, setSheetsLoading] = useState(false);
  const [activeSheet, setActiveSheet] = useState(null);
  const [formId, setFormId] = useState(" ");
  const [formState, setFormState] = useState({});
  const [runUserId,setRunUserId] = useState("")
  const [analysisData, setAnalysisData] = useState({ analysisstatus: -1 });
  const [backdrop, setBackdrop] = useState(false);
  const [nowUseAddTrigger, setNowUseAddTrigger] = useState(false);
  const [sheetDropdown, setSheetDropdown] = useState({
    bool: false,
    index: null,
  });
  const [loading, setLoading] = useState(true);
  const [loaders, setLoaders] = useState({
    drawer_loader: false,

    addSheet: false,
  });
  const [userIdToken, setUserIdToken] = useState("");
  const [renameTrigger, setrenameTrigger] = useState(null);
  const [renameSheetValue, setRenameSheetValue] = useState("");
  let [chart, setChart] = useState(null);

  const schema = {};
  const uiSchema = {};
  const data = {};

  const updatePlot = (activeSheetData) => {
    const plot_graph_collection = activeSheetData.plot_graph_collection;
    const plot_graph_template = activeSheetData.plot_graph_template;
    const plot_graph_options = cloneDeep(activeSheetData.plot_graph_options);

    const plot_type = get(activeSheetData,'plot_type','old_type')

    

    if (!isEmpty(plot_graph_options)) {
      if (chart) {
        chart.showLoading({
          text: "loading",
          color: "#c23531",
          textColor: "#000",
          maskColor: "rgba(255, 255, 255, 0.2)",
          zlevel: 0,
        });
      }


      if (plot_type ==='old_type'){

        const data = appenData(plot_graph_options, plot_graph_collection).then(
          (data) => {
            plot_graph_options.series.forEach((element, index) => {
              element.data = [...data[index]];
            });
  
            chart.hideLoading();
            chart.clear();
  
            chart.setOption(plot_graph_options);
          }
        );

      }
      else if(plot_type ==='Ground_station_contact'){

        const fileInformation = get(plot_graph_options,'fileInformation')
    
        groundStationContact(fileInformation).then((data)=>{

         

          plot_graph_options.series.forEach((element, index)=>{

           
            element.data = [...data[index+1]];
            const duration_info = cloneDeep(element.markArea.data)
            element.markArea.data=[]
            element.markArea.data.push(cloneDeep(duration_info))

          })

        
          chart.hideLoading();
          chart.clear();

          chart.setOption(plot_graph_options);
        })


      }
      else if (plot_type ==='Satellite Visibility Report'){

        const fileInformation = get(plot_graph_options,'fileInformation')
        groundStationContact(fileInformation).then((data)=>{

        
          plot_graph_options.xAxis.data=cloneDeep(data.date)

          plot_graph_options.series = cloneDeep(data.series)

         
          chart.hideLoading();
          chart.clear();

          chart.setOption(plot_graph_options);

        })

      }
      
     

    } else if (!isEmpty(plot_graph_template)) {
      // First everything
      updateOptions((draft) => {
        draft.series.splice(0, draft.series.length);
      });
      plot_graph_template.forEach((element) => {
        updateOptions((draft) => {
          draft.series.push(element);
        });
      });

      plot_graph_template.forEach((element) => {
        const file_id = get(element, ["fileid"]);
        const graph_detail = get(plot_graph_collection, [file_id]);
        const url = get(graph_detail, ["public_url"]);
        fetchplotdata(url, file_id);
      });
    } else {
      updateOptions((draft) => {
        var i;
        for (i = 0; i < draft.series.length; i++) {
          draft.series.pop();
        }
      });

      if (chart) {
        chart.showLoading({
          text: "loading",
          color: "#c23531",
          textColor: "#000",
          maskColor: "rgba(255, 255, 255, 0.2)",
          zlevel: 0,
        });
      }

      setTimeout(() => {
        chart.hideLoading();
        chart.clear();
        chart.setOption(defaultoption);
      }, 1000);

      // chart.hideLoading();
    }
  };

  const defaultoption = {
    title: {
      text: " ",
      left: "left",
      padding: [
        0, // up
        0, // right
        0, // down
        0, // left
      ],
    },
    animation: false,
    tooltip: {
      trigger: "axis",
      axisPointer: {
        type: "cross",
      },
    },
    axisPointer: {
      link: { xAxisIndex: "all" },
      label: {
        backgroundColor: "#777",
      },
    },

    toolbox: {
      right: "20%",
      orient: "horizontal",
      feature: {
        dataZoom: {},
        saveAsImage: {},
      },
    },
    legend: {
      align: "left",
      orient: "horizontal",
    },
    xAxis: {
      type: "value",
      name: "sim time(sec)",
      nameLocation: "middle",
      minorTick: {
        show: true,
      },
      minorSplitLine: {
        show: true,
      },
      splitLine: {
        show: false,
      },
    },
    yAxis: {
      name: "y",
      nameLocation: "middle",
      minorTick: {
        show: true,
      },
      minorSplitLine: {
        show: true,
      },
    },
    dataZoom: [
      {
        show: true,
        type: "inside",
        filterMode: "none",
        xAxisIndex: [0],
      },
      {
        show: true,
        type: "inside",
        filterMode: "none",
        yAxisIndex: [0],
      },
    ],
    series: [],
  };

  const [options, updateOptions] = useImmer({
    title: {
      text: " ",
      left: "left",
      padding: [
        0, // up
        0, // right
        0, // down
        0, // left
      ],
    },
    animation: false,
    tooltip: {
      trigger: "axis",
      axisPointer: {
        type: "cross",
      },
    },
    axisPointer: {
      link: { xAxisIndex: "all" },
      label: {
        backgroundColor: "#777",
      },
    },

    toolbox: {
      right: "20%",
      orient: "horizontal",
      feature: {
        dataZoom: {},
        saveAsImage: {},
      },
    },
    legend: {
      align: "left",
      orient: "horizontal",
    },
    xAxis: {
      type: "value",
      name: "sim time(sec)",
      nameLocation: "middle",
      minorTick: {
        show: true,
      },
      minorSplitLine: {
        show: true,
      },
      splitLine: {
        show: false,
      },
    },
    yAxis: {
      name: "y",
      nameLocation: "middle",
      minorTick: {
        show: true,
      },
      minorSplitLine: {
        show: true,
      },
    },
    dataZoom: [
      {
        show: true,
        type: "inside",
        filterMode: "none",
        xAxisIndex: [0],
      },
      {
        show: true,
        type: "inside",
        filterMode: "none",
        yAxisIndex: [0],
      },
    ],
    series: [],
  });

  const fetchplotdata = async (url, fileid) => {
    // do something

    let config = {
      method: "get",
      url: url,
      headers: {
        "Content-Type": "application/json",
      },
    };

    await axios(config)
      .then((response) => {
        updateOptions((draft) => {
          const index = draft.series.findIndex((plt) => plt.fileid === fileid);

          if (index !== -1) {
            draft.series[index].data = [...response.data];
          }
        });
      })
      .catch((error) => {
         console.error("got error data ", error);
      });
  };

  const appenData = async (plot_graph_options, plot_data_urls) => {
    const pArray = plot_graph_options.series.map(async (plotData, index) => {
      const public_url = get(plot_data_urls[plotData.fileid], ["public_url"]);
      let config = {
        method: "get",
        url: public_url,
        headers: {
          "Content-Type": "application/json",
        },
      };

      const response = await axios(config);

      return response.data;
    });

    const plotdatas = await Promise.all(pArray);
    return plotdatas;
  };


  const groundStationContact = async (data_url) => {

      let config = {
        method: "get",
        url: data_url,
        headers: {
          "Content-Type": "application/json",
        },
      };

      const response = await axios(config);

      return response.data;


  }

  useEffect(() => {
    if (activeSheet) {

     

      if (!isEmpty(dropItemsArrayRef.current)) {
        let item = dropItemsArrayRef.current.find(
          (item) => activeSheet.id === item.sheet_id
        );

        
        
        if (item) {
        
          
          setDropItem(item.value);
        } else {
          let temp = dropItemsArrayRef.current;
          temp.push({
            sheet_id: activeSheet.id,
            value: null,
          });

          
          setDropItemsArray([...temp]);

     
          setDropItem(null);
        }
      }
      else {
        let temp = dropItemsArrayRef.current;
        temp.push({
          sheet_id: activeSheet.id,
          value: null,
        });
    
        setDropItemsArray([...temp]);
       
        setDropItem(null);
      }

      if (formDataArray.length > 0) {
        let item = formDataArray.find(
          (item) => activeSheet.id === item.sheet_id
        );
        if (item) {
          setFormData({
            ...item,
            sheet_id: item.sheet_id,
            data: item.data,
            schema: item.schema,
            uischema: item.uiSchema,
          });
        } else {
          let temp = formDataArray;
          const newForm = {
            sheet_id: activeSheet.id,
            data: data,
            schema: schema,
            uischema: uiSchema,
          };
          temp.push(newForm);
          setFormDataArray([...temp]);
          setFormData(newForm);
        }
      } else {
        let temp = formDataArray;
        const newForm = {
          sheet_id: activeSheet.id,
          data: data,
          schema: schema,
          uischema: uiSchema,
        };
        temp.push(newForm);
        setFormDataArray([...temp]);
        setFormData(newForm);
      }
    }
  }, [activeSheet]);

  useEffect(() => {
    if (
      formData.sheet_id &&
      formData.data &&
      formData.uischema &&
      formData.schema
    ) {
      props.JsonFormsAction(formData.data, formData.schema, formData.uischema);
    }
  }, [formData]);

  const StyledTreeItem = withStyles({
    group: {
      marginLeft: 7,
      paddingLeft: 18,
      borderLeft: `1px dashed`,
    },
  })((props) => <TreeItem {...props} />);

  const [dragState, setDragState] = useState(false);

  const createSubNodes = (state, node, path, searchtext) => {
    if (state.analysistypes && state.analysistypes.length > 0) {
      //child === analysistypes
      return (
        <StyledTreeItem
          className="treeNode"
          nodeId={state.id}
          label={<HighlightedText text={searchtext} label={state.name} />}
          id={state.id}
        >
          {state.analysistypes.map(
            (it) =>
              createSubNodes(it, node, path + '/' + state.name, searchtext),
            expandedArr.push(state.id)
          )}
        </StyledTreeItem>
      );
    } else {
      return (
        <TreeViewLabel searchtext={searchtext} setDragState={setDragState} node={state} />
      );
    }
  };
  const setDropItemFunc = async (nodeinfo,path) => {
    
    setBackdrop(true);
    
    let item ={}
    item['state'] = nodeinfo;
    item['path'] = path

    const runConfigData = await SimulationService.getRunConfigurationDetails(projectId, simulationId, item.state.configuration_id)
    
    if(runConfigData){
      setRunUserId(runConfigData.UserDocumentID);
    }
    setFormState(item.state);
   
    setDropItem({ path: item.path, name: item.state.name, id: item.state.id });

  

    let jsonformId = get(item, "state.formid", "aIOnZ8iyCD71IBTFI9DP");

    if (jsonformId) {
    } else {
      jsonformId = "aIOnZ8iyCD71IBTFI9DP";
    }

    const formData1 = await getFormData(jsonformId);
    
    if (formData1) {
      let dropItem_value = dropItemsArrayRef.current.find(
        (item) => activeSheet.id === item.sheet_id
      );
      let dropItemIndex = dropItemsArrayRef.current.findIndex(
        (item) => activeSheet.id === item.sheet_id
      );

      if (dropItem_value) {

        let temp = cloneDeep(dropItemsArrayRef.current);
        temp[dropItemIndex].value = item;
       
        setDropItemsArray([...temp]);
      }
      setBackdrop(false);
      setOpen(true);
    } else {
      // Notification of error and close setBackdrop
      setBackdrop(false);
      NotificationManager.error("cannot fetch form data please try again");
    }
    // TODO : check if form id is null or not
    // if not null

    // fetch for database = > if unable show error

    // setFormId(item.state.formid);
  };

  const getSheetCollection = (analysisReduxData) => {
    setSheetsLoading(true);

    

    let sheetReduxdata = [];
    analysisReduxData.simulationAnalysisCollection.map((ele) => {
      let sheetObj = { id: ele.id, sheetname: ele.sheetname };
      sheetReduxdata.push(sheetObj);
    });
    // do something
    setSheets(sheetReduxdata);

    sheetReduxdata.length > 0 && setActiveSheet(sheetReduxdata[0]);

    

    let dropAreaValuesReduxdata = [];
    analysisReduxData.simulationAnalysisCollection.map((ele) => {
      dropAreaValuesReduxdata.push(ele.drop_area ? ele.drop_area : null);
    });
    dropAreaValuesReduxdata.map((element) => {
      let elementarr = []
      if (element) {
       
        setDropItemsArray( [...dropItemsArrayRef.current,element]);
       

        
        
      }
     
    });
    setSheetsLoading(false);
  };

  /**
   * Not required moved to redux instead of calling
    const getData = async () => {
      try {
        const getAnalysisFile = firebase
          .app()
          .functions('us-central1')
          .httpsCallable('generateAnalysisTree');

        let data = await getAnalysisFile({
          projectid: projectId,
          simulationid: simulationId,
        });
        console.log("RunData getRun", data);
        const { status, message } = data.data;

        data = data.data.data;
        if (status === "ok") {
          setJsonFile(data);

          setLoading(false);
          setLoaders({ ...loaders, drawer_loader: false });
          console.log("RunData Status ok", data, jsonFile);
        } else {
          NotificationManager.error(message);
          setLoaders({ ...loaders, drawer_loader: false });
          console.log("RunData Status not ok", data, jsonFile);
        }
      } catch (error) {
        NotificationManager.error("Cannot Find Any Run data");
        setLoaders({ ...loaders, drawer_loader: false });
      }
    };
*/

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  const resetSheet = (index, sheet) => {
    let temp = sheets;
    if (temp[index]) {
      temp[index] = sheet;
    }
    setSheets([...temp]);
  };

  useEffect(() => {
    if (analysisSheetinfo.isloaded) {
      getSheetCollection(analysisSheetinfo);
      setLoaders({ ...loaders, drawer_loader: true });
      setNowUseAddTrigger(true);
    }
  }, [analysisSheetinfo.isloaded]);

  useEffect(() => {
    if (nowUseAddTrigger) {
      const index = analysisSheetinfo.simulationAnalysisCollection.findIndex(
        (ele) => ele.id === analysisReduxData_Reducer.idAdded
      );

      if (index == -1) {
        const last_item_index =
          analysisReduxData_Reducer.simulationAnalysisCollection.length - 1;

        setAnalysisSheetTab((draft) => {
          draft.simulationAnalysisCollection.push(
            cloneDeep(
              analysisReduxData_Reducer.simulationAnalysisCollection[
              last_item_index
              ]
            )
          );
        });
      }
    }
  }, [analysisReduxData_Reducer.isAddedNewtoggle]);

  useEffect(() => {
    if (analysisReduxData_Reducer.isModifytoggele > 0 && activeSheet) {
      const index = analysisSheetinfo.simulationAnalysisCollection.findIndex(
        (ele) => ele.id === analysisReduxData_Reducer.idModified
      );

      if (index > -1) {
        if (activeSheet.id === analysisReduxData_Reducer.idModified) {
          updatePlot(
            cloneDeep(
              analysisReduxData_Reducer.simulationAnalysisCollection[index]
            )
          );
          
          setActiveSheet(
            cloneDeep(
              analysisReduxData_Reducer.simulationAnalysisCollection[index]
            )
          );
        }

        setAnalysisSheetTab((draft) => {
          draft.simulationAnalysisCollection[index] = cloneDeep(
            analysisReduxData_Reducer.simulationAnalysisCollection[index]
          );
        });
      }
    }
  }, [analysisReduxData_Reducer.isModifytoggele]);

  useEffect(() => {
    if (analysisReduxData_Reducer.isRemovedtoggel > 0 && activeSheet) {
      const index = analysisSheetinfo.simulationAnalysisCollection.findIndex(
        (ele) => ele.id === analysisReduxData_Reducer.idRemoved
      );

      if (index > -1) {
        setAnalysisSheetTab((draft) => {
          draft.simulationAnalysisCollection.splice(index, 1);
        });
      }
    }
  }, [analysisReduxData_Reducer.isRemovedtoggel]);

 

  const getFormData = async (formId1) => {
    const doc = await firebase
      .app()
      .firestore()
      .collection("AnalysisForms")
      .doc(formId1)
      .get();
    if (!doc.exists) {
      return false;
    } else {
      const formDefaultData = doc.data();
      setFormData({
        ...formData,
        data: formDefaultData.data,
        schema: formDefaultData.schema,
        uischema: formDefaultData.uischema,
      });

      return formDefaultData;
    }
  };
  const postFormData = async () => {


    
    if(!isEmpty(formError)){

     
      NotificationManager.error(formError[0].message);
      return
    }
    const simulationId = simulate.getIn(["case", "id"]);
    const projectId = simulate.getIn(["project", "id"]);
    const { user_id } = props;

    let dropitemValus = dropItemsArrayRef.current.find(
      (item) => activeSheet.id === item.sheet_id
    );
    if (dropitemValus) {
    }

    UpdatetheAnlysis({
      projectId: projectId,
      simulationId: simulationId,
      analysisSheetId: activeSheet.id,
      data: {
        drop_area: dropitemValus,
        form_data: formData,
      },
    });

    auth.currentUser.getIdToken().then(async (idToken) => {
      const myHeaders = new Headers();
      myHeaders.append("Authorization", `Bearer ${idToken}`);
      myHeaders.append("Content-Type", "application/json");

      const raw = JSON.stringify({
        project_id: projectId,
        simulation_id: simulationId,
        analysis_info: {
          ...formState,
        },
        sheet_id: activeSheet.id,
        form_info: formData,
        user_id: user_id,
        run_user_id :runUserId
      });
      
      
      // const url ="https://generatingreport-dcyfkp3xea-uc.a.run.app/post_analysis";
      const url ="https://generatingreport-dcyfkp3xea-uc.a.run.app/post_analysis";
      // const url = "http://localhost:8083/post_analysis";

      let config = {
        method: "post",
        url: url,
        headers: {
          Authorization: `Bearer ${idToken}`,
          "Content-Type": "application/json",
        },
        data: raw,
      };

      setOpen(false);
      setBackdrop(true);

      await axios(config)
        .then(function (response) {
          setBackdrop(false);
        })
        .catch(function (error) {
          
          setErrorStatus({
            projectId: projectId,
            simulationId: simulationId,
            analysisSheetId: activeSheet.id,
          });
          setBackdrop(false);
        });
    });
  };
  const renameSheet = async (index, sheet, name) => {
    if (analysisData.analysisstatus !== 0) {
      await firebase
        .firestore()
        .collection("PROJECT")
        .doc(projectId)
        .collection("Simulation")
        .doc(simulationId)
        .collection("Analysis")
        .doc(sheet.id)
        .update({ sheetname: name });
    }
  };
  const removeSheet = async (index, sheet) => {

    if (analysisData.analysisstatus !== 0) {

      if (sheets.length < 2) {
        NotificationManager.error("Atleast one sheet should be there");
      }
      else {
        let temp = sheets;
        temp.splice(index, 1);

        await firebase
          .firestore()
          .collection("PROJECT")
          .doc(projectId)
          .collection("Simulation")
          .doc(simulationId)
          .collection("Analysis")
          .doc(sheet.id)
          .delete();

        if (sheet.id === activeSheet.id) {
         
          setActiveSheet(sheets[0])
        }
        setSheets([...temp]);
      }
    }
  };
  const addNewSheets = async () => {
    const addNewSheet = firebase
      .app()
      .functions("us-central1")
      .httpsCallable("addNewSheet");

    let data = await addNewSheet({
      projectid: projectId,
      simulationid: simulationId,
    });

    // do something
    const { status } = data.data && data.data;
    if (status === "ok") {
      data = data.data.data && data.data.data;
      let temp = sheets;
      data.length > 0 && data.map((elem) => temp.push(elem));
      setSheets(temp);

      
      setActiveSheet(data.length > 0 ? data[0] : activeSheet);
      setLoaders({ ...loaders, addSheet: false });
      NotificationManager.success("New Sheet Added Sucessfully");
    } else {
      setLoaders({ ...loaders, addSheet: false });
      NotificationManager.error("Error");
    }
  };
  const handleSheetChange = (event, sheet) => {
    
    setActiveSheet(sheet);
  };
  const setSheetDropdownFunc = (index) => {
    if (sheetDropdown.bool && sheetDropdown.index === index) {
      setSheetDropdown({ ...sheetDropdown, bool: false, index: null });
    } else {
      setSheetDropdown({ ...sheetDropdown, bool: true, index: index });
    }
  };
  const removeDropItem = () => {
    let temp = dropItemsArrayRef.current;
    let item =
      temp.length > 0 && temp.find((item) => item.sheet_id === activeSheet.id);
    const index =
      temp.length > 0 &&
      temp.findIndex((item) => item.sheet_id === activeSheet.id);

    temp[index] = {
      sheet_id: item.sheet_id,
      value: null,
    };

    removetheDropPath({
      projectId: projectId,
      simulationId: simulationId,
      analysisSheetId: activeSheet.id,
    });
    
    
    setDropItemsArray([...temp]);
   
    setDropItem(null);
  };

  useEffect(() => {
    if (projectId && simulationId && activeSheet) {
      if (activeSheet.id) {
        const activeSheetData = analysisSheetinfo.simulationAnalysisCollection.find(
          (ele) => {
            if (ele.id === activeSheet.id) {
              return ele;
            }
          }
        );

        setAnalysisData(activeSheetData);

        setTimeout(() => {
          setBackdrop(false);
        }, 1000);

        updatePlot(activeSheetData);

        // });
      }
    }
  }, [projectId, simulationId, activeSheet, chart]);

  

  const [ondroptrigger,setonDroptrigger, onDroptriggerref]=useStateRef(null)
  const [droppedNode,setDroppedNode, droppedNoderef]=useStateRef(null)

  useEffect(() => {
    if (onDroptriggerref.current) {

      

      const node = droppedNoderef.current

      const deepth = node.deepness;
      const parents =  [...node.parents]
      // let parent_node = cloneDeep(jsonFile)
      let json = [];
      if(RunDataReducer.runData !== null){
        json = RunDataReducer.runData.data.data;
      }
      let parent_node = cloneDeep(json);
      let path =''
      for (let indexpath = 0; indexpath < deepth; indexpath++) {
        const currentparent = parents[indexpath]
        parent_node = parent_node.filter(nodesvale => nodesvale.id ===currentparent)
       
        
        if(path){
          path = path+'/'+parent_node[0].name
        }else{
          path = parent_node[0].name
        }
        
        parent_node = parent_node[0]['children']
  
        
      }
      const newpath = path+'/'+node.name;
      // console.log("Jsonfile New 45",jsonFile,newpath,node)
      setDropItemFunc(droppedNoderef.current,newpath)
      setonDroptrigger(false)
   
    }
  }, [onDroptriggerref.current]);

  const [expanded, setExpanded] = useState(false);
  const [onResizeTrig, SetOnResizerTrig] = useImmer({ tigger: 0, size: [] });
  const buttonPositionOffset = 0;
  const collapseDirection = "up";
  const minSizes = [50, 50, 50, 50];
  const collapseTransition = 500;
  const grabberSize = 40;
  const buttonTransition = 'zoom';
  let expandedArr = [];
  const handleToggle = (event, nodeIds) => {
    setExpanded(nodeIds);
  };
  let path = '';

 
  const [{ isOver }, drop] = useDrop(() => ({
    accept: ItemTypes.BOX,
    drop: (item) => {

     
      setDroppedNode(item['node'])
      setonDroptrigger(true)
      // setDropItemFunc(item['node'])
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  }));

 

  return (
    <div
      id="analysis"
      className={classes.root }
    >
      <Backdrop open={backdrop} style={{ zIndex: '1300' }}>
        <CircularProgress />
      </Backdrop>
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        className="analysisFormModal"
      >
        <div className="modalContainer">
          <JsonForms
            schema={formData.schema}
            uischema={formData.uischema}
            data={formData.data}
            renderers={renderers}
            cells={materialCells}
            onChange={({ errors, data }) => {

              setFormData({ ...formData, data })

              setFormError(errors)
              
           
            
            }}
          />
          <div className="row">
            <Button variant="contained" color="primary" onClick={postFormData}>
              Submit
            </Button>
          </div>
        </div>
      </Modal>

      <div className={classes.innerWrapper}>
        <Drawer
          id="analysisDrawer"
          className={classes.drawerPaper}
          variant="permanent"
          classes={{
            paper: classes.drawerPaper,
          }}
        >
          <div className={classes.searchContainer}>
            <SearchBar
              disabled={RunDataReducer.isLoading}
              value={searchtext}
              onChange={(newValue) => setsearchtext(newValue)}
              onRequestSearch={() => {
                setExpanded(true);
                // setExpanded((oldExpanded) =>
                //   oldExpanded.length === 0 ? expandedArr : []
                // );
              }}
              onCancelSearch={() => {
                setExpanded(false);
                setsearchtext('');
              }}
            />
            <div>
              {expanded ? (
                <CollapseIcon
                  disabled={RunDataReducer.isLoading}
                  width="32px"
                  height="32px"
                  className={
                    RunDataReducer.isLoading
                      ? classes.ExpandButtonDisabled
                      : classes.ExpandButton
                  }
                  onClick={() => {
                    setExpanded(false);
                  }}
                />
              ) : (
                <ExpandIcon
                  width="32px"
                  height="32px"
                  className={
                    RunDataReducer.isLoading
                      ? classes.ExpandButtonDisabled
                      : classes.ExpandButton
                  }
                  onClick={() => {
                    setExpanded(true);
                  }}
                />
              )}
            </div>
          </div>
          {/* <Divider /> */}
          {/* {loaders.drawer_loader ? ( */}
          {RunDataReducer.isLoading ? (
            <div className="mainLoader">
              <CircularProgress />
            </div>
          ) : RunDataReducer.runData === null ? (
            // <DisplayAnlysisTree
            //   data={[{"name": "No Run Data Found", "id": "0"}]}
            //   expanded={expanded}
            //   searchtext={searchtext}
            //   setDragState={setDragState}
            // />
            <p style={{color: "red", fontStyle: "bold", fontSize: "16sp", padding: "10px"}}>No Run Data Found</p>
          )
          : (RunDataReducer.runData !== null && RunDataReducer.runData.data.status !== "ok")? (
            // <DisplayAnlysisTree
            //   data={[{"name": "No Run Data Found", "id": "0"}]}
            //   expanded={expanded}
            //   searchtext={searchtext}
            //   setDragState={setDragState}
            // />
            <p style={{color: "red", fontStyle: "bold", fontSize: "16sp", padding: "10px"}}>No Run Data Found</p>
          ) : (

            <DisplayAnlysisTree
              // data={jsonFile}
              data={RunDataReducer.runData.data.data}
              expanded={expanded}
              searchtext={searchtext}
              setDragState={setDragState}
            />
          )}
        </Drawer>

        <main id="mainContent" className={classes.content}>
          {!sheetsLoading ? (
            <React.Fragment>
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
                          value={sheet}
                          label={
                            <SheetTab
                              sheet={sheet}
                              index={index}
                              resetSheet={resetSheet}
                              removeSheet={removeSheet}
                              renameSheet={renameSheet}
                              analysisstatus={analysisData.analysisstatus}
                            />
                          }
                        />
                      ))}

                  </Tabs>
                  <div className="d-flex flex-row align-items-center justify-content-center pr-2">
                    <div
                      className="sheetTab addNewSheet"
                      onClick={() => {
                        addNewSheets();
                        setLoaders({ ...loaders, addSheet: true });
                      }}
                    >
                      <AddIcon fontSize="small" />{" "}
                      {loaders.addSheet && (
                        <CircularProgress className="addNewSheetLoader" />
                      )}{" "}
                    </div>
                  </div>
                </div>
              </div>
              <div
                id="dropZone"
               
                ref={drop}
                style={{
                  backgroundColor: dragState ? '#D1EBDE' : 'white',
                }}
              >
                Drop Area :
                {dropItem && (
                  <span className="droppedItem">
                    {dropItem.path}{" "}
                    <span className="actions">
                      {" "}
                      <EditIcon
                        onClick={() => {
                          if (analysisData.analysisstatus !== 1) {
                            setBackdrop(true);
                            const activeSheetData = analysisSheetinfo.simulationAnalysisCollection.find(
                              (ele) => {
                                if (ele.id === activeSheet.id) {
                                  const formDefaultData = ele.form_data;
                                  setFormData({
                                    ...formData,
                                    data: formDefaultData.data,
                                    schema: formDefaultData.schema,
                                    uischema: formDefaultData.uischema,
                                  });
                                }
                              }
                            );
                            setOpen(true);

                            setBackdrop(false);
                            // first find active sheet id
                            // then form id
                            // smae
                          } else {
                            setBackdrop(false);
                            NotificationManager.error(
                              "Cannot update! Simulation is loading!"
                            );
                          }
                        }}
                        className="icon"
                        fontSize="small"
                      />{" "}
                      <CloseIcon
                        onClick={() => {
                          if (analysisData.analysisstatus !== 1)
                            removeDropItem();
                          else
                            NotificationManager.error(
                              "Cannot delete! Simulation is loading!"
                            );
                        }}
                        className="icon"
                        fontSize="small"
                      />
                    </span>
                  </span>
                )}
              </div>
              <div>
                <SplitPane
                  split={"horizontal"}
                  collapse={{
                    collapseTransitionTimeout: collapseTransition,
                    buttonTransition,
                    collapseDirection,
                    buttonPositionOffset,
                  }}
                  minSizes={minSizes}
                  // initialSizes={[1000,816]}
                  resizerOptions={{
                    grabberSize,
                  }}
                  hooks={{
                    onCollapse: (collaped_size) => {
                      
                    },
                    onDragStarted: () => {
                      
                    },
                    onChange: (sizes) => {
                    
                    },
                    onSaveSizes: (sizes) => {
                     
                      SetOnResizerTrig((draft) => {
                        draft.size = sizes;
                        draft.tigger = draft.tigger + 1;
                      });
                    },
                  }}
                >
                  <div>
                    {analysisData.analysisstatus === 1 && (
                      <React.Fragment>
                        <LinearProgress />
                        <p>Your Analysis is loading...</p>
                      </React.Fragment>
                    )}
                    <Chart
                      options={options}
                      chart={chart}
                      setChart={setChart}
                      onResizeTrig={onResizeTrig}
                    />
                  </div>
                  <div>
                    {analysisData.analysisstatus === 1 && (
                      <React.Fragment>
                        <LinearProgress />
                        <p>Your Analysis is loading, ...</p>
                      </React.Fragment>
                    )}

                    {analysisData.analysisstatus === 2 && (
                      <div>
                        <div className={classes.downloadcsv}>
                          <a
                            href={analysisData.file_location}
                            style={{
                              padding: "5px",
                              margin: "2px",
                              backgroundColor: "#464D69",
                              borderRadius: "5px",
                              color: "#fff",
                            }}
                          >
                            Download
                          </a>
                        </div>

                        <DataTable onResizeTrig={onResizeTrig} dataUrl={analysisData.file_location} />
                      </div>
                    )}
                    {analysisData.analysisstatus === 0 && (
                      <div style={{ color: "red", fontWeight: "bold" }}>
                        Error: {analysisData.error_message}
                      </div>
                    )}
                  </div>
                </SplitPane>
              </div>
            </React.Fragment>
          ) : (
            <LinearProgress />
          )}
        </main>
      </div>
    </div>
  );
};

const mapStateToProps = (state) => ({
  simulate: state.simulate,
  RunDataReducer: state.RunDataReducer,
  user_id: state.firebase.auth.uid,
  analysisReduxData_Reducer: state.SimulationAnalysisReducer,
  // isHeaderCollapsed: state.settings.isHeaderCollapsed,
});
const mapDispatchToProps = (dispatch) =>
  bindActionCreators(
    {
      JsonFormsAction: (data, schema, uischema) =>
        dispatch(Actions.init(data, schema, uischema)),
      setAnalysisCollection,
    },
    dispatch
  );
export default connect(mapStateToProps, mapDispatchToProps)(PreAnalysisDrawer);
