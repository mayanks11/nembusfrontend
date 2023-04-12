import { fromJS, merge, List, Map } from "immutable";
import produce from "immer";
import openSocket from "socket.io-client";
import { auth,fireStore } from "../firebase";

import {
  SIMULATE_CHANGE_TAB,
  SIMULATE_CHANGE_AXIS,
  SIMULATE_CHANGE_UNIT,
  SIMULATE_CHANGE_SIMPLE,
  SIMULATE_CHANGE_LEFTPANEL,
  SIMULATE_CHANGE_SAVE,
  SIMULATE_RUN,
  CREATE_SIMULATION_SUCCESS,
  SAVE_CZML_DATA,
  INIT_SOCKET,
  CLOSE_SOCKET,
  SET_PROJECT,
  SET_CASE,
  CLEAR_CASE,
  SET_OLD_CASE,
  SET_PARAMETERS,
  FIRE_EVENT,
  SET_STATUS,
  CLEAR_PARAMETER,
  SET_SIMULATION_CONFIG_LIST,
  SET_RUN_SIMULATION_CONFIG_LIST,
  CLEAR_SIMULATION_CONFIG_LIST,
  CLEAR_RUN_SIMULATION_CONFIG_LIST,
  SET_SIMULATION_CONFIG_ACTIVE,
  CLEAR_SIMULATION_CONFIG_ACTIVE,
  SET_SELECT_SIMULATION_CONFIG,
  CLEAR_SELECT_SIMULATION_CONFIG,
  SET_IS_PAGE_LOADING,
  SET_SIMULATION_CONFIG_RATE
} from "../actions/types";

const _3D = {
  x: {
    value: 7300,
    unit: "km",
  },
  y: {
    value: 0,
    unit: "km",
  },
  z: {
    value: 1300,
    unit: "km",
  },
};

const _3DVelocity = {
  x: {
    value: 0,
    unit: "km/s",
  },
  y: {
    value: 7.35,
    unit: "km/s",
  },
  z: {
    value: 1,
    unit: "km/s",
  },
};

const initParameters = {
  OrbitType: {
    algorithmType: "NumericalIntegration",
    CoordinationType: "ECEF",
    StateType: "cartesian",
    Position_initial: { ..._3D }, // remove this if statetype != cartesian
    velocity_initial: { ..._3DVelocity }, // remove this if statetype != cartesian

    SimulationConfiguration: {
      Integrator: {
        type: "abm",
        Initial_step_Size: 1,
        Accuracy: 1,
        Min_Step_size: 1,
        Max_Step_size: 1,
        Max_Step_Attempts: 1,
        StopIfAccuracyViolated: true,
        Minimum_Error: "1", // remove this when type != "abm"
        Nominal_Error: "1", // remove this when type != "abm"
      },
    },
    Forces: {
      GravitationalModel: {
        Degree: "",
        Order: "",
        STM_Limit: "",
        GravitationalModelName: "None",
        Tide: "",
      },
      DragForce: "",
      Solar_Radiation: false,
      Relatvistic_Correction: false,
      ThirdBody: [],
    },
  },
  Attitude: {
    Orientation: {
      type: "quaternion",
      eulerSeq: "312", // remove this if type != eulerAngle
      // value:undefined,
      DCM: {
        row1: [1, 0, 0],
        row2: [0, 1, 0],
        row3: [0, 0, 1],
      }, // set this as value if type = DCM and remove this
      eulerAngle: [0, 0, 0], // set this as value if type = eulerAngle and remove this
      quaternion: [1, 0, 0, 0], // set this as value if type = quaternion and remove this
    },
    BodyFrame: "ECI",
    AngularVel: {
      X: {
        unit: "deg/sec",
        value: 0.2,
      },
      Y: {
        unit: "deg/sec",
        value: 0.2,
      },
      Z: {
        unit: "deg/sec",
        value: 0.2,
      },
    },
    Mass: {
      value: "",
      unit: "kg",
    },
    MOI: {
      unit: "kgm2",
      value: {
        row1: [1, 0, 0],
        row2: [0, 1, 0],
        row3: [0, 0, 1],
      },
    },
  },
};

const initState = fromJS({
  tabs: [
    { label: "Parameters", value: "p" },
    { label: "Simulation", value: "s" },
    { label: "Analysis", value: "a" },
  ],
  case: {},
  parameters: initParameters,
  activeTab: 0,
  czmlData: [],
  simulationsList: [],
  simulateLeftPanelOpened: true,
  simulationConfigList: [],
  simulationRunConfigList: [],
  simulationActiveConfig: null,
  selectedSimulationConfig: null,
  oldcase: {},
  isPageLoading: false,
  simulate: {
    save: false,
    run: false,
  },
});

