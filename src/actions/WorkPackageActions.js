import firebase, { auth, fireStore } from "../firebase";
import { NotificationManager } from "react-notifications";
import { setDocumentAtRef } from "../firebase/firestore";
import {
  getRequirementBlockLabel,
  getFormforGivenblock,
  getOperationReq
} from "../util/requirement";
import {
  WORK_PACKAGE__SET_IS_FORM_OPEN,
  WORK_PACKAGE__SET_FORM_TYPE,
  WORK_PACKAGE__SET_EDIT_FORM_DATA,
  WORK_PACKAGE__SET_IS_DELETE_DIALOG_OPEN,
  WORK_PACKAGE__ENABLE_DELETE_DIALOG,
  WORK_PACKAGE__DISABLE_DELETE_DIALOG,
  WORK_PACKAGE__SET_WORK_PACKAGE,
  WORK_PACKAGE__STOP_WORK_PACKAGE_LOADING,
  WORK_PACKAGE__START_WORK_PACKAGE_LOADING,
  WORK_PACKAGE__UPDATE_OPEN_VIEW_REQUIRMENT_MODAL,
  REQUIREMENTSGRAPH_OPEN_MISSION_NODE,
  WORK_PACKAGE__OPEN_VIEW_AND_EDIT_REQUIRMENT_MODAL,
  WORK_PACKAGE__OPEN_VIEW_AND_EDIT_SYSTEMTASK_MODAL,
  WORK_PACKAGE__OPEN_VIEW_AND_EDIT_SUBSYSTE_MODAL,
  WORK_PACKAGE__OPEN_VIEW_AND_EDIT_COMPONENT_MODAL,
  WORK_PACKAGE__OPEN_VIEW_AND_EDIT_COMPONENT_SUB_PARTS_MODAL,
} from "./types";
import { getProjectDetails } from "./ProjectDetailsActions";
import { getCurrentUserData } from "../helpers/helpers";
import { getTasks } from "./TaskActions";
import {
  addNodeInRequirementGraph,
  updateRequirementAddButton,
} from "./RequirementGraphAction";

import _ from "lodash";

export function getWorkPackages(loadingHandler) {
  return async (dispatch, getState) => {
    dispatch({ type: WORK_PACKAGE__START_WORK_PACKAGE_LOADING });
    try {
      const collectionRef = fireStore.collection("WorkPackage");

      const projectDetails = getState().projectDetails.details;
      let dataArray = [];
      const response = await collectionRef
        .where("ProjectDocumentID", "==", projectDetails.uid)
        .where("IsDelete", "==", false)
        .get()
        .then((workpackages) => {
          workpackages.forEach((workpackage) => {
            dataArray.push({
              requirementid: workpackage.id,
              ...workpackage.data(),
              functionalreq: [],
              operationalreq: [],
            });
          });
         
          return dataArray;
        });

      for (let i = 0; i < dataArray.length; i++) {
        const response = await collectionRef
          .doc(dataArray[i].requirementid)
          .collection("RequirementList")
          .where("isDelete", "==", false)
          .orderBy("createdOn","desc")
          .get()
          .then((doc) => {
            let functionreq = [];
            let operationalreq = [];
            doc.forEach((value) => {
              const req = value.data();

              if (req.type === "Functional") {
                functionreq.push({
                  requirementlistid: value.id,
                  ...value.data(),
                });
              } else {
                operationalreq.push({
                  requirementlistid: value.id,
                  ...value.data(),
                });
              }

              console.log("<><>doc Array ", value.data());
            });
            dataArray[i].functionalreq = [...functionreq];
            dataArray[i].operationalreq = [...operationalreq];
            console.log("doc Array functionalreq", dataArray);
          });
      }

      await dispatch({ type: WORK_PACKAGE__SET_WORK_PACKAGE, data: dataArray });
      if(loadingHandler)
      {
        loadingHandler(false)
      }
    } catch (err) {
      console.error({ err });
      NotificationManager.error("Error occurred while fetching Work Package.");
    }
    await dispatch({ type: WORK_PACKAGE__STOP_WORK_PACKAGE_LOADING });
  };
}

