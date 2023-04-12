import createEngine, { DiagramModel } from "@projectstorm/react-diagrams";
import commandHandlers from "./Command/commandHandlers";
import CommandManager from "./Command/CommandManager";
import { SimPortFactory } from "../SimulationNodes/Ports/SimPortFactory";
import { SimulationNodeFactory } from "../SimulationNodes/SimulationNodeFactory.js";
import { SimulationNodeModel } from "../SimulationNodes/SimulationNodeModel";
import { LinkFactory } from "../PortModel";
// import LinkFactory from './Link/LinkFactory';
import States from "./states/States";
import ZoomAction from "./actions/ZoomAction";
import DeleteAction from "./actions/DeleteAction";
import { nanoid } from "nanoid";
import { get } from "lodash";

import styler from "stylerjs";

export default class DiagramEngine {
  constructor(updatenode) {
    // this.showSnackbar = showSnackbar;
    this.updatenode = updatenode;
    this.locked = false;
    this.zoomlocked = false;
    this.initializeEngine();
    this.initializeModel();
  }

  getEngine = () => this.engine;

  getModel = () => this.engine.getModel();

  /**
   * Initialization methods
   */

  initializeEngine = () => {
    this.engine = createEngine({
      registerDefaultDeleteItemsAction: false,
      registerDefaultZoomCanvasAction: false,
    });
    // this.engine.registerListener(commandHandlers(this));

    this.engine.getStateMachine().pushState(new States());

    const actions = [ZoomAction, DeleteAction];

    actions.forEach((Action) =>
      this.engine.getActionEventBus().registerAction(new Action())
    );

    this.engine
      .getNodeFactories()
      .registerFactory(new SimulationNodeFactory(this));
    this.engine.getPortFactories().registerFactory(new SimPortFactory());
    this.engine.getLinkFactories().registerFactory(new LinkFactory());
    this.engine.setMaxNumberPointsPerLink(0);
  };

  initializeModel = () => {
    this.model = new DiagramModel();
    this.model.setGridSize(15);
    this.model.setLocked(false);
    this.model.zoomlocked = false;
    this.model.setZoomLocked= function(zoomlocked){
      console.log("Zoom Locked ",zoomlocked)
      this.zoomlocked=zoomlocked
    }
    this.model.updateduringdrag = (nodeid,newposX,newposy) => {
      let node = {
        id: nodeid,
        x: newposX,
        y: newposy
      }
      this.updatenode("UPDATE_NODE",node);


      

      const offSetY =
      this.model.options.offSetY / (this.model.getZoomLevel() * 0.01);
    const offSetX =
    this.model.options.offSetX / (this.model.getZoomLevel() * 0.01);


    console.log("this.model.getZoomLevel()",offSetY,offSetX
      )

      
    
      
      // if(newposX+this.model.options.offsetX < 0){
      //   let newx = (newposX+this.model.options.offsetX) * -1;
      //   var data = {
      //     id: nodeid,
      //     pos: newx,
      //     check: 0
      //   }
      //     console.log("NNNN", data)
      //     this.updatenode("MINIMAP_EXTRA_NEGITIVE_WIDTH", data);
      // }
      // if(newposX+this.model.options.offsetX > this.engine.canvas.clientWidth){
      //   let newx = newposX+this.model.options.offsetX-this.engine.canvas.clientWidth;
      //   var data = {
      //     id: nodeid,
      //     pos: newx,
      //     check: 0
      //   }
      //     console.log("NNNN", data)
      //     this.updatenode("MINIMAP_EXTRA_POSITIVE_WIDTH", data);
      // }
      // if(newposy+this.model.options.offsetY < 0){
      //   let newy = (newposy+this.model.options.offsetY) * -1;
      //   var data = {
      //     id: nodeid,
      //     pos: newy,
      //     check: 0
      //   }
      //     this.updatenode("MINIMAP_EXTRA_NEGITIVE_HEIGHT", data);
      // }
      // if(newposy+this.model.options.offsetY > this.engine.canvas.clientHeight){
      //   let newy = newposy+this.model.options.offsetY-this.engine.canvas.clientHeight;
      //   var data = {
      //     id: nodeid,
      //     pos: newy,
      //     check: 0
      //   }
      //     this.updatenode("MINIMAP_EXTRA_POSITIVE_HEIGHT", data);
      // }
      
    }
    this.model.isZoomLocked = ()=> {
      return this.zoomlocked

    }



    this.model.registerListener({
      eventDidFire: (event) => {
        const type = event.function;
        if (type === "offsetUpdated") this.adjustGridOffset(event);
        if (type === "zoomUpdated") {
          console.log("adjustGridZoom","zoomUpdated")
          this.adjustGridZoom(event)
        };
      },
    });

    this.realignGrid();
    this.engine.setModel(this.model);
  };

