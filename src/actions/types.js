/**
 * App Redux Action Types
 */
export const COLLAPSED_SIDEBAR = 'COLLAPSED_SIDEBAR';
export const DARK_MODE = 'DARK_MODE';
export const BOXED_LAYOUT = 'BOXED_LAYOUT';
export const RTL_LAYOUT = 'RTL_LAYOUT';
export const MINI_SIDEBAR = 'MINI_SIDEBAR';
export const SEARCH_FORM_ENABLE = 'SEARCH_FORM_ENABLE';
export const CHANGE_THEME_COLOR = 'CHANGE_THEME_COLOR';
export const TOGGLE_SIDEBAR_IMAGE = 'TOGGLE_SIDEBAR_IMAGE';
export const SET_SIDEBAR_IMAGE = 'SET_SIDEBAR_IMAGE';
export const SET_LANGUAGE = 'SET_LANGUAGE';
export const START_USER_TOUR = 'START_USER_TOUR';
export const STOP_USER_TOUR = 'STOP_USER_TOUR';
export const TOGGLE_DARK_SIDENAV = 'TOGGLE_DARK_SIDENAV';
export const TOGGLE_HEADER = 'TOGGLE_HEADER'

// Temporary Data
export const EXTRA_DATA__SET_TEMP_DATA = 'EXTRA_DATA__SET_TEMP_DATA';
export const EXTRA_DATA__SET_USER_DATA = 'EXTRA_DATA__SET_USER_DATA';

// Projects
export const PROJECTS__GET_PROJECTS = 'PROJECTS__GET_PROJECTS';
export const PROJECTS__ADD_PROJECT = 'PROJECTS__ADD_PROJECT';
export const PROJECTS__EDIT_PROJECT = 'PROJECTS__EDIT_PROJECT';
export const PROJECTS__DELETE_PROJECT = 'PROJECTS__DELETE_PROJECT';
export const PROJECTS__SET_PROJECTS = 'PROJECTS__SET_PROJECTS';
export const PROJECTS__START_PROJECTS_LOADING =
    'PROJECTS__START_PROJECTS_LOADING';
export const PROJECTS__STOP_PROJECTS_LOADING =
    'PROJECTS__STOP_PROJECTS_LOADING';
export const PROJECTS__SET_IS_FORM_OPEN = 'PROJECTS__SET_IS_FORM_OPEN';
export const PROJECTS__SET_FORM_TYPE = 'PROJECTS__SET_FORM_TYPE';
export const PROJECTS__SET_EDIT_FORM_DATA = 'PROJECTS__SET_EDIT_FORM_DATA';
export const PROJECTS__SET_IS_DELETE_DIALOG_OPEN =
    'PROJECTS__SET_IS_DELETE_DIALOG_OPEN';
export const PROJECTS__DISABLE_DELETE_DIALOG =
    'PROJECTS__DISABLE_DELETE_DIALOG';
export const PROJECTS__ENABLE_DELETE_DIALOG = 'PROJECTS__ENABLE_DELETE_DIALOG';
export const GET_PROJECT_BY_ID = 'GET_PROJECT_BY_ID';

// Project Details
export const PROJECT_DETAILS__SET = 'PROJECT_DETAILS__SET';
export const PROJECT_DETAILS__START_LOADING = 'PROJECT_DETAILS__START_LOADING';
export const PROJECT_DETAILS__STOP_LOADING = 'PROJECT_DETAILS__STOP_LOADING';
export const PROJECT_DETAILS__UPDATE_STAKEHOLDER =
    'PROJECT_DETAILS__UPDATE_STAKEHOLDER';

// Stakeholders
export const STAKEHOLDERS__GET_STAKEHOLDERS = 'STAKEHOLDERS__GET_STAKEHOLDERS';
export const STAKEHOLDERS__ADD_PROJECT = 'STAKEHOLDERS__ADD_PROJECT';
export const STAKEHOLDERS__EDIT_PROJECT = 'STAKEHOLDERS__EDIT_PROJECT';
export const STAKEHOLDERS__DELETE_PROJECT = 'STAKEHOLDERS__DELETE_PROJECT';
export const STAKEHOLDERS__SET_STAKEHOLDERS = 'STAKEHOLDERS__SET_STAKEHOLDERS';
export const STAKEHOLDERS__START_STAKEHOLDERS_LOADING =
    'STAKEHOLDERS__START_STAKEHOLDERS_LOADING';
export const STAKEHOLDERS__STOP_STAKEHOLDERS_LOADING =
    'STAKEHOLDERS__STOP_STAKEHOLDERS_LOADING';
export const STAKEHOLDERS__SET_IS_FORM_OPEN = 'STAKEHOLDERS__SET_IS_FORM_OPEN';
export const STAKEHOLDERS__SET_FORM_TYPE = 'STAKEHOLDERS__SET_FORM_TYPE';
export const STAKEHOLDERS__SET_EDIT_FORM_DATA =
    'STAKEHOLDERS__SET_EDIT_FORM_DATA';
export const STAKEHOLDERS__SET_IS_DELETE_DIALOG_OPEN =
    'STAKEHOLDERS__SET_IS_DELETE_DIALOG_OPEN';
