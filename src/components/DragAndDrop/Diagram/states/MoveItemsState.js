import { Point } from '@projectstorm/geometry';
import {
  Action,
  InputType,
  AbstractDisplacementState,
} from '@projectstorm/react-canvas-core';

import { BasePositionModel } from '@projectstorm/react-canvas-core';

import {SimulationNodeModel} from '../../SimulationNodes/SimulationNodeModel';
import {SimPortModel} from '../../SimulationNodes/Ports/SimPortModel'

import { PointModel } from '@projectstorm/react-diagrams';

import {
  snap,
  samePosition,
  sameX,
  sameY,
  closestPointToLink,
} from './common';

/**
 * This State handles node moving.
 *
 * When nodes are moved, all of its links (and all bifurcations from
 * or to this link) need to be rearranged.
 */
export default class MoveItemsState extends AbstractDisplacementState {
  constructor() {
    super({
      name: 'move-items',
    });

    this.registerAction(
      new Action({
        type: InputType.MOUSE_DOWN,
        fire: event => {
          
          if (this.engine.getModel().isLocked()) {
            this.eject();
            return;
          }

          this.lastDisplacement = new Point(0, 0);

          this.element = this.engine
            .getActionEventBus()
            .getModelForEvent(event);

          

          if (!this.element) {
            this.eject();
            return;
          }


          if (!this.element.isSelected()) {
            this.engine.getModel().clearSelection();
          }

          this.element.setSelected(true);
					this.engine.repaintCanvas();

          // console.log("this.element.isSelected()",this.element.isSelected())
          // this.linkDirections = this.getLinkDirections(this.element);

          // console.log("this.linkDirections",this.linkDirections)

          // this.element.setSelected(true);
          // this.engine.repaintCanvas();

          // this.nodesBefore = this.getNodesPositions();
          // this.linksBefore = this.getLinksPoints();

        },
      }),
    );

    // this.registerAction(
    //   new Action({
    //     type: InputType.MOUSE_UP,
    //     fire: () => {
		// 			const item = this.engine.getMouseElement(event.event);
		// 			if (item instanceof SimPortModel) {
		// 				_.forEach(this.initialPositions, (position) => {
		// 					if (position.item instanceof PointModel) {
		// 						const link = position.item.getParent() ;

		// 						// only care about the last links
		// 						if (link.getLastPoint() !== position.item) {
		// 							return;
		// 						}
		// 						if (link.getSourcePort().canLinkToPort(item)) {
		// 							link.setTargetPort(item);
		// 							item.reportPosition();
		// 							this.engine.repaintCanvas();
		// 						}
		// 					}
		// 				});
		// 			}
		// 		},
    //   }),
    // );

 
  }




  activated(previous) {
    super.activated(previous);
    this.initialPositions = {};
  }



  fireMouseMoved(event) {
    // Allow moving only with left clicks

    const items = this.engine.getModel().getSelectedEntities();
		const model = this.engine.getModel();

    for (let item of items) {

      if (item instanceof BasePositionModel) {
        if (item.isLocked()) {
					continue;
				}

        if (!this.initialPositions[item.getID()]) {
					this.initialPositions[item.getID()] = {
						point: item.getPosition(),
						item: item
					};
				}

				const pos = this.initialPositions[item.getID()].point;
				item.setPosition(
					model.getGridPosition(pos.x + event.virtualDisplacementX),
					model.getGridPosition(pos.y + event.virtualDisplacementY)
				);

        model.updateduringdrag(item.getID(),pos.x + event.virtualDisplacementX,pos.y + event.virtualDisplacementY);
        
      }
      this.engine.repaintCanvas();

    }


  }



 
 

 
}
