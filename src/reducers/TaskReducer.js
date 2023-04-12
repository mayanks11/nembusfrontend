/**
 * Auth User Reducers
 */
import produce from 'immer';
import {
    TASK__START_TASK_LOADING,
    TASK__STOP_TASK_LOADING,
    TASK__SET_IS_FORM_OPEN,
    TASK__SET_FORM_TYPE,
    TASK__SET_IS_DELETE_DIALOG_OPEN,
    TASK__SET_EDIT_FORM_DATA,
    TASK__DISABLE_DELETE_DIALOG,
    TASK__ENABLE_DELETE_DIALOG,
    TASK__SET_TASK
} from '../actions/types';

/**
 * initial auth user
 */
const INIT_STATE = {
    tasks: [],
    loading: {
        getTasks: false
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
            case TASK__SET_TASK:
                draft.tasks = action.data;
                break;
            case TASK__START_TASK_LOADING:
                draft.tasks = [];
                draft.loading.getTasks = true;
                break;
            case TASK__STOP_TASK_LOADING:
                draft.loading.getTasks = false;
                break;
            case TASK__SET_IS_FORM_OPEN:
                draft.isFormOpen = action.data;
                break;
            case TASK__SET_FORM_TYPE:
                draft.formType = action.data;
                if (action.data == 'add') draft.editFormData = {};
                break;
            case TASK__SET_EDIT_FORM_DATA:
                draft.editFormData = action.data;
                break;
            case TASK__SET_IS_DELETE_DIALOG_OPEN:
                draft.isDisableDeleteDialog = false;
                draft.isDeleteDialogOpen = action.data;
                break;
            case TASK__DISABLE_DELETE_DIALOG:
                draft.isDisableDeleteDialog = true;
                break;
            case TASK__ENABLE_DELETE_DIALOG:
                draft.isDisableDeleteDialog = false;
                break;
        }
    });
};
