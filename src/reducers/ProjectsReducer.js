/**
 * Auth User Reducers
 */
import { PROJECTS__SET_PROJECTS } from 'Actions/types';
import produce from 'immer';
import {
  PROJECTS__START_PROJECTS_LOADING,
  PROJECTS__STOP_PROJECTS_LOADING,
  PROJECTS__SET_IS_FORM_OPEN,
  PROJECTS__SET_FORM_TYPE,
  PROJECTS__SET_IS_DELETE_DIALOG_OPEN,
  PROJECTS__SET_EDIT_FORM_DATA,
  PROJECTS__DISABLE_DELETE_DIALOG,
  PROJECTS__ENABLE_DELETE_DIALOG,
  GET_PROJECT_BY_ID,
  WAIT_WHILE_LOADING,
  IS_ELIGIBLE_CREATE_NEW_MISSION,
  IS_MISSION_CREATION_SUCESSFUL
} from '../actions/types';

/**
 * initial auth user
 */
const INIT_STATE = {
  projects: [],
  loading: {},
  isFormOpen: false,
  formType: undefined, // 'add' | 'edit'
  editFormData: {},
  isDeleteDialogOpen: false,
  isDisableDeleteDialog: false,
  projectById: [],
  waitWhileLoading:false,
  isCreatingIsUnique:{},
  createdSucessfully:false
};

export default (state = INIT_STATE, action) => {
  return produce(state, draft => {
    switch (action.type) {
      case PROJECTS__SET_PROJECTS:
        draft.projects = action.data;
        draft.projectName=action.projectName
        break;
      case PROJECTS__START_PROJECTS_LOADING:
        draft.projects = [];
        draft.loading.getProjects = true;
        break;
      case PROJECTS__STOP_PROJECTS_LOADING:
        draft.loading.getProjects = false;
        break;
      case PROJECTS__SET_IS_FORM_OPEN:
        draft.isFormOpen = action.data;
        break;
      case PROJECTS__SET_FORM_TYPE:
        draft.formType = action.data;
        if (action.data == 'add') draft.editFormData = {};
        break;
      case PROJECTS__SET_EDIT_FORM_DATA:
        draft.editFormData = action.data;
        break;
      case PROJECTS__SET_IS_DELETE_DIALOG_OPEN:
        draft.isDisableDeleteDialog = false;
        draft.isDeleteDialogOpen = action.data;
        break;
      case PROJECTS__DISABLE_DELETE_DIALOG:
        draft.isDisableDeleteDialog = true;
        break;
      case PROJECTS__ENABLE_DELETE_DIALOG:
        draft.isDisableDeleteDialog = false;
        break;
      case GET_PROJECT_BY_ID:
        console.log('action>>', action);
        draft.projectById = action.data;
        break;
      case WAIT_WHILE_LOADING:
        draft.waitWhileLoading = action.data;
        break;

      case IS_ELIGIBLE_CREATE_NEW_MISSION:
        console.log("IS_ELIGIBLE_CREATE_NEW_MISSION",action.data)
        draft.isCreatingIsUnique ={...action.data}

        break;

        case IS_MISSION_CREATION_SUCESSFUL:
          console.log("IS_MISSION_CREATION_SUCESSFUL",action.data)
          draft.createdSucessfully =action.data
  
          break;
    }
  });
};
