import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import StatusAccordina from './SimulationStatus/simstatusaccordian'
import SimulationInfo from './SimulationStatus/simulationinfo';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
  },
  accordian:{
    backgroundColor:"#303336",
    opacity: 0.9
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    fontWeight: theme.typography.fontWeightRegular,
  },
  accordiandetail:{
    paddingLeft:5,
    paddingRight:5
  }
}));

export default function SimpleAccordion() {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Accordion >
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header"
          className={classes.accordian}
        >
         <StatusAccordina/>
        </AccordionSummary>
        <AccordionDetails className={classes.accordiandetail}>
          <SimulationInfo/>
         
        </AccordionDetails>
      </Accordion>
     
   
    </div>
  );
}
