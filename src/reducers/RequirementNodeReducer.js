import produce from "immer";
import {
  REQUIREMENTSNODE_SET_SELECTED_NODE,
  REQUIREMENTSNODE_SET_SELECTED_NODE_VIEW,
  REQUIREMENTSNODE_UPDATE_VALUE,
  REQUIREMENTSNODE_SELECTED_REQUIREMENT,
} from "../actions/types";
import shortid from "shortid";

function getlistofselection(selection) {
  switch (selection) {
    case "mission":
      return [{ label: "System Task", value: "systemtask", id: shortid() }];
      break;
    case "systemtask":
      return [
        { label: "Satellite", value: "satellite", id: shortid() },
        { label: "Dispenser", value: "dispenser", id: shortid() },
        { label: "Launch", value: "launch", id: shortid() },
      ];
      break;
    case "satellite":
      return [
        { label: "Payload", value: "payload", id: shortid() },
        { label: "ADCS", value: "adcs", id: shortid() },
        {
          label: "Electric Power System",
          value: "electricpowersystem",
          id: shortid(),
        },
        { label: "Flight Software", value: "flightsoftware", id: shortid() },
        { label: "Ground Software", value: "groundsoftware", id: shortid() },
        { label: "Communication", value: "communication", id: shortid() },
        {
          label: "Structure/Mechanical",
          value: "structuremechanical",
          id: shortid(),
        },
        {
          label: "CD&H",
          value: "commandanddatahandling",
          id: shortid(),
        },
        { label: "Thermal", value: "thermal", id: shortid() },
      ];
      break;
    case "adcs":
      return [
        { label: "Sensor", value: "sensor", id: shortid() },
        { label: "Actuator", value: "actuator", id: shortid() },
        { label: "Control", value: "control", id: shortid() },
      ];
      break;
    case "sensor":
      return [
        { label: "Magnetometer", value: "magnetometer", id: shortid() },
        { label: "Sun Sensor", value: "sunsensor", id: shortid() },
        { label: "Accelerometer", value: "accelerometer", id: shortid() },
        { label: "Gyroscope", value: "gyroscope", id: shortid() },
        { label: "Earth Horizon Sensor(EHS)", value: "earthhorizonsensor", id: shortid() },
      ];
      break;
    case "actuator":
      return [
        { label: "ReactionWheel", value: "reactionwheel", id: shortid() },
        { label: "Magnetorquer", value: "magnetorquer", id: shortid() },
      ];
      break;

    case "electricpowersystem":
      return [
        { label: "PMDS", value: "pmds", id: shortid() },
        { label: "Battery", value: "battery", id: shortid() },
        { label: "Solar Panel", value: "solarpanel", id: shortid() },
      ];
      break

    case "communication":
      return [
        { label: "Antenna", value: "antenna", id: shortid() },
        { label: "Transmitter", value: "transmitter", id: shortid() },
        { label: "Receiver", value: "receiver", id: shortid() },
      ];

      break

      case "commandanddatahandling":
        return [
          { label: "RTC Clock", value: "rtcclock", id: shortid() },
          { label: "Memory", value: "memory", id: shortid() }
        ];
  
        break

      

      
  }
}



/**
 * initial auth user
 */
const INIT_STATE = {
  currentSelected: {},
  selectedRequirement: {},
  listofOption: [],
  selectedoptionValue: "",
};

export default (state = INIT_STATE, action) => {
  return produce(state, (draft) => {
    switch (action.type) {
      case REQUIREMENTSNODE_SET_SELECTED_NODE:
        draft.currentSelected = action.data;

        const requirement_type = action.data.blockinfo.blockname;

        const listofoption = getlistofselection(requirement_type);
        console.log(
          "REQUIREMENTSNODE_SET_SELECTED_NODE",
          listofoption,
          requirement_type,
          action.data
        );
        draft.listofOption = listofoption;
        draft.selectedoptionValue = listofoption[0].value;

        break;

      case REQUIREMENTSNODE_UPDATE_VALUE:
        draft.selectedoptionValue = action.data;
        break;

      case REQUIREMENTSNODE_SET_SELECTED_NODE_VIEW:
        draft.currentSelected = action.data;
        break;

      // case REQUIREMENTSNODE_SELECTED_REQUIREMENT:
      //     draft.currentSelected = action.data;
      //     break;
    }
  });
};
