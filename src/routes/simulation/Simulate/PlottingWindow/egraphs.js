import React, { useRef, useEffect } from "react"
import PropTypes from "prop-types"
import * as echarts from '../../../../lib/echarts.min.js'





function Chart({ options }) {
  const myChart = useRef(null)

  let chart;
  useEffect(() => {
     chart = echarts.init(myChart.current,{
       width:'auto'})

    chart.setOption(options)
    // chart.on('datazoom', function (evt) {
    //     console.log(" Zoomed --->")
    //     var axis = chart.getModel().option.xAxis[0];
    //     // var starttime = axis.data[axis.rangeStart];
    //     // var endtime = axis.data[axis.rangeEnd];
    //     console.log("axis",axis);

    //  })
   
  }, [options])

  window.onresize = function() {
    console.log("Resizeeeeee")
    if (chart){
      chart.resize();
    }
    
  };

  return (
    <div
      ref={myChart}
      style={{
        width: "100%",
        height: "100%",
      }}
    ></div>
  )
}

Chart.propTypes = {
  options: PropTypes.any,
}

export default Chart