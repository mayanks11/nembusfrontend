import * as React from 'react';
import { withJsonFormsControlProps } from '@jsonforms/react';
import  Matrix  from './MatrixDisable';



const MatrixDisableControl = ( props ) => 
(
 <Matrix
    {...props}

  />
);

export default withJsonFormsControlProps(MatrixDisableControl);