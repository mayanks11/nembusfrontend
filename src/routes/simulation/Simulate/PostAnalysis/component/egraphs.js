import React, { useRef, useEffect,useState } from "react"
import PropTypes from "prop-types"
import * as echarts from '../../../../../lib/echarts.min.js'





function Chart(props) {
    const myChart = useRef(null)

    const { options } = props;
    const { chart,setChart } = props;
 
    useEffect(() => {
        const chart1 = echarts.init(myChart.current,null, {
            width: 'auto',
            height:'auto',
            renderer:'canvas'

        })
        chart1.setOption(options)
        setChart(chart1)

        
        // chart.on('datazoom', function (evt) {
        //     console.log(" Zoomed --->")
        //     var axis = chart.getModel().option.xAxis[0];
        //     // var starttime = axis.data[axis.rangeStart];
        //     // var endtime = axis.data[axis.rangeEnd];
        //     console.log("axis",axis);

        //  })

    }, [options])

    // useEffect(() => {

    //     console.log("Update the series ",options,chart)
       
    //     if(chart){
    //         chart.setOption(options)
    //     }
      
        

        
    //     // chart.on('datazoom', function (evt) {
    //     //     console.log(" Zoomed --->")
    //     //     var axis = chart.getModel().option.xAxis[0];
    //     //     // var starttime = axis.data[axis.rangeStart];
    //     //     // var endtime = axis.data[axis.rangeEnd];
    //     //     console.log("axis",axis);

    //     //  })

    // }, [options.series])


    useEffect(() => {
        if(props.onResizeTrig.tigger){
            console.log("onResizeTrig",props.onResizeTrig.size[0])
            chart.resize({height:props.onResizeTrig.size[0]});
          }

    }, [props.onResizeTrig.tigger])



    window.onresize = function () {
        if (chart) {
            chart.resize();
        }

    };

    return (
        <div>

        <div
            ref={myChart}
            style={{
                height: "50vh", left: 0, top: 0, width: "100%" 
            }}
        >

        </div>
        </div>
    )
}

Chart.propTypes = {
    options: PropTypes.any,
}

export default Chart