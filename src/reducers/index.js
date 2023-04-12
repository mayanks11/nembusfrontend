/**
 * App Reducers
 */
import { combineReducers } from 'redux';
import settings from './settings';
import sidebarReducer from './SidebarReducer';
import authUserReducer from './AuthUserReducer';
import simulateReducer from './SimulateReducer';
import projectsReducer from './ProjectsReducer';
import projectDetailsReducer from './ProjectDetailsReducer';
import StakeholdersReducer from './StakeholdersReducer';
import RequirementsReducer from './RequirementsReducer';
import WorkPackageReducer from './WorkPackageReducer';
import TemporaryDataReducer from './TemporaryDataReducer';
import TaskReducer from './TaskReducer';
import FileReducer from './FileReducer';
import SatelliteReducer from './SatelliteReducer';
import SimulationReducer from './SimulationReducer';
import loading from "./loading";
import SimulationConfigReducer from "./SimulationConfigReducer";
import ComponentReducer from './ComponentReducer';
import { jsonformsReducer } from '@jsonforms/core';

import GroundStationReducer from "./GroundStationReducer";
import RequirementGraph from './RequirementGraphReducer';
import RequirementNodeReducer from './RequirementNodeReducer';
import RequirementTabReducer from './RequirementTabReducer';
import SimulationEngine from './SimulationEngine';
import SimConfiguration from './SimConfiguration';

import ReactDiagramReducer from "./ReactDiagramReducer";

import { firebaseReducer } from "react-redux-firebase";
import { firestoreReducer } from "redux-firestore";



import TourReducer from './TourReducer';
import SimulationAnalysisReducer from './SimulationAnalysisReducer';
import SimulationRunconfiguration from './SimulationRunconfiguration';

import StationReducer from './StationReducer';

import MinimapReducer from './MinimapReducer';
import RunDataReducer from './RunData';
import SplitReducer from './SplitReducer';
const reducers = combineReducers({
    settings,
    firebase:firebaseReducer,
    firestore:firestoreReducer,
    projects: projectsReducer,
    sidebar: sidebarReducer,
    authUser: authUserReducer,
    simulate: simulateReducer,
    projectDetails: projectDetailsReducer,
    stakeholders: StakeholdersReducer,
    requirements: RequirementsReducer,
    workPackages: WorkPackageReducer,
    extraData: TemporaryDataReducer,
    tasks: TaskReducer,
    files: FileReducer,
    satellites: SatelliteReducer,
    simulations: SimulationReducer,
    loading: loading,
    SimulationConfigReducer: SimulationConfigReducer,
    groundStationState: GroundStationReducer,
    component: ComponentReducer,
    jsonforms: jsonformsReducer(),
    requirementGraph: RequirementGraph,
    requirementNode: RequirementNodeReducer,
    requirmentTab: RequirementTabReducer,
    simengine: SimulationEngine,
    ReactDiagramReducer: ReactDiagramReducer,
    TourReducer: TourReducer,
    SimulationAnalysisReducer: SimulationAnalysisReducer,
    SimConfiguration: SimConfiguration,
    SimulationRunconfiguration: SimulationRunconfiguration,
    GroundStationDetails: StationReducer,
    MinimapReducer: MinimapReducer,
    RunDataReducer: RunDataReducer,
    SplitReducer: SplitReducer
});

export default reducers;