export function getWorkPackages_old() {
  return async (dispatch, getState) => {
    dispatch({ type: WORK_PACKAGE__START_WORK_PACKAGE_LOADING });
    try {
      const collectionRef = fireStore.collection("WorkPackage");

      const projectDetails = getState().projectDetails.details;

      const response = await collectionRef
        .where("ProjectDocumentID", "==", projectDetails.uid)
        .where("IsDelete", "==", false)
        .get();

      let dataArray = [];
      response.forEach((value) => {
        const tmp = {
          ...value.data(),
          lastModified: value.data().LastModifiedBy,
          createByOn: value.data().CreatedBy,
          uid: value.id,
        };
        dataArray.push({
          ...tmp,
          AddChild: tmp,
          "": tmp,
        });
      });

      // Sort by LastModifiedOn
      dataArray = dataArray.sort(
        (a, b) => b.LastModifiedOn.seconds - a.LastModifiedOn.seconds
      );
      let workPackageData = [];
      for (let result of dataArray) {
        let temp = { ...result };
        if (result.ParentNode.Name !== "Null") {
          let parentId = result.ParentNode.ID;
          console.log("Just check is this is problem place", parentId);
          let docRef = await fireStore
            .collection("WorkPackage")
            .doc(parentId)
            .get();
          let startDate = docRef.data().StartDate;
          let endDate = docRef.data().EndDate;
          temp.parentStartDate = startDate;
          temp.parentEndDate = endDate;

          workPackageData.push({
            ...temp,
          });
        } else {
          workPackageData.push({
            ...result,
          });
        }
      }
      dispatch({ type: WORK_PACKAGE__SET_WORK_PACKAGE, data: workPackageData });
    } catch (err) {
      console.error({ err });
      NotificationManager.error("Error occurred while fetching Work Package.");
    }
    dispatch({ type: WORK_PACKAGE__STOP_WORK_PACKAGE_LOADING });
  };
}

