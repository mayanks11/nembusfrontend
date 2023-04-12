import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import AccountCircle from "@material-ui/icons/AccountCircle";
import InputAdornment from "@material-ui/core/InputAdornment";
import TextField from "@material-ui/core/TextField";
// import { Chart } from "react-charts";
import { Line } from "@reactchartjs/react-chart.js";
// import "../../../../../node_modules/react-vis/dist/style.css";
// import {XYPlot, XAxis, YAxis, HorizontalGridLines,  VerticalGridLines,LineSeries} from 'react-vis';
import { useImmer } from "use-immer";
import { auth } from "../../../../firebase";
import useStateRef from "react-usestateref";
import {has,isEmpty,get} from "lodash";
import Button from "@material-ui/core/Button";
import ListofPlot from "./dialogListofPlot";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import PlotNameArray from "./PlotNameList";
import shortid from "shortid";
import LineGraph from "./LineGraph";
import Chart from "./egraphs";
import RctSectionLoader from "Components/RctSectionLoader/RctSectionLoader";
import { saveData } from "../../../../workers/UpdatedSimulation.worker.js";
import AddCircleOutlineIcon from "@material-ui/icons/AddCircleOutline";

import PlotGraphSVG from "../plotgraphsvg";


const useStyles = makeStyles((theme) => ({
  margin: {
    margin: theme.spacing(1),
  },
}));

async function demo(data) {
  console.log(await saveData(data));
}

