import React, { useRef, useEffect, useState } from "react";
import Dygraph from "dygraphs";
import "../../../../../node_modules/dygraphs/dist/dygraph.min.css";

function ChartExample({newdata,newlabels}) {
  const chartRef = useRef(null);
  const [graph, setGraph] = useState(null);
  const [labels, setLabels] = useState([]);
  const [datas, setDatas] = useState([]);

  useEffect(()=>{

    if(newdata)
    {
        setDatas([...datas,...newdata])
    }
    


  },[newdata])
  
  

  useEffect(() => {
    if (chartRef.current) {
        console.log(graph,!graph,"graphgraphgraph")
      if (!graph) {
        setGraph(
          new Dygraph(chartRef.current, datas, {
            drawPoints: true,
            showRoller: false,
            legend: "always",
            animatedZooms: true,
            labels: labels,
          })
        );
      }
    }
  }, []);

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
      }}
      ref={chartRef}
    />
  );
}

export default ChartExample;
