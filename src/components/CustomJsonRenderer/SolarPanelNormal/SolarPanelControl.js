import * as React from 'react';
import { withJsonFormsControlProps } from '@jsonforms/react';
import SolarPanelNormalTable  from './SolarPanel';



const SolarPanelNormalControl = ( props ) => 
(
 <SolarPanelNormalTable
    {...props}

  />
);

export default withJsonFormsControlProps(SolarPanelNormalControl);