import produce from "immer";
import {
  REQUIREMENTSTAB_SET_FUNCTIONAL_REQ,
  REQUIREMENTSTAB_SET_OPERATIONAL_REQ,
  REQUIREMENTSTAB_SET_CONSTRAINT_REQ,
  REQUIREMENTSTAB_SET_VERIFICATION_REQ,
  REQUIREMENTSTAB_CLEAR_FUNCTIONAL_REQ,
  REQUIREMENTSTAB_CLEAR_OPERATIONAL_REQ,
  REQUIREMENTSTAB_CLEAR_CONSTRAINT_REQ,
  REQUIREMENTSTAB_CLEAR_VERIFICATION_REQ,
} from "../actions/types";

/**
 * initial auth user
 */
const INIT_STATE = {
  functionalRequirment: "",
  operationalRequirement: "",
  constraintRequirement: "",
  verificationRequirement: "",
};

export default (state = INIT_STATE, action) => {
  return produce(state, (draft) => {
    switch (action.type) {
      case REQUIREMENTSTAB_SET_FUNCTIONAL_REQ:
        draft.functionalRequirment = action.data;
        console.log("REQUIREMENTSTAB_SET_FUNCTIONAL_REQ", action.data);
        break;

      case REQUIREMENTSTAB_SET_OPERATIONAL_REQ:
        draft.operationalRequirement = action.data;
        break;

      case REQUIREMENTSTAB_SET_CONSTRAINT_REQ:
        draft.constraintRequirement = action.data;
        break;

      case REQUIREMENTSTAB_SET_VERIFICATION_REQ:
        draft.verificationRequirement = action.data;
        break;

      case REQUIREMENTSTAB_CLEAR_FUNCTIONAL_REQ:
        draft.functionalRequirment = "";
        break;

      case REQUIREMENTSTAB_CLEAR_OPERATIONAL_REQ:
        draft.operationalRequirement = "";
        break;

      case REQUIREMENTSTAB_CLEAR_CONSTRAINT_REQ:
        draft.constraintRequirement = "";
        break;

      case REQUIREMENTSTAB_CLEAR_VERIFICATION_REQ:
        draft.verificationRequirement = "";
        break;
    }
  });
};