export default function(state = initState, action) {
  switch (action.type) {
    case SIMULATE_CHANGE_TAB: {
      return state.set("activeTab", action.payload);
    }
    case SIMULATE_CHANGE_LEFTPANEL: {
      return state.set("simulateLeftPanelOpened", action.payload);
    }
    case SIMULATE_CHANGE_SAVE: {
      return state.set("simulate.save", action.payload);
    }
    case SIMULATE_RUN: {
      return state.set("simulate.run", action.payload);
    }
    case SET_PROJECT: {
      return state.set("project", fromJS(action.payload));
    }
    case SET_CASE: {

      if (action.payload.tempConfigList) {
        for (const [key, value] of Object.entries(action.payload.tempConfigList)) {
          if (key === auth.currentUser.uid) {
            action.payload.tempId = value
          }
        }
      }
      return state.set("case", fromJS(action.payload));
    }
    case SET_OLD_CASE: {
      return state.set("oldcase", fromJS(action.payload));
    }
    case CLEAR_CASE: {
      return state
        .set("case", fromJS({}))
        .set("parameters", fromJS(initParameters));
    }
    case CLEAR_PARAMETER: {
      return state.set("parameters", fromJS(initParameters));
    }
    case SET_PARAMETERS: {
      return state.set(
        "parameters",
        fromJS(merge(initParameters, action.payload))
      );
    }
    case SET_STATUS: {
      return state.set("status", fromJS(action.payload));
    }
    case SIMULATE_CHANGE_AXIS: {
      const { which, value } = action.payload;
      return state.setIn(which, value);
    }
    case SIMULATE_CHANGE_UNIT: {
      const { which, value } = action.payload;
      return state.setIn(which, value);
    }
    case SIMULATE_CHANGE_SIMPLE: {
      const { path, value } = action.payload;
      return state.setIn(path, value);
    }
    case CREATE_SIMULATION_SUCCESS: {
      return initState;
    }
    case SET_IS_PAGE_LOADING: {
      // console.log("isPageLoading", action.payload);
      return state.set("isPageLoading", fromJS(action.payload.isLoading));
    }
    case SET_SIMULATION_CONFIG_RATE:{
       return state.setIn(
        ["selectedSimulationConfig", "simRate"],
        action.payload
      );
    }
    case SET_SIMULATION_CONFIG_LIST: {
      const current_SimulationConfig_list = state.get("simulationConfigList");

      return state.set(
        "simulationConfigList",
        fromJS(merge(current_SimulationConfig_list, action.payload))
      );
    }
    // case SET_RUN_SIMULATION_CONFIG_LIST: {
    //   return state.set("simulationRunConfigList",action.payload);
    // }
    case CLEAR_SIMULATION_CONFIG_LIST: {
      return state.set("simulationConfigList", fromJS([]));
    }
    // case CLEAR_RUN_SIMULATION_CONFIG_LIST: {
    //   return state.set("simulationRunConfigList", fromJS([]));
    // }

    case SET_SIMULATION_CONFIG_ACTIVE: {
      return state.set("simulationActiveConfig", action.payload);
    }
    case CLEAR_SIMULATION_CONFIG_ACTIVE: {
      return state.set("simulationActiveConfig", null);
    }
    case SET_SELECT_SIMULATION_CONFIG: {
      return state.set("selectedSimulationConfig", action.payload);
    }
    case CLEAR_SELECT_SIMULATION_CONFIG: {
      return state.set("selectedSimulationConfig", null);
    }
    case SAVE_CZML_DATA: {
      const czmlData = [...state.czmlData];
      czmlData.push(action.payload);
      return {
        ...state,
        czmlData,
      };
    }
    case FIRE_EVENT: {
      const { name, args } = action.payload;
      const socket = state.get("socket");
      if (socket) {
        socket.emit.apply(socket, [name, ...args]);
      }
      return state;
    }

    case INIT_SOCKET: {
      const url = action.payload.url;
      const uid = action.payload.uid;
      const consumerGroup = action.payload.consumerGroup;
      const topic = `toclient-czml-new-${uid}`;
      const topic_plot_graph = `plot-graph-${uid}`;
      const topic_simstatus_graph = `simulation-status-${uid}`;
      const czml_offset = action.payload.czml_offset;
      const plotgraph_offset = action.payload.plotgraph_offset;
      const simulationstatus_offset = action.payload.simulationstatus_offset;

      const socket = openSocket(
        url + `?uid=${uid}&consumerGroup=${consumerGroup}`
      );

      const add_user = {
        uid: uid,
        topic: {},
      };
      add_user.topic[`toclient-czml-new-${uid}`] = czml_offset;
      add_user.topic[`plot-graph-${uid}`] = plotgraph_offset;

      socket.on("get_topic", (data) => {
        socket.emit("add_topic", {
          uid: uid,
          topic: topic,
          consumergroup: consumerGroup,
          partition: 0,
          offset: czml_offset + 1,
        });

        socket.emit("add_topic", {
          uid: uid,
          topic: topic_plot_graph,
          consumergroup: consumerGroup,
          partition: 0,
          offset: plotgraph_offset + 1,
        });

        socket.emit("add_topic", {
          uid: uid,
          topic: topic_simstatus_graph,
          consumergroup: consumerGroup,
          partition: 0,
          offset: simulationstatus_offset + 1,
        });
      });

      socket.emit("add_user", add_user);

      socket.on("czml_path", ({ projectId, caseId, filePath }) => {
        fireStore
          .collection("simulations")
          .doc(projectId)
          .collection("Case")
          .doc(caseId)
          .update({
            CzmlPath: filePath,
          })
          .then((data) => {});
      });

      socket.on("video_path", ({ projectId, caseId, filePath }) => {
        fireStore
          .collection("simulations")
          .doc(projectId)
          .collection("Case")
          .doc(caseId)
          .update({
            videoPath: filePath,
          })
          .then((data) => {});
      });
      return state.set("socket", socket);
    }
    case CLOSE_SOCKET: {
      const socket = state.get("socket");
      if (socket) {
        socket.disconnect();
      }
      return state.set("socket", null);
    }
    default: {
      return state;
    }
  }
}
