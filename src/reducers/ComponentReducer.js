import {
  GET_COMPONENT_UI_FORM,
  GET_COMPONENT,
  GET_STATUS_HISTORY,
  GET_COMPONENT_BY_DOC_ID,
  GET_COMPONENT_BY_DOC_VERSION_ID,
  GET_COMPANY_NAME,
  GET_COMPONENT_MODEL_VERSION_BY_DOC_ID,
  GET_COMPONENT_MODEL_VERSION_HISTORY,
  UPDATE_COMPONENT_VERSION_STATUS,
  SET_ACTION_WAIT,
  SET_CAD_URL
} from '../actions/types';

/**
 * initial auth user
 */
const INIT_STATE = {
  componentUiForm: [],
  actionwait:false,
  isReLoading:false,
  CADurl:{}
};

export default (state = INIT_STATE, action) => {
  switch (action.type) {
    case GET_COMPONENT_UI_FORM:
      console.log('action>>>', action);
      return { ...state, componentUiForm: action.data };
    case GET_COMPONENT:
      console.log('action>>>', action);
      return { ...state, components: action.data };
    case GET_STATUS_HISTORY:
      return { ...state, statusHistory: action.data };
    case GET_COMPONENT_BY_DOC_ID:
      return { ...state, componentByDocId: action.data };
    case GET_COMPONENT_MODEL_VERSION_BY_DOC_ID:
        return { ...state, componentModelVersionByDocId: action.data };
    case GET_COMPONENT_MODEL_VERSION_HISTORY:
      return { ...state, componentModelVersionHistory: action.data };
    case GET_COMPONENT_BY_DOC_VERSION_ID:
        return { ...state, componentByDocVersionId: action.data};
    case GET_COMPANY_NAME:
      return { ...state, companyName: action.data };
    
    case UPDATE_COMPONENT_VERSION_STATUS:
      return { ...state, isReLoading: action.data };

    case SET_ACTION_WAIT:
        return { ...state, actionwait: action.data };

    case SET_CAD_URL:
      return {
        ...state,CADurl:action.data
      }

      
    default:
      return state;
  }
};
