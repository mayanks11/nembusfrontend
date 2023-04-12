

import Home from 'Routes/home';
import Simulation from 'Routes/simulation';
import ProjectHome from 'Routes/project';


export default [
   {
      path: 'home',
      component: Home
   },
   {
      path: 'simulation',
      component: Simulation
   },
   {
      path: 'project-detail/:id',
      component: ProjectHome
   }
]