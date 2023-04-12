import { auth, fireStore } from "../firebase";
import { NotificationManager } from "react-notifications";
import {
  PROJECTS__SET_PROJECTS,
  PROJECTS__STOP_PROJECTS_LOADING,
  PROJECTS__START_PROJECTS_LOADING,
  GET_PROJECT_BY_ID,
  WAIT_WHILE_LOADING,
  IS_ELIGIBLE_CREATE_NEW_MISSION,
  IS_MISSION_CREATION_SUCESSFUL
} from "Actions/types";
import {
  PROJECTS__SET_IS_FORM_OPEN,
  PROJECTS__SET_FORM_TYPE,
  PROJECTS__SET_EDIT_FORM_DATA,
  PROJECTS__SET_IS_DELETE_DIALOG_OPEN,
  PROJECTS__ENABLE_DELETE_DIALOG,
  PROJECTS__DISABLE_DELETE_DIALOG,
} from "./types";
import history from "../helpers/history";
import { getProjectDetails } from "./ProjectDetailsActions";
import moment from "moment";

import shortid from "shortid";

export function getProjects() {
  return async (dispatch, getState) => {
    dispatch({ type: PROJECTS__START_PROJECTS_LOADING });
    try {
      const projectRef = fireStore.collection("PROJECT");
      const response = await projectRef
        .where("IsDelete", "==", false)
        .where(`StackholderList.${auth.currentUser.uid}`, "in", [
          "admin",
          "edit",
          "read",
        ])
        .get();

      let projects = [];
      let projectName = [];
      response.docs.forEach((value) => {
        projects.push({
          uid: value.id,
          CreateByOn: value.data().CreatedBy,
          LastModified: value.data().LastModifiedBy,
          ...value.data(),
          ProjectName: {
            ProjectName: value.data().ProjectName,
            data: value.data(),
            uid: value.id,
          },
          "": value,
        });
        projectName.push(value.data().ProjectName);
      });

      // Sort projects by LastModifiedOn
      projects = projects.sort(
        (a, b) => b.LastModifiedOn.seconds - a.LastModifiedOn.seconds
      );

      dispatch({
        type: PROJECTS__SET_PROJECTS,
        data: projects,
        projectName: projectName,
      });
    } catch (err) {
      NotificationManager.error("Error occurred while fetching projects.");
    }
    dispatch({ type: PROJECTS__STOP_PROJECTS_LOADING });
  };
}

export function isProjectExistAcrossCompany({ missionName }) 
{
  return async (dispatch, getState) => {
    try {
      console.log("missionName", missionName);

      dispatch({ type: WAIT_WHILE_LOADING, data: true });
      // Get user data
      const userInfo = await fireStore
        .collection("users")
        .doc(auth.currentUser.uid)
        .get();
      const userData = userInfo.data();

      // Check if project with same name exist
      const doc = await fireStore
        .collection("PROJECT")
        .where("ProjectName", "==", missionName)
        .where("CompanyName", "==", userData.CompanyName)
        .where("IsDelete", "==", false)
        .get();
      if (!doc.empty) {
        NotificationManager.error("Project with same name already exist.");

        dispatch({
          type: IS_ELIGIBLE_CREATE_NEW_MISSION,
          data: { result: false, error: true, isLoading: false },
        });
        dispatch({ type: WAIT_WHILE_LOADING, data: false });
        return;
      }
      NotificationManager.info("Project avilable .");
      dispatch({
        type: IS_ELIGIBLE_CREATE_NEW_MISSION,
        data: { result: true, error: false, isLoading: false },
      });
      dispatch({ type: WAIT_WHILE_LOADING, data: false });
    } catch (error) {
      console.error(error);
    }
  };
}

