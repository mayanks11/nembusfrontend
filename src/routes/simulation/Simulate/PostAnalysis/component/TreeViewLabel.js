import { useDrag } from 'react-dnd';
import { ItemTypes } from './tree/Constants.js';
import React from 'react';
import { HighlightedText } from './PlotAnalysisdata.js';

const style = {
  cursor: 'move',
  fontWeight: 'bold',
  width: 'fit-content',
};
export const TreeViewLabel = function Box({ node, setDragState, searchtext }) {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: ItemTypes.BOX,
    item: { node },
    end: (item) => {
      setDragState(false);
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));
  isDragging && setDragState(true);
  const opacity = isDragging ? 0.4 : 1;
  return (
    <div ref={drag} style={{ ...style, opacity }} data-testid={`box`}>
      <HighlightedText text={searchtext} label={node.name}></HighlightedText>
    </div>
  );
};
