/**
 * Auth User Reducers
 */
import produce from 'immer';
import {
    REQUIREMENTS__START_REQUIREMENTS_LOADING,
    REQUIREMENTS__STOP_REQUIREMENTS_LOADING,
    REQUIREMENTS__SET_IS_FORM_OPEN,
    REQUIREMENTS__SET_FORM_TYPE,
    REQUIREMENTS__SET_IS_DELETE_DIALOG_OPEN,
    REQUIREMENTS__SET_EDIT_FORM_DATA,
    REQUIREMENTS__DISABLE_DELETE_DIALOG,
    REQUIREMENTS__ENABLE_DELETE_DIALOG,
    REQUIREMENTS__SET_REQUIREMENTS
} from '../actions/types';

/**
 * initial auth user
 */
const INIT_STATE = {
    requirements: [],
    loading: {
        getRequirements: false
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
            case REQUIREMENTS__SET_REQUIREMENTS:
                draft.requirements = action.data;
                break;
            case REQUIREMENTS__START_REQUIREMENTS_LOADING:
                draft.requirements = [];
                draft.loading.getRequirements = true;
                break;
            case REQUIREMENTS__STOP_REQUIREMENTS_LOADING:
                draft.loading.getRequirements = false;
                break;
            case REQUIREMENTS__SET_IS_FORM_OPEN:
                draft.isFormOpen = action.data;
                break;
            case REQUIREMENTS__SET_FORM_TYPE:
                draft.formType = action.data;
                if (action.data == 'add') draft.editFormData = {};
                break;
            case REQUIREMENTS__SET_EDIT_FORM_DATA:
                draft.editFormData = action.data;
                break;
            case REQUIREMENTS__SET_IS_DELETE_DIALOG_OPEN:
                draft.isDisableDeleteDialog = false;
                draft.isDeleteDialogOpen = action.data;
                break;
            case REQUIREMENTS__DISABLE_DELETE_DIALOG:
                draft.isDisableDeleteDialog = true;
                break;
            case REQUIREMENTS__ENABLE_DELETE_DIALOG:
                draft.isDisableDeleteDialog = false;
                break;
        }
    });
};