export function addMissionIfEligible({uid, missionName,Description,companyname,userData,Objective })
{
  return async (dispatch, getState) => {
    try {
      dispatch({ type: WAIT_WHILE_LOADING, data: true });

      
      const endDate = moment().add(1, "year").format("YYYY-MM-DD");
      const startDate = moment().format("YYYY-MM-DD")
      console.log("moment().format ===>>>", moment(startDate).utc().toDate())
      console.log("moment().format ===>>>", moment(endDate).utc().toDate())
      console.log("companyname>>>", companyname)
      console.log("Description , uis>>>", Description,uid,Objective)
     
      const doc = await fireStore
        .collection("PROJECT")
        .where("ProjectName", "==", missionName)
        .where("CompanyName", "==", companyname)
        .where("IsDelete", "==", false)
        .get();

        const values = {
          "ProjectName": missionName,
          "EndDate":  moment(startDate).utc().toDate(),
          "StartDate": moment(startDate).utc().toDate(),
          "Description": Description,
          "Objective": Objective
      };

        if (!doc.empty) {
          NotificationManager.error("Project with same name already exist.");
          dispatch({
            type: IS_ELIGIBLE_CREATE_NEW_MISSION,
            data: { result: false, error: true, isLoading: false },
          });
          dispatch({ type: IS_MISSION_CREATION_SUCESSFUL, data: false });
          dispatch({ type: WAIT_WHILE_LOADING, data: false });

          return;
        }else{

          console.log("=====================================")
          // CompanyName + ProjectName is unique
      const project = {
        ...values,
        CompanyName: companyname,
        CreatedBy: userData.Email,
        CreatedOn: new Date(),
        StackholderList: {
          [auth.currentUser.uid]: "admin",
        },
        UserDocumentID: auth.currentUser.uid,
        Role: "owner",
        IsDelete: false,
        LastModifiedBy: userData.Email,
        LastModifiedOn: new Date(),
        RequirmentGraphid:""
      };

      const stakeholder = {
        UserDocumentID: auth.currentUser.uid,
        Email: userData.Email,
        Role: "owner",
        Permission: "admin",
        CreatedBy: userData.Email,
        CreatedOn: new Date(),
        LastModifiedBy: userData.Email,
        LastModifiedOn: new Date(),
        ProjectName: values.ProjectName,
        Name: userData.FirstName + " " + userData.LastName,
        IsDelete: false,
      };

      let workPackage = {
        Name: values.ProjectName,
        ParentNode: { ID: "", Name: "Null" },
        StartDate: values.StartDate,
        EndDate: values.EndDate,
        RequirementType: "Objective",
        MissionObjective: values.Description,
        Description: values.Description, //Fixme Delete it
        CreatedBy: userData.Email,
        CreatedOn: new Date(),
        Ancestors: [],
        createdAt: new Date(),
        updatedAt: new Date(),
        parentStartDate: "",
        parentEndDate: "",
        IsDelete: false,
        LastModifiedBy: userData.Email,
        LastModifiedOn: new Date(),
      };

      let projectRef;
      await fireStore.runTransaction(async (transaction) => {
        // Add the project
        projectRef = fireStore.collection("PROJECT").doc();
        const projectdId = projectRef.id;

        const workPackageRef = fireStore.collection("WorkPackage").doc();
        const workPackageId = workPackageRef.id;

       

        const systemactionref = fireStore.collection("WorkPackage").doc();
        const systemactionref_id = systemactionref.id;
        const requirementGraph = [
          {
            id: workPackageId,
            type: "missionNode",
            data: { 
                    
                    "requirementid":workPackageId,
                    "blockinfo":{
                      "level":0,
                      "parentlevel":-1,
                      "blockname":"mission",
                      "label":"Mission"
                    },
                     missionName: values.ProjectName,
                     missionDescription: values.Description,
                    "button":{
                        "add":{
                          'enable':true
                        },
                        "view":{
                          'enable':true
                        },
                        "battery":{
                          'level':0,
                          'enable':true
                        }
                    }
                    },
            targetPosition:"top",
            sourcePosition:"bottom",
            position: { },
          }
        ];

        await transaction.set(projectRef, project);

        // This field will connect stakeholder to PROJECT collection
        stakeholder.ProjectDocumentID = projectRef.id;

        // Add stakeholder
        const docRef = fireStore.collection("StakeHolder").doc();
        await transaction.set(docRef, stakeholder);

        workPackage = {
          ...workPackage,
          ProjectDocumentID: projectdId,
          WorkPackageId: workPackageId,
        };

        
        await transaction.set(workPackageRef, workPackage);

        const requirmentGraphref = fireStore
          .collection("PROJECT")
          .doc(projectdId)
          .collection("RequirementGraph")
          .doc();


        const updatemission_ref= fireStore
        .collection("PROJECT")
        .doc(projectdId)
       
        let rgraph = {"reguirementgraph":JSON.stringify(requirementGraph,null,2)
      
                      }
        console.log("graph",rgraph)
        await transaction.set(requirmentGraphref,rgraph)
        await transaction.update(updatemission_ref,{RequirmentGraphid:requirmentGraphref.id})
        console.log("graph2",rgraph)


      });
        }

        dispatch({ type: WAIT_WHILE_LOADING, data: false });

        dispatch({ type: IS_MISSION_CREATION_SUCESSFUL, data: true });
      
    } 
    catch (error) {

      NotificationManager.error("Error While Creating Mission ");
      dispatch({ type: IS_MISSION_CREATION_SUCESSFUL, data: false });
      console.error(error);
      dispatch({ type: WAIT_WHILE_LOADING, data: false });

    }
  };

} 

