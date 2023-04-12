/**
 * Nembus Projects Page
 * B2C
 * Nirmalya Saha
*/
/* eslint-disable */
import React, { Component } from 'react';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { Progress } from 'reactstrap';
import {
   Dialog,
   DialogTitle,
   DialogContent,
   DialogActions,
 } from "@material-ui/core";
 import { NotificationManager } from "react-notifications";
 import { connect } from "react-redux";
 import { Link } from "react-router-dom";
 import * as firebase from 'firebase';

// rct card box
import { RctCard, RctCardContent } from 'Components/RctCard';

// rct collapsible card
import RctCollapsibleCard from 'Components/RctCollapsibleCard/RctCollapsibleCard';
import RctSectionLoader from 'Components/RctSectionLoader/RctSectionLoader';

// widgets data
// import { projectData } from './data';

// helpers
import { getAppLayout } from "Helpers/helpers";

//component
import ProjectListing from './component/ProjectListing';

//firebase api
import NembusProjectAdapter from '../../../adapterServices/NembusProjectAdapter';
import { element } from 'prop-types';

class Home extends Component {
   state = {
      gridlayout: true,
      isDialogOpened: false,
      title: '',
      description: '',
      titleError: false,
      descriptionError: false,
      search: '',
      projectData: [],
      searchedProjectData: [],
      load: false
   };

   componentDidMount() {
      this.getAllProjects();
   }

   getAllProjects = async () => {
      this.setState({ load: true });
      const user = firebase.auth().currentUser;
      const projects = await NembusProjectAdapter.getAllProjectsAdapter(user.uid);
      this.setState({ projectData: projects.projects, searchedProjectData: projects.projects });
      this.setState({ load: false });
   }

   onSearchChange = (event) => {
      this.setState({ search: event.target.value });
      const search = event.target.value
      if(search === '') {
         this.setState({ searchedProjectData: this.state.projectData });
      } else {
         const filtered = this.state.projectData.filter(element => {
            return element.title.substring(0,search.length).toLowerCase() === search.toLowerCase();
         });
         this.setState({ searchedProjectData: filtered });
      }
   }

   onSearch = () => {
      if(this.state.search === '') {
         this.setState({ searchedProjectData: this.state.projectData });
      } else {
         const filtered = this.state.projectData.filter(element => {
            return element.title.substring(0,this.state.search.length).toLowerCase() === this.state.search.toLowerCase();
         });
         this.setState({ searchedProjectData: filtered });
      }
   }

   // show grid layout
   listLayout = () => {
      this.setState({ gridlayout: false });
   };

   // show list layout
   gridLayout = () => {
      this.setState({ gridlayout: true });
   };

   handleDialogOpen = () => {
      this.setState({ isDialogOpened: true, title: '', description: '', titleError: false, descriptionError: false });
    }

   handleDialogClose = () => {
      this.setState({ isDialogOpened: false });
      this.setState({ title: '', description: '', titleError: false, descriptionError: false });
    }

    onTitleChange = (event) => {
      this.setState({ title: event.target.value });
    }

    onDescriptionChange = (event) => {
      this.setState({ description: event.target.value });
    }

    onSubmit = async () => {
      this.setState({ load: true });
      if(this.state.title !== '' && this.state.description !== '') {
         const user = firebase.auth().currentUser;
         const data = {
            title: this.state.title,
            description: this.state.description,
            userId: user.uid,
            createdBy: this.props.userprofile.FirstName,
            companyName: this.props.userprofile.CompanyName
         }         

         const result = await NembusProjectAdapter.createProjectAdapter(data);
         if(result === true) {
            this.getAllProjects();
         }
         this.setState({ title: '', description: '', load: false, titleError: false, descriptionError: false });
         this.setState({ isDialogOpened: false });
      } else {
         if(this.state.title === '') {
            this.setState({ titleError: true });
         }
         if(this.state.description === '') {
            this.setState({ descriptionError: true });
         }
         this.setState({ load: false });
         NotificationManager.error("Please provide required details.");
      }
    }

    onProjectDelete = async (projectId) => {
      this.setState({ load: true });
      const result = await NembusProjectAdapter.deleteProjectAdapter(projectId);
      if(result === true) {
         this.getAllProjects();
      }
      this.setState({ load: false });
    }
 
