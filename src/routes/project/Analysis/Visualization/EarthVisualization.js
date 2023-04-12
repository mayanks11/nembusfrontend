import React, { useEffect, useState, Fragment, useRef } from "react";
import { connect } from "react-redux";
import TimeLine from "./CesiumTimeline";
import ThreeDimension from "./CesiumThreeDimesionViz";
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';

const EarthVisualization = ({
  
  }) => {

    function getWindowSize() {
      const {innerWidth, innerHeight} = window;
      return {innerWidth, innerHeight};
    }
  
    const [windowSize, setWindowSize] = useState(getWindowSize());
  
    useEffect(()=>{
  
      function handleWindowResize() {
        console.log(getWindowSize())
        setWindowSize(getWindowSize());
      }
  
      window.addEventListener('resize', handleWindowResize);

  
      return () => {
        window.removeEventListener('resize', handleWindowResize);
      };
    },[])
  
    return (<div style={{ width: '100%' ,height: windowSize.innerHeight*0.965}}>
      
       
       <ThreeDimension/>
      
      </div>
    
    )

}

const mapState = (state) => ({
    simulate: state.simulate,
  });


const mapDispatchToProps = (dispatch) =>{
    
}

export default connect(mapState, mapDispatchToProps)(EarthVisualization);