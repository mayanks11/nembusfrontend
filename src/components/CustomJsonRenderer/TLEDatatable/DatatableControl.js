import * as React from 'react';
import { withJsonFormsControlProps } from '@jsonforms/react';
import Datatable  from './Datatable';



const DatatableControl = ( props ) => 
(
 <Datatable
    {...props}

  />
);

export default withJsonFormsControlProps(DatatableControl);