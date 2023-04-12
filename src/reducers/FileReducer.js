/**
 * Auth User Reducers
 */
import produce from 'immer';
import {
    FILE__START_FILE_LOADING,
    FILE__STOP_FILE_LOADING,
    FILE__SET_IS_FORM_OPEN,
    FILE__SET_FORM_TYPE,
    FILE__SET_IS_DELETE_DIALOG_OPEN,
    FILE__SET_EDIT_FORM_DATA,
    FILE__DISABLE_DELETE_DIALOG,
    FILE__ENABLE_DELETE_DIALOG,
    FILE__SET_FILE
} from '../actions/types';

/**
 * initial auth user
 */
const INIT_STATE = {
    files: [],
    loading: {
        getFiles: false
    },
    isFormOpen: false,
    formType: 'add', // 'add' | 'edit'
    editFormData: {},
    isDeleteDialogOpen: false,
    isDisableDeleteDialog: false
};

export default (state = INIT_STATE, action) => {
    return produce(state, draft => {
        switch (action.type) {
            case FILE__SET_FILE:
                draft.files = action.data;
                break;
            case FILE__START_FILE_LOADING:
                draft.files = [];
                draft.loading.getFiles = true;
                break;
            case FILE__STOP_FILE_LOADING:
                draft.loading.getFiles = false;
                break;
            case FILE__SET_IS_FORM_OPEN:
                draft.isFormOpen = action.data;
                break;
            case FILE__SET_FORM_TYPE:
                draft.formType = action.data;
                if (action.data == 'add') draft.editFormData = {};
                break;
            case FILE__SET_EDIT_FORM_DATA:
                draft.editFormData = action.data;
                break;
            case FILE__SET_IS_DELETE_DIALOG_OPEN:
                draft.isDisableDeleteDialog = false;
                draft.isDeleteDialogOpen = action.data;
                break;
            case FILE__DISABLE_DELETE_DIALOG:
                draft.isDisableDeleteDialog = true;
                break;
            case FILE__ENABLE_DELETE_DIALOG:
                draft.isDisableDeleteDialog = false;
                break;
        }
    });
};
