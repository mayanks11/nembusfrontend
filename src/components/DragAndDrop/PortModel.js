import { DefaultLinkFactory } from '@projectstorm/react-diagrams-defaults';
import createEngine, {
  DiagramModel,
  DefaultNodeModel,
  DefaultPortModel,
  RightAngleLinkFactory,
  LinkModel,
  RightAngleLinkModel
} from '@projectstorm/react-diagrams';
export class LinkFactory extends RightAngleLinkFactory {
  constructor() {
    super('default');
  }
}

export default class PortModel extends DefaultPortModel {
  canLinkToPort(port) {
    try {
      if (port instanceof DefaultPortModel) {
        // should be (in and out) and (allowMultipleConnections || nodeCount==1 if notAllowMultipleConnections)
        // let maxLinks = port.getMaximumLinks() ? port.getMaximumLinks(): -1;
        // let length = 0;

        // for(let i in port.getLinks()) {
        //   length++;
        // }
        // return ((this.options.in !== port.getOptions().in) && ( maxLinks === -1 || length < maxLinks));

        // one port must be in and other port must be out &&
        // port name must match the name of the destination parent node name &&
        // port's parent node name must match the name of the destination port name &&
        console.log("PORT----------------------------->",port)
        return (
          this.options.in !== port.getOptions().in &&
          this.options.label.toLowerCase() === port.parent.options.extras.blockType.type.toLowerCase() &&
          port.options.label.toLowerCase() === this.parent.options.extras.blockType.type.toLowerCase()
        );
      }
    } catch(e) {
      console.log('Cannot determine block type');
      return false;
    }
  }
}