import { fireStore, auth } from "../firebase";
import { NotificationManager } from "react-notifications";
import $ from "jquery";
import moment from "moment";

// import shortid from 'shortid';

const Project = fireStore.collection("PROJECT");
const Components = fireStore.collection("GENERICCOMPONENTS");
const ownModel = fireStore.collection("Models");
const SimultionsLog = fireStore.collection("simulationLogs");

const sendResponse = (data) => Promise.resolve(data);

import firebase from "firebase/app";

export default class SimulationCloneService {
  static async createProject(
    values,
    userData,
    simulation,
    simulationTime,
    configObj,
    simulationName,
    projectName
  ) {
    try {
      const project = {
        ProjectName: values.ProjectName,
        Description: values.ProjectDescription,
        StartDate: moment(new Date())
          .utc()
          .format("YYYY-MM-DD"),
        EndDate: moment(new Date())
          .add(5, "days")
          .utc()
          .format("YYYY-MM-DD"),
        Status: "active",
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

      const { CaseName, CaseDescription } = simulation;
      const {
        startDate,
        starttimeScale,
        endDate,
        endtimeScale,
      } = simulationTime;

      let newSimulationData = {
        SimulationName: $.trim(CaseName),
        SimulationDescription: CaseDescription,
        StartDate: new Date(startDate),
        StartTimeScale: starttimeScale,
        EndDate: new Date(endDate),
        EndTimeScale: endtimeScale,
        CreatedBy: auth.currentUser.email,
        CreatedOn: new Date(),
        LastModifiedBy: auth.currentUser.email,
        LastModifiedOn: new Date(),
        sheetnumber: 1,
        IsDelete: false,
        tempId: "",
        GitGraphVersion: "1",
      };

      const runid = moment(new Date()).valueOf();

      let newConfigData = {
        createdAt: runid,
        runid: runid,
        parameters: null,
        version: 0,
        name: "",
        LastModifiedOn: runid,
        LastModifiedBy: auth.currentUser.email,
        simRate: {
          value: 60000,
          unit: "milliseconds",
        },
      };

      let projectId;
      let simulationData;
      await fireStore.runTransaction(async (transaction) => {
        // Add the project
        let projectRef = fireStore.collection("PROJECT").doc();
        await transaction.set(projectRef, project);

        // This field will connect stakeholder to PROJECT collection
        stakeholder.ProjectDocumentID = projectRef.id;
        // Add stakeholder
        const docRef = fireStore.collection("StakeHolder").doc();
        await transaction.set(docRef, stakeholder);

        projectId = projectRef.id;

        newSimulationData.ProjectDocumentID = projectRef.id;
        const simRef = fireStore
          .collection("PROJECT")
          .doc(projectRef.id)
          .collection("Simulation")
          .doc();
        await transaction.set(simRef, newSimulationData);
        // simulationId = simRef.id;

        // This field will connect stakeholder to PROJECT collection
        // stakeholder.ProjectDocumentID = simulationRef.id;

        // Add stakeholder
        const configRef = fireStore
          .collection("PROJECT")
          .doc(projectRef.id)
          .collection("Simulation")
          .doc(simRef.id)
          .collection("Configuration")
          .doc();

        await transaction.set(configRef, configObj);

        const ref2 = fireStore
        .collection("PROJECT")
        .doc(projectRef.id)
        .collection("Simulation")
        .doc(simRef.id)
        .collection("GitGraphTest");

        const ref3 = fireStore
        .collection("PROJECT")
        .doc(projectRef.id)
        .collection("Simulation")
        .doc(simRef.id)

        ref2.add({
          id: "",
          name: "Cloned from " + simulationName + " of " + projectName,
          nodetype: "Cloned",
          branchinfog: {
            branchid: 0,
            branchname: "master",
            parent: null,
            child: []
          },
          LastModifiedOn: configObj.runid,
          LastModifiedBy: auth.currentUser.email,
          createdBy: auth.currentUser.email,
          runid: configObj.runid,
          parameters: configObj.parameters,
          version: configObj.version,
          simRate: configObj.simRate
        })
        .then(async function(docRef) {
            var simulationNewData = {
              gitGraph: [{
                parent: docRef.id,
                branchname: "master",
                branchid: 0,
                user: auth.currentUser.email
              }]
            }

            await ref2.doc(docRef.id).update({
              id: docRef.id
            });

            await ref3.update({...simulationNewData});
        })
        .catch(function(error) {
            console.error("Error", error);
        });

        let sheetInfoRef = fireStore
          .collection("PROJECT")
          .doc(projectRef.id)
          .collection("Simulation")
          .doc(simRef.id)
          .collection("Analysis")
          .doc();


        const sheetInfo = {
          sheetname: `SHEET${1}`,
          createdon: Date.now(),
          analysisstatus: -1,
        }

        await transaction.set(sheetInfoRef, sheetInfo);


        // setAnalysisSheetTab((draft) => {
        //   draft.simulationAnalysisCollection.push({ id: sheetInfoRef.id, ...sheetInfo });
        //   draft.isloaded = true;
        // });

        await transaction.update(simRef, { tempId: configRef.id });


        simulationData = {
          id: simRef.id,
          tempId: configRef.id,
        };
      });
      return {
        id: projectId,
        ...project,
        simulation: simulationData,
      };
    } catch (error) {
      NotificationManager.error(
        "Error while creating MissionPlease Try Again!"
      );
      console.log("error: ", error);
    }
  }
  static async addSimulationInProject(
    id,
    simulation,
    simulationTime,
    configObj,
    simulationName,
    projectName
  ) {
    try {
      const { CaseName, CaseDescription } = simulation;
      const {
        startDate,
        starttimeScale,
        endDate,
        endtimeScale,
      } = simulationTime;

      const CaseCollection = Project.doc(id).collection("Simulation");

      let newSimulationData = {
        SimulationName: $.trim(CaseName),
        SimulationDescription: CaseDescription,
        StartDate: new Date(startDate),
        StartTimeScale: starttimeScale,
        EndDate: new Date(endDate),
        EndTimeScale: endtimeScale,
        CreatedBy: auth.currentUser.email,
        CreatedOn: new Date(),
        LastModifiedBy: auth.currentUser.email,
        LastModifiedOn: new Date(),
        ProjectDocumentID: id,
        IsDelete: false,
        sheetnumber: 1,
        tempId: "",
        GitGraphVersion: "1",
      };

      const runid = moment(new Date()).valueOf();

      let newConfigData = {
        createdAt: runid,
        runid: runid,
        parameters: null,
        version: 0,
        name: "",
        LastModifiedOn: runid,
        LastModifiedBy: auth.currentUser.email,
        simRate: {
          value: 60000,
          unit: "milliseconds",
        },
      };

      let simulationData;
      await fireStore.runTransaction(async (transaction) => {
        const simulationRef = CaseCollection.doc();
        await transaction.set(simulationRef, newSimulationData);

        const configRef = CaseCollection.doc(simulationRef.id)
          .collection("Configuration")
          .doc();

        await transaction.set(configRef, configObj);

        let sheetInfoRef = fireStore
          .collection("PROJECT")
          .doc(id)
          .collection("Simulation")
          .doc(simulationRef.id)
          .collection("Analysis")
          .doc();

        await transaction.set(sheetInfoRef, {
          sheetname: `SHEET${1}`,
          createdon: Date.now(),
          analysisstatus: -1,
        });


        await transaction.update(simulationRef, { tempId: configRef.id });

        const ref2 = fireStore
        .collection("PROJECT")
        .doc(id)
        .collection("Simulation")
        .doc(simulationRef.id)
        .collection("GitGraphTest");

        const ref3 = fireStore
        .collection("PROJECT")
        .doc(id)
        .collection("Simulation")
        .doc(simulationRef.id)

        ref2.add({
          id: "",
          name: "Cloned from " + simulationName + " of " + projectName,
          nodetype: "Cloned",
          branchinfog: {
            branchid: 0,
            branchname: "master",
            parent: null,
            child: []
          },
          LastModifiedOn: configObj.runid,
          LastModifiedBy: auth.currentUser.email,
          createdBy: auth.currentUser.email,
          runid: configObj.runid,
          parameters: configObj.parameters,
          version: configObj.version,
          simRate: configObj.simRate
        })
        .then(async function(docRef) {
            var simulationNewData = {
              gitGraph: [{
                parent: docRef.id,
                branchname: "master",
                branchid: 0,
                user: auth.currentUser.email
              }]
            }

            await ref2.doc(docRef.id).update({
              id: docRef.id
            });

            await ref3.update({...simulationNewData});
        })
        .catch(function(error) {
            console.error("Error", error);
        });

        simulationData = {
          id: simulationRef.id,
          tempId: configRef.id,
        };
      });
      return simulationData;
    } catch (error) {
      NotificationManager.error("Could not create simulation.");
      console.log("error: ", error);
    }
  }

  static async addGroundStationsFromClone(projectId, simulationId, data) {
    try {
      let response;
      await Project
        .doc(projectId)
        .collection("Simulation")
        .doc(simulationId)
        .collection("groundstation")
        .add(data)
        .then((doc, value = data, projectId, simulationId) => {
          response = {
            id: doc.id, ...value, projectid: projectId,
            simulationid: simulationId
          };
        });
      return response

    } catch (err) {
      NotificationManager.error("Error while adding the ground station 1");
      return false;
    }

  }
}