export const STAKEHOLDERS__DISABLE_DELETE_DIALOG =
    'STAKEHOLDERS__DISABLE_DELETE_DIALOG';
export const STAKEHOLDERS__ENABLE_DELETE_DIALOG =
    'STAKEHOLDERS__ENABLE_DELETE_DIALOG';

// Requirements
export const REQUIREMENTS__GET_REQUIREMENTS = 'REQUIREMENTS__GET_REQUIREMENTS';
export const REQUIREMENTS__ADD_PROJECT = 'REQUIREMENTS__ADD_PROJECT';
export const REQUIREMENTS__EDIT_PROJECT = 'REQUIREMENTS__EDIT_PROJECT';
export const REQUIREMENTS__DELETE_PROJECT = 'REQUIREMENTS__DELETE_PROJECT';
export const REQUIREMENTS__SET_REQUIREMENTS = 'REQUIREMENTS__SET_REQUIREMENTS';
export const REQUIREMENTS__START_REQUIREMENTS_LOADING =
    'REQUIREMENTS__START_REQUIREMENTS_LOADING';
export const REQUIREMENTS__STOP_REQUIREMENTS_LOADING =
    'REQUIREMENTS__STOP_REQUIREMENTS_LOADING';
export const REQUIREMENTS__SET_IS_FORM_OPEN = 'REQUIREMENTS__SET_IS_FORM_OPEN';
export const REQUIREMENTS__SET_FORM_TYPE = 'REQUIREMENTS__SET_FORM_TYPE';
export const REQUIREMENTS__SET_EDIT_FORM_DATA =
    'REQUIREMENTS__SET_EDIT_FORM_DATA';
export const REQUIREMENTS__SET_IS_DELETE_DIALOG_OPEN =
    'REQUIREMENTS__SET_IS_DELETE_DIALOG_OPEN';
export const REQUIREMENTS__DISABLE_DELETE_DIALOG =
    'REQUIREMENTS__DISABLE_DELETE_DIALOG';
export const REQUIREMENTS__ENABLE_DELETE_DIALOG =
    'REQUIREMENTS__ENABLE_DELETE_DIALOG';

// WorkPackage
export const WORK_PACKAGE__GET_WORK_PACKAGE = 'WORK_PACKAGE__GET_WORK_PACKAGE';
export const WORK_PACKAGE__ADD_PROJECT = 'WORK_PACKAGE__ADD_PROJECT';
export const WORK_PACKAGE__EDIT_PROJECT = 'WORK_PACKAGE__EDIT_PROJECT';
export const WORK_PACKAGE__DELETE_PROJECT = 'WORK_PACKAGE__DELETE_PROJECT';
export const WORK_PACKAGE__SET_WORK_PACKAGE = 'WORK_PACKAGE__SET_WORK_PACKAGE';
export const WORK_PACKAGE__START_WORK_PACKAGE_LOADING =
    'WORK_PACKAGE__START_WORK_PACKAGE_LOADING';
export const WORK_PACKAGE__STOP_WORK_PACKAGE_LOADING =
    'WORK_PACKAGE__STOP_WORK_PACKAGE_LOADING';
export const WORK_PACKAGE__SET_IS_FORM_OPEN = 'WORK_PACKAGE__SET_IS_FORM_OPEN';
export const WORK_PACKAGE__SET_FORM_TYPE = 'WORK_PACKAGE__SET_FORM_TYPE';
export const WORK_PACKAGE__SET_EDIT_FORM_DATA =
    'WORK_PACKAGE__SET_EDIT_FORM_DATA';
export const WORK_PACKAGE__SET_IS_DELETE_DIALOG_OPEN =
    'WORK_PACKAGE__SET_IS_DELETE_DIALOG_OPEN';
export const WORK_PACKAGE__DISABLE_DELETE_DIALOG =
    'WORK_PACKAGE__DISABLE_DELETE_DIALOG';
export const WORK_PACKAGE__ENABLE_DELETE_DIALOG =
    'WORK_PACKAGE__ENABLE_DELETE_DIALOG';

// Task
export const TASK__GET_TASK = 'TASK__GET_TASK';
export const TASK__ADD_PROJECT = 'TASK__ADD_PROJECT';
export const TASK__EDIT_PROJECT = 'TASK__EDIT_PROJECT';
export const TASK__DELETE_PROJECT = 'TASK__DELETE_PROJECT';
export const TASK__SET_TASK = 'TASK__SET_TASK';
export const TASK__START_TASK_LOADING = 'TASK__START_TASK_LOADING';
export const TASK__STOP_TASK_LOADING = 'TASK__STOP_TASK_LOADING';
export const TASK__SET_IS_FORM_OPEN = 'TASK__SET_IS_FORM_OPEN';
export const TASK__SET_FORM_TYPE = 'TASK__SET_FORM_TYPE';
export const TASK__SET_EDIT_FORM_DATA = 'TASK__SET_EDIT_FORM_DATA';
export const TASK__SET_IS_DELETE_DIALOG_OPEN =
    'TASK__SET_IS_DELETE_DIALOG_OPEN';