  /**
   * Serializing & deserializing methods
   */
  serialize = () => this.model.serialize();

  load = (circuit) => {
    //  if(this.engine.commands){
    //   this.engine.commands.clear();
    //  }
    if (get(circuit, "gridSize") == 0) {
      circuit["gridSize"] = 15;
    }

    console.log(". dragAndDropApp",circuit.zoom)
    if(circuit.zoom){
      this.updatenode('ZOOM_IN', circuit.zoom);
    }
    
    this.model.deserializeModel(circuit, this.engine);
    this.getModel()
    .getNodes()
    .forEach((model) => {
      this.addEventListernerToNodes(model)
    })

    this.realignGrid();
    this.engine.repaintCanvas();
    this.updatenode("INILIZE_MINIMAP",this.getModel().getNodes());
  };

  /**
   * Diagram locking methods
   */
  setLocked = (locked) => {
    this.locked = locked;
    this.model.setLocked(locked);
    // this.locked = locked;
  };

  /**
  * Zoom Control Functionality
  * Nirmalya Saha
  */

  setZoomLocked = (zoomLocked)=>{
    this.zoomlocked = zoomLocked;
    this.model.setZoomLocked(zoomLocked)
    // this.model.set
  }
  isZoomLocked = () =>this.zoomlocked;

  setZoomIn = () => {
     var ZOOM_LEVELS = [15, 25, 50, 75, 100, 150, 200, 300];
    // var ZOOM_LEVELS = [10, 11, 20, 40, 80, 160, 320, 325];
    const model = this.engine.getModel();

    if (this.engine.getModel().isLocked()) {
      return;
    }

    if (this.engine.getModel().isZoomLocked()) {
      return;
    }

    // We can block layer rendering because we are only targeting the transforms
    model.getLayers().forEach(layer => layer.allowRepaint(false));

    const zoomDirection = 'in' ;

    const currentZoomLevelIndex = ZOOM_LEVELS.indexOf(
      ZOOM_LEVELS.includes(model.getZoomLevel())
        ? model.getZoomLevel()
        : 100,
    );

    // const currentZoomLevelIndex = this.updatenode('GET_ZOOM_LEVELS');


    let nextZoomLevelIndex;
      nextZoomLevelIndex = Math.min(
        currentZoomLevelIndex + 1,
        ZOOM_LEVELS.length - 1,
      );

    this.updatenode('ZOOM_IN', ZOOM_LEVELS[nextZoomLevelIndex]);

    const oldZoomFactor = model.getZoomLevel() / 100;

    model.setZoomLevel(ZOOM_LEVELS[nextZoomLevelIndex]);
    console.log("adjustGridZoom 4",ZOOM_LEVELS[nextZoomLevelIndex],event)
    const zoomFactor = model.getZoomLevel() / 100;

        const boundingRect = this.engine
          .getCanvas()
          .getBoundingClientRect();
        const clientWidth = boundingRect.width;
        const clientHeight = boundingRect.height;

        // Compute difference between rect before and after scroll
        const widthDiff =
          clientWidth * zoomFactor - clientWidth * oldZoomFactor;
        const heightDiff =
          clientHeight * zoomFactor - clientHeight * oldZoomFactor;

        // Compute mouse coords relative to canvas
        const clientX = event.clientX - boundingRect.left;
        const clientY = event.clientY - boundingRect.top;

        // Compute width and height increment factor
        const xFactor =
          (clientX - model.getOffsetX()) /
          oldZoomFactor /
          clientWidth;
        const yFactor =
          (clientY - model.getOffsetY()) /
          oldZoomFactor /
          clientHeight;

        // model.setOffset(
        //   model.getOffsetX() - widthDiff * xFactor,
        //   model.getOffsetY() - heightDiff * yFactor,
        // );
        // var data = {
        //   x: model.getOffsetX(),
        //   y: model.getOffsetY()
        // };
  
        // this.updatenode('SET_OFFSET', data);
        this.engine.repaintCanvas();

        // Re-enable rendering
        model.getLayers().forEach(layer => layer.allowRepaint(true));

  }

