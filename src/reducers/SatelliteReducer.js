/**
 * Auth User Reducers
 */
import produce from 'immer';
import {
    SATELLITE__START_SATELLITE_LOADING,
    SATELLITE__STOP_SATELLITE_LOADING,
    SATELLITE__SET_IS_FORM_OPEN,
    SATELLITE__SET_FORM_TYPE,
    SATELLITE__SET_IS_DELETE_DIALOG_OPEN,
    SATELLITE__SET_EDIT_FORM_DATA,
    SATELLITE__DISABLE_DELETE_DIALOG,
    SATELLITE__ENABLE_DELETE_DIALOG,
    SATELLITE__SET_SATELLITE
} from '../actions/types';

/**
 * initial auth user
 */
const INIT_STATE = {
    satellites: [],
    loading: {
        getSatellites: false
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
            case SATELLITE__SET_SATELLITE:
                draft.satellites = action.data;
                break;
            case SATELLITE__START_SATELLITE_LOADING:
                draft.satellites = [];
                draft.loading.getSatellites = true;
                break;
            case SATELLITE__STOP_SATELLITE_LOADING:
                draft.loading.getSatellites = false;
                break;
            case SATELLITE__SET_IS_FORM_OPEN:
                draft.isFormOpen = action.data;
                break;
            case SATELLITE__SET_FORM_TYPE:
                draft.formType = action.data;
                if (action.data == 'add') draft.editFormData = {};
                break;
            case SATELLITE__SET_EDIT_FORM_DATA:
                draft.editFormData = action.data;
                break;
            case SATELLITE__SET_IS_DELETE_DIALOG_OPEN:
                draft.isDisableDeleteDialog = false;
                draft.isDeleteDialogOpen = action.data;
                break;
            case SATELLITE__DISABLE_DELETE_DIALOG:
                draft.isDisableDeleteDialog = true;
                break;
            case SATELLITE__ENABLE_DELETE_DIALOG:
                draft.isDisableDeleteDialog = false;
                break;
        }
    });
};
