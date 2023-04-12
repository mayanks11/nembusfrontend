/**
 * AsyncComponent
 * Code Splitting Component / Server Side Rendering
 */
import React from 'react';
import Loadable from 'react-loadable';

// rct page loader
import RctPageLoader from 'Components/RctPageLoader/RctPageLoader';

// Overview
const AsynOverviewComponent  = Loadable({
   loader: () => import("Routes/home/Home"),
   loading: () => <RctPageLoader />,
});





// import SimulationHome from './SimulationHome';
// import SimulateComponent from './Simulate';
// import NewSimulation from './SimulationForm';
// import SimualtionsList from './SimualtionsList';

// Simulation  home 
const AsynSimulationHomeComponent  = Loadable({
   loader: () => import("Routes/simulation/SimulationHome"),
   loading: () => <RctPageLoader />,
});


// new simulation  
const AsynNewSimulationComponent  = Loadable({
   loader: () => import("Routes/simulation/SimulationForm"),
   loading: () => <RctPageLoader />,
});

// my simulation  
const AsynMySimulationComponent  = Loadable({
   loader: () => import("Routes/simulation/SimualtionsList"),
   loading: () => <RctPageLoader />,
});

// simulate 
const AsynSimulateComponent  = Loadable({
   loader: () => import("Routes/simulation/Simulate"),
   loading: () => <RctPageLoader />,
});

//shared Simulations

const AsyncSharedSimulationsComponent = Loadable({
   loader: () => import("Routes/simulation/SharedSimulations"),
   loading: () => <RctPageLoader />,
})

// project detail
const AsyncProjectDetailComponent = Loadable({
	loader: () => import("Routes/project"),
	loading: () => <RctPageLoader />,
});



export {
   AsynOverviewComponent,
   AsynSimulateComponent,
   AsynMySimulationComponent,
   AsynNewSimulationComponent,
   AsynSimulationHomeComponent,
   AsyncSharedSimulationsComponent,
   AsyncProjectDetailComponent
};
