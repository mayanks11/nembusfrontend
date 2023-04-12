/**
 * Auth User Reducers
 */
import produce from 'immer';
import {
    STAKEHOLDERS__START_STAKEHOLDERS_LOADING,
    STAKEHOLDERS__STOP_STAKEHOLDERS_LOADING,
    STAKEHOLDERS__SET_IS_FORM_OPEN,
    STAKEHOLDERS__SET_FORM_TYPE,
    STAKEHOLDERS__SET_IS_DELETE_DIALOG_OPEN,
    STAKEHOLDERS__SET_EDIT_FORM_DATA,
    STAKEHOLDERS__DISABLE_DELETE_DIALOG,
    STAKEHOLDERS__ENABLE_DELETE_DIALOG,
    STAKEHOLDERS__SET_STAKEHOLDERS
} from '../actions/types';

/**
 * initial auth user
 */
const INIT_STATE = {
    stakeholders: [],
    loading: {
        getStakeholders: false
    },
    isFormOpen: false,
    formType: undefined, // 'add' | 'edit'
    editFormData: {},
    isDeleteDialogOpen: false,
    isDisableDeleteDialog: false
};

export default (state = INIT_STATE, action) => {
    return produce(state, draft => {
        switch (action.type) {
            case STAKEHOLDERS__SET_STAKEHOLDERS:
                draft.stakeholders = action.data;
                break;
            case STAKEHOLDERS__START_STAKEHOLDERS_LOADING:
                draft.stakeholders = [];
                draft.loading.getStakeholders = true;
                break;
            case STAKEHOLDERS__STOP_STAKEHOLDERS_LOADING:
                draft.loading.getStakeholders = false;
                break;
            case STAKEHOLDERS__SET_IS_FORM_OPEN:
                draft.isFormOpen = action.data;
                break;
            case STAKEHOLDERS__SET_FORM_TYPE:
                draft.formType = action.data;
                if (action.data == 'add') draft.editFormData = {};
                break;
            case STAKEHOLDERS__SET_EDIT_FORM_DATA:
                draft.editFormData = action.data;
                break;
            case STAKEHOLDERS__SET_IS_DELETE_DIALOG_OPEN:
                draft.isDisableDeleteDialog = false;
                draft.isDeleteDialogOpen = action.data;
                break;
            case STAKEHOLDERS__DISABLE_DELETE_DIALOG:
                draft.isDisableDeleteDialog = true;
                break;
            case STAKEHOLDERS__ENABLE_DELETE_DIALOG:
                draft.isDisableDeleteDialog = false;
                break;
        }
    });
};
