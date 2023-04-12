import { NodeModel } from "@projectstorm/react-diagrams";
import { SimPortModel } from "./Ports/SimPortModel";

export class SimulationNodeModel extends NodeModel {
  constructor(options = {}, createNewIds = false) {
    super({
      ...options,
      type: "deltav",
    });

    const createSimPortModel = (port, direction = "in") => {
     
    const { name, portType, allowConnection, alignment } = port;

    return new SimPortModel({
        in: true,
        name,
        label: name,
        direction,
        portType,
        allowConnection,
        alignment,
      });
    };

    
    if (options.hasOwnProperty("extras")) {
      options.extras.blockType.inputArray.forEach((inputPort) => {
        const isActiveport = inputPort.portType.hasOwnProperty("isActivePort")
          ? inputPort.portType.isActivePort
          : true;
        if (isActiveport) {
          this.addPort(createSimPortModel(inputPort, "in"));
        }
      });

      options.extras.blockType.outputArray.forEach((outputPort) => {
        const isActiveport = outputPort.portType.hasOwnProperty("isActivePort")
          ? outputPort.portType.isActivePort
          : true;
        if (isActiveport) {
          this.addPort(createSimPortModel(outputPort, "out"));
        }
      });
    }

    this.setPosition(options.positionX, options.positionY);
  }



  addNewPort(portData, port="out"){
    
    const createSimPortModel = (port, direction = "in") => {
      
      const { name, portType, allowConnection, alignment } = port;
      return new SimPortModel({
        in: true,
        name,
        label: name,
        direction,
        portType,
        allowConnection,
        alignment,
      });
      };

      this.addPort(createSimPortModel(portData, port));

      
  }

  deletePort(portName){

    // console.log("550797a4 LINKS --------->" ,this.getPort(portName).getLinks());
    // // this.getPort(portName).removeLink(this.getPort(portName).getLinks());

    // const port = this.getPort(portName);

    // port.removeLink(Object.entries(port.getLinks()).map(outlink => outlink));

    // Object.entries(this.getPort(portName).getLinks()).forEach(([key,value]) => {
    //   // this.getPort(portName).removeLink(element.ge);
    //   console.log("550797a4 Key --------->",key, value);
    //   // this.getPort(portName).removeLink(value);
    // });
    // Object.entries(this.getPort(portName).getLinks()).

    this.removePort(this.getPort(portName));
  }

  getOptions() {
    return this.options;
  }

 
  setOptions(data) {
    this.options = data;
  }

  getID() {
    return this.options.id;
  }
  serialize() {
    return {
      ...super.serialize(),
      name: this.options.name,
      options: this.options.options,
    };
  }

  deserialize(ob, engine) {
    super.deserialize(ob, engine);
    this.options.name = ob.name;
  }
}