  setZoomOut = () => {
    var ZOOM_LEVELS = [15, 25, 50, 75, 100, 150, 200, 300];
   // var ZOOM_LEVELS = [10, 11, 20, 40, 80, 160, 320, 325];
   const model = this.engine.getModel();

   if (this.engine.getModel().isLocked()) {
     return;
   }

   if (this.engine.getModel().isZoomLocked()) {
     return;
   }

   // We can block layer rendering because we are only targeting the transforms
   model.getLayers().forEach(layer => layer.allowRepaint(false));

   const zoomDirection = 'out' ;

   const currentZoomLevelIndex = ZOOM_LEVELS.indexOf(
     ZOOM_LEVELS.includes(model.getZoomLevel())
       ? model.getZoomLevel()
       : 100,
   );

     // const currentZoomLevelIndex = this.updatenode('GET_ZOOM_LEVELS');

   let nextZoomLevelIndex;
     nextZoomLevelIndex = Math.max(currentZoomLevelIndex - 1, 0);

   this.updatenode('ZOOM_OUT', ZOOM_LEVELS[nextZoomLevelIndex]);


   const oldZoomFactor = model.getZoomLevel() / 100;

   model.setZoomLevel(ZOOM_LEVELS[nextZoomLevelIndex]);
   console.log("adjustGridZoom 5",ZOOM_LEVELS[nextZoomLevelIndex])
   // model.setZoomLevel(100 / (0.5*nextZoomLevelIndex) * (4*0.5));

  
   model.setZoomLevel(ZOOM_LEVELS[nextZoomLevelIndex]);
   const zoomFactor = model.getZoomLevel() / 100;

        const boundingRect = this.engine
          .getCanvas()
          .getBoundingClientRect();
        const clientWidth = boundingRect.width;
        const clientHeight = boundingRect.height;

        // Compute difference between rect before and after scroll
        const widthDiff =
          clientWidth * zoomFactor - clientWidth * oldZoomFactor;
        const heightDiff =
          clientHeight * zoomFactor - clientHeight * oldZoomFactor;

        // Compute mouse coords relative to canvas
        const clientX = event.clientX - boundingRect.left;
        const clientY = event.clientY - boundingRect.top;

        // Compute width and height increment factor
        const xFactor =
          (clientX - model.getOffsetX()) /
          oldZoomFactor /
          clientWidth;
        const yFactor =
          (clientY - model.getOffsetY()) /
          oldZoomFactor /
          clientHeight;

        // model.setOffset(
        //   model.getOffsetX() - widthDiff * xFactor,
        //   model.getOffsetY() - heightDiff * yFactor,
        // );

        // var data = {
        //   x: model.getOffsetX(),
        //   y: model.getOffsetY()
        // };
  
        // this.updatenode('SET_OFFSET', data);
        this.engine.repaintCanvas();

        // Re-enable rendering
        model.getLayers().forEach(layer => layer.allowRepaint(true));


 }

  isLocked = () => this.locked;

  /**
   * Diagram painting methods
   */
  repaint = () => this.engine.repaintCanvas();

  realignGrid = () => {
    this.adjustGridOffset({
      offsetX: this.model.getOffsetX(),
      offsetY: this.model.getOffsetY(),
    });

    this.adjustGridZoom({
      zoom: this.model.getZoomLevel(),
    });
  };

  adjustGridOffset = ({ offsetX, offsetY }) => {
    console.log("Offset Diagram", offsetX, offsetY);
    if(offsetX !== 0 || offsetX){
      // var data = {
      //   x: offsetX,
      //   y: offsetY
      // };


      var data = {
        x: offsetX,
        y: offsetY
      };

      this.updatenode('SET_OFFSET', data);
     
    }

    if (this.model.isLocked()) {
      return;
    }
    const grid_info = document.querySelector(".fw-wrapper");
  
    if (grid_info) {
      grid_info.style.setProperty("--offset-x", `${Math.round(offsetX)}px`);

      grid_info.style.setProperty("--offset-y", `${Math.round(offsetY)}px`);
    }
  };

  adjustGridZoom = ({ zoom }) => {
   
    const { gridSize } = this.model.getOptions();
    const grid_info = document.querySelector(".fw-wrapper");
    var styles = styler(".fw-wrapper").get(["--grid-size"]);

    if (grid_info) {
      grid_info.style.setProperty(
        "--grid-size",
        `${(gridSize * zoom) / 100}px`
      );
    }
  };