export const TASK__DISABLE_DELETE_DIALOG = 'TASK__DISABLE_DELETE_DIALOG';
export const TASK__ENABLE_DELETE_DIALOG = 'TASK__ENABLE_DELETE_DIALOG';

// FILE
export const FILE__GET_FILE = 'FILE__GET_FILE';
export const FILE__ADD_FILE = 'FILE__ADD_FILE';
export const FILE__EDIT_FILE = 'FILE__EDIT_FILE';
export const FILE__DELETE_FILE = 'FILE__DELETE_FILE';
export const FILE__SET_FILE = 'FILE__SET_FILE';
export const FILE__START_FILE_LOADING = 'FILE__START_FILE_LOADING';
export const FILE__STOP_FILE_LOADING = 'FILE__STOP_FILE_LOADING';
export const FILE__SET_IS_FORM_OPEN = 'FILE__SET_IS_FORM_OPEN';
export const FILE__SET_FORM_TYPE = 'FILE__SET_FORM_TYPE';
export const FILE__SET_EDIT_FORM_DATA = 'FILE__SET_EDIT_FORM_DATA';
export const FILE__SET_IS_DELETE_DIALOG_OPEN =
    'FILE__SET_IS_DELETE_DIALOG_OPEN';
export const FILE__DISABLE_DELETE_DIALOG = 'FILE__DISABLE_DELETE_DIALOG';
export const FILE__ENABLE_DELETE_DIALOG = 'FILE__ENABLE_DELETE_DIALOG';

// Satellite
export const SATELLITE__GET_SATELLITE = 'SATELLITE__GET_SATELLITE';
export const SATELLITE__ADD_SATELLITE = 'SATELLITE__ADD_SATELLITE';
export const SATELLITE__EDIT_SATELLITE = 'SATELLITE__EDIT_SATELLITE';
export const SATELLITE__DELETE_SATELLITE = 'SATELLITE__DELETE_SATELLITE';
export const SATELLITE__SET_SATELLITE = 'SATELLITE__SET_SATELLITE';
export const SATELLITE__START_SATELLITE_LOADING =
    'SATELLITE__START_SATELLITE_LOADING';
export const SATELLITE__STOP_SATELLITE_LOADING =
    'SATELLITE__STOP_SATELLITE_LOADING';
export const SATELLITE__SET_IS_FORM_OPEN = 'SATELLITE__SET_IS_FORM_OPEN';
export const SATELLITE__SET_FORM_TYPE = 'SATELLITE__SET_FORM_TYPE';
export const SATELLITE__SET_EDIT_FORM_DATA = 'SATELLITE__SET_EDIT_FORM_DATA';
export const SATELLITE__SET_IS_DELETE_DIALOG_OPEN =
    'SATELLITE__SET_IS_DELETE_DIALOG_OPEN';
export const SATELLITE__DISABLE_DELETE_DIALOG =
    'SATELLITE__DISABLE_DELETE_DIALOG';
export const SATELLITE__ENABLE_DELETE_DIALOG =
  'SATELLITE__ENABLE_DELETE_DIALOG';
export const GET_COMPONENT_UI_FORM = 'GET_COMPONENT_UI_FORM';
export const GET_COMPONENT = 'GET_COMPONENT';
export const GET_STATUS_HISTORY = 'GET_STATUS_HISTORY';
export const GET_COMPONENT_BY_DOC_ID = 'GET_COMPONENT_BY_DOC_ID';
export const GET_COMPONENT_MODEL_VERSION_BY_DOC_ID = 'GET_COMPONENT_MODEL_VERSION_BY_DOC_ID';
export const GET_COMPONENT_MODEL_VERSION_HISTORY = 'GET_COMPONENT_MODEL_VERSION_HISTORY';
export const UPDATE_COMPONENT_VERSION_STATUS = 'UPDATE_COMPONENT_VERSION_STATUS';

export const GET_COMPONENT_BY_DOC_VERSION_ID = 'GET_COMPONENT_BY_DOC_VERSION_ID';
export const GET_COMPANY_NAME = 'GET_COMPANY_NAME';
// Simulation
export const SIMULATION__GET_SIMULATION = 'SIMULATION__GET_SIMULATION';
export const SIMULATION__ADD_SIMULATION = 'SIMULATION__ADD_SIMULATION';
export const SIMULATION__EDIT_SIMULATION = 'SIMULATION__EDIT_SIMULATION';
export const SIMULATION__DELETE_SIMULATION = 'SIMULATION__DELETE_SIMULATION';
export const SIMULATION__SET_SIMULATION = 'SIMULATION__SET_SIMULATION';
export const SIMULATION__START_SIMULATION_LOADING =
    'SIMULATION__START_SIMULATION_LOADING';
export const SIMULATION__STOP_SIMULATION_LOADING =
    'SIMULATION__STOP_SIMULATION_LOADING';
export const SIMULATION__SET_IS_FORM_OPEN = 'SIMULATION__SET_IS_FORM_OPEN';
export const SIMULATION__SET_FORM_TYPE = 'SIMULATION__SET_FORM_TYPE';
export const SIMULATION__SET_EDIT_FORM_DATA = 'SIMULATION__SET_EDIT_FORM_DATA';
export const SIMULATION__SET_IS_DELETE_DIALOG_OPEN =
    'SIMULATION__SET_IS_DELETE_DIALOG_OPEN';