export function addWorkPackage(values, parentnode, setisloaded) {
  return async (dispatch, getState) => {
    try {
      const { userData } = await getCurrentUserData(dispatch, getState);
      const projectDetails = getState().projectDetails.details;
      console.log("projectDetailsprojectDetails", projectDetails);
      console.log("parent node behavior", parentnode);

      const parentLevel = _.get(parentnode, ["data", "blockinfo", "level"]);
      const parentName = _.get(parentnode, ["data", "blockinfo", "blockname"]);

      const { requirement_type } = values;

      const currentblocklabel = getRequirementBlockLabel(
        parentName,
        requirement_type
      );

      const jsonform = getFormforGivenblock(parentName, requirement_type);
      const operational = getOperationReq(parentName, requirement_type);

      console.log(
        "currentblocklabel",
        currentblocklabel,
        parentName,
        requirement_type,
        jsonform,
        operational
      );

      setisloaded(true);

      await fireStore.runTransaction(async (transaction) => {
        const WORKPACKAGE_COLLECTION_REF = fireStore.collection("WorkPackage");

        const workPackageDocRef = WORKPACKAGE_COLLECTION_REF.doc();
        const workPackageId = workPackageDocRef.id;

        console.log("workPackageId", workPackageId);

        const workPackage = {
          // Functional: null,
          // Operational: null,
          // Constraint: null,
          // Verification: null,
          FormDescription: {
            schema: jsonform.schema,
            uischema: jsonform.uischema,
          },
          Formdata: { ...jsonform.data },
          
          RequirementType: requirement_type,
          Members: null,
          WorkPackageId: workPackageId,
          ParentNode: {
            Name: "Donot have ide now ",
            ID: parentnode.id,
          },
          CreatedBy: userData.Email,
          CreatedOn: new Date(),
          LastModifiedBy: userData.Email,
          LastModifiedOn: new Date(),
          ProjectDocumentID: projectDetails.uid,
          StartDate: projectDetails.StartDate,
          EndDate: projectDetails.EndDate,
          IsDelete: false,
          MaxIndex:{
            functional:0,
            operational:0
          }
        };

        



        const xAxis = _.get(parentnode, "__rf.position.x");
        const yAxis = _.get(parentnode, "__rf.position.y");

        const newNode = {
          id: workPackageId,
          type: "commonNode",
          data1: {
            requirementid: workPackageId,
            requirement_type: requirement_type,
            display: requirement_type,
          },
          data: {
            requirementid: workPackageId,
            blockinfo: {
              level: parentLevel + 1,
              parentlevel: parentLevel,
              blockname: requirement_type,
              label: currentblocklabel,
              parentblockname: parentName,
            },
            button: {
              add: {
                enable: true,
              },
              view: {
                enable: true,
              },
              battery: {
                level: 0,
                enable: true,
              },
            },
          },
          targetPosition: "top",
          sourcePosition: "bottom",
          position: {},
        };

        const newEdge = {
          id: workPackageId + "_" + parentnode.id,
          source: parentnode.id,
          target: workPackageId,
          sourceHandle: "out",
          type: "step",
          data: { text: "custom edge" }, // Have to think what to write
          arrowHeadType: "arrowclosed",
          animated: true,
        };

        dispatch(addNodeInRequirementGraph(newNode));
        dispatch(addNodeInRequirementGraph(newEdge));
        
        if (parentName == "mission") {
          dispatch(updateRequirementAddButton(parentnode));
        }

        // addblockhandler(newNode);
        // addblockhandler(newEdge);

        const requirementGraph2 = getState().requirementGraph.requirementGraph2;

        //TODO crate Requirement collection
        await transaction.set(workPackageDocRef, workPackage);


        const requirementListRef = fireStore
        .collection("WorkPackage")
        .doc(workPackageId)
        .collection("RequirementList")
        .doc();

      for(let i =0;i<operational.length;i++){
        await transaction.set(requirementListRef, {
          ...operational[i],
          type: "Operational",
          verificationStatus: "Not-Started",
          verificationDate: null,
          verificationApprovedBy: null,
          requirementid: workPackageId,
          createdBy:userData.Email,
          createdOn:new Date(),
          LastModifiedBy: userData.Email,
          LastModifiedOn: new Date(),
          isDelete:false
        });

      }
      

        const requirmentGraphref = fireStore
          .collection("PROJECT")
          .doc(projectDetails.uid)
          .collection("RequirementGraph")
          .doc();

        const updatemission_ref = fireStore
          .collection("PROJECT")
          .doc(projectDetails.uid);

        let rgraph = {
          reguirementgraph: JSON.stringify(requirementGraph2, null, 2),
        };

        console.log("graph", rgraph);
        await transaction.set(requirmentGraphref, rgraph);
        await transaction.update(updatemission_ref, {
          RequirmentGraphid: requirmentGraphref.id,
        });
      });
      

      // dispatch({
      //   type: WORK_PACKAGE__UPDATE_OPEN_VIEW_REQUIRMENT_MODAL,
      //   data: false,
      // });
      dispatch(getWorkPackages(setisloaded));

      // setisloaded(false);

      NotificationManager.success("New Work Package added successfully");
    } catch (error) {
      console.log({ error });
      setisloaded(false);
      dispatch({
        type: WORK_PACKAGE__UPDATE_OPEN_VIEW_REQUIRMENT_MODAL,
        data: false,
      });
      NotificationManager.error("Error occurred while adding new Requirement.");
    }
  };
}

