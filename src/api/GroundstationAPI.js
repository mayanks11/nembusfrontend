import { fireStore, auth, storage } from "../firebase";
import { NotificationManager } from "react-notifications";
import React from "react";
import { connect } from "react-redux";

const sendResponse = (data) => Promise.resolve(data);

export async function addGroundstation(
  values,
  projectid,
  simulationid
) {
  try {
    const projectRef = fireStore.collection("PROJECT");
    let response;
    await projectRef
      .doc(projectid)
      .collection("Simulation")
      .doc(simulationid)
      .collection("groundstation")
      .add(values)
      .then((doc, value = values,projectId=projectid,simulationID=simulationid) => {
         response = { id: doc.id, ...value ,projectid: projectId,
          simulationid: simulationID};
        });
        NotificationManager.success("successfully Added New Station");
        return response
      
  } catch (err) {
    NotificationManager.error("Error while adding the ground station 1");
    return false;
  }
}

export async function updateGroundstationValues(
  values,
  projectid,
  simulationid,
  groundstationId
) {
  try {
    const projectRef = fireStore.collection("PROJECT");
    await projectRef
      .doc(projectid)
      .collection("Simulation")
      .doc(simulationid)
      .collection("groundstation")
      .doc(groundstationId)
      .set(values);
  //TODO: update the value in redux store 
  NotificationManager.success("Succesfully updated the ground station details");
  } catch (err) {
    console.error(err)
    NotificationManager.error("Error while updating the ground station details");
  }
}

export async function getGroundstationList(
  projectid,
  simulationid,
  setGroundstationList
) {
  try {

    const projectRef = fireStore.collection("PROJECT");
    const snapshot = await projectRef
      .doc(projectid)
      .collection("Simulation")
      .doc(simulationid)
      .collection("groundstation")
      .get();
    let response =[];
    snapshot.docs.forEach((doc)=>{
      response.push({
        id: doc.id,projectID:projectid,simulationID:simulationid,...doc.data()})
    })

    // const response = snapshot.docs.map((doc) => ({
    //   id: doc.id,
    //   ...doc.data(),
    // }));
    return response;
    // setGroundstationList(response);

   
    // return response;
  } catch (err) {
    NotificationManager.error("Error occurred while fetching ground station details.");
    return false;
  }
}

export async function deleteGroundstationListItem(
  projectid,
  simulationid,
  groundstationId
) {
  try {
    const projectRef = fireStore.collection("PROJECT");

    await projectRef
    .doc(projectid)
    .collection("Simulation")
    .doc(simulationid)
    .collection("groundstation")
    .doc(groundstationId)
    .delete().then(function() {
      
  }).catch(function(error) {
      console.error("Error removing document: ", error);
  });
    // return response;
  } catch (err) {
    NotificationManager.error("Error occurred while fetching projects.");
  }
}

export async function setCloneGroundStationList(projectid,simulationid,data){
  try {
    const projectRef = fireStore.collection("PROJECT");

  let groundStationRef= await projectRef
      .doc(projectid)
      .collection("Simulation")
      .doc(simulationid)
      .collection("groundstation")
      .doc()

      await fireStore.runTransaction(async (transaction) => {
        data.map(async (ele)=>{
          await transaction.set(groundStationRef, ele);
        })
        
      })

  }
  catch (err) {
    NotificationManager.error("Error while adding the ground station 1");
  }
  }

