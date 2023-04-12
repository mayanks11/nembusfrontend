import React,{useEffect,useState} from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import { AppBar, Tabs, Tab, Typography, Box,InputAdornment,Input,
    Accordion,AccordionSummary,AccordionDetails

} from "@material-ui/core";
import SearchIcon from "@material-ui/icons/Search";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import AppsIcon from "@material-ui/icons/Apps";
import {getGenericcomponents} from 'Api/GenericComponent';
// rct section loader
import RctSectionLoader from 'Components/RctSectionLoader/RctSectionLoader';

import {useImmer} from 'use-immer';


function TabPanel(props) {
  const { children, value, index, ...other } = props;

 
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`scrollable-auto-tabpanel-${index}`}
      aria-labelledby={`scrollable-auto-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

function a11yProps(index) {
  return {
    id: `scrollable-auto-tab-${index}`,
    "aria-controls": `scrollable-auto-tabpanel-${index}`,
  };
}

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    width: "100%",
    backgroundColor: theme.palette.background.paper,
  },
}));

export const BlockCollection = () => {
  const classes = useStyles();
  const [value, setValue] = React.useState(0);
  const [searchQuery, setSearchQuery] = useState('');

  const [genericComponents,setGenericComponents]=useImmer({
    componentsList:[],
    isLoading:false
})

  function stopPropagation(e) {
    e.stopPropagation();
    e.nativeEvent.stopImmediatePropagation();
    
  }

  function reduceComponents() {
    return genericComponents.componentsList.reduce((acc, component) => {
      const group = acc.find((g) => g.type === component.type);

      if (group) group.components.push(component);
      else acc.push({ type: component.type, components: [component] });

      return acc;
    }, []);
  }

  function   filteredBlockTypes() {
    return reduceComponents().map(({ type, components }) => ({
      type,
      components: components.filter((component) => {
        return (
          !searchQuery ||
          (component.name &&
            component.name
              .toLowerCase()
              .includes(searchQuery.toLowerCase()))
        );
      }),
    }));
  }


  function renderSidebarItems(groupedComponents) {
    if (groupedComponents.components.length === 0)
      return <React.Fragment></React.Fragment>;
    return (
      <Accordion defaultExpanded>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          className="fw-block_ul type-header"
        >
          <li key={groupedComponents.type}>{groupedComponents.type}</li>
        </AccordionSummary>
        <AccordionDetails
          style={{ borderTop: "1px solid black", display: "block" }}
        >
          {groupedComponents.components.map((component) => (
            <li
              className="fw-block_ul-sub-item"
              draggable={true}
              style={{ cursor: "grabbing" }}
              onDragStart={(event) => {
                event.dataTransfer.setData(
                  "deltav-block-type",
                  JSON.stringify(component)
                );
                // requestAnimationFrame(() => {
                //   this.handleOpen();
                // });
              }}
              key={component.id}
            >
              <div style={{ width: "95%" }}>
                <p>{component.name}</p>
              </div>
              <AppsIcon />
            </li>
          ))}
        </AccordionDetails>
      </Accordion>
    );
  }

 


  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  useEffect(() => {
    getGenericcomponents(setGenericComponents)
  }, []);

  useEffect(() => {

    if(genericComponents.isLoading){
        console.log(genericComponents)
    }
  }, [genericComponents.isLoading]);

  return (
    <div className="fw-block" draggable="false">
      <AppBar position="static" color="default">
        <Tabs
          value={value}
          onChange={handleChange}
          indicatorColor="primary"
          textColor="primary"
          variant="scrollable"
          scrollButtons="auto"
          aria-label="scrollable auto tabs example"
        >
          <Tab label="Standard" {...a11yProps(0)} />
          <Tab label="User Defined" {...a11yProps(1)} />
        </Tabs>
      </AppBar>

      <div className="fw-block__search">
          <Input
            style={{ width: "100%" }}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={stopPropagation}
            onKeyUp={stopPropagation}
            endAdornment={
              <InputAdornment position="end">
                <SearchIcon />
              </InputAdornment>
            }
          />
        </div>

      <TabPanel value={value} index={0}>
        {
          !genericComponents.isLoading
          &&
               <RctSectionLoader />
            }
           <div>{filteredBlockTypes().map(renderSidebarItems)}</div>
        
      </TabPanel>
      <TabPanel value={value} index={1}>
        
      </TabPanel>
    </div>
  );
};