export function addWorkPackage_old2(values, parentnode, addblockhandler) {
  return async (dispatch, getState) => {
    try {
      const { userData } = await getCurrentUserData(dispatch, getState);
      const projectDetails = getState().projectDetails.details;

      console.log("values", values);
      console.log("parentnode", parentnode);
      console.log("userData", userData);
      console.log("projectDetails", projectDetails);

      const {
        functionalReq,
        operationalReq,
        constraintReq,
        formdata,
        members,
        requirement_type,
      } = values;

      const WORKPACKAGE_COLLECTION_REF = fireStore.collection("WorkPackage");

      const workPackageDocRef = WORKPACKAGE_COLLECTION_REF.doc();
      const workPackageId = workPackageDocRef.id;

      console.log("workPackageId", workPackageId);

      const workPackage = {
        Functional: functionalReq,
        Operational: operationalReq,
        Constraint: constraintReq,
        Formdata: formdata,
        RrquirmentType: requirement_type,
        Members: members,
        WorkPackageId: workPackageId,
        ParentNode: {
          Name: "Donot have ide now ",
          ID: parentnode.id,
        },
        CreatedBy: userData.Email,
        CreatedOn: new Date(),
        LastModifiedBy: userData.Email,
        LastModifiedOn: new Date(),
        ProjectDocumentID: projectDetails.uid,
        IsDelete: false,
      };

      const xAxis = _.get(parentnode, "__rf.position.x");
      const yAxis = _.get(parentnode, "__rf.position.y");

      const newNode = {
        id: workPackageId,
        type: "commonNode",
        data: {
          requirementid: workPackageId,
          requirement_type: "Segment",
          display: "Segment",
        },
        targetPosition: "top",
        sourcePosition: "bottom",
        position: { x: xAxis, y: yAxis + 125 },
      };

      const newEdge = {
        id: workPackageId + "_" + parentnode.id,
        source: parentnode.id,
        target: workPackageId,
        sourceHandle: "a",
        type: "step",
        data: { text: "custom edge" }, // Have to think what to write
        arrowHeadType: "arrowclosed",
        animated: true,
      };

      addblockhandler(newNode);
      addblockhandler(newEdge);

      console.log("workPackage", workPackage);

      await setDocumentAtRef(workPackageDocRef, workPackage);

      NotificationManager.success("New Work Package added successfully");

      // // Close the form
      // dispatch(setIsFormOpenWorkPackage(false));

      // dispatch(getWorkPackages());
    } catch (err) {
      console.error({ err });;
      NotificationManager.error("Error occurred while adding new Requirement.");
    }
  };
}

export function addWorkPackage_old(values, setSubmitting) {
  return async (dispatch, getState) => {
    try {
      const { userData } = await getCurrentUserData(dispatch, getState);
      const projectDetails = getState().projectDetails.details;

      const WORKPACKAGE_COLLECTION_REF = fireStore.collection("WorkPackage");
      const workPackageDocRef = WORKPACKAGE_COLLECTION_REF.doc();
      const workPackageId = workPackageDocRef.id;

      // Adding Ancestors which will help in 'delete' operation
      let Ancestors = [];
      if (getState().extraData.data.uid) {
        Ancestors.push(getState().extraData.data.uid);
      }
      if (getState().extraData.data.Ancestors) {
        Ancestors = Ancestors.concat(getState().extraData.data.Ancestors);
      }

      let parentNodeId = "";
      const workPackages = getState().workPackages.workPackages;
      if (getState().extraData.data.uid) {
        parentNodeId = getState().extraData.data.uid;
      } else {
        if (workPackages && workPackages.length > 0) {
          workPackages.map((element) => {
            if (
              element.Name === getState().extraData.data.Name &&
              element.ParentNode.Name === "Null"
            ) {
              parentNodeId = element.WorkPackageId;
            }
          });
        }
      }

      console.log("extraData", getState().extraData.data);

      const workPackage = {
        ...values,
        WorkPackageId: workPackageId,
        ParentNode: {
          Name: getState().extraData.data.Name,
          ID: getState().extraData.data.uid || "Null",
        },
        CreatedBy: userData.Email,
        CreatedOn: new Date(),
        LastModifiedBy: userData.Email,
        LastModifiedOn: new Date(),
        ProjectDocumentID: projectDetails.uid,
        IsDelete: false,
        Ancestors,
      };

      await setDocumentAtRef(workPackageDocRef, workPackage);
      //   await fireStore.collection('WorkPackage').add(workPackage);
      NotificationManager.success("New Work Package added successfully");

      // Close the form
      dispatch(setIsFormOpenWorkPackage(false));

      dispatch(getWorkPackages());
    } catch (err) {
      console.error({ err });;
      NotificationManager.error("Error occurred while adding new stakeholder.");
      setSubmitting(false);
    }
  };
}

