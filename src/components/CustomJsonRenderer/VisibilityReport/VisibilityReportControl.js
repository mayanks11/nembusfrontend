import * as React from 'react';
import { withJsonFormsControlProps } from '@jsonforms/react';
import VisibilityReport  from './VisibilityReport';



const VisibilityReportControl = ( props ) => 
(
 <VisibilityReport
    {...props}

  />
);

export default withJsonFormsControlProps(VisibilityReportControl);