import * as Cesium from "cesium/Cesium";



export default class VisualizationClock {


    constructor(startDateTime,EndDateTime,currentDateTime,multiplier) {

    
        this.globalClock = new Cesium.Clock({
            startTime: startDateTime,
            currentTime: currentDateTime,
            stopTime: EndDateTime,
            clockRange: Cesium.ClockRange.LOOP_STOP, // loop when we hit the end time
            clockStep: Cesium.ClockStep.SYSTEM_CLOCK_MULTIPLIER,
            multiplier: multiplier, // how much time to advance each tick
            shouldAnimate: true, // Animation on by default
          });
    }

    

}