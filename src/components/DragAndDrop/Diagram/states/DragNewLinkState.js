import {
  AbstractDisplacementState,
  Action,
  InputType,
} from '@projectstorm/react-canvas-core';

import {SimulationNodeModel} from '../../SimulationNodes/SimulationNodeModel';
import {SimPortModel} from '../../SimulationNodes/Ports/SimPortModel'
import {
  nearby,
  getLandingLink,
  getIncompatibleWidthsErrorMessage,
} from './common';
import handleLinkDrag from './handleLinkDrag';
import { NotificationManager } from "react-notifications";


/**
 * This State is responsible for handling link creation events.
 */
export default class DragNewLinkState extends AbstractDisplacementState {
  timmer;
  constructor() {
    super({ name: 'drag-new-link' });

    this.registerAction(
      new Action({
        type: InputType.MOUSE_DOWN,
        fire: event => {
        
          this.port = this.engine.getMouseElement(event.event);

          if (!(this.port instanceof SimPortModel) ||this.port.isLocked()) 
          {
            this.eject();
            return;
          }

          this.link = this.port.createLinkModel();

          if (!this.link) {
            this.eject();
            return;
          }

          this.link.setSelected(true);
          this.link.setSourcePort(this.port);
          // this.engine.getModel().clearSelection();
          this.engine.getModel().addLink(this.link);
          this.port.reportPosition();
        },
      }),
    );

    this.registerAction(
      new Action({
        type: InputType.MOUSE_UP,
        fire: event => {
					const model = this.engine.getMouseElement(event.event);
					// check to see if we connected to a new port
					if (model instanceof SimPortModel) {
						if (this.port.canLinkToPort(model)) {
							this.link.setTargetPort(model);
							model.reportPosition();
							this.engine.repaintCanvas();
							return;
						} else {
							this.link.remove();
							this.engine.repaintCanvas();
							return;
						}
					}
          else{
            console.log("Nirmalya Link", this.link);
            this.link.options.color = "red";
            this.link.options.setSelectedColor = "red";
            this.link.options.selectedColor = "red";
            this.timmer = setTimeout(() => {
              this.link.remove();
						  this.engine.repaintCanvas();
              NotificationManager.error("Please connect links between ports");
            },3000);
          }

					if (!this.config.allowLooseLinks) {
						this.link.remove();
						this.engine.repaintCanvas();
					}
				}
      }),
    );
  }

  
  fireMouseMoved(event) {
    const portPos = this.port.getPosition();
		const zoomLevelPercentage = this.engine.getModel().getZoomLevel() / 100;
		const engineOffsetX = this.engine.getModel().getOffsetX() / zoomLevelPercentage;
		const engineOffsetY = this.engine.getModel().getOffsetY() / zoomLevelPercentage;
		const initialXRelative = this.initialXRelative / zoomLevelPercentage;
		const initialYRelative = this.initialYRelative / zoomLevelPercentage;
		const linkNextX = portPos.x - engineOffsetX + (initialXRelative - portPos.x) + event.virtualDisplacementX;
		const linkNextY = portPos.y - engineOffsetY + (initialYRelative - portPos.y) + event.virtualDisplacementY;

		this.link.getLastPoint().setPosition(linkNextX, linkNextY);
		this.engine.repaintCanvas();
  }
}