  /**
   * Component creation and configuration methods
   */
  handleComponentDrop = (event, component) => {
    let params = component.datas.data ? component.datas.data : [];

    let data = {
      id: this.generateID(),
      name: component.type,
      extras: {
        blockType: {
          ...component,
        },
        params,
        description: component.description,
      },
    };

    let node = new SimulationNodeModel(data);

    let point = this.engine.getRelativeMousePoint(event);
    node.setPosition(point);

    this.model.addNode(node);

   this.updatenode("ADD_NODE",node);
    this.addEventListernerToNodes(node)
   
    // this.engine.fireEvent({ nodes: [node] }, 'componentsAdded');
    this.engine.repaintCanvas();
  };

  /**
   * addEvenetListernerToNode attach the lister
   * @param {*} model : 
   */
  addEventListernerToNodes = (model) =>{
    if(model){
      model.registerListener({
        eventDidFire: (e) => {
          if (e.function === "selectionChanged") {
            
            if (e.isSelected) {
              // console.log("selected ");
            } else {
              // console.log(" un selected ");
            }
          }
          if (e.function === "entityRemoved") {
            // removing of the node
            console.log("Entity is removed==============> testing",model)
            this.updatenode("DELETE_NODE",model);
          }
          if (e.function === "nodesUpdated") {
            console.log("Entity is updating==============> testing",model)
          }
        },
      });
    }
  }

