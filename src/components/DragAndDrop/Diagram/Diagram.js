import React, {useRef} from 'react';
import { CanvasWidget } from '@projectstorm/react-canvas-core';
import styled from 'styled-components';

import DroppableLayer from './DroppableLayer';
import DiagramContext from './DiagramContext';

import MiniMap from '../minimap_new/MiniMap';


const FullscreenCanvas = styled(CanvasWidget)`
  height: 100%;
`;




const Diagram = ({ engine }) => {

    React.useEffect(()=>{
      setLocked(engine.isLocked())
    },engine.locked)


    const [isLocked,setLocked] = React.useState(engine.isLocked());
     
    return(
    
      <DroppableLayer
        handleComponentDrop={(...args) =>
          engine.handleComponentDrop(...args)
        }
        disabled={isLocked}
      >
        <DiagramContext.Provider value={engine}>
          <FullscreenCanvas engine={engine.getEngine()} />
          <MiniMap engine={engine} />
          </DiagramContext.Provider>
      </DroppableLayer>
   
  )};
  
  export default Diagram;