export const SIMULATION__DISABLE_DELETE_DIALOG =
    'SIMULATION__DISABLE_DELETE_DIALOG';
export const SIMULATION__ENABLE_DELETE_DIALOG =
    'SIMULATION__ENABLE_DELETE_DIALOG';

export const SET_SIMULATION_CONFIG_LIST = 'SET_SIMULATION_CONFIG_LIST';
export const SET_RUN_SIMULATION_CONFIG_LIST = 'SET_RUN_SIMULATION_CONFIG_LIST';
export const CLEAR_SIMULATION_CONFIG_LIST = 'CLEAR_SIMULATION_CONFIG_LIST';
export const CLEAR_RUN_SIMULATION_CONFIG_LIST ='CLEAR_RUN_SIMULATION_CONFIG_LIST';
export const SET_RUN_SIMULATION_CONFIG_LIST_LOADING ='SET_RUN_SIMULATION_CONFIG_LIST_LOADING';

export const SET_SIMULATION_CONFIG_ACTIVE = 'SET_SIMULATION_CONFIG_ACTIVE';
export const CLEAR_SIMULATION_CONFIG_ACTIVE ='CLEAR_SIMULATION_CONFIG_ACTIVE';
export const SET_SELECT_SIMULATION_CONFIG = 'SET_SELECT_SIMULATION_CONFIG';
export const CLEAR_SELECT_SIMULATION_CONFIG = 'CLEAR_SELECT_SIMULATION_CONFIG';
export const SET_IS_PAGE_LOADING = 'SET_IS_PAGE_LOADING';
export const SET_ANALYSIS_COLLECTION = 'SET_ANALYSIS_COLLECTION';
export const ADD_NEW_ANALYSIS_COLLECTION ='ADD_NEW_ANALYSIS_COLLECTION';
export const REMOVE_ANALYSIS_COLLECTION = 'REMOVE_ANALYSIS_COLLECTION';
export const MODIFY_ANALYSIS_COLLECTION = 'MODIFY_ANALYSIS_COLLECTION';
export const RESET_ANALYSIS_COLLECTION = 'RESET_ANALYSIS_COLLECTION';
// Chat App Actions
export const CHAT_WITH_SELECTED_USER = 'CHAT_WITH_SELECTED_USER';
export const SEND_MESSAGE_TO_USER = 'SEND_MESSAGE_TO_USER';
export const UPDATE_USERS_SEARCH = 'UPDATE_USERS_SEARCH';
export const SEARCH_USERS = 'SEARCH_USERS';
export const GET_RECENT_CHAT_USERS = 'GET_RECENT_CHAT_USERS';
// Agency Sidebar
export const AGENCY_TOGGLE_MENU = 'AGENCY_TOGGLE_MENU';
export const CHANGE_AGENCY_LAYOUT_BG = 'CHANGE_AGENCY_LAYOUT_BG';
// Mail App
export const GET_EMAILS = 'GET_EMAILS';
export const GET_EMAIL_SUCCESS = 'GET_EMAIL_SUCCESS';
export const GET_EMAIL_FAILURE = 'GET_EMAIL_FAILURE';
export const SET_EMAIL_AS_STAR = 'SET_EMAIL_AS_STAR';
export const READ_EMAIL = 'READ_EMAIL';
export const HIDE_LOADING_INDICATOR = 'HIDE_LOADING_INDICATOR';
export const FETCH_EMAILS = 'FETCH_EMAILS';
export const ON_SELECT_EMAIL = 'ON_SELECT_EMAIL';
export const UPDATE_EMAIL_SEARCH = 'UPDATE_EMAIL_SEARCH';
export const SEARCH_EMAIL = 'SEARCH_EMAIL';
export const ON_DELETE_MAIL = 'ON_DELETE_MAIL';
export const ON_BACK_PRESS_NAVIGATE_TO_EMAIL_LISTING = 'ON_BACK_PRESS_NAVIGATE_TO_EMAIL_LISTING';
export const GET_SENT_EMAILS = 'GET_SENT_EMAILS';
export const GET_INBOX = 'GET_INBOX';
export const GET_DRAFTS_EMAILS = 'GET_DRAFTS_EMAILS';
export const GET_SPAM_EMAILS = 'GET_SPAM_EMAILS';
export const GET_TRASH_EMAILS = 'GET_TRASH_EMAILS';
export const ON_EMAIL_MOVE_TO_FOLDER = 'ON_EMAIL_MOVE_TO_FOLDER';
export const SELECT_ALL_EMAILS = 'SELECT_ALL_EMAILS';
export const UNSELECT_ALL_EMAILS = 'UNSELECT_ALL_EMAILS';
export const ON_SEND_EMAIL = 'ON_SEND_EMAIL';
export const EMAIL_SENT_SUCCESSFULLY = 'EMAIL_SENT_SUCCESSFULLY';
export const FILTER_EMAILS_WITH_LABELS = 'FILTER_EMAILS_WITH_LABELS';
export const ADD_LABELS_INTO_EMAILS = 'ADD_LABELS_INTO_EMAILS';
// sidebar
export const TOGGLE_MENU = 'TOGGLE_MENU';
// ToDo App
export const GET_TODOS = 'GET_TODOS';
export const FETCH_TODOS = 'FETCH_TODOS';
export const ADD_NEW_TASK = 'ADD_NEW_TASK';
export const ON_SELECT_TODO = 'ON_SELECT_TODO';
export const ON_HIDE_LOADER = 'ON_HIDE_LOADER';
export const ON_BACK_TO_TODOS = 'ON_BACK_TO_TODOS';
export const ON_SHOW_LOADER = 'ON_SHOW_LOADER';
export const MARK_AS_STAR_TODO = 'MARK_AS_STAR_TODO';
export const DELETE_TODO = 'DELETE_TODO';
export const ADD_LABELS_INTO_THE_TASK = 'ADD_LABELS_INTO_THE_TASK';
export const GET_ALL_TODO = 'GET_ALL_TODO';
export const GET_COMPLETED_TODOS = 'GET_COMPLETED_TODOS';
export const GET_DELETED_TODOS = 'GET_DELETED_TODOS';
export const GET_STARRED_TODOS = 'GET_STARRED_TODOS';
export const GET_FILTER_TODOS = 'GET_FILTER_TODOS';
export const CLOSE_SNACKBAR = 'CLOSE_SNACKBAR';
export const COMPLETE_TASK = 'COMPLETE_TASK';
export const UPDATE_TASK_TITLE = 'UPDATE_TASK_TITLE';
export const UPDATE_TASK_DESCRIPTION = 'UPDATE_TASK_DESCRIPTION';
export const CHANGE_TASK_ASSIGNER = 'CHANGE_TASK_ASSIGNER';
export const ON_CHECK_BOX_TOGGLE_TODO_ITEM = 'ON_CHECK_BOX_TOGGLE_TODO_ITEM';
export const SELECT_ALL_TODO = 'SELECT_ALL_TODO';
export const GET_UNSELECTED_ALL_TODO = 'GET_UNSELECTED_ALL_TODO';
export const SELECT_STARRED_TODO = 'SELECT_STARRED_TODO';
export const SELECT_UNSTARRED_TODO = 'SELECT_UNSTARRED_TODO';
export const ON_LABEL_SELECT = 'ON_LABEL_SELECT';
export const ON_LABEL_MENU_ITEM_SELECT = 'ON_LABEL_MENU_ITEM_SELECT';
export const UPDATE_SEARCH = 'UPDATE_SEARCH';
export const SEARCH_TODO = 'SEARCH_TODO';
// Auth Actions
export const LOGIN_USER = 'LOGIN_USER';
export const LOGIN_USER_SUCCESS = 'LOGIN_USER_SUCCESS';
export const LOGIN_USER_FAILURE = 'LOGIN_USER_FAILURE';
export const LOGOUT_USER = 'LOGOUT_USER';
export const SIGNUP_USER = 'SIGNUP_USER';
export const SIGNUP_USER_SUCCESS = 'SIGNUP_USER_SUCCESS';
export const SIGNUP_USER_FAILURE = 'SIGNUP_USER_FAILURE';
export const PROCEED_TO_UPDATE_PASSWORD = 'PROCEED_TO_UPDATE_PASSWORD';
export const PASSWORD_RESET_SUCCESS = 'PASSWORD_RESET_SUCCESS';
export const RESET_FORGOT_PASSWORD_STATE = 'RESET_FORGOT_PASSWORD_STATE';
export const PASSWORD_RESET_ERROR = 'PASSWORD_RESET_ERROR';
// Feedbacks
export const GET_FEEDBACKS = 'GET_FEEDBACKS';
export const GET_FEEDBACKS_SUCCESS = 'GET_FEEDBACKS_SUCCESS';
export const GET_ALL_FEEDBACKS = 'GET_ALL_FEEDBACKS';
export const ON_CHANGE_FEEDBACK_PAGE_TABS = 'ON_CHANGE_FEEDBACK_PAGE_TABS';
export const MAKE_FAVORITE_FEEDBACK = 'MAKE_FAVORITE_FEEDBACK';
export const ON_DELETE_FEEDBACK = 'ON_DELETE_FEEDBACK';
export const VIEW_FEEDBACK_DETAILS = 'VIEW_FEEDBACK_DETAILS';
export const ADD_NEW_FEEDBACK = 'ADD_NEW_FEEDBACK';
export const SHOW_FEEDBACK_LOADING_INDICATOR = 'SHOW_FEEDBACK_LOADING_INDICATOR';
export const HIDE_FEEDBACK_LOADING_INDICATOR = 'HIDE_FEEDBACK_LOADING_INDICATOR';
export const NAVIGATE_TO_BACK = 'NAVIGATE_TO_BACK';
export const REPLY_FEEDBACK = 'REPLY_FEEDBACK';
export const SEND_REPLY = 'SEND_REPLY';
export const UPDATE_SEARCH_IDEA = 'UPDATE_SEARCH_IDEA';
export const ON_SEARCH_IDEA = 'ON_SEARCH_IDEA';
export const ON_COMMENT_FEEDBACK = 'ON_COMMENT_FEEDBACK';
// ecommerce
export const ON_DELETE_ITEM_FROM_CART = 'ON_DELETE_ITEM_FROM_CART';
export const ON_QUANTITY_CHANGE = 'ON_QUANTITY_CHANGE';
export const ON_ADD_ITEM_TO_CART = 'ON_ADD_ITEM_TO_CART';
//crm
export const ADD_NEW_CLIENT = 'ADD_NEW_CLIENT';
export const DELETE_CLIENT = 'DELETE_CLIENT';
export const UPDATE_CLIENT = 'UPDATE_CLIENT';

