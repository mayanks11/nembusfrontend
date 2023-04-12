import React, { useRef, useEffect, useState, useMemo } from "react";
import { useImmer } from "use-immer";

import DataGrid from "react-data-grid-temp";
import { parse,load,registerLoaders } from "@loaders.gl/core";
import { CSVLoader } from "@loaders.gl/csv";

import 'react-data-grid-temp/dist/react-data-grid.css';
import './datagride.css'

function DataTable({ onResizeTrig ,dataUrl}) {

    const [columns,setColumns] = useImmer([])
    const [rows,setRow] = useState([])
    const [tableHeight, setTableHeight] = useState("90vh");
  
    useEffect(() => {
      const getdata = async (dataUrl) => {
          const data = await parse(fetch(dataUrl), CSVLoader,{csv: {
          header:true,fastMode:true,delimiter:',',comments:true
        }});
    
        
        setRow(data)

        setColumns((draft)=>{
          draft.splice(0,draft.length)

        })

       
        
        if(data){
          const column_name = Object.keys(data[0])
          
  
          setColumns((draft)=>{
            column_name.forEach((element,index) => {
              draft.push({
                key:element,
                frozen: index==0,
                name:element,
                resizable:true,
                width:220
              })
            });
            
          })
  
  
        }
  
      };
      getdata(dataUrl);
    }, [dataUrl]);
  
    useEffect(() => {
      if (onResizeTrig.tigger) {
        
        setTableHeight(onResizeTrig.size[1]);
      }
    }, [onResizeTrig.tigger]);
  
  
  
    return (
      <div
        style={{
          height: tableHeight,
        }}
      >
        <DataGrid
          className="fill-grid"
          columns={columns}
          rows={rows}
          rowHeight={22}
          className="fill-grid"
          defaultColumnOptions={{
            sortable: true,
            resizable: true,
          }}
        />
      </div>
    );
  }
  
  export default DataTable;