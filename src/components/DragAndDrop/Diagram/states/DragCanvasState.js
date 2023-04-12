import { AbstractDisplacementState } from '@projectstorm/react-canvas-core';


export default class DragCanvasState extends AbstractDisplacementState {
  constructor() {
    super({
      name: 'drag-canvas',
    });
  }

  callingsuper(prev){
    //This function was only to solve problem 
    // it was not able to call super from able to call
    super.activated(prev);
  }

  async activated(prev) {
     
    this.callingsuper(prev)
    

    // console.log("event ==> prev",prev,this.engine.getModel())

    this.engine.getModel().clearSelection();
    await this.engine.repaintCanvas(true);

    // We can block layer rendering because we are only targeting the transforms
    this.engine
      .getModel()
      .getLayers()
      .forEach(layer => layer.allowRepaint(false));

    this.initialCanvasX = this.engine.getModel().getOffsetX();
    this.initialCanvasY = this.engine.getModel().getOffsetY();

    
    
  }

  deactivated(next) {
    super.deactivated(next);

    this.engine
      .getModel()
      .getLayers()
      .forEach(layer => layer.allowRepaint(true));
  }

  fireMouseMoved(event) {

    console.log("firemouse event",event)
    // Allow moving only with left clicks
    if (
      event.event.nativeEvent.which !== 1 &&
      !event.event.nativeEvent.targetTouches
    )
      return;


    if (this.engine.getModel().isLocked()) {
        return;
      }

    this.engine
      .getModel()
      .setOffset(
        this.initialCanvasX + event.displacementX,
        this.initialCanvasY + event.displacementY,
      );
    this.engine.repaintCanvas();
  }
}