export function deleteWorkPackage(index) {
  return async (dispatch, getState) => {
    dispatch({ type: WORK_PACKAGE__DISABLE_DELETE_DIALOG });
    try {
      const workPackage = getState().workPackages.workPackages[index];
      const projectDetails = getState().projectDetails.details;
      let batch = firebase.firestore().batch();

      // Check if there are childs under this work package

      const response = await fireStore
        .collection("WorkPackage")
        .where("ProjectDocumentID", "==", projectDetails.uid)
        .where("Ancestors", "array-contains", workPackage.uid)
        .where("IsDelete", "==", false)
        .get();
      if (response.size > 0) {
        NotificationManager.error(
          `WorkPackage can't be deleted as this is parent of other Work Packages.`
        );
        // Close the delete dialog
        dispatch(setIsDeleteDialogOpenWorkPackage(false));
        return true;
      }

      // Check if there is any task under this Work Package
      const docs = await fireStore
        .collection("Task")
        .where("WorkPackageID", "==", workPackage.uid)
        .where("IsDelete", "==", false)
        .get();
      if (docs.size > 0) {
        NotificationManager.error(
          `WorkPackage can't be deleted as there are task under this WorkPackage`
        );
        // Close the delete dialog
        dispatch(setIsDeleteDialogOpenWorkPackage(false));
        return true;
      }

      // Delete clicked WorkPackage
      const docRef = fireStore.collection("WorkPackage").doc(workPackage.uid);
      batch.update(docRef, {
        IsDelete: true,
      });

      await batch.commit();

      NotificationManager.success("Work Package deleted successfully.");

      // Close the delete dialog
      dispatch(setIsDeleteDialogOpenWorkPackage(false));

      // Reload the projects
      dispatch(getWorkPackages());
    } catch (err) {
      console.error({ err });;
      NotificationManager.error("Error occurred while deleting the project.");
    }
    dispatch({ type: WORK_PACKAGE__ENABLE_DELETE_DIALOG });
  };
}
export function updateWorkPackage(values, currentNode, setisloaded) {
  return async (dispatch, getState) => {
    try {
      setisloaded(true);
      const requirement_id = currentNode.id;
      const { userData } = await getCurrentUserData(dispatch, getState);
      const batch = firebase.firestore().batch();

      const requirement_type = _.get(currentNode, "data.requirement_type");

      console.log(
        "Values -------->",
        values,
        currentNode,
        currentNode.id,
        requirement_type
      );

      const docRef = fireStore.collection("WorkPackage").doc(requirement_id);

      batch.update(docRef, {
        ...values,
        LastModifiedBy: userData.Email,
        LastModifiedOn: new Date(),
      });

      // Update name in Task collection
      let response = await fireStore
        .collection("Task")
        .where("WorkPackageID", "==", requirement_id)
        .where("IsDelete", "==", false)
        .get();

      response.docs.forEach((doc) => {
        const docRef = firebase
          .firestore()
          .collection("Task")
          .doc(doc.id);
        batch.update(docRef, {
          WorkPackageName: values.Name,
        });
      });

      await batch.commit();

      NotificationManager.success("Requirement has been updated successfully.");
      setisloaded(false);

      // // Close the form
      // dispatch(setIsFormOpenWorkPackage(false));

      // Reload the project
      dispatch(getWorkPackages());
      dispatch(getTasks());
    } catch (err) {
      console.error({ err });;
      console.error({ err });
      setisloaded(false);
      NotificationManager.error(
        "Error occurred while updating the Work Package."
      );
    }
  };
}

