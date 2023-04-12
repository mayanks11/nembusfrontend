/**
 * Form Dialog
 */
import React from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { fireStore, auth } from '../firebase';

import MenuItem from '@material-ui/core/MenuItem';
import Select from 'react-select';
import { toUTCDateString } from '../util/formateTime'

import ReactSelect from 'react-select';

 const options = [
	  { value: 'Active', label: 'Active' },
	  { value: 'InActive', label: 'InActive' },
	  { value: 'Completed', label: 'Completed' }
	]
import { NotificationManager } from 'react-notifications'; 
//import { Redirect } from 'react-router-dom'

import { Route, withRouter, Redirect } from 'react-router-dom';


class AddStackHolderDialog extends React.Component {  
  
   constructor(props) 
   {
		super(props)
		//alert( this.state.docID )		
   }
   
   state = {
      open: false,
	  formData: {
					  Name: '',
					  Email: '',
					  Role: '',					  
					  Permission: 'Active'
				   }
   };

   handleClickOpen = () => {
      this.setState({ open: true });
   };

   handleClose = () => {
      this.setState({ open: false });
   };
   
   Change1 = (e) => {
	   //alert('hhh' + e.target.name );	  
		   
	   const state1 = this.state.formData
	   var n1 = e.target.name;
	   state1[n1] = e.target.value;
	   this.setState( { formData: state1  } );
	   //alert( this.state.formData.title ); 
   }; 

   
    formSubmit = event => {
    // alert('gg')
	//alert( this.state.formData.title ); 
	//alert( this.state.formData.desc ); 
    event.preventDefault();
	
	this.insert();

	

  };
  
  async insert() {
  //async function foo() {
	var Name = this.state.formData.Name;
	var Email = this.state.formData.Email;
	var Role = this.state.formData.Role;	
	var Permission = this.state.formData.Permission;
	
	var userID = localStorage.getItem('user_id');
	var ProjectID = localStorage.getItem("project_id");
	
	//alert(status)
	/*
				ProjectName: $.trim(data.ProjectName),
                ProjectDescription: data.ProjectDescription,
                UserDocId: auth.currentUser.uid,
                CreatedDate: toUTCDateString(new Date()),
                LastModifiedDate: toUTCDateString(new Date())
				*/
	
	
	 try {
            let response = await fireStore.collection("StackHolder").add(
			{                
				Name: Name,
				Email: Email,
				Role: Role,
				Permission: Permission,				
				ProjectID: ProjectID,
				CBy: userID,
				CDate: toUTCDateString(new Date()),
				LMBy: userID,
				LMDate: toUTCDateString(new Date())
            })
			
            let doc = await fireStore.collection("StackHolder").doc(response.id).get()
			
			this.handleClose();	
			
			//alert(doc.id)
			//var d1 = doc.id;			
			//this.props.history.push('/app/addproject/'+ ProjectID);	
			
			
			//this.handleClose;
			NotificationManager.success('Stack Holder Added Successfully!');
			//props.history.push('/app/addproject');
			window.location.reload();
			
            /*return {
                id: doc.id,
                ...doc.data()
            };*/
        } 
		catch (error) {
            //console.log('error: ', error);
			alert('error: ', error)
        }
 
  
  }
 


   render() {
   // const { title, description, author } = this.state1;
      return (
         <div style={{
				  width: "200px",
				  paddingBottom: "27px"
                }} >
            <Button variant="contained" className="btn-info text-white btn-block" onClick={this.handleClickOpen}>Add Stack Holder</Button>
            <Dialog open={this.state.open} onClose={this.handleClose} aria-labelledby="form-dialog-title" >
               <DialogTitle id="form-dialog-title">New Stack Holder</DialogTitle>

 <form onSubmit={this.formSubmit}>			   
			  <DialogContent style={{
				  height: "300px"
                }}>
				                 
                  <TextField onChange={this.Change1}  required autoFocus margin="dense" name="Name" id="Name" label="Name" type="text" fullWidth />				  			   
				  
				  <TextField  onChange={this.Change1}  required autoFocus margin="dense" name="Email" id="Email" label="Email" type="email" fullWidth />
				  
				  <TextField  onChange={this.Change1}  required autoFocus margin="dense" name="Role" id="Role" label="Role" type="text" fullWidth />
				 
				  <select required autoFocus margin="dense" name="Permission" id="Permission" label="Permission" onChange={this.Change1} style={{				  
				  marginTop: "16px",
				  display:"block"
                }}>
					   <option selected="selected" value="">Select Permission</option>
					   <option value="Read">Read</option>
					   <option  value="Edit">Edit</option>					   
				  </select>	  
               </DialogContent>
               <DialogActions>
                  <Button variant="contained" onClick={this.handleClose} color="primary" className="text-white">
                     Cancel
            		</Button>
                  <Button variant="contained" type="submit"  className="btn-info text-white">
                     Submit
            		</Button>
					
					
               </DialogActions>
			   
			    </form>
            </Dialog>
         </div>
      );
   }
}

export default withRouter(AddStackHolderDialog);