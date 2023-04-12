import React, { useState, useEffect, useRef } from "react";
import { connect } from "react-redux";
import OperationSheetTab from "./OperationSheetTab";
import NembusProjectAdapter from "../../../../adapterServices/NembusProjectAdapter";
import NembusProjectService from "../../../../api/NembusProject";
import RctSectionLoader from 'Components/RctSectionLoader/RctSectionLoader';
import Chart from "./Chart";
import { NotificationManager } from "react-notifications";
import {
  SplitPane
} from "react-collapse-pane";
import { useImmer } from 'use-immer';
import {
  CircularProgress,
  Tabs,
  Tab
} from "@material-ui/core";
import Tooltip from "@material-ui/core/Tooltip";
import AddIcon from "@material-ui/icons/AddCircle";
import './styles.scss';

/**
 * Analysis
 * By Nirmalya Saha
 */

function Analysis(props) {
  const projectId = window.location.pathname.split('/')[3];

  /**
   * Chart configuration
   */

  const collapseTransition = 500;
  const grabberSize = 40;
  const buttonTransition = 'zoom';
  const collapseDirection = "up";
  const buttonPositionOffset = 0;
  const minSizes = [50, 50, 50, 50];

  let [chart, setChart] = useState(null);
  const [onResizeTrig, SetOnResizerTrig] = useImmer({ tigger: 0, size: [] });

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
      right: "5%",
      orient: "vertical",
      feature: {
        dataZoom: {},
        saveAsImage: {},
      },
    },
    legend: {
      align: "left",
      orient: "horizontal",
      data: []
    },
    xAxis: {
      type: "value",
      name: "x-axis",
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
      name: "y-axis",
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

  const [height, setHeight] = useState(0);
  const [width, setWidth] = useState(0);
  const elementRef = useRef(null);

  /**
   * States
   */

  const [activeSheet, setActiveSheet] = useState(null);
  const [sheets, setSheets] = useState([]);
  const [names, setNames] = useState([]);
  const [sheetNumber, setSheetNumber] = useState(null);
  const [loader, setLoader] = useState(false);
  const [load, setLoad] = useState(false);

  /**
   * useEffects calls
   */

  useEffect(()=>{
    getData("none", true);
    getSnapshots();
    setActiveSheet(sheets[0]);
  },[]);

  useEffect(() => {
    if(elementRef && elementRef.current && elementRef.current.clientHeight){
      setHeight(elementRef.current.clientHeight);
    }
  }, [activeSheet]);

  useEffect(() => {
    SetOnResizerTrig((draft) => {
      draft.size = draft.size;
      draft.tigger = draft.tigger + 1;
    });
  },[props.SplitReducer.nembusProjectAnalysis.widthChanged]);

  /**
   * Function calls
   */

  const getSnapshots = async () => {
    await NembusProjectService.getAnalysisSheetSnapshots(
      projectId,
      (snapshot) => {
        snapshot.docChanges().forEach((change) => {
          if (change.type === "modified") {
            getData(change.doc.data().id, false);
          }
        });
      }
    );
  }

  const handleSheetChange = (event, sheet) => {
    setActiveSheet(sheet);
  }

  const getData = async (id, trigger) => {
    if(trigger === true) {
      setLoad(true);
    } else {
      // setLinearLoad(true);
    }

    const data = await NembusProjectAdapter.getAnalysisSheetInfoAdapter(projectId);
    setSheets(data.data.dataArray);
    setNames(data.data.names);
    setSheetNumber(data.data.projectData.sheetNo);
    if(id === "none") {
      var pos1 = 0;
      setActiveSheet(data.data.dataArray[pos1]);
    } else if(id === "max_addition") {
      var pos2 = data.data.dataArray.length - 1;
      setActiveSheet(data.data.dataArray[pos2]);
    } else {
      var pos3 = data.data.dataArray.map(function(element) {
        return element.id;
      }).indexOf(id);
      setActiveSheet(data.data.dataArray[pos3]);
    }
    if(trigger === true){
      setLoad(false);
    } else {
      // setLinearLoad(false);
    }

    console.log("Analysis Data ===>", data);
  }

  const checkSheet = () => {
    var count = sheetNumber + 1;
    var name = `SHEET${count}`;
    while(names.includes(name)) {
      count++;
      name = `SHEET${count}`;
    }
    return count;
  }

  const addNewSheets = async () => {
    setLoader(true);
    const sheetNo = checkSheet();
    const result = await NembusProjectAdapter.addAnalysisSheetTabsAdapter(projectId,sheetNo);
    if(result === true) {
      getData("max_addition", true);
    }
    setLoader(false);
  }

  const removeSheets = async (sheet) => {
    setLoader(true);
    if(sheets.length < 2) {
      NotificationManager.error("Atleast one sheet should be there");
    } else {
      const data = await NembusProjectAdapter.removeAnalysisSheetTabsAdapter(projectId,sheet.id);
      if(activeSheet.id === sheet.id) {
        getData("none", true);
      } else {
        getData(activeSheet.id, true);
      }
    }
    setLoader(false);
  }

  const resetSheet = async (index, sheet) => {
    setLoader(true);
    if(names.includes(sheet.sheetName)) {
      NotificationManager.error("Sheet name should be unique");
    } else if(sheet.sheetName === ""){
      NotificationManager.error("Sheet name cannot be empty.")
    } else {
      const result = await NembusProjectAdapter.renameAnalysisSheetTabsAdapter(projectId,sheet.sheetName,index);
    }
    getData(activeSheet.id, true);
    setLoader(false);
  };
 
  return (
    <div>
        {load && <RctSectionLoader />}
        <main id="mainContent">
            <React.Fragment>
              <div className="sheetsContainer">
                <div style={{ backgroundColor: "white" }} className="sheetTabs">
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
                            <OperationSheetTab
                              sheet={sheet}
                              index={index}
                              resetSheet={resetSheet}
                              removeSheets={removeSheets}
                            />
                          }
                        />
                      ))}
                  </Tabs>
                  <div className="d-flex flex-row align-items-center justify-content-center pr-2">
                    <Tooltip title="Add a new sheet" placement="bottom">
                      <div
                        className="sheetTab addNewSheet"
                        onClick={() => {
                          addNewSheets();
                        }}
                      >
                        <AddIcon color="secondary" fontSize="small" />{" "}                    
                        {loader && (
                          <CircularProgress color="secondary" className="addNewSheetLoader" />
                        )}{" "}
                      </div>
                    </Tooltip>
                  </div>
                </div>
              </div>

              <div style={{ display: "flex" }}>
                <div style={{ width: "100%" }}>
                  <div id="dropZone">
                    Analysis Report:
                  </div>
                </div>
              </div>

              <div ref={elementRef}>
                      <SplitPane
                        split={"horizontal"}
                        collapse={{
                          collapseTransitionTimeout: collapseTransition,
                          buttonTransition,
                          collapseDirection,
                          buttonPositionOffset,
                        }}
                        minSizes={minSizes}
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

                        <div className="chart-container">
                          <div className="chart-main">
                            <Chart
                              options={options}
                              chart={chart}
                              setChart={setChart}
                              onResizeTrig={onResizeTrig}
                              height={height}
                              divHeight={50}
                            />
                          </div>
                        </div>

                        <div>
                          To be added..
                        </div>

                        
                      </SplitPane>
                    </div>
            </React.Fragment>
        </main>
    </div>
  );
}

const stateProp = (state) => ({
  SplitReducer: state.SplitReducer
});

const dispatchProps = {
};

export default connect(stateProp, dispatchProps)(Analysis);