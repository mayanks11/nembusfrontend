import React from "react";
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import PlotAnalysisdata from "./component/PlotAnalysisdata";



const PostAnalysis = (props) => {
  const {projectId , simulate,analysisSheetinfo,setAnalysisSheetTab} = props

  return (
    <DndProvider backend={HTML5Backend}>
      <div>
        <PlotAnalysisdata analysisSheetinfo={analysisSheetinfo}
          setAnalysisSheetTab={setAnalysisSheetTab}
        />
      </div>
    </DndProvider>
  );

};

export default PostAnalysis;
