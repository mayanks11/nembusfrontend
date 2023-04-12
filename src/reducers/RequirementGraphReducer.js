import produce from "immer";

import { isEdge, isNode } from "react-flow-renderer";

import dagre from "dagre";
import _ from "lodash";

import {
  REQUIREMENTSGRAPH_START_REQUIREMENTSGRAPH_LOADING,
  REQUIREMENTSGRAPH__SET_REQUIREMENTSGRAPH,
  REQUIREMENTSGRAPH__STOP_REQUIREMENTSGRAPH_LOADING,
  REQUIREMENTSGRAPH__ADDNODE_REQUIREMENTSGRAPH,
  REQUIREMENTSNODE_UPDATE_ADD_BUTTON,
} from "../actions/types";

/**
 * initial auth user
 */
const INIT_STATE = {
  requirementGraph2: [],
  dagreGraph: new dagre.graphlib.Graph(),

  loading: {
    getRequirements: false,
  },
};

export default (state = INIT_STATE, action) => {

  return produce(state, (draft) => {
    switch (action.type) {
      case REQUIREMENTSGRAPH_START_REQUIREMENTSGRAPH_LOADING:
        draft.requirementGraph2=[]
        draft.loading.getRequirements = true;
        draft.dagreGraph.setDefaultEdgeLabel(() => ({}));
        break;
      case REQUIREMENTSGRAPH__SET_REQUIREMENTSGRAPH:
        

        draft.dagreGraph.setGraph({ rankdir: "TB" });
        action.data.forEach((el) => {
          if (isNode(el)) {
            draft.dagreGraph.setNode(el.id, { width: 180, height: 80 });
          } else {
            draft.dagreGraph.setEdge(el.source, el.target);
          }
          draft.requirementGraph2.push(el);
        });
        dagre.layout(draft.dagreGraph);

        draft.requirementGraph2.map((el) => {
          if (isNode(el)) {
            const nodeWithPosition = draft.dagreGraph.node(el.id);
            el.position.x = nodeWithPosition.x;
            el.position.y = nodeWithPosition.y;
          }
          return el;
        });

        break;

      case REQUIREMENTSGRAPH__ADDNODE_REQUIREMENTSGRAPH:
        if (isNode(action.data)) {
          draft.dagreGraph.setNode(action.data.id, { width: 150, height: 80 });
        } else {
          draft.dagreGraph.setEdge(action.data.source, action.data.target);
        }

        draft.requirementGraph2.push(action.data);
        dagre.layout(draft.dagreGraph);

        draft.requirementGraph2.map((el) => {
          if (isNode(el)) {
            const nodeWithPosition = draft.dagreGraph.node(el.id);
            el.position.x = nodeWithPosition.x;
            el.position.y = nodeWithPosition.y;
          }
          return el;
        });

        break;

      case REQUIREMENTSGRAPH__STOP_REQUIREMENTSGRAPH_LOADING:
        draft.loading.getRequirements = false;
        break;

      case REQUIREMENTSNODE_UPDATE_ADD_BUTTON:
          
          // const index = draft.findIndex(node => node.id === action.data.id)
          const index = draft.requirementGraph2.findIndex(node => node.id === action.data.id)

          draft.requirementGraph2[index].data.button.add.enable = false
          
          break;
    }
  });
};
