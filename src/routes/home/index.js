/**
 * Dasboard Routes
 * B2C
 * Nirmalya Saha
 */
import React from 'react';
import {Redirect, Route, Switch } from 'react-router-dom';
import { Helmet } from "react-helmet";


import {
  AsynOverviewComponent
} from 'Components/AsyncComponent/AsyncComponent';


const Landinghome = ({ match }) => (

   
   <div className="content-wrapper">
     <Helmet>
			<title>Overview | SAT-PASS</title>
			<meta name="description" content="SAT-PASS Overview" />
		</Helmet>
      <Switch>

      <Route path={`${match.url}`} component={AsynOverviewComponent} />
    </Switch>
  </div>
);

export default Landinghome;