export function resetisEligible(value) {
  return async (dispatch, getState) => {
    try {
      console.log(value);
      dispatch({ type: IS_ELIGIBLE_CREATE_NEW_MISSION, data: {} });
    } catch (error) {
      console.error(error);
    }
  };
}

export function addProject(values) {
  return async (dispatch, getState) => {
    try {
      // Get user data
      const userInfo = await fireStore
        .collection("users")
        .doc(auth.currentUser.uid)
        .get();
      const userData = userInfo.data();

      console.log("valuesvaluesvaluesvalues",values)

      // CompanyName + ProjectName is unique
      const project = {
        ...values,
        CompanyName: userData.CompanyName,
        CreatedBy: userData.Email,
        CreatedOn: new Date(),
        StackholderList: {
          [auth.currentUser.uid]: "admin",
        },
        UserDocumentID: auth.currentUser.uid,
        Role: "owner",
        IsDelete: false,
        LastModifiedBy: userData.Email,
        LastModifiedOn: new Date(),
        RequirmentGraphid:""
      };

      const stakeholder = {
        UserDocumentID: auth.currentUser.uid,
        Email: userData.Email,
        Role: "owner",
        Permission: "admin",
        CreatedBy: userData.Email,
        CreatedOn: new Date(),
        LastModifiedBy: userData.Email,
        LastModifiedOn: new Date(),
        ProjectName: values.ProjectName,
        Name: userData.FirstName + " " + userData.LastName,
        IsDelete: false,
      };

      let workPackage = {
        Name: values.ProjectName,
        ParentNode: { ID: "", Name: "Null" },
        StartDate: values.StartDate,
        EndDate: values.EndDate,
        RequirementType: "Objective",
        MissionObjective: values.Description,
        Description: values.Description, //Fixme Delete it
        CreatedBy: userData.Email,
        CreatedOn: new Date(),
        Ancestors: [],
        createdAt: new Date(),
        updatedAt: new Date(),
        parentStartDate: "",
        parentEndDate: "",
        IsDelete: false,
        LastModifiedBy: userData.Email,
        LastModifiedOn: new Date(),
      };

      let projectRef;
      await fireStore.runTransaction(async (transaction) => {
        // Add the project
        projectRef = fireStore.collection("PROJECT").doc();
        const projectdId = projectRef.id;

        const workPackageRef = fireStore.collection("WorkPackage").doc();
        const workPackageId = workPackageRef.id;

       

        const systemactionref = fireStore.collection("WorkPackage").doc();
        const systemactionref_id = systemactionref.id;
        const requirementGraph = [
          {
            id: workPackageId,
            type: "missionNode",
            data: { 
                    
                    "requirementid":workPackageId,
                    "blockinfo":{
                      "level":0,
                      "parentlevel":-1,
                      "blockname":"mission",
                      "label":"Mission"
                    },
                     missionName: values.ProjectName,
                     missionDescription: values.Description,
                    "button":{
                        "add":{
                          'enable':true
                        },
                        "view":{
                          'enable':true
                        },
                        "battery":{
                          'level':0,
                          'enable':true
                        }
                    }
                    },
            targetPosition:"top",
            sourcePosition:"bottom",
            position: { },
          }
        ];

        await transaction.set(projectRef, project);

        // This field will connect stakeholder to PROJECT collection
        stakeholder.ProjectDocumentID = projectRef.id;

        // Add stakeholder
        const docRef = fireStore.collection("StakeHolder").doc();
        await transaction.set(docRef, stakeholder);

        workPackage = {
          ...workPackage,
          ProjectDocumentID: projectdId,
          WorkPackageId: workPackageId,
        };

        
        await transaction.set(workPackageRef, workPackage);

        const requirmentGraphref = fireStore
          .collection("PROJECT")
          .doc(projectdId)
          .collection("RequirementGraph")
          .doc();


        const updatemission_ref= fireStore
        .collection("PROJECT")
        .doc(projectdId)
       
        let rgraph = {"reguirementgraph":JSON.stringify(requirementGraph,null,2)
      
                      }
        console.log("graph",rgraph)
        await transaction.set(requirmentGraphref,rgraph)
        await transaction.update(updatemission_ref,{RequirmentGraphid:requirmentGraphref.id})
        console.log("graph2",rgraph)


      });

      NotificationManager.success("New project added successfully");

      // Close the form
      dispatch(setIsFormOpen(false));

      // Reload the projects
      dispatch(getProjects());

      // Redirect to project details page
      history.push(
        `/app/systemengineering/mission?id=${projectRef.id}&tab=requirement`
      );
    } catch (err) {
      console.log("err>>", err);
      NotificationManager.error("Error occurred while adding new project.");
      // setSubmitting(false);
    }
  };
}