   render() {

      return (  
         <React.Fragment>
            {this.state.load && <RctSectionLoader />}  
            <div className="projects-wrapper">
               
               <div className="search-bar-wrap">
                  <RctCard >
                     <RctCardContent>
                        <div className="row">
                           <div className="col-sm-12 col-md-3 col-lg-3 align-items-center mb-10 mb-sm-0">
                              <h2 className="mb-0 text-capitalize">search</h2>
                           </div>
                           <div className="col-sm-12 col-md-9 col-lg-9">
                              <div className="d-sm-flex">
                                 <div className="search-bar">
                                    <TextField
                                       id="standard-with-placeholder"
                                       placeholder="Search Projects"
                                       value={this.state.search}
                                       onChange={this.onSearchChange}
                                    />
                                    <Button onClick={this.onSearch} variant="contained" color="primary" className="mx-sm-15">
                                       Search
                                    </Button>
                                 </div>
                                 <div className="add-project-wrap">
                                    <Button onClick={this.handleDialogOpen} variant="contained" color="primary">
                                       Add
                                       <i className="material-icons pl-10">add</i>
                                    </Button>
                                 </div>
                              </div>
                           </div>
                        </div>
                     </RctCardContent>
                  </RctCard>
               </div>
               <div>
                  <div className="d-flex justify-content-between align-items-center mt-15 mb-30">
                     <h2 className="text-capitalize mb-0">
                        {this.state.gridlayout === true ?
                           'project grid'
                           :
                           'project list'
                        }
                     </h2>
                  </div>
                  {this.state.gridlayout && this.state.gridlayout === true ?
                     <div className="row">
                        {this.state.searchedProjectData.map((dataItem, index) => {
                           console.log("dataItem", dataItem);
                           return (
                              <RctCollapsibleCard
                                 key={index}
                                 customClasses="rct-block"
                                 colClasses="col-sm-12 col-md-6 col-lg-4 w-xs-full"
                                 heading={
                                    <Link to={`/app/project-detail/${dataItem.id}`}>
                                       {dataItem.title}
                                    </Link>
                                 }                                 
                                 collapsible
                                 closeable
                                 fullBlock
                                 projectId={dataItem.id}
                                 onDelete={this.onProjectDelete}
                              >
                                 <RctCardContent>
                                    <div className="desc-wrap">
                                       <h5>Description :</h5>
                                       <p>{dataItem.description}</p>
                                    </div>
                                    {/* {dataItem.team_image && dataItem.team_image !== null ?
                                       <div className="project-team mb-15">
                                          <h5 className="mb-15">Team Members : </h5>
                                          <div className="team-img-wrap">
                                             {dataItem.team_image.map((image, index) => {
                                                return (
                                                   <img
                                                      key={index}
                                                      src={require(`Assets/avatars/${image}`)}
                                                      alt="team"
                                                      className="mr-2"
                                                      width="30"
                                                      height="30"
                                                   />
                                                )
                                             })}
                                          </div>
                                       </div>
                                       :
                                       null
                                    } */}
                                    {/* <div className="deadline-info mrgn-b-md">
                                       <h5>Created On : </h5>
                                       {dataItem.createdOn && <p>{dataItem.createdOn}</p>}
                                    </div> */}
                                    <div className="progress-wrap mb-15">
                                       <div className="">
                                          <h4 className="mb-0">Owner :</h4>
                                          <p><span className="text-primary">{dataItem.createdBy}</span></p>
                                       </div>
                                       {/* <Progress color="primary" className="my-15 progress-xs" value={dataItem.progress} /> */}
                                    </div>
                                    <div className="text-right">
                                       <Link to={`/app/project-detail/${dataItem.id}`} className="text-primary text-capitalize fs-14">
                                          Details
                                       </Link>
                                    </div>
                                 </RctCardContent>
                              </RctCollapsibleCard>
                           )
                        })}
                     </div>
                     :
                     <div className="row">
                        <div className="col-sm-12 col-md-12 col-lg-12">
                           <ProjectListing data={this.state.searchedProjectData} />
                        </div>
                     </div>
                  }
               </div>

               <React.Fragment>
                  <Dialog
                  fullWidth={true}
                  maxWidth={"sm"}
                  open={this.state.isDialogOpened}
                  onClose={this.handleDialogClose}
                  aria-labelledby="max-width-dialog-title"
               >
                  <DialogTitle id="max-width-dialog-title">
                     Add Project
                  </DialogTitle>
                  <DialogContent>
                     {
                        this.state.title === '' && this.state.titleError === true ? (
                        <TextField
                           style={{ marginBottom: "10px" }}
                           error
                           helperText = "Please enter project title"
                           fullWidth
                           id="name"
                           name="title"
                           label="Project Title"
                           variant="outlined"
                           value={this.state.title}
                           onChange={this.onTitleChange}
                           />
                     ) : (
                        <TextField
                           style={{ marginBottom: "10px" }}
                           fullWidth
                           id="name"
                           name="title"
                           label="Project Title"
                           variant="outlined"
                           value={this.state.title}
                           onChange={this.onTitleChange}
                           />
                     )
                     }

                     {
                        this.state.description === '' && this.state.descriptionError === true ? (
                        <TextField
                           error
                           helperText = "Please enter project description"
                           fullWidth
                           id="desc"
                           name="description"
                           label="Project Description"
                           variant="outlined"
                           value={this.state.description}
                           onChange={this.onDescriptionChange}
                           />
                     ) : (
                        <TextField
                           fullWidth
                           id="desc"
                           name="description"
                           label="Project Description"
                           variant="outlined"
                           value={this.state.description}
                           onChange={this.onDescriptionChange}
                           />
                     )
                     }
                           
                     <div className="d-flex flex-end justify-content-end align-items-center">
                           <Button
                              color="primary"
                              variant="contained"
                              className="mt-3 mb-3"
                              onClick={this.onSubmit}
                           >
                              Add
                           </Button>            
                     <Button
                        onClick={this.handleDialogClose}
                        variant="contained"
                        className="m-3 btn btn-danger"
                        autoFocus
                     >
                        Cancel
                     </Button>
                     </div> 
                  </DialogContent>
                  <DialogActions></DialogActions>
               </Dialog>
               </React.Fragment>
            </div>
         </React.Fragment> 
      );
   }
}

const mapStateToProps = (state) => {
   return {
      userprofile: state.firebase.profile,
   };
 };
 
 const mapDispatchToProps = {
   
 };

export default connect(mapStateToProps, mapDispatchToProps)(Home);