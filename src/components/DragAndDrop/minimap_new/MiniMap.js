import React, { useContext, useRef, useState, useEffect } from "react";
import { Stage, Layer, Rect, Group, Text, Circle, Ellipse } from "react-konva";
import { connect } from "react-redux";
import Konva from "konva";
import ViewBoxContext from "./ViewBoxContext";
import DiagramContext from "../Diagram/DiagramContext";
import useStateRef from "react-usestateref";

/*
 Minimap Component
 Nirmalya Saha
*/

const WIDTH = 271;
const HEIGHT = 163;
const MAP_WIDTH = 3850;
// const MAP_WIDTH = 1536;

function Minimap(props) {
  const engine = useContext(DiagramContext);
  // const [isDrag, setIsDrag] = useState(false);

  console.log("Nirmalya Reducer State", props.MinimapReducer);
  // props.getMinimapRedux(props.MinimapReducer);
  // useEffect(()=> {
  //   props.getMinimapRedux(props.MinimapReducer);
  // },[props.MinimapReducer])

  useEffect(() => {
    if (typeof engine !== "undefined") {
      const data = {
        width: engine.getEngine().canvas.clientWidth,
        height: engine.getEngine().canvas.clientHeight,
      };
      engine.updatenode("MINIMAP_CANVAS_WIDTH_HEIGHT", data);
      console.log(
        "Mirmalya Use Context",
        engine.getEngine().canvas.clientHeight,
        engine.getEngine().canvas.clientWidth,
        engine.getEngine(),
        engine
      );

      console.log("props.MinimapReducer.", props.MinimapReducer);
    }
  }, []);

  const zoomLevelsdown =
    props.MinimapReducer.zoomLevels * 0.01 < 1.0
      ? props.MinimapReducer.zoomLevels * 0.01
      : 1;

  useEffect(() => {
    const additionOff_pos_X = {
      position: 0,
      id: "",
    };
    const additionOff_neg_X = {
      position: 0,
      id: "",
    };
    const additionOff_pos_Y = {
      position: 0,
      id: "",
    };
    const additionOff_neg_Y = {
      position: 0,
      id: "",
    };

    const zoomLevelsdown =
      props.MinimapReducer.zoomLevels * 0.01 < 1.0
        ? props.MinimapReducer.zoomLevels * 0.01
        : 1;

    const offSetY =
      props.MinimapReducer.offSetY / (props.MinimapReducer.zoomLevels * 0.01);
    const offSetX =
      props.MinimapReducer.offSetX / (props.MinimapReducer.zoomLevels * 0.01);

    props.MinimapReducer.initializeModel.map((ele) => {
      /**
       * Negative X Axis
       */

      if (
        ele.position.x + offSetX < 0 &&
        (!additionOff_neg_X.id || ele.position.x < additionOff_neg_X.position)
      ) {
        additionOff_neg_X.position = ele.position.x;
        additionOff_neg_X.id = ele.id;
      }
      /**
       * Negative Y Axis
       */

      if (
        ele.position.y + offSetY < 0 &&
        (!additionOff_neg_Y.id || ele.position.y < additionOff_neg_Y.position)
      ) {
        additionOff_neg_Y.position = ele.position.y;
        additionOff_neg_Y.id = ele.id;
      }
      /**
       * X positve
       */

      if (ele.position.x >= 0 && ele.position.x > additionOff_pos_X.position) {
        additionOff_pos_X.position = ele.position.x;
        additionOff_pos_X.id = ele.id;
      }

      /**
       * Y positive
       */

      if (ele.position.y >= 0 && ele.position.y > additionOff_pos_Y.position) {
        additionOff_pos_Y.position = ele.position.y;
        additionOff_pos_Y.id = ele.id;
      }

      console.log(
        "~~~minimap offsetN before 3",
        ele.position,
        ele.id,
        "OffSetY",
        offSetY,
        "offsetX",
        offSetX,
        ele.position.y + offSetY < 0,
        ele.position.y + offSetY < additionOff_neg_Y.position + offSetY,
        props.MinimapReducer.offSetX / (props.MinimapReducer.zoomLevels * 0.01),
        props.MinimapReducer.offSetY / (props.MinimapReducer.zoomLevels * 0.01)
      );
    });

    console.log(
      "~~~minimap offsetN before 3 rest",
      additionOff_neg_X,
      additionOff_neg_Y,
      additionOff_pos_X,
      additionOff_pos_Y
    );

    const check = 0;
    if (typeof engine !== "undefined") {
      /**
       * Negative X Axis
       */

      if (additionOff_neg_X.position + offSetX < 0 && additionOff_neg_X.id) {
        let newx = (additionOff_neg_X.position + offSetX) * -1;

        const newdata = {
          id: additionOff_neg_X.id,
          pos: newx,
        };
        console.log(" ~~~minimap MINIMAP_EXTRA_NEGITIVE_WIDTH", newdata);
        engine.updatenode("MINIMAP_EXTRA_NEGITIVE_WIDTH", newdata);
      } else if (props.MinimapReducer.extraWidthNegative.id) {
        const newdata = {
          id: "",
          pos: 0,
        };
        engine.updatenode("MINIMAP_EXTRA_NEGITIVE_WIDTH", newdata);
      }

      /**
       * Negative Y Axis
       */
      if (additionOff_neg_Y.position + offSetY < 0 && additionOff_neg_Y.id) {
        let newy = (additionOff_neg_Y.position + offSetY) * -1;
        const newdata = {
          id: additionOff_neg_Y.id,
          pos: newy,
        };

        engine.updatenode("MINIMAP_EXTRA_NEGITIVE_HEIGHT", newdata);
      } else if (props.MinimapReducer.extraHeightNegative.id) {
        const newdata = {
          id: "",
          pos: 0,
        };

        engine.updatenode("MINIMAP_EXTRA_NEGITIVE_HEIGHT", newdata);
      }

      if (
        additionOff_pos_X.position +
          props.MinimapReducer.offSetX /
            (props.MinimapReducer.zoomLevels * 0.01) >
          (props.MinimapReducer.canvasWidth -
            props.MinimapReducer.markLeft * props.MinimapReducer.isOpenTab) /
            (props.MinimapReducer.zoomLevels * 0.01) &&
        additionOff_pos_X.id
      ) {
        let newx =
          additionOff_pos_X.position +
          props.MinimapReducer.offSetX /
            (props.MinimapReducer.zoomLevels * 0.01) -
          (props.MinimapReducer.canvasWidth -
            props.MinimapReducer.markLeft * props.MinimapReducer.isOpenTab) /
            (props.MinimapReducer.zoomLevels * 0.01);

        const newdata = {
          id: additionOff_pos_X.id,
          pos: newx,
        };

        engine.updatenode("MINIMAP_EXTRA_POSITIVE_WIDTH", newdata);
      } else if (props.MinimapReducer.extraWidthPositive.id) {
        const newdata = {
          id: "",
          pos: 0,
        };
        engine.updatenode("MINIMAP_EXTRA_POSITIVE_WIDTH", newdata);
      }

      if (
        additionOff_pos_Y.position +
          props.MinimapReducer.offSetY /
            (props.MinimapReducer.zoomLevels * 0.01) >
          (props.MinimapReducer.markHeight - 48) /
            (props.MinimapReducer.zoomLevels * 0.01) &&
        additionOff_pos_Y.id
      ) {
        let newy =
          additionOff_pos_Y.position +
          props.MinimapReducer.offSetY /
            (props.MinimapReducer.zoomLevels * 0.01) -
          (props.MinimapReducer.markHeight - 48) /
            (props.MinimapReducer.zoomLevels * 0.01);

        const newdata = {
          id: additionOff_pos_Y.id,
          pos: newy,
        };

        engine.updatenode("MINIMAP_EXTRA_POSITIVE_HEIGHT", newdata);
      } else if (props.MinimapReducer.extraHeightPositive.id) {
        const newdata = {
          id: "",
          pos: 0,
        };
        engine.updatenode("MINIMAP_EXTRA_POSITIVE_HEIGHT", newdata);
      }

      console.log(
        "minimap offsetN before 4",
        additionOff_pos_X.position + props.MinimapReducer.offSetX,
        props.MinimapReducer.canvasWidth -
          props.MinimapReducer.markLeft * props.MinimapReducer.isOpenTab,
        (props.MinimapReducer.canvasWidth -
          props.MinimapReducer.markLeft * props.MinimapReducer.isOpenTab) /
          (props.MinimapReducer.zoomLevels * 0.01),
        additionOff_pos_X.position + props.MinimapReducer.offSetX >
          (props.MinimapReducer.canvasWidth -
            props.MinimapReducer.markLeft * props.MinimapReducer.isOpenTab) /
            (props.MinimapReducer.zoomLevels * 0.01)
      );
    }
    //   props.MinimapReducer.initializeModel.map(ele => {
    //     // if(ele.position.x+props.MinimapReducer.offSetX < newnx){
    //     if(ele.position.x+props.MinimapReducer.offSetX < newnx){
    //       console.log("ChangeNNNM", newnx, ele.position.x);
    //       if(count == 0){
    //         newnx = ele.position.x;
    //         idnx = ele.id;
    //         count++;
    //       }
    //       else{
    //         if(ele.position.x < newnx){
    //           newnx = ele.position.x;
    //           idnx = ele.id;
    //         }
    //       }
    //     }
    //     else if(props.MinimapReducer.extraWidthNegative.id === ele.id){
    //       newnx = ele.position.x;
    //       idnx = ele.id;
    //       check = 1;
    //     }
    //     // if(ele.position.x+props.MinimapReducer.offSetX > newpx){
    //     if(ele.position.x > newpx){
    //       console.log("ChangeN", newpx, ele.position.x);
    //       newpx = ele.position.x;
    //       idpx = ele.id;
    //     }
    //     else if( props.MinimapReducer.extraWidthPositive.id === ele.id){
    //       console.log("ChangeNMN", newpx, ele.position.x);
    //       newpx = ele.position.x;
    //       idpx = ele.id;
    //       check = 1;
    //     }
    //     if(ele.position.y+props.MinimapReducer.offSetY < newny){
    //     // if(ele.position.y< newny){
    //       if(count2 === 0){
    //         newny = ele.position.y;
    //         idny = ele.id;
    //         count2++;
    //       }
    //       else{
    //         if(ele.position.x < newny){
    //           newny = ele.position.y;
    //           idny = ele.id;
    //         }
    //       }
    //     }
    //     else if( props.MinimapReducer.extraHeightNegative.id === ele.id){
    //       newny = ele.position.y;
    //       idny = ele.id;
    //       check = 1;
    //     }
    //     // if(ele.position.y+props.MinimapReducer.offSetY > newpy){
    //     if(ele.position.y > newpy){
    //       newpy = ele.position.y;
    //       idpy = ele.id;
    //     }
    //     else if( props.MinimapReducer.extraHeightPositive.id === ele.id){
    //       newpy = ele.position.y;
    //       idpy = ele.id;
    //       check = 1;
    //     }
    //   });

    //   if(typeof engine !== 'undefined'){

    //   if(newnx+props.MinimapReducer.offSetX < 0 && idnx){
    //     let newx = (newnx+props.MinimapReducer.offSetX) * -1;
    //     var data = {
    //       id: idnx,
    //       pos: newx,
    //       check: check
    //     }
    //     console.log("Demo123456", data);
    //       engine.updatenode("MINIMAP_EXTRA_NEGITIVE_WIDTH", data);
    //   }
    //   if(newpx+props.MinimapReducer.offSetX > ((props.MinimapReducer.canvasWidth - props.MinimapReducer.markWidth - (props.MinimapReducer.markLeft * props.MinimapReducer.isOpenTab)) /(props.MinimapReducer.zoomLevels * 0.01)) && idpx){
    //     let newx = newpx+props.MinimapReducer.offSetX-((props.MinimapReducer.canvasWidth - props.MinimapReducer.markWidth - (props.MinimapReducer.markLeft * props.MinimapReducer.isOpenTab)) /(props.MinimapReducer.zoomLevels * 0.01));
    //     var data = {
    //       id: idpx,
    //       pos: newx,
    //       check: check
    //     }
    //     console.log("Demo123", data);
    //       engine.updatenode("MINIMAP_EXTRA_POSITIVE_WIDTH", data);
    //   }
    //   if(newny+props.MinimapReducer.offSetY < 0 && idny){
    //     let newy = (newny+props.MinimapReducer.offSetY) * -1;
    //     var data = {
    //       id: idny,
    //       pos: newy,
    //       check: check
    //     }
    //     console.log("Demo1", data);
    //       engine.updatenode("MINIMAP_EXTRA_NEGITIVE_HEIGHT", data);
    //   }
    //   if(newpy+props.MinimapReducer.offSetY> ((props.MinimapReducer.markHeight - 45) /(props.MinimapReducer.zoomLevels * 0.01)) && idpy){
    //     let newy = newpy+props.MinimapReducer.offSetY-((props.MinimapReducer.markHeight - 45) /(props.MinimapReducer.zoomLevels * 0.01));
    //     var data = {
    //       id: idpy,
    //       pos: newy,
    //       check: check
    //     }
    //     console.log("Demo1", data);
    //       engine.updatenode("MINIMAP_EXTRA_POSITIVE_HEIGHT", data);
    //   }
    // }

    // console.log(
    //   "minimap offsetN",
    //   newpx,
    //   newnx,
    //   newpy,
    //   newny,
    //   idpx,
    //   idpy,
    //   idnx,
    //   idny
    // );
  }, [props.MinimapReducer.offSetX, props.MinimapReducer.offSetY]);

  // useEffect(()=>{
  //   if(typeof engine !== 'undefined'){
  //     if(isDrag === false){
  //       engine.updatenode("END_VIEW_DRAG", false);
  //     }
  //     else{
  //       engine.updatenode("START_VIEW_DRAG", true);
  //     }
  //   }
  // }, [isDrag]);

  const miniMapRef = useRef(null);
  const viewBoxRef = useRef(null);
  const { xPos, yPos, scale } = useContext(ViewBoxContext);
  const { setMiniMapX, setMiniMapY } = useContext(ViewBoxContext);
  const viewXPos = xPos / scale;
  const viewYPos = yPos / scale;
  // const canvasWidth = 1536;
  // const canvasHeight = 722;
  const canvasWidth = props.MinimapReducer.canvasWidth;
  const canvasHeight = props.MinimapReducer.canvasHeight;
  const scaleX = WIDTH / canvasWidth;
  const scaleY = HEIGHT / canvasHeight;
  const finalScale = WIDTH / canvasWidth;
  const viewScale = WIDTH / MAP_WIDTH - 0.005;
  const viewDimensions = {
    width: window.innerWidth / scale / 2,
    height: window.innerHeight / scale / 2,
  };

  let previousvalue = {
    x: -100000,
    y: -100000,
  };

  const [
    previousMouseValue,
    setOffsetpreviousMouseValue,
    setOffsetpreviousMouseValueRef,
  ] = useStateRef({
    x: -100000,
    y: -100000,
  });
  const [
    initialCanvasValue,
    setInitialCanvasValue,
    setInitialCanvasValueeRef,
  ] = useStateRef({
    x: -100000,
    y: -100000,
  });

  function handleDragMove(event) {
    console.log("~~~~~View", viewBoxRef.current.getPosition().x, event);

    const additionWidth =
      (props.MinimapReducer.extraWidthNegative.pos +
        props.MinimapReducer.extraWidthPositive.pos) *
      props.MinimapReducer.zoomLevels *
      0.01;

    const additionHeight =
      (props.MinimapReducer.extraHeightNegative.pos +
        props.MinimapReducer.extraHeightPositive.pos) *
      props.MinimapReducer.zoomLevels *
      0.01;

    const widthration = (canvasWidth + additionWidth) / WIDTH;
    const heightration = (canvasHeight + additionHeight) / HEIGHT;

    const stage = event.target.getStage();
    const pointerPosition = stage.getPointerPosition();

    let displacementX = -1;
    let displacementY = -1;

    displacementX =
      pointerPosition.x - setOffsetpreviousMouseValueRef.current.x;
    displacementY =
      pointerPosition.y - setOffsetpreviousMouseValueRef.current.y;

    console.log(
      "~~~newview",
      pointerPosition,
      setOffsetpreviousMouseValueRef.current,
      setInitialCanvasValueeRef.current,
      displacementX,
      displacementY,
      setInitialCanvasValueeRef.current.x - displacementX,
      setInitialCanvasValueeRef.current.y - displacementY
    );

    console.log(
      "!!!Displacment",
      setInitialCanvasValueeRef.current.x,
      setInitialCanvasValueeRef.current.y,
      displacementX,
      displacementY,
      setInitialCanvasValueeRef.current.x - displacementX,
      setInitialCanvasValueeRef.current.y - displacementY
    );

    props.setMinimap({
      offsetX: setInitialCanvasValueeRef.current.x - displacementX,
      offsetY: setInitialCanvasValueeRef.current.y - displacementY,
    });
  }

  
  return (
    <div style={{ backgroundColor: "grey" }}>
      <Stage
        width={WIDTH}
        height={HEIGHT}
        ref={miniMapRef}
        scaleX={
          WIDTH /
          ((canvasWidth +
            (props.MinimapReducer.extraWidthNegative.pos +
              props.MinimapReducer.extraWidthPositive.pos)) /
            zoomLevelsdown)
        }
        scaleY={
          HEIGHT /
          ((canvasHeight +
            (props.MinimapReducer.extraHeightNegative.pos +
              props.MinimapReducer.extraHeightPositive.pos)) /
            zoomLevelsdown)
        }
        offset={{
          x: -1 * props.MinimapReducer.extraWidthNegative.pos * 1,
          y: -1 * props.MinimapReducer.extraHeightNegative.pos * 1,
        }}
      >
        <Layer id="screens">
          <Group>
            {props.MinimapReducer.initializeModel.map((ele) => {
              return (
                <div>
                  <Rect
                    x={
                      ele.position.x +
                      (props.MinimapReducer.offSetX * 100) /
                        props.MinimapReducer.zoomLevels
                    }
                    y={
                      ele.position.y +
                      (props.MinimapReducer.offSetY * 100) /
                        props.MinimapReducer.zoomLevels
                    }
                    width={ele.width}
                    height={ele.height}
                    fill="rgba(86, 204, 242, 1)"
                    stroke="#2d9cdb"
                    strokeWidth={2}
                  />
                </div>
              );
            })}
          </Group>
        </Layer>
        <Layer id="viewbox">
          <Rect
            x={0}
            y={0}
            width={
              (props.MinimapReducer.canvasWidth -
                props.MinimapReducer.markWidth -
                props.MinimapReducer.markLeft *
                  props.MinimapReducer.isOpenTab) /
              (1 * 1)
            }
            //  height={props.MinimapReducer.canvasHeight/(props.MinimapReducer.zoomLevels * 0.01)}
            height={(props.MinimapReducer.markHeight - 48) / (1 * 1)}
            fill="rgba(86, 204, 242, 0.1)"
            stroke="#2d9cdb"
            strokeWidth={2}
            ref={viewBoxRef}
            scaleX={1 / (props.MinimapReducer.zoomLevels * 0.01)}
            scaleY={1 / (props.MinimapReducer.zoomLevels * 0.01)}
            draggable
            dragBoundFunc={(pos) => {
              const additionWidth =
                (props.MinimapReducer.extraWidthNegative.pos +
                  props.MinimapReducer.extraWidthPositive.pos) *
                props.MinimapReducer.zoomLevels *
                0.01;

              const additionHeight =
                (props.MinimapReducer.extraHeightNegative.pos +
                  props.MinimapReducer.extraHeightPositive.pos) *
                props.MinimapReducer.zoomLevels *
                0.01;

              const widthration = WIDTH/(canvasWidth + additionWidth) ;
              const heightration = HEIGHT/(canvasHeight + additionHeight) ; ;
              //
              console.log(
                "~~~~~View",
                pos,
                props.MinimapReducer.extraWidthNegative.pos
              );
              return {
                x: props.MinimapReducer.extraWidthNegative.pos * widthration,
                y: props.MinimapReducer.extraHeightNegative.pos * heightration,
              };
            }}
            onDragMove={(e) => {
              const stage = e.target.getStage();
              const pointerPosition = stage.getPointerPosition();
              const offset = {
                x: e.currentTarget.attrs.x,
                y: e.target.attrs.y,
              };

              handleDragMove(e);

              console.log(
                "~~~~~View",
                "jajaj",
                e,
                offset,
                pointerPosition,
                e.evt.movementX
              );
            }}
            // onDragMove={(eve)=>{handleDragMove(eve)}}
            onDragStart={(e) => {
              // props.setIsDrag(true);
              // previousvalue = {
              //   x:-100000,
              //   y:-100000
              // }
              const stage = e.target.getStage();
              const pointerPosition = stage.getPointerPosition();
              console.log("~~~~~View Dragging started", pointerPosition);

              setOffsetpreviousMouseValue({
                ...setOffsetpreviousMouseValueRef.current,
                x: pointerPosition.x,
                y: pointerPosition.y,
              });

              setInitialCanvasValue({
                ...setInitialCanvasValueeRef.current,
                x: props.MinimapReducer.offSetX,
                y: props.MinimapReducer.offSetY,
              });
            }}
            onDragEnd={(e) => {
              // props.setIsDrag(false);
              // previousvalue = {
              //   x:-100000,
              //   y:-100000
              // }
              setOffsetpreviousMouseValue({
                ...setOffsetpreviousMouseValueRef.current,
                x: -100000,
                y: -100000,
              });
              console.log("~~~~~View Dragging Stopped");
            }}
          />
        </Layer>
      </Stage>
    </div>
  );
}

const mapStateToProps = (state) => ({
  MinimapReducer: state.MinimapReducer,
});

export default connect(mapStateToProps)(Minimap);