export function addProject_old(values, setSubmitting) {
  return async (dispatch, getState) => {
    try {
      // Get user data
      const userInfo = await fireStore
        .collection("users")
        .doc(auth.currentUser.uid)
        .get();
      const userData = userInfo.data();

      // Check if project with same name exist
      const doc = await fireStore
        .collection("PROJECT")
        .where("ProjectName", "==", values.ProjectName)
        .where("CompanyName", "==", userData.CompanyName)
        .where("IsDelete", "==", false)
        .get();
      if (!doc.empty) {
        NotificationManager.error("Project with same name already exist.");
        setSubmitting(false);
        return;
      }

      // CompanyName + ProjectName is unique
      const project = {
        ...values,
        CompanyName: userData.CompanyName,
        CreatedBy: userData.Email,
        CreatedOn: new Date(),
        StackholderList: {
          [auth.currentUser.uid]: "admin",
        },
        UserDocumentID: auth.currentUser.uid,
        Role: "owner",
        IsDelete: false,
        LastModifiedBy: userData.Email,
        LastModifiedOn: new Date(),
      };

      const stakeholder = {
        UserDocumentID: auth.currentUser.uid,
        Email: userData.Email,
        Role: "owner",
        Permission: "admin",
        CreatedBy: userData.Email,
        CreatedOn: new Date(),
        LastModifiedBy: userData.Email,
        LastModifiedOn: new Date(),
        ProjectName: values.ProjectName,
        Name: userData.FirstName + " " + userData.LastName,
        IsDelete: false,
      };

      let workPackage = {
        Name: values.ProjectName,
        ParentNode: { ID: "", Name: "Null" },
        StartDate: values.StartDate,
        EndDate: values.EndDate,
        Description: values.Description,
        CreatedBy: userData.Email,
        CreatedOn: new Date(),
        Ancestors: [],
        createdAt: new Date(),
        updatedAt: new Date(),
        parentStartDate: "",
        parentEndDate: "",
        IsDelete: false,
        LastModifiedBy: userData.Email,
        LastModifiedOn: new Date(),
      };
      let projectRef;
      await fireStore.runTransaction(async (transaction) => {
        // Add the project
        projectRef = fireStore.collection("PROJECT").doc();
        const projectdId = projectRef.id;

        const workPackageRef = fireStore.collection("WorkPackage").doc();
        const workPackageId = workPackageRef.id;

        await transaction.set(projectRef, project);

        // This field will connect stakeholder to PROJECT collection
        stakeholder.ProjectDocumentID = projectRef.id;

        // Add stakeholder
        const docRef = fireStore.collection("StakeHolder").doc();
        await transaction.set(docRef, stakeholder);

        workPackage = {
          ...workPackage,
          ProjectDocumentID: projectdId,
          WorkPackageId: workPackageId,
        };
        // add Work Package
        await transaction.set(workPackageRef, workPackage);
      });

      NotificationManager.success("New project added successfully");

      // Close the form
      dispatch(setIsFormOpen(false));

      // Reload the projects
      dispatch(getProjects());

      // Redirect to project details page
      history.push(`/app/projects/${projectRef.id}&tab=requirement`);
    } catch (err) {
      console.log("err>>", err);
      NotificationManager.error("Error occurred while adding new project.");
      setSubmitting(false);
    }
  };
}

export function deleteProject(index) {
  return async (dispatch, getState) => {
    dispatch({ type: PROJECTS__DISABLE_DELETE_DIALOG });
    try {
      const projects = getState().projects.projects;
      const uid = projects[index].uid;
      await fireStore
        .collection("PROJECT")
        .doc(uid)
        .update({
          IsDelete: true,
        });
      NotificationManager.success("Project deleted successfully.");

      // Close the delete dialog
      dispatch(setIsDeleteDialogOpen(false));

      // Reload the projects
      dispatch(getProjects());
    } catch (err) {
      NotificationManager.error("Error occurred while deleting the project.");
    }
    dispatch({ type: PROJECTS__ENABLE_DELETE_DIALOG });
  };
}

