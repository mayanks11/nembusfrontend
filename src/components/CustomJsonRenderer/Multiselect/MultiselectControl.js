import * as React from 'react';
import { withJsonFormsControlProps } from '@jsonforms/react';
import Multiselect  from './Multiselect';



const MultiselectControl = ( props ) => 
(
 <Multiselect
    {...props}

  />
);

export default withJsonFormsControlProps(MultiselectControl);