// simulate
export const SIMULATE_CHANGE_TAB = 'SIMULATE_CHANGE_TAB';
export const SIMULATE_CHANGE_AXIS = 'SIMULATE_CHANGE_AXIS';
export const SIMULATE_CHANGE_UNIT = 'SIMULATE_CHANGE_UNIT';
export const SIMULATE_CHANGE_SIMPLE = 'SIMULATE_CHANGE_SIMPLE';
export const SIMULATE_CHANGE_SAVE = 'SIMULATE_CHANGE_SAVE';
export const SIMULATE_RUN = 'SIMULATE_RUN';
export const CREATE_SIMULATION_SUCCESS = 'CREATE_SIMULATION_SUCCESS';
export const SAVE_CZML_DATA = 'SAVE_CZML_DATA';
export const INIT_SOCKET = 'INIT_SOCKET';
export const CLOSE_SOCKET = 'CLOSE_SOCKET';
export const FIRE_EVENT = 'FIRE_EVENT';
export const SET_CASE = 'SET_CASE';
export const CLEAR_CASE = 'CLEAR_CASE';
export const SET_OLD_CASE ='SET_OLD_CASE';
export const SET_STATUS = 'SET_STATUS';
export const SET_PARAMETERS = 'SET_PARAMETERS';
export const SET_PROJECT = 'SET_PROJECT';
export const CLEAR_PROJECT = 'CLEAR_PROJECT';
export const CLEAR_PARAMETER = 'CLEAR_PARAMETER';
export const SIMULATE_CHANGE_LEFTPANEL = 'SIMULATE_CHANGE_LEFTPANEL';
// Loading
export const PORTION_LOADING = "PORTION_LOADING";
export const PORTION_LOADED = "PORTION_LOADED";
export const OVERLAY_LOADING = "OVERLAY_LOADING";
export const OVERLAY_LOADED = "OVERLAY_LOADED";