  editComponent = (nodealloptions) => {
    this.getModel()
      .getNodes()
      .map((node) => {
        if (node.getID() == nodealloptions.id) {

          if (
            nodealloptions.extras.blockType.type === "Propagator" &&
            nodealloptions.extras.blockType.subtype === "Propagator"
          ) {
            Object.entries(nodealloptions.extras.params.Force).forEach(
              ([key, value]) => {

                switch (key) {
                  case "forceModel_Magneticfield":
                    if (value.hasOwnProperty("magneticfield")) {
                      if (value.magneticfield === "None") {
                        const indexOfForce = nodealloptions.extras.blockType.outputArray.findIndex(
                          (ports) => {
                            return ports.name_id === "magnetic_field";
                          }
                        );

                        if (
                          nodealloptions.extras.blockType.outputArray[
                            indexOfForce
                          ].portType.isActivePort
                        ) {
                          node.deletePort("magnetic_field");
                          nodealloptions.extras.blockType.outputArray[
                            indexOfForce
                          ].portType.isActivePort = false;
                        }
                      } else {
                        //TODO: Add The Node
                        const indexOfForce = nodealloptions.extras.blockType.outputArray.findIndex(
                          (ports) => {
                            return ports.name === "magnetic_field";
                          }
                        );

                        const selectedOutputport =
                          nodealloptions.extras.blockType.outputArray[
                            indexOfForce
                          ];

                        if (!selectedOutputport.portType.isActivePort) {
                          node.addNewPort({ ...selectedOutputport }, "out");
                          nodealloptions.extras.blockType.outputArray[
                            indexOfForce
                          ].portType.isActivePort = true;
                        }
                      }
                    } else {
                      //TODO: Remove the Node

                      const indexOfForce = nodealloptions.extras.blockType.outputArray.findIndex(
                        (ports) => {
                          return ports.name === "magnetic_field";
                        }
                      );

                      if (
                        nodealloptions.extras.blockType.outputArray[indexOfForce]
                          .portType.isActivePort
                      ) {
                        node.deletePort("magnetic_field");
                        nodealloptions.extras.blockType.outputArray[
                          indexOfForce
                        ].portType.isActivePort = false;
                      }
                    }

                    break;

                  case "forceModel_Third_body":

                    if (value.hasOwnProperty("thirdbodylist")) {
                      if (
                        value.thirdbodylist.hasOwnProperty(
                          "ThirdBody_PositionList_multiselect"
                        )
                      ) {
                        const indexOfMoonPosition = value.thirdbodylist.ThirdBody_PositionList_multiselect.findIndex(
                          (thirdbody) => {
                            return thirdbody === "Earth-Moon";
                          }
                        );

                        if (indexOfMoonPosition > -1) {
                          const indexOfForce = nodealloptions.extras.blockType.outputArray.findIndex(
                            (ports) => {
                              return ports.name === "moon_position";
                            }
                          );
                          const selectedOutputport =
                            nodealloptions.extras.blockType.outputArray[
                              indexOfForce
                            ];

                          if (!selectedOutputport.portType.isActivePort) {
                            node.addNewPort({ ...selectedOutputport }, "out");
                            nodealloptions.extras.blockType.outputArray[
                              indexOfForce
                            ].portType.isActivePort = true;
                          }
                        } else {
                          //TODO: Delete
                          const indexOfForce = nodealloptions.extras.blockType.outputArray.findIndex(
                            (ports) => {
                              return ports.name_id === "moon_position";
                            }
                          );

                          if (
                            nodealloptions.extras.blockType.outputArray[
                              indexOfForce
                            ].portType.isActivePort
                          ) {
                            node.deletePort("moon_position");
                            nodealloptions.extras.blockType.outputArray[
                              indexOfForce
                            ].portType.isActivePort = false;
                          }
                        }

                        const indexOfSun = value.thirdbodylist.ThirdBody_PositionList_multiselect.findIndex(
                          (thirdbody) => {
                            return thirdbody === "Sun";
                          }
                        );

                        if (indexOfSun > -1) {
                          const indexOfForce = nodealloptions.extras.blockType.outputArray.findIndex(
                            (ports) => {
                              return ports.name === "sun_position";
                            }
                          );
                          const selectedOutputport =
                            nodealloptions.extras.blockType.outputArray[
                              indexOfForce
                            ];
                          if (!selectedOutputport.portType.isActivePort) {
                            node.addNewPort({ ...selectedOutputport }, "out");
                            nodealloptions.extras.blockType.outputArray[
                              indexOfForce
                            ].portType.isActivePort = true;
                          }
                        } else {
                          //TODO: Delete
                          const indexOfForce = nodealloptions.extras.blockType.outputArray.findIndex(
                            (ports) => {
                              return ports.name_id === "sun_position";
                            }
                          );
                          if (
                            nodealloptions.extras.blockType.outputArray[
                              indexOfForce
                            ].portType.isActivePort
                          ) {
                            node.deletePort("sun_position");
                            nodealloptions.extras.blockType.outputArray[
                              indexOfForce
                            ].portType.isActivePort = false;
                          }
                        }
                        // value.thirdbodylist.ThirdBody_PositionList_multiselect.forEach(element => {

                        //   if(element ==="Earth-Moon")
                        //   {
                        //     //TODO: ADD Earth-Moon
                        //     const indexOfForce = nodealloptions.extras.blockType.outputArray.findIndex((ports)=>{
                        //       return (ports.name ==="Moon Position")
                        //     });
                        //     const selectedOutputport = nodealloptions.extras.blockType.outputArray[indexOfForce];
                        //     console.log("550797a4 ---> 56", selectedOutputport) ;
                        //     if(!selectedOutputport.portType.isActivePort)
                        //     {
                        //       node.addNewPort({...selectedOutputport},"out");
                        //       nodealloptions.extras.blockType.outputArray[indexOfForce].portType.isActivePort = true;
                        //     }

                        //   }
                        //   else
                        //   {
                        //     // TODO: Delete

                        //     console.log("78174820", "delete the MOOOn Position " ,element)
                        //     const indexOfForce = nodealloptions.extras.blockType.outputArray.findIndex((ports)=>{
                        //       return (ports.name ==="Moon Position")
                        //     });
                        //     if(nodealloptions.extras.blockType.outputArray[indexOfForce].portType.isActivePort){
                        //       node.deletePort("Moon Position");
                        //       nodealloptions.extras.blockType.outputArray[indexOfForce].portType.isActivePort = false;
                        //     }
                        //   }

                        // });
                      }
                    }

                    break;

                  default:
                    console.log("nothing to do ");
                }
              }
            );

            if (nodealloptions.extras.params.Satellite_chassis.isexternalchasis) {
              const indexOfForce = nodealloptions.extras.blockType.inputArray.findIndex(
                (ports) => {
                  return ports.name === "Satellite chasis Configuration";
                }
              );

              const selectedOutputport =
                nodealloptions.extras.blockType.inputArray[indexOfForce];
              if (!selectedOutputport.portType.isActivePort) {
                node.addNewPort({ ...selectedOutputport }, "in");
                nodealloptions.extras.blockType.inputArray[
                  indexOfForce
                ].portType.isActivePort = true;
              }
            } else {
              const indexOfForce = nodealloptions.extras.blockType.inputArray.findIndex(
                (ports) => {
                  return ports.name === "Satellite chassis Configuration";
                }
              );

              if (
                nodealloptions.extras.blockType.inputArray[indexOfForce].portType
                  .isActivePort
              ) {
                node.deletePort("Satellite chassis Configuration");
                nodealloptions.extras.blockType.inputArray[
                  indexOfForce
                ].portType.isActivePort = false;
              }
            }
          }

          node.setOptions({ ...nodealloptions });
        }
      });
    this.engine.repaintCanvas();

    // const parametersJson = this.serialize();

    // const parameters = JSON.stringify(parametersJson);
  };

  generateID() {
    return nanoid();
  }
}
