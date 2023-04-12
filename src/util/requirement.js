import satellite from "./Jsonformcollection/satellite.json";
import elementjson from "./Jsonformcollection/Element.json";

export function getRequirementBlockLabel(parenetblockname, currentblockname) {
  switch (parenetblockname) {
    case "mission": {
      switch (currentblockname) {
        case "systemtask":
          return "System Task";
          break;
      }

      break;
    }
    case "systemtask": {
      switch (currentblockname) {
        case "satellite":
          return "Satellite";
          break;

        case "dispenser":
          return "Dispenser";
          break;
        
        case "launch":
          return "Launch";
          break;

      }
      break;
    }

    case "satellite": {
      switch (currentblockname) {
        case "payload":
          return "Payload";
          break;

        case "adcs":
          return "ADCS";
          break;

        case "electricpowersystem":
          return "Electric Power System";
          break;
        case "flightsoftware":
          return "Flight Software";
          break;
        case "groundsoftware":
          return "Ground Software";
          break;
        case "communication":
          return "Communication";
          break;

        case "structuremechanical":
          return "Structure/Mechanical";
          break;

        case "commandanddatahandling":
          return "CD&H";
          break;

        case "thermal":
          return "Thermal";
          break;
      }
      break;
    }

    case "adcs": {
      switch (currentblockname) {
        case "sensor":
          return "Sensor";
          break;

        case "actuator":
          return "Actuator";
          break;
        case "control":
          return "Control";
          break;
      }
      break;
    }
    case "sensor": {
      switch (currentblockname) {
        case "magnetometer":
          return "Magnetometer";
          break;
        case "sunsensor":
          return "Sun Sensor";
          break;
        case "accelerometer":
          return "Accelerometer";
          break;
        case "gyroscope":
          return "Gyroscope";
          break;
        case "earthhorizonsensor":
          return "Earth Horizon";
          break;
      }
      break;
    }
    case "communication": {
      switch (currentblockname) {
        case "antenna":
          return "Antenna";
          break;
        case "transmitter":
          return "Transmitter";
          break;
        case "receiver":
          return "Receiver";
          break;
      }
      break;
    }
    case "electricpowersystem": {
      switch (currentblockname) {
        case "pmds":
          return "PMDS";
          break;

        case "battery":
          return "Battery";
          break;
        case "solarpanel":
          return "Solar Panel";
          break;
      }
      break;
    }

    case "actuator": {
      switch (currentblockname) {
        case "reactionwheel":
          return "Reaction Wheel";
          break;

        case "magnetorquer":
          return "Magnetorquer";
          break;
      }
      break;
    }

    case "commandanddatahandling": {
      switch (currentblockname) {
        case "rtcclock":
          return "RT Clock";
          break;

        case "memory":
          return "Memory";
          break;
     
      }
      break;
    }
  }
}

export function getFormforGivenblock(parenetblockname, currentblockname) {
  switch (currentblockname) {
    case "satellite":
      return satellite;

    case "payload":
    case "adcs":
    case "electricpowersystem":
    case "flightsoftware":
    case "groundsoftware":
    case "communication":
    case "structuremechanical":
    case "commandanddatahandling":
      return elementjson;
      break;

    case "sensor":
    case "actuator":
    case "control":
      return elementjson;
      break;

    default:
      return elementjson;
      break;
  }
}

// reqId: "Com-Ope-01"
// requirement: "r"
// requirementValue: "5"
// requirmentValueUnit: "deg"

// class Operational{
//   constructor(reqId, requirement,equalitysymbol,requirementValue,requirmentValueUnit) {
//    this.reqId = reqId;
//    this.requirement = requirement;
//    this.equalitysymbol = equalitysymbol;
//    this.requirementValue = requirementValue;
//    this.requirmentValueUnit = requirmentValueUnit;
//   }
// }

const Operational = (
  reqId,
  requirement,
  equalitysymbol,
  requirementValue,
  requirmentValueUnit
) => {
  return {
    reqId: reqId,
    requirement: requirement,
    equalitysymbol: equalitysymbol,
    requirementValue: requirementValue,
    requirmentValueUnit: requirmentValueUnit,
  };
};

export function getOperationReq(parenetblockname, currentblockname) {
  switch (currentblockname) {
    case "sunsensor":
      {
        let operation = [];
        operation = [
          { ...Operational("Com-Ope-01", "Sun Track Error", "<", 15, "deg") },
        ];

        console.log("sensor ====>", operation);
        return operation;
      }
      break;

    default: {
      return [];
    }
  }
}
