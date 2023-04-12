import React ,{useEffect,useState} from "react";
import { cloneDeep, has } from 'lodash';

import Tree, {
  renderers as Renderers,
  selectors
} from "react-virtualized-tree";
import 'react-virtualized/styles.css'
import 'react-virtualized-tree/lib/main.css'

import { useDrag } from 'react-dnd'
import { ItemTypes } from './Constants'



const { getNodeRenderOptions } = selectors;


const { Expandable } = Renderers;



const HighlightedText = ((props) => {
  return props.text && (props.label.toLowerCase().includes(props.text) || props.label.includes(props.text)) ? (
    <mark style={{ backgroundColor: 'yellow' }}>{props.label}</mark>
  ) : (
    props.bold ? <b>{props.label}</b> : props.label
  );
});

function Renderer({ node, children, setDragState, expanded, searchtext,nodesall }) {
 
  const { id, name } = node;
  
  const { hasChildren, isExpanded } = getNodeRenderOptions(node);

  expanded && hasChildren && { ...getNodeRenderOptions(node), isExpanded: true }

 
  const [{ isDragging }, drag] = useDrag(() => ({
    type: ItemTypes.BOX,
    item: { node },
    end: (item) => {
      setDragState(false)
    },
    collect: monitor => ({
      isDragging: !!monitor.isDragging(),
    }),
  }))
  isDragging && setDragState(true)


  if (!hasChildren) {
    return (
      <span
        // draggable
        ref={drag}
        style={{
          opacity: isDragging ? 0.5 : 1,
          cursor: 'move',
        }}
      >
        <HighlightedText text={searchtext} label={name} bold={true}/>
        {/* <b>{name}</b> */}
      </span>
    )
  }
  else {
    return (
      <span>
        {children}
        <HighlightedText text={searchtext} label={name} bold={false}/>
      </span>
    );
  }
}


const DisplayAnlysisTree = (props) => {
  const [nodes, setNodes] = React.useState(props.data);



  const handleChange = (nodes) => {
    setNodes(nodes);
  }

  React.useEffect(() => {


    let gotolevel_1 = false;
    let gotolevel_2 = false;
    let gotolevel_3 = false;
    let gotolevel_4 = false;
    let gotolevel_5 = false;
    

    const nodesclone = JSON.parse(JSON.stringify(nodes))

    if (props.expanded == true || props.expanded == false) {
      for (let index_0 = 0; index_0 < nodesclone.length; index_0++) {
        gotolevel_1 = false;
        if (has(nodesclone[index_0], "children")) {
          nodesclone[index_0]["state"] = {
            expanded: props.expanded,
          };
          gotolevel_1 = true;
        }

        if (gotolevel_1) {

          const chilrenlen_in_1 = nodesclone[index_0]['children'].length
          for (let index_1 = 0; index_1 < chilrenlen_in_1; index_1++) {
            gotolevel_1 = false;
            if (has(nodesclone[index_0]['children'][index_1], "children")) {
              nodesclone[index_0]['children'][index_1]["state"] = {
                expanded: props.expanded,
              };
              gotolevel_2 = true;
            }

            /**
             * Level2
             */

            if (gotolevel_2) {
              const chilrenlen_in_2 = nodesclone[index_0]['children'][index_1]['children'].length
              for (let index_2 = 0; index_2 < chilrenlen_in_2; index_2++) {
                gotolevel_3 = false;
                if (has(nodesclone[index_0]['children'][index_1]['children'][index_2], "children")) {
                  nodesclone[index_0]['children'][index_1]['children'][index_2]["state"] = {
                    expanded: props.expanded,
                  };
                  gotolevel_3 = true;
                }

                if (gotolevel_3) {
                  const chilrenlen_in_3 = nodesclone[index_0]['children']
                  [index_1]['children']
                  [index_2]['children'].length

                  for (let index_3 = 0; index_3 < chilrenlen_in_3; index_3++) {
                    gotolevel_4 = false;
                    if (has(nodesclone[index_0]['children']
                    [index_1]['children']
                    [index_2]['children'][index_3], "children")) {

                      nodesclone[index_0]['children']
                      [index_1]['children']
                      [index_2]['children']
                      [index_3]["state"] = {
                        expanded: props.expanded,
                      };
                      gotolevel_4 = true;
                    }


                    if (gotolevel_4) {
                      const chilrenlen_in_4 = nodesclone[index_0]['children']
                      [index_1]['children']
                      [index_2]['children']
                      [index_3]['children'].length

                      for (let index_4 = 0; index_4 < chilrenlen_in_4; index_4++) {
                        gotolevel_5 = false;
                        if (has(nodesclone[index_0]['children']
                        [index_1]['children']
                        [index_2]['children']
                        [index_3]['children'][index_4], "children")) {

                          nodesclone[index_0]['children']
                          [index_1]['children']
                          [index_2]['children']
                          [index_3]['children']
                          [index_4]["state"] = {
                            expanded: props.expanded,
                          };
                          gotolevel_5 = true;
                        }


                      }
                    }





                  }
                }




              }
            }





          }
        }
      }
      
      setNodes(nodesclone);
    }

  }, [props.expanded]);




  const SELECT = 3;
  return (
    <Tree nodes={nodes} onChange={handleChange}
    
   
    >
      {({ style, ...p }) => {

        return (
          <div style={style}>
            <Expandable {...p} >
              <Renderer {...p} nodesall={nodes} setDragState={props.setDragState} expanded={props.expanded} searchtext={props.searchtext}>
              </Renderer>
            </Expandable>
          </div>
        )
      }
      }
    </Tree>
  );
}


export default DisplayAnlysisTree;