export function addRequirmentTable(
  typeofRequirement,
  newRequirement,
  maxIndex,
  currentNode,
  setisloaded
) {

  return async (dispatch, getState) => {
    try {
      
      setisloaded(true);
      const requirement_id = currentNode.id;
      const { userData } = await getCurrentUserData(dispatch, getState);
      const requirement_type = _.get(currentNode, "data.requirement_type");

      console.log(
        "Values -------->",
        newRequirement,
        currentNode,
        currentNode.id,
        requirement_type,
        maxIndex
      );

      await fireStore.runTransaction(async (transaction) => {


        const requirementListRef = fireStore
          .collection("WorkPackage")
          .doc(requirement_id)
          .collection("RequirementList")
          .doc();

        await transaction.set(requirementListRef, {
          ...newRequirement,
          type: typeofRequirement,
          verificationStatus: "Not-Started",
          verificationDate: null,
          verificationApprovedBy: null,
          requirementid: requirement_id,
          createdBy:userData.Email,
          createdOn:new Date(),
          LastModifiedBy: userData.Email,
          LastModifiedOn: new Date(),
          isDelete:false
        });

        const maxIndexRef = fireStore
          .collection("WorkPackage")
          .doc(requirement_id)
        if (typeofRequirement ==="Functional"){
          await transaction.update(maxIndexRef,{
            "MaxIndex.functional":maxIndex
            
          })
        }
        else{

          await transaction.update(maxIndexRef,{
            "MaxIndex.operational":maxIndex
            
          })

        }  
      
        
      });

      NotificationManager.success("Requirement has been updated successfully.");
      dispatch(getWorkPackages(setisloaded));

    } catch (err) {
      console.error({ err });;
      console.error({ err });
      setisloaded(false);
      NotificationManager.error(
        "Error occurred while updating the Work Package."
      );
    }
  };
}

export function editRequirmentTable(
  newRequirement,
  currentNode,
  setisloaded
) {

  return async (dispatch, getState) => {
    try {
      
      setisloaded(true);
      const requirement_id = currentNode.id;
      const { userData } = await getCurrentUserData(dispatch, getState);
      // const requirement_type = _.get(currentNode, "data.requirement_type");
      const requirementlistid = newRequirement.requirementlistid
    
      
      let updatedReq = Object.assign({}, newRequirement);
      delete updatedReq["requirementlistid"];
      delete updatedReq["createdBy"];
      delete updatedReq["createdOn"];
      delete updatedReq["isDelete"];
      console.log(
        "Values Edit -------->",
        newRequirement,
        currentNode,
        currentNode.id,
        updatedReq
        
      );

      await fireStore.runTransaction(async (transaction) => {


        const requirementListRef = fireStore
          .collection("WorkPackage")
          .doc(requirement_id)
          .collection("RequirementList")
          .doc(requirementlistid);

        await transaction.update(requirementListRef, {
          ...updatedReq,
          LastModifiedBy: userData.Email,
          LastModifiedOn: new Date(),
        });
 
      });

      NotificationManager.success("Requirement has been updated successfully.");
      dispatch(getWorkPackages());

      setisloaded(false)
      
    } catch (err) {
      console.error({ err });;
      console.error({ err });
      setisloaded(false);
      NotificationManager.error(
        "Error occurred while updating the Work Package."
      );
    }
  };
}

