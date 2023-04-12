import * as React from 'react';
import { withJsonFormsControlProps } from '@jsonforms/react';
import  Matrix  from './Matrix';



const MatrixControl = ( props ) => 
(
 <Matrix
    {...props}

  />
);

export default withJsonFormsControlProps(MatrixControl);