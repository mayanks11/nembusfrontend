import {
  PortModel,
  PortModelAlignment,
} from "@projectstorm/react-diagrams-core";
import { RightAngleLinkModel } from "@projectstorm/react-diagrams";

export class SimPortModel extends PortModel {
  constructor({
    label,
    direction,
    portType,
    name,
    allowConnection,
    alignments,
  }) {
    super({
      label,
      alignment:
        direction === "in" ? PortModelAlignment.LEFT : PortModelAlignment.RIGHT,
      type: "default",
      name,
    });

    this.portType = portType;
    this.direction = direction;
    this.allowConnection = allowConnection;
  }

  deserialize(event) {
    super.deserialize(event);
    this.options.label = event.data.label;
    this.portType = event.data.portType;
    this.direction = event.data.direction;
    this.allowConnection = event.data.allowConnection;
  }

  serialize() {
    return {
      ...super.serialize(),
      label: this.options.label,
      portType: this.portType,
      direction: this.direction,
      allowConnection: this.allowConnection,
    };
  }

  link(port, factory) {
    let link = this.createLinkModel(factory);
    link.setSourcePort(this);
    link.setTargetPort(port);
    return link;
  }

  //Note: Condition for linking to another
  canLinkToPort(port) {
    if (port instanceof SimPortModel) {
      const sameDirection = this.direction === port.direction;
      let samePortType = this.portType.type === port.portType.type;
      // this.portType.type === port.portType.type;
      if (this.portType.type === "matrix" && port.portType.type === "matrix") {
        if (
          this.portType.size.col === port.portType.size.col &&
          this.portType.size.row === port.portType.size.row
        ) {
          samePortType = true;
        } else {
          samePortType = false;
        }
      }
      const portTypeAny =
        this.portType.type === "any" || port.portType.type === "any";
      if (!sameDirection && (samePortType || portTypeAny)) return true;
    }
    return false;
  }

  createLinkModel(factory) {
    let link = super.createLinkModel();
    if (!link && factory) {
      return factory.generateModel({});
    }
    return link || new RightAngleLinkModel();
  }
}