// Simulation Configuration 
export const SET_SIMULATION_CONFIG_SELECT_BLOCK = "SET_SIMULATION_CONFIG_SELECT_BLOCK";
export const SET_BLOCK_NAME_SELECT_BLOCK = "SET_BLOCK_NAME_SELECT_BLOCK";
export const SET_BLOCK_SIMULATION_TIME_SELECT_BLOCK = "SET_BLOCK_SIMULATION_TIME_SELECT_BLOCK";
export const SET_IS_UPDATE_BLOCK_CONFIG = "SET_IS_UPDATE_BLOCK_CONFIG";
export const SET_BLOCK_PARAM_CONFIG = "SET_BLOCK_PARAM_CONFIG";
export const SET_NEW_CONFIG_OBJECT = "SET_NEW_CONFIG_OBJECT";
export const SET_SIMULATION_CONFIG_RATE ="SET_SIMULATION_CONFIG_RATE";

// Ground Station 

export const GROUNDSTATION_IS_ADD_DIALOG_OPEN = "GROUNDSTATION_IS_ADD_DIALOG_OPEN";
export const GROUNDSTATION_IS_VIEW_DIALOG_OPEN = "GROUNDSTATION_IS_VIEW_DIALOG_OPEN";
export const GROUNDSTATION_ADD_STATION_LIST = "GROUNDSTATION_ADD_STATION_LIST";
export const GROUNDSTATION_UPDATE_STATION_LIST = "GROUNDSTATION_UPDATE_STATION_LIST";
export const GROUNDSTATION_UPDATE_STATION_ITEM = "GROUNDSTATION_UPDATE_STATION_ITEM";
export const GROUNDSTATION_DELETE_STATION_LIST_ROW = "GROUNDSTATION_DELETE_STATION_LIST_ROW";
export const GROUNDSTATION_CLEAR_STATION_LIST ="GROUNDSTATION_CLEAR_STATION_LIST";

//Ground Station New

export const SET_GROUNDSTATION_LIST = "SET_GROUNDSTATION_LIST";
export const ADD_NEW_GROUNDSTATION_ITEM = "ADD_NEW_GROUNDSTATION_ITEM";
export const UPDATE_GROUNDSTATION_ITEM = "UPDATE_GROUNDSTATION_ITEM";
export const DELETE_GROUNDSTATION_ITEM = "DELETE_GROUNDSTATION_ITEM";
export const RESET_GROUNDSTATION_LIST = "RESET_GROUNDSTATION_LIST";