function getChartOption(plotinfo,showPlotnamehandler,plot_description) {

  const chart_id = shortid.generate();

  console.log("chart_id",chart_id);
  let option = {
    title:{
      id:chart_id,
      padding: [
        1,  // up
        0, // right
        0,  // down
        5, // left
    ]
    },
    animation: false,
    tooltip: {
      trigger: "axis",
    },

    toolbox: {
      left: 0,
      orient: "vertical",
      feature: {
        dataZoom: {
          yAxisIndex: "none",
        },
        restore: {},
        saveAsImage: {},
        myTool1: {
          show: true,
          title: "Add Plot",
          icon:
            "path://M432.45,595.444c0,2.177-4.661,6.82-11.305,6.82c-6.475,0-11.306-4.567-11.306-6.82s4.852-6.812,11.306-6.812C427.841,588.632,432.452,593.191,432.45,595.444L432.45,595.444z M421.155,589.876c-3.009,0-5.448,2.495-5.448,5.572s2.439,5.572,5.448,5.572c3.01,0,5.449-2.495,5.449-5.572C426.604,592.371,424.165,589.876,421.155,589.876L421.155,589.876z M421.146,591.891c-1.916,0-3.47,1.589-3.47,3.549c0,1.959,1.554,3.548,3.47,3.548s3.469-1.589,3.469-3.548C424.614,593.479,423.062,591.891,421.146,591.891L421.146,591.891zM421.146,591.891",
          onclick: (chartinfo,charthandler)=>{
          
            console.log(chartinfo.option.series,chart_id)
            console.log(chartinfo,charthandler)
            console.log(charthandler.getOption())
            
            showPlotnamehandler([...chartinfo.option.series],plot_description)
            
          },
        },
      },
    },
    legend: {
      align: "left",
      orient: "vertical",
      right: "0%",
    },
    xAxis: {
      axisPointer: {
        // value: "2016-10-7",
        value: 1,
        name: "time(Sec)",
        nameLocation: "middle",
        minorTick: {
          show: true,
        },
        minorSplitLine: {
          show: true,
        },
        snap: true,
        label: {
          show: true,
        },
        handle: {
          show: true,
        },
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

  plotinfo.forEach((element) => {
    console.log("getChartOption", element);
    option.series.push({
      type: "line",
      name: element.name,
      showSymbol: false,
      clip: true,
      id: element['id']+'_'+element['name'],
      id1:element['id']
    });
  });

  return option;
}

function PlottingPanel({ plotIndex, socket }) {

  const classes = useStyles();
  const [plot_data, setPlot_data, plot_dataRef] = useStateRef({});
  const [plot_time, setPlot_time, plot_timeRef] = useStateRef({});
  const [plot_id, setPlotid] = useImmer([]);
  const [selectedPlotname, setSelectedPlotname] = useImmer({});
  const [addedOnUpdate, setAddedOnUpdate,addedOnUpdateRef] = useStateRef([]);
  const [removeOnUpdate, setRemovedOnUpdate,removeOnUpdateRef] = useStateRef([]);
  const [formType,setFormType] = useState("add")

  const [
    plot_description,
    setPlot_description,
  ] = useState({});

  const [open, setOpen] = useState(false);

  const [isLoading, setIsLoading] = useState(false);

  function updatePlotList(series , plot_description)
  {
    console.log("updatePlotList",series , plot_description);

    setFormType("update")

    series.forEach(element => {

      console.log("series ===>",element['id1'],element['name'],element)

      

      setSelectedPlotname((draft)=>{
         if (draft.hasOwnProperty(element['id1']))
         {
          draft[element['id1']].push(element['name'])
         }
         else{
          draft[element['id1']]= []
          draft[element['id1']].push(element['name'])
         }
      })

    }); 

    setOpen(true);

  }

  const addChart = (plotinfo) => {
    console.log("Addd New Charts ---->", plotinfo);
    const options_perchart = getChartOption(plotinfo,updatePlotList,plot_description);
    console.log("Addd New Charts ---->", options_perchart);
    setPlotid((draft) => {
      draft.push(options_perchart);
    });

    setOpen(false);
  };

  useEffect(() => {
    const uid = auth.currentUser.uid;
    
    const topic = `plot-graph-${uid}`;
    let counter = 0;
    socket.on(topic, (message) => {
      let newmessage = JSON.parse(message);
      newmessage.forEach((socket_message) => {
        // const parsed_graph_data = JSON.parse(socket_message.message);
       
        // console.log("plot graph data",parsed_graph_data,
        // has(parsed_graph_data, ["data","description"]));
        
        // demo(parsed_graph_data)
        // if (has(parsed_graph_data, ["data","description"])) {

        //   if (isEmpty(plot_description)) {
        //     setPlot_description({...get(parsed_graph_data,["data","description"])});
            
        //   } 
        //   else{
        //   }

        //   console.log("<==============>", counter, socket_message.offset,plot_timeRef.current);
        //   counter = counter + 1;

          // if (isEmpty(plot_timeRef.current)) {

          //   setPlot_time([...parsed_graph_data.data.time]);

          // }else {
            
          //   setPlot_time((prevState) => {
          //     return [...prevState, ...parsed_graph_data.data.time];
          //   });
          // }

          // if (isEmpty(plot_dataRef.current)) {
          //   let plotdata_temp = {};
          //   for (var key in parsed_graph_data.data) {
          //     if (!(key === "time")) {
          //       plotdata_temp[key] = { ...parsed_graph_data.data[key] };
          //       // setPlot_data({`${key}`:{...parsed_graph_data.data[key]}})
          //     }
          //   }
          //   setPlot_data(plotdata_temp);
          // } 
          // else 
          
          // {
          //   const parsed_Data = parsed_graph_data.data;
          //   for (var key in parsed_Data) {
          //     if (!(key === "time")) {
          //       if (has(plot_dataRef.current, key)) {
          //         for (var key1 in parsed_Data[key]) {
          //           setPlot_data((prevState) => {
          //             return {
          //               ...prevState,
          //               [key]: {
          //                 ...prevState[key],
          //                 [key1]: [
          //                   ...prevState[key][key1],
          //                   ...parsed_Data[key][key1],
          //                 ],
          //               },
          //             };
          //           });
          //         }
          //       }
          //     }
          //   }
          // }
        // }
      });
    });
  }, []);

  const buttonClick = () => {
    setFormType("add")
    console.log("button click ");
    setOpen(true);
  };

  return (
    <div>
      {isLoading && <RctSectionLoader />}
      <Grid container spacing={1} alignItems="flex-end">
        <Grid item>
          <Typography variant="body">Y-Axis</Typography>
        </Grid>
        {plot_id.map((plotsPerChart, index) => {
          return (
            <Grid item>
              <PlotNameArray plotsPerChart={plotsPerChart} />
            </Grid>
          );
        })}
        <Grid item>
          <Button
            variant="contained"
            color="primary"
            onClick={buttonClick}
            disabled={isEmpty(plot_description)}
          >
            Add
          </Button>
        </Grid>
      </Grid>

      <div>
        {plot_id.map((data1, index) => {
          return (
            <div
              style={{
                width: "100%",
                height: "300px",
              }}
              key={index}
            >
              <Chart options={data1} />
            </div>
          );
        })}
      </div>
      <ListofPlot
        open={open}
        setOpen={setOpen}
        plot_description={plot_description}
        plot_id={plot_id}
        setPlotid={setPlotid}
        addChart={addChart}
        comparedList={selectedPlotname}
        setSelectedPlotname ={setSelectedPlotname}
        formtype ={formType}
        setAddedOnUpdate={setAddedOnUpdate}
        setRemovedOnUpdate ={setRemovedOnUpdate}
        removeOnUpdate ={removeOnUpdateRef}
        addedOnUpdate={addedOnUpdateRef}
      />
    </div>
  );
}

export default PlottingPanel;
