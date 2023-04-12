/**
 * Auth User Reducers
 */
import produce from "immer";
import {
  WORK_PACKAGE__START_WORK_PACKAGE_LOADING,
  WORK_PACKAGE__STOP_WORK_PACKAGE_LOADING,
  WORK_PACKAGE__SET_IS_FORM_OPEN,
  WORK_PACKAGE__SET_FORM_TYPE,
  WORK_PACKAGE__SET_IS_DELETE_DIALOG_OPEN,
  WORK_PACKAGE__SET_EDIT_FORM_DATA,
  WORK_PACKAGE__DISABLE_DELETE_DIALOG,
  WORK_PACKAGE__ENABLE_DELETE_DIALOG,
  WORK_PACKAGE__SET_WORK_PACKAGE,
  WORK_PACKAGE__UPDATE_OPEN_VIEW_REQUIRMENT_MODAL,
  REQUIREMENTSGRAPH_OPEN_MISSION_NODE,
  WORK_PACKAGE__OPEN_VIEW_AND_EDIT_REQUIRMENT_MODAL,
  WORK_PACKAGE__OPEN_VIEW_AND_EDIT_SYSTEMTASK_MODAL,
  WORK_PACKAGE__OPEN_VIEW_AND_EDIT_SUBSYSTE_MODAL,
  WORK_PACKAGE__OPEN_VIEW_AND_EDIT_COMPONENT_MODAL,
  WORK_PACKAGE__OPEN_VIEW_AND_EDIT_COMPONENT_SUB_PARTS_MODAL,
} from "../actions/types";

/**
 * initial auth user
 */
const INIT_STATE = {
  workPackages: [],
  loading: {
    getWorkPackages: false,
  },
  isFormOpen: false,
  formType: undefined, // 'add' | 'edit'
  editFormData: {},
  isDeleteDialogOpen: false,
  isDisableDeleteDialog: false,
  OpenRequirmentModal: false,
  OpenRequirmentMissionModal: false,
  OpenEditAndView: false,
  OpenEditAndViewSystemTask: false,
  OpenSubsystemRequirement: false,
  OpenComponentRequirement: false,
  OpenComponentSubPartRequirement: false,
};

export default (state = INIT_STATE, action) => {
  return produce(state, (draft) => {
    switch (action.type) {
      case WORK_PACKAGE__SET_WORK_PACKAGE:
        draft.workPackages = action.data;
        break;
      case WORK_PACKAGE__START_WORK_PACKAGE_LOADING:
        draft.workPackages = [];
        draft.loading.getWorkPackages = true;
        break;
      case WORK_PACKAGE__STOP_WORK_PACKAGE_LOADING:
        draft.loading.getWorkPackages = false;
        break;
      case WORK_PACKAGE__SET_IS_FORM_OPEN:
        draft.isFormOpen = action.data;
        break;
      case WORK_PACKAGE__SET_FORM_TYPE:
        draft.formType = action.data;
        if (action.data == "add") draft.editFormData = {};
        break;
      case WORK_PACKAGE__SET_EDIT_FORM_DATA:
        draft.editFormData = action.data;
        break;
      case WORK_PACKAGE__SET_IS_DELETE_DIALOG_OPEN:
        draft.isDisableDeleteDialog = false;
        draft.isDeleteDialogOpen = action.data;
        break;
      case WORK_PACKAGE__DISABLE_DELETE_DIALOG:
        draft.isDisableDeleteDialog = true;
        break;
      case WORK_PACKAGE__ENABLE_DELETE_DIALOG:
        draft.isDisableDeleteDialog = false;
        break;
      case WORK_PACKAGE__UPDATE_OPEN_VIEW_REQUIRMENT_MODAL:

        console.log(
          WORK_PACKAGE__UPDATE_OPEN_VIEW_REQUIRMENT_MODAL,
          action.data
        );

        draft.OpenRequirmentModal = action.data;

        break;
      case REQUIREMENTSGRAPH_OPEN_MISSION_NODE:
        console.log(REQUIREMENTSGRAPH_OPEN_MISSION_NODE, action.data);

        draft.OpenRequirmentMissionModal = action.data;

        break;

      case WORK_PACKAGE__OPEN_VIEW_AND_EDIT_REQUIRMENT_MODAL:
        console.log(
          WORK_PACKAGE__OPEN_VIEW_AND_EDIT_REQUIRMENT_MODAL,
          action.data
        );

        draft.OpenEditAndView = action.data;

        break;
      case WORK_PACKAGE__OPEN_VIEW_AND_EDIT_SYSTEMTASK_MODAL:
        draft.OpenEditAndViewSystemTask = action.data;
        break;

      case WORK_PACKAGE__OPEN_VIEW_AND_EDIT_SUBSYSTE_MODAL:
        draft.OpenSubsystemRequirement = action.data;
        break;

      case WORK_PACKAGE__OPEN_VIEW_AND_EDIT_COMPONENT_MODAL:
        draft.OpenComponentRequirement = action.data;
        break;

      case WORK_PACKAGE__OPEN_VIEW_AND_EDIT_COMPONENT_SUB_PARTS_MODAL:
        draft.OpenComponentSubPartRequirement = action.data;
        break;
    }
  });
};
