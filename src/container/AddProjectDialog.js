/**
 * Form Dialog
 */
import React from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import { fireStore, auth } from '../firebase';
import { connect } from 'react-redux';
import { loadingSpinner } from '../actions/AddingProjectDialog';

import Spinner from '../components/Spinner/Spinner.component';
import { toUTCDateString } from '../util/formateTime';

const options = [
	{ value: 'Active', label: 'Active' },
	{ value: 'InActive', label: 'InActive' },
	{ value: 'Completed', label: 'Completed' }
]
import { NotificationManager } from 'react-notifications';
//import { Redirect } from 'react-router-dom'

import { Route, withRouter, Redirect } from 'react-router-dom';


class AddProjectDialog extends React.Component {
	constructor(props) {
		super(props)
	}

	state = {
		open: false,
		uniqueNameChecker: false,
		userName: "",
		userId: "",
		loading: false,
		companyName: '',
		projectData: {
			title: '',
			desc: '',
			sdate: '',
			edate: '',
			status: 'Active'
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

		const state1 = this.state.projectData
		var n1 = e.target.name;
		state1[n1] = e.target.value;
		this.setState({ projectData: state1 });
		//alert( this.state.projectData.title ); 
	};




	formSubmit = event => {
		// alert('gg')
		//alert( this.state.projectData.title ); 
		//alert( this.state.projectData.desc ); 
		event.preventDefault();
		console.log('props: ', this.props.isLoading)
		const { loadingSpinner } = this.props;
		loadingSpinner();
		var sdate = this.state.projectData.sdate;
		var edate = this.state.projectData.edate;		
		if (sdate > edate) {
			NotificationManager.error(`Please entre a valid dates`);
			loadingSpinner();
			return;
		} else {
			// isLoading = true;
			this.fetchingCompanyNameAndUserData();
		}
	};

	fetchingCompanyNameAndUserData = async () => {
		const userRef = fireStore.collection('users');
		const userData = await userRef.where("Email", "==", auth.currentUser.email).get();
		userData.forEach(doc => {
			const cashedFirstName = doc.data().FirstName;
			const cashedLastName = doc.data().LastName;
			const fullName = cashedFirstName + ' ' + cashedLastName;
			return this.setState({
				companyName: doc.data().CompanyName,
				userName: fullName,
			}, () => {
				this.checkUniqueName();
			});
		})
	};

	checkUniqueName = async () => {
		const projectName = this.state.projectData.title;
		const { loadingSpinner } = this.props;
		const companyName = this.state.companyName;
		const projectRef = fireStore.collection('PROJECT')
		const projectData = await projectRef.where("ProjectName", "==", projectName).get();
		console.log('projectData: ', projectData);
		if (!projectData.empty) {
			loadingSpinner();
			NotificationManager.error('this project already exists');
			
		} else {
			this.creatingProject();
		}

	}

	createingDefulatStackHolder = async (projectID) => {
		console.log('creating a default Stackholder');
		let response = await fireStore.collection("StackHolder").add(
			{
				Name: this.state.userName,
				Email: auth.currentUser.email,
				Role: 'Admin',
				Permission: 'Edit',
				ProjectID: projectID,
				CBy: auth.currentUser.email,
				CDate: toUTCDateString(new Date()),
				LMBy: auth.currentUser.email,
				LMDate: toUTCDateString(new Date())
			});
		let doc = await fireStore.collection("StackHolder").doc(response.id).get()

		console.log('response: ', doc.data());
		if (response) {
			this.insert(projectID);
		}
	};

	creatingProject = async () => {
		var ptitle = this.state.projectData.title;
		var pdesc = this.state.projectData.desc;
		var sdate = this.state.projectData.sdate;
		var edate = this.state.projectData.edate;
		var status = this.state.projectData.status;
		var companyName = this.state.companyName;
		let response = await fireStore.collection("PROJECT").add(
			{
				ProjectName: ptitle,
				CompanyName: companyName,
				ProjectDescription: pdesc,
				startDate: sdate,
				EndDate: edate,
				Status: status,
				CreatedBy: auth.currentUser.email,
				CreatedDate: toUTCDateString(new Date()),
				LastModifiedBy: auth.currentUser.email,
				LastModifiedDate: toUTCDateString(new Date()),
				UserDocId: auth.currentUser.uid
			});

		let docRef = await fireStore.collection("PROJECT").doc(response.id).get();
		console.log('docREf: ', docRef.id);
		this.createingDefulatStackHolder(docRef.id);
	};

	insert(docRefId) {
		this.props.loadingSpinner();
		this.handleClose();

		//alert(doc.id)
		var d1 = docRefId;
		this.props.history.push('/app/dashboard/addproject/' + d1);

		//this.handleClose;
		NotificationManager.success('Project Created Successfully!');

	}



	render() {
		// const { title, description, author } = this.state1;
		const {isLoading} = this.props;
		return (
			<div>
			{
				isLoading ? <Spinner /> : 
					<div style={{
						width: "200px",
						paddingBottom: "27px"
					}} >
						<Button variant="contained" className="btn-info text-white btn-block" onClick={this.handleClickOpen}>Add Project</Button>
						<Dialog open={this.state.open} onClose={this.handleClose} aria-labelledby="form-dialog-title" >
							<DialogTitle id="form-dialog-title">New Project</DialogTitle>

							<form onSubmit={this.formSubmit}>
								<DialogContent style={{
									height: "300px"
								}}>

									<TextField onChange={this.Change1} required autoFocus margin="dense" name="title" id="title" label="Project Name" type="text" fullWidth />

									<TextField onChange={this.Change1} required autoFocus margin="dense" name="desc" id="desc" label="Project Description" type="text" fullWidth />

									<TextField onChange={this.Change1} required autoFocus margin="dense" id="sdate" name="sdate" label="Start Date" type="date"
										InputLabelProps={{
											shrink: true,
										}}
										style={{
											marginRight: "50px"
										}}
									/>

									<TextField onChange={this.Change1} required autoFocus margin="dense" id="edate" name="edate" label="End Date" type="date" InputLabelProps={{
										shrink: true,
									}} />

									<select required autoFocus margin="dense" name="status" id="status" label="Status" onChange={this.Change1} style={{
										marginTop: "16px",
										display: "block"
									}}>
										<option selected="selected" value="">Select Status</option>
										<option value="Active">Active</option>
										<option value="InActive">InActive</option>
										<option value="Completed">Completed</option>
									</select>




								</DialogContent>
								<DialogActions>
									<Button variant="contained" onClick={this.handleClose} color="primary" className="text-white">
										Cancel
            		</Button>
									<Button variant="contained" type="submit" className="btn-info text-white">
										Submit
            		</Button>


								</DialogActions>

							</form>
						</Dialog>
					</div>

			}
			</div>
			





		);

	}
};

	const mapStateToProps = state => ({
		isLoading: state.isLoading.isLoading
	});
	const mapDispatchToProps = dispatch => ({
		loadingSpinner: () => dispatch(loadingSpinner())
	  });

	

	export default withRouter(connect(mapStateToProps, mapDispatchToProps)(AddProjectDialog))