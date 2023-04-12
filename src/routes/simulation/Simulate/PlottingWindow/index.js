import React, { useState,useEffect } from 'react';
import { Tabs, Tab, Box, Paper, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import AddCircle from '@material-ui/icons/AddCircle';
import * as Cesium from "cesium/Cesium";
import useStateRef from "react-usestateref";
import PlottingPanel from './plottingpanel';






const useStyles = makeStyles(theme => ({
  root: {
    width: "100%"
  }
}));

let maxTabIndex = 0;
let currentTablIndex = 0;

function TabPanel(props) {
  const { children, tabId } = props;
  return (
    <Box
      value={maxTabIndex}
      index={maxTabIndex}
      hidden={tabId !== currentTablIndex}
      key={maxTabIndex}
    >
      {children}
    </Box>
  );
}
export default function PlotingWindow({addCesiumcontroller,socket}) {
  const classes = useStyles();
  const [lastupdate,setLastupdate,lastupdateRef] = useStateRef({})
  let   [plotIndex,setPlotIndex] = useState(0)
  // Handle Tab Button Click
  const [tabId, setTabId] = React.useState(0);
  const handleTabChange = (event, newTabId) => {
    if (newTabId === "tabProperties") {
      handleAddTab();
    } else {
      currentTablIndex = newTabId;
      setTabId(newTabId);
    }
  };

  function updatePreviourstime(timevalue) {
  
    return {
      ...timevalue,
    };
  }

  let currenttime = {}

  function onTickCallback(clock)
  {
    
    const timeOffset = Math.floor(
      Cesium.JulianDate.secondsDifference(clock.currentTime, clock.startTime));

      if (timeOffset > 1) {
        if (
          Math.abs(
            Math.floor(
              Cesium.JulianDate.secondsDifference(
                lastupdateRef.current,
                clock.currentTime
              )
            )
          ) > 1
        )
        {
          
          
        }
        setPlotIndex(timeOffset);
        
      }

     setLastupdate(updatePreviourstime(clock.currentTime));

      
  }

  useEffect(() => {
    // Update the document title using the browser API
    
    if (addCesiumcontroller)
    {
      
      addCesiumcontroller.viewer.clock.onTick.addEventListener(
           onTickCallback
        );
    }
  },[addCesiumcontroller]);




  // Handle Add Tab Button
  const [tabs, setAddTab] = React.useState([]);
  const handleAddTab = () => {
    maxTabIndex = maxTabIndex + 1;
    setAddTab([
      ...tabs,
      <Tab label={`New Tab ${maxTabIndex}`} key={maxTabIndex} />
    ]);
    handleTabsContent();
  };

  // Handle Add Tab Content
  const [tabsContent, setTabsContent] = React.useState([
    <TabPanel tabId={tabId}>
      Default Panel - {Math.random()}
      
      </TabPanel>
  ]);
  const handleTabsContent = () => {
    setTabsContent([
      ...tabsContent,
      <TabPanel tabId={tabId}>New Tab Panel - {Math.random()}</TabPanel>
    ]);
  };

 

  return (
    <Paper className={classes.root}>
      <AppBar position="static" color="inherit">
        <Tabs
          value={tabId}
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="on"
        >
          <Tab label="Default" />
          {tabs.map(child => child)}
          <Tab icon={<AddCircle />} value="tabProperties" />
        </Tabs>
      </AppBar>
      {/* <Box padding={2}>{tabsContent.map(child => child)}</Box> */}
      
      <TabPanel tabId={0} index={0}>
        <PlottingPanel plotIndex ={plotIndex} socket={socket}/>
      </TabPanel>
      <TabPanel tabId={1} index={0}>
        Item Two
      </TabPanel>
      
    </Paper>
  );
}