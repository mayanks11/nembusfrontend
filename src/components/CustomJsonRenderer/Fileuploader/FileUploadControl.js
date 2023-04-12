import * as React from 'react';
import { withJsonFormsControlProps } from '@jsonforms/react';
import FileUploader  from './FileUpload';



const FileUploadControl = ( props ) => (

 <FileUploader
    {...props}

  />
);

export default withJsonFormsControlProps(FileUploadControl);