export function deleteRequirmentTable(
  newRequirement,
  currentNode,
  setisloaded
) {

  return async (dispatch, getState) => {
    try {
      
      setisloaded(true);
      const requirement_id = currentNode.id;
      const { userData } = await getCurrentUserData(dispatch, getState);
      // const requirement_type = _.get(currentNode, "data.requirement_type");
      const requirementlistid = newRequirement.requirementlistid
    
      
      let updatedReq = Object.assign({}, newRequirement);
      delete updatedReq["requirementlistid"];
      delete updatedReq["createdBy"];
      delete updatedReq["createdOn"];
      delete updatedReq["isDelete"];
      console.log(
        "Values Edit -------->",
        newRequirement,
        currentNode,
        currentNode.id,
        updatedReq
        
      );

      await fireStore.runTransaction(async (transaction) => {


        const requirementListRef = fireStore
          .collection("WorkPackage")
          .doc(requirement_id)
          .collection("RequirementList")
          .doc(requirementlistid);

        await transaction.update(requirementListRef, {
          isDelete:true,
          LastModifiedBy: userData.Email,
          LastModifiedOn: new Date(),
        });
 
      });

      NotificationManager.success("Requirement has been updated successfully.");
      dispatch(getWorkPackages());

      setisloaded(false)
      
    } catch (err) {
      console.error({ err });;
      console.error({ err });
      setisloaded(false);
      NotificationManager.error(
        "Error occurred while updating the Work Package."
      );
    }
  };
}

export function updateWorkPackage_old2(values, currentNode, setisloaded) {
  return async (dispatch, getState) => {
    try {
      setisloaded(true);
      const requirement_id = currentNode.id;
      const { userData } = await getCurrentUserData(dispatch, getState);
      const batch = firebase.firestore().batch();

      const requirement_type = _.get(currentNode, "data.requirement_type");

      console.log(
        "Values -------->",
        values,
        currentNode,
        currentNode.id,
        requirement_type
      );

      const docRef = fireStore.collection("WorkPackage").doc(requirement_id);

      batch.update(docRef, {
        ...values,
        LastModifiedBy: userData.Email,
        LastModifiedOn: new Date(),
      });

      // Update name in Task collection
      let response = await fireStore
        .collection("Task")
        .where("WorkPackageID", "==", requirement_id)
        .where("IsDelete", "==", false)
        .get();

      response.docs.forEach((doc) => {
        const docRef = firebase
          .firestore()
          .collection("Task")
          .doc(doc.id);
        batch.update(docRef, {
          WorkPackageName: values.Name,
        });
      });

      await batch.commit();

      NotificationManager.success("Requirement has been updated successfully.");

      // // Close the form
      // dispatch(setIsFormOpenWorkPackage(false));

      // Reload the project
      dispatch(getWorkPackages());
      dispatch(getTasks());
      setisloaded(false);
      if (requirement_type === "System Task") {
        dispatch({
          type: WORK_PACKAGE__OPEN_VIEW_AND_EDIT_SYSTEMTASK_MODAL,
          data: false,
        });
      } else {
        dispatch({
          type: WORK_PACKAGE__OPEN_VIEW_AND_EDIT_REQUIRMENT_MODAL,
          data: false,
        });
      }
    } catch (err) {
      console.error({ err });;
      setisloaded(false);
      NotificationManager.error(
        "Error occurred while updating the Work Package."
      );
      dispatch({
        type: WORK_PACKAGE__OPEN_VIEW_AND_EDIT_REQUIRMENT_MODAL,
        data: false,
      });
      dispatch({
        type: WORK_PACKAGE__OPEN_VIEW_AND_EDIT_SYSTEMTASK_MODAL,
        data: false,
      });
    }
  };
}