// Component Loading 
export const SET_ACTION_WAIT ='SET_ACTION_WAIT'
export const SET_CAD_URL ='SET_CAD_URL'

export const WAIT_WHILE_LOADING ="WAIT_WHILE_LOADING"
export const IS_ELIGIBLE_CREATE_NEW_MISSION = "IS_ELIGIBLE_CREATE_NEW_MISSION"
export const IS_MISSION_CREATION_SUCESSFUL = "IS_MISSION_CREATION_SUCESSFUL"


export const WORK_PACKAGE__UPDATE_OPEN_VIEW_REQUIRMENT_MODAL ="WORK_PACKAGE__UPDATE_OPEN_VIEW_REQUIRMENT_MODAL"
export const REQUIREMENTSGRAPH_OPEN_MISSION_NODE ="REQUIREMENTSGRAPH_OPEN_MISSION_NODE"
export const REQUIREMENTSGRAPH_START_REQUIREMENTSGRAPH_LOADING ="REQUIREMENTSGRAPH_START_REQUIREMENTSGRAPH_LOADING"
export const REQUIREMENTSGRAPH__SET_REQUIREMENTSGRAPH ="REQUIREMENTSGRAPH__SET_REQUIREMENTSGRAPH"
export const REQUIREMENTSGRAPH__STOP_REQUIREMENTSGRAPH_LOADING ="REQUIREMENTSGRAPH__STOP_REQUIREMENTSGRAPH_LOADING"


export const REQUIREMENTSNODE_SET_SELECTED_NODE ="REQUIREMENTSNODE_SET_SELECTED_NODE"


//REQUIRMENT TAB

export const REQUIREMENTSTAB_SET_FUNCTIONAL_REQ="REQUIREMENTSTAB_SET_FUNCTIONAL_REQ";
export const REQUIREMENTSTAB_SET_OPERATIONAL_REQ="REQUIREMENTSTAB_SET_OPERATIONAL_REQ";
export const REQUIREMENTSTAB_SET_CONSTRAINT_REQ="REQUIREMENTSTAB_SET_CONSTRAINT_REQ";
export const REQUIREMENTSTAB_SET_VERIFICATION_REQ="REQUIREMENTSTAB_SET_VERIFICATION_REQ";

export const REQUIREMENTSTAB_CLEAR_FUNCTIONAL_REQ="REQUIREMENTSTAB_CLEAR_FUNCTIONAL_REQ";
export const REQUIREMENTSTAB_CLEAR_OPERATIONAL_REQ="REQUIREMENTSTAB_CLEAR_OPERATIONAL_REQ";
export const REQUIREMENTSTAB_CLEAR_CONSTRAINT_REQ="REQUIREMENTSTAB_CLEAR_CONSTRAINT_REQ";
export const REQUIREMENTSTAB_CLEAR_VERIFICATION_REQ="REQUIREMENTSTAB_CLEAR_VERIFICATION_REQ";


export const REQUIREMENTSGRAPH__ADDNODE_REQUIREMENTSGRAPH="REQUIREMENTSGRAPH__ADDNODE_REQUIREMENTSGRAPH";
export const REQUIREMENTSNODE_UPDATE_VALUE="REQUIREMENTSNODE_UPDATE_VALUE";
export const REQUIREMENTSNODE_UPDATE_ADD_BUTTON="REQUIREMENTSNODE_UPDATE_ADD_BUTTON";

export const WORK_PACKAGE__OPEN_VIEW_AND_EDIT_REQUIRMENT_MODAL="WORK_PACKAGE__OPEN_VIEW_AND_EDIT_REQUIRMENT_MODAL";
export const REQUIREMENTSNODE_SET_SELECTED_NODE_VIEW="REQUIREMENTSNODE_SET_SELECTED_NODE_VIEW";
export const REQUIREMENTSNODE_SELECTED_REQUIREMENT="REQUIREMENTSNODE_SELECTED_REQUIREMENT";
export const WORK_PACKAGE__OPEN_VIEW_AND_EDIT_SYSTEMTASK_MODAL="WORK_PACKAGE__OPEN_VIEW_AND_EDIT_SYSTEMTASK_MODAL";
export const WORK_PACKAGE__OPEN_VIEW_AND_EDIT_SUBSYSTE_MODAL="WORK_PACKAGE__OPEN_VIEW_AND_EDIT_SUBSYSTE_MODAL";
export const WORK_PACKAGE__OPEN_VIEW_AND_EDIT_COMPONENT_MODAL="WORK_PACKAGE__OPEN_VIEW_AND_EDIT_COMPONENT_MODAL";
export const WORK_PACKAGE__OPEN_VIEW_AND_EDIT_COMPONENT_SUB_PARTS_MODAL="WORK_PACKAGE__OPEN_VIEW_AND_EDIT_COMPONENT_SUB_PARTS_MODAL";


// Simulation Engine 

