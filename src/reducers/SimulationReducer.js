/**
 * Auth User Reducers
 */
import produce from 'immer';
import {
    SIMULATION__START_SIMULATION_LOADING,
    SIMULATION__STOP_SIMULATION_LOADING,
    SIMULATION__SET_IS_FORM_OPEN,
    SIMULATION__SET_FORM_TYPE,
    SIMULATION__SET_IS_DELETE_DIALOG_OPEN,
    SIMULATION__SET_EDIT_FORM_DATA,
    SIMULATION__DISABLE_DELETE_DIALOG,
    SIMULATION__ENABLE_DELETE_DIALOG,
    SIMULATION__SET_SIMULATION
} from '../actions/types';

/**
 * initial auth user
 */
const INIT_STATE = {
    simulations: [],
    loading: {
        getSimulations: false
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
            case SIMULATION__SET_SIMULATION:
                draft.simulations = action.data;
                break;
            case SIMULATION__START_SIMULATION_LOADING:
                draft.simulations = [];
                draft.loading.getSimulations = true;
                break;
            case SIMULATION__STOP_SIMULATION_LOADING:
                draft.loading.getSimulations = false;
                break;
            case SIMULATION__SET_IS_FORM_OPEN:
                draft.isFormOpen = action.data;
                break;
            case SIMULATION__SET_FORM_TYPE:
                draft.formType = action.data;
                if (action.data == 'add') draft.editFormData = {};
                break;
            case SIMULATION__SET_EDIT_FORM_DATA:
                draft.editFormData = action.data;
                break;
            case SIMULATION__SET_IS_DELETE_DIALOG_OPEN:
                draft.isDisableDeleteDialog = false;
                draft.isDeleteDialogOpen = action.data;
                break;
            case SIMULATION__DISABLE_DELETE_DIALOG:
                draft.isDisableDeleteDialog = true;
                break;
            case SIMULATION__ENABLE_DELETE_DIALOG:
                draft.isDisableDeleteDialog = false;
                break;
        }
    });
};