export function updateWorkPackage_old(values, setSubmitting) {
  return async (dispatch, getState) => {
    try {
      const { userData } = await getCurrentUserData(dispatch, getState);
      const batch = firebase.firestore().batch();

      console.log("state", values);
      const docRef = fireStore
        .collection("WorkPackage")
        .doc(getState().workPackages.editFormData.uid);
      batch.update(docRef, {
        ...values,
        LastModifiedBy: userData.Email,
        LastModifiedOn: new Date(),
      });

      // Update name in Task collection
      let response = await fireStore
        .collection("Task")
        .where("WorkPackageID", "==", getState().workPackages.editFormData.uid)
        .where("IsDelete", "==", false)
        .get();

      response.docs.forEach((doc) => {
        const docRef = firebase
          .firestore()
          .collection("Task")
          .doc(doc.id);
        batch.update(docRef, {
          WorkPackageName: values.Name,
        });
      });

      await batch.commit();

      NotificationManager.success("Requirement has been updated successfully.");

      // Close the form
      dispatch(setIsFormOpenWorkPackage(false));

      // Reload the project
      dispatch(getWorkPackages());
      dispatch(getTasks());
    } catch (err) {
      console.error({ err });;
      NotificationManager.error(
        "Error occurred while updating the Work Package."
      );
      setSubmitting(false);
    }
  };
}

export function setIsFormOpenWorkPackage(data) {
  return async (dispatch) => {
    dispatch({ type: WORK_PACKAGE__SET_IS_FORM_OPEN, data });
  };
}

export function setFormTypeWorkPackage(data) {
  return async (dispatch) => {
    dispatch({ type: WORK_PACKAGE__SET_FORM_TYPE, data });
  };
}

export function setEditFormDataWorkPackage(data) {
  return async (dispatch) => {
    dispatch({ type: WORK_PACKAGE__SET_EDIT_FORM_DATA, data });
  };
}

export function setIsDeleteDialogOpenWorkPackage(data) {
  return async (dispatch) => {
    dispatch({ type: WORK_PACKAGE__SET_IS_DELETE_DIALOG_OPEN, data });
  };
}

export function updateWorkpackageRequirmentModel(data) {
  return async (dispatch, getState) => {
    console.log("at least at updateWorkpackageRequirmentModel", data);
    dispatch({ type: WORK_PACKAGE__UPDATE_OPEN_VIEW_REQUIRMENT_MODAL, data });
  };
}

export function openRequirementGraphMissionNode(data) {
  return async (dispatch, getState) => {
    console.log("at least at openRequirementGraphMissionNode", data);
    dispatch({ type: REQUIREMENTSGRAPH_OPEN_MISSION_NODE, data });
  };
}

export function EditAndViewRequirmentModel(data) {
  return async (dispatch, getState) => {
    console.log("at least at EditAndViewRequirmentModel", data);
    dispatch({ type: WORK_PACKAGE__OPEN_VIEW_AND_EDIT_REQUIRMENT_MODAL, data });
  };
}
WORK_PACKAGE__OPEN_VIEW_AND_EDIT_SYSTEMTASK_MODAL;

export function EditAndViewSystemTaskReqModel(data) {
  return async (dispatch, getState) => {
    console.log("at least at EditAndViewSystemTaskReqModel", data);
    dispatch({ type: WORK_PACKAGE__OPEN_VIEW_AND_EDIT_SYSTEMTASK_MODAL, data });
  };
}

export function EditAndViewSubSystem(data) {
  return async (dispatch, getState) => {
    console.log("WORK_PACKAGE__OPEN_VIEW_AND_EDIT_SUBSYSTE_MODAL", data);
    dispatch({ type: WORK_PACKAGE__OPEN_VIEW_AND_EDIT_SUBSYSTE_MODAL, data });
  };
}

export function EditAndViewComponent(data) {
  return async (dispatch, getState) => {
    console.log("WORK_PACKAGE__OPEN_VIEW_AND_EDIT_COMPONENT_MODAL", data);
    dispatch({ type: WORK_PACKAGE__OPEN_VIEW_AND_EDIT_COMPONENT_MODAL, data });
  };
}

export function EditAndViewComponentSubPart(data) {
  return async (dispatch, getState) => {
    console.log(
      "WORK_PACKAGE__OPEN_VIEW_AND_EDIT_COMPONENT_SUB_PARTS_MODAL",
      data
    );
    dispatch({
      type: WORK_PACKAGE__OPEN_VIEW_AND_EDIT_COMPONENT_SUB_PARTS_MODAL,
      data,
    });
  };
}