export function updateProject({ uid, values }) {
  return async (dispatch, getState) => {
    try {
      const userInfo = await fireStore
        .collection("users")
        .doc(auth.currentUser.uid)
        .get();
      const userData = userInfo.data();

      console.log("updating the name is successful", uid, values);

      await fireStore
        .collection("PROJECT")
        .doc(uid)
        .update({
          LastModifiedBy: userData.Email,
          LastModifiedOn: new Date(),
          ...values,
        });

      console.log("updating the name is successful");

      //updating Workpackage information
      let workPackageDoc = await fireStore
        .collection("WorkPackage")
        .where("ProjectDocumentID", "==", uid)
        .where("parentStartDate", "==", "")
        .where("parentEndDate", "==", "")
        .get();

      let workPackageId = "";
      workPackageDoc.forEach((doc) => {
        workPackageId = doc.data().WorkPackageId;
      });

      await fireStore
        .collection("WorkPackage")
        .doc(workPackageId)
        .update({
          StartDate: values.StartDate,
          EndDate: values.EndDate,
          Name: values.ProjectName,
          Description: values.Description,
          LastModifiedBy: userData.Email,
          LastModifiedOn: new Date(),
        });

      NotificationManager.success("Project updated successfully.");

      dispatch(setIsFormOpen(false));

      dispatch(getProjects());
    } catch (err) {
      console.log("err>>", err);
      NotificationManager.error("Error occurred while updating the project.");
    }
  };
}
export function updateProject_old(
  uid,
  values,
  setSubmitting,
  isProjectUpdateFromProjectDetails
) {
  return async (dispatch, getState) => {
    try {
      const userInfo = await fireStore
        .collection("users")
        .doc(auth.currentUser.uid)
        .get();
      const userData = userInfo.data();

      if (
        getState().projects.editFormData.ProjectName.ProjectName !=
          values.ProjectName &&
        !isProjectUpdateFromProjectDetails
      ) {
        // Check if project with same name exist
        const doc = await fireStore
          .collection("PROJECT")
          .where("ProjectName", "==", values.ProjectName)
          .where("CompanyName", "==", userData.CompanyName)
          .where("IsDelete", "==", false)
          .get();
        if (!doc.empty) {
          NotificationManager.error("Project with same name already exist.");
          setSubmitting(false);
          return;
        }
      }

      await fireStore
        .collection("PROJECT")
        .doc(uid)
        .update({
          LastModifiedBy: userData.Email,
          LastModifiedOn: new Date(),
          ...values,
        });
      let workPackageDoc = await fireStore
        .collection("WorkPackage")
        .where("ProjectDocumentID", "==", uid)
        .where("parentStartDate", "==", "")
        .where("parentEndDate", "==", "")
        .get();

      let workPackageId = "";
      workPackageDoc.forEach((doc) => {
        workPackageId = doc.data().WorkPackageId;
      });

      await fireStore
        .collection("WorkPackage")
        .doc(workPackageId)
        .update({
          StartDate: values.StartDate,
          EndDate: values.EndDate,
          Name: values.ProjectName,
          Description: values.Description,
          LastModifiedBy: userData.Email,
          LastModifiedOn: new Date(),
        });

      NotificationManager.success("Project updated successfully.");

      dispatch(setIsFormOpen(false));

      if (isProjectUpdateFromProjectDetails) {
        dispatch(getProjectDetails());
      } else {
        // Reload the projects
        dispatch(getProjects());
      }
    } catch (err) {
      console.log("err>>", err);
      NotificationManager.error("Error occurred while updating the project.");
      setSubmitting(false);
    }
  };
}
export function getProjectById(projectId) {
  console.log("projectId", projectId);
  return async (dispatch, getState) => {
    let projectRef = await fireStore
      .collection("PROJECT")
      .doc(projectId)
      .get();

    console.log("projectRef", projectRef.data());

    let data = projectRef.data();
    dispatch({ type: GET_PROJECT_BY_ID, data });
  };
}

export function setIsFormOpen(data) {
  return async (dispatch) => {
    dispatch({ type: PROJECTS__SET_IS_FORM_OPEN, data });
  };
}

export function setFormType(data) {
  return async (dispatch) => {
    dispatch({ type: PROJECTS__SET_FORM_TYPE, data });
  };
}

export function setEditFormData(data) {
  return async (dispatch) => {
    dispatch({ type: PROJECTS__SET_EDIT_FORM_DATA, data });
  };
}

export function setIsDeleteDialogOpen(data) {
  return async (dispatch) => {
    dispatch({ type: PROJECTS__SET_IS_DELETE_DIALOG_OPEN, data });
  };
}
