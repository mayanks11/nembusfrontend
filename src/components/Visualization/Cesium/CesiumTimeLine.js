// Import webpack externals
import * as Cesium from "cesium/Cesium";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";

dayjs.extend(utc);

export class CesiumTimeLine {
  constructor() {    
    this.GlobalTimeline = Cesium.Timeline;

    this.globalClock = new Cesium.Clock({
      startTime: Cesium.JulianDate.fromIso8601("2013-12-25"),
      currentTime: Cesium.JulianDate.fromIso8601("2013-12-25"),
      stopTime: Cesium.JulianDate.fromIso8601("2013-12-26"),
      clockRange: Cesium.ClockRange.LOOP_STOP, // loop when we hit the end time
      clockStep: Cesium.ClockStep.SYSTEM_CLOCK_MULTIPLIER,
      multiplier: 60, // how much time to advance each tick
      shouldAnimate: true, // Animation on by default
    });

    this.timeline = new this.GlobalTimeline("global-time1", this.globalClock);
  }
}


export default CesiumTimeLine;