import { NotificationManager } from "react-notifications";
import {
  REQUIREMENTSTAB_SET_FUNCTIONAL_REQ,
  REQUIREMENTSTAB_SET_OPERATIONAL_REQ,
  REQUIREMENTSTAB_SET_CONSTRAINT_REQ,
  REQUIREMENTSTAB_SET_VERIFICATION_REQ,

  REQUIREMENTSTAB_CLEAR_FUNCTIONAL_REQ,
  REQUIREMENTSTAB_CLEAR_OPERATIONAL_REQ,
  REQUIREMENTSTAB_CLEAR_CONSTRAINT_REQ,
  REQUIREMENTSTAB_CLEAR_VERIFICATION_REQ,

} from "./types";

export function setFunctionalReqirment(feqreq) {
  return async (dispatch, getState) => {
    dispatch({ type: REQUIREMENTSTAB_SET_FUNCTIONAL_REQ, data: feqreq });
  };
}

export function setOperationalReqirment(opreg) {
  return async (dispatch, getState) => {
    dispatch({ type: REQUIREMENTSTAB_SET_OPERATIONAL_REQ, data: opreg });
  };
}

export function setConstraintReqirment(conReq) {
  return async (dispatch, getState) => {
    dispatch({ type: REQUIREMENTSTAB_SET_CONSTRAINT_REQ, data: conReq });
  };
}

export function setVerificationReqirment(verReq) {
  return async (dispatch, getState) => {
    dispatch({ type: REQUIREMENTSTAB_SET_VERIFICATION_REQ, data: verReq });
  };
}

export function clearFunctionalReqirment() {
  return async (dispatch, getState) => {
    dispatch({ type: REQUIREMENTSTAB_CLEAR_FUNCTIONAL_REQ });
  };
}

export function clearOperationalReqirment() {
  return async (dispatch, getState) => {
    dispatch({ type: REQUIREMENTSTAB_CLEAR_OPERATIONAL_REQ });
  };
}

export function clearConstraintReqirment() {
  return async (dispatch, getState) => {
    dispatch({ type: REQUIREMENTSTAB_CLEAR_VERIFICATION_REQ });
  };
}

export function clearVerificationReqirment() {
  return async (dispatch, getState) => {
    dispatch({ type: REQUIREMENTSTAB_CLEAR_CONSTRAINT_REQ });
  };
}