export const SIMULATION_ENGINE_UPDATE_STATUS="SIMULATION_ENGINE_UPDATE_STATUS";
export const EXPECTED_SIMULATION_ENGINE_UPDATE_STATUS="EXPECTED_SIMULATION_ENGINE_UPDATE_STATUS";
export const UPDATE_SIMULATION_PROGRESS_STATUS="UPDATE_SIMULATION_PROGRESS_STATUS";
export const ADD_SIMULATION_ERROR_RESULT="ADD_SIMULATION_ERROR_RESULT";
export const RESET_SIMULATION_ERROR_RESULT="RESET_SIMULATION_ERROR_RESULT";

//React Diagram 

export const SET_PROPAGATOR_COUNT = "SET_PROPAGATOR_COUNT";
//to manage tour joyride
export const SET_START_TOUR ="SET_START_TOUR";
export const SET_END_TOUR = "SET_END_TOUR";


//to manage the Drag and configuration 
export const SET_SIM_CONFIGURATION = "SET_SIM_CONFIGURATION";
export const UPDATE_SIM_CONFIGURATION = "UPDATE_SIM_CONFIGURATION";
export const IS_CONFIGURATION_SAVED = "IS_CONFIGURATION_SAVED";

// to manage simmulation visualization

export const SET_VISUALIZATION_TABS = "SET_VISUALIZATION_TABS";
export const SET_VISUALIZATION_TABS_CONTENT = "SET_VISUALIZATION_TABS_CONTENT";
export const SET_ACTIVE_VISUALIZATION_TAB ="SET_ACTIVE_VISUALIZATION_TAB";
export const ADD_VISUALIZATION_TAB = "ADD_VISUALIZATION_TAB";
export const ADD_VISUALIZATION_TABS_CONTENT = "ADD_VISUALIZATION_TABS_CONTENT";
export const REMOVE_VISUALIZATION_TAB = "REMOVE_VISUALIZATION_TAB";
export const REMOVE_VISUALIZATION_TABS_CONTENT = "REMOVE_VISUALIZATION_TABS_CONTENT";

export const SET_VISUALIZATION_TAB_LIST = "SET_VISUALIZATION_TAB_LIST"
export const ADD_VISUALIZATION_TAB_ITEM = "ADD_VISUALIZATION_TAB_ITEM"
export const UPDATE_VISUALIZATION_TAB_ITEM = "UPDATE_VISUALIZATION_TAB_ITEM"
export const DELETE_VISUALIZATION_TAB_ITEM = "DELETE_VISUALIZATION_TAB_ITEM"
export const RESET_VISUALIZATION_TAB_LIST = "RESET_VISUALIZATION_TAB_LIST"


//REALTIME
export const SET_REALTIME_PARAMETER_ID = "SET_REALTIME_PARAMETER_ID"

//minimpa constants
export const MINIMAP_INITIALZE_MODEL = "MINIMAP_INITIALZE_MODEL";
export const MINIMAP_DELETE_NODE = "MINIMAP_DELETE_NODE";
export const MINIMAP_ADD_NODE = "MINIMAP_ADD_NODE";
export const MINIMAP_UPDATE_NODE = "MINIMAP_UPDATE_NODE";
export const MINIMAP_ZOOMIN = "MINIMAP_ZOOMIN";
export const MINIMAP_ZOOMOUT = "MINIMAP_ZOOMOUT";
export const MINIMAP_SETOFFSET = "MINIMAP_SETOFFSET";
export const MINIMAP_CANVAS_WIDTH_HEIGHT = "MINIMAP_CANVAS_WIDTH_HEIGHT";
export const MINIMAP_MARK_WIDTH = "MINIMAP_MARK_WIDTH";
export const MINIMAP_MARK_LEFT = "MINIMAP_MARK_LEFT";
export const MINIMAP_EXTRA_RIGHT_WIDTH = "MINIMAP_EXTRA_RIGHT_WIDTH";
export const MINIMAP_EXTRA_LEFT_WIDTH = "MINIMAP_EXTRA_LEFT_WIDTH";
export const MINIMAP_EXTRA_TOP_HEIGHT = "MINIMAP_EXTRA_TOP_HEIGHT";
export const MINIMAP_EXTRA_BOTTOM_HEIGHT = "MINIMAP_EXTRA_BOTTOM_HEIGHT";
export const MINIMAP_MARK_HEIGHT = "MINIMAP_MARK_HEIGHT";
export const MINIMAP_IS_OPEN_TAB = "MINIMAP_IS_OPEN_TAB";
export const MINIMAP_DRAG_START = "MINIMAP_DRAG_START";
export const MINIMAP_DRAG_END = "MINIMAP_DRAG_END";

// Plot AnaLysis Run Data Constants
export const LOAD_RUN_DATA = "LOAD_RUN_DATA";
export const SET_RUN_DATA_LOADING = "SET_RUN_DATA_LOADING";

//Split Simulation
export const SET_MAX = "SET_MAX";
export const SET_MIN = "SET_MIN";
export const SET_LOCK = "SET_LOCK";
export const SET_EXPAND = "SET_EXPAND";
export const SET_WINDOW_COLLAPSE = "SET_WINDOW_COLLAPSE";
export const SET_NEMBUS_PROJECT_WIDTHCHANGED = "SET_NEMBUS_PROJECT_WIDTHCHANGED";