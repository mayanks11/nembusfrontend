import { fireStore, auth } from "../firebase";
import { toUTCDateString } from "../util/formateTime";
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
import { config } from "@jsonforms/examples";

export default class SimulationService {
  static async createProject(values, userData, simulation, simulationTime) {
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
        sheetnumber:1,
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

        await transaction.set(configRef, newConfigData);
        let sheetInfoRef = fireStore
          .collection("PROJECT")
          .doc(projectRef.id)
          .collection("Simulation")
          .doc(simRef.id)
          .collection("Analysis")
          .doc();

        await transaction.set(sheetInfoRef, {
          sheetname: `SHEET${1}`,
          createdon: Date.now(),
          analysisstatus: -1,
        });

        await transaction.update(simRef, { tempId: configRef.id });
        simulationData = {
          id: simRef.id,
          tempId: configRef.id,
          sheetnumber: 1
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

  static async getSimulationNames(
    projectId,
    caseId
  ){
    try {
      const ref = fireStore
      .collection("PROJECT")
      .doc(projectId)
      .collection("Simulation")
      .doc(caseId);

      const ref2 = fireStore
      .collection("PROJECT")
      .doc(projectId);

      const data = await ref.get().then((doc) =>{
        return doc.data();
      });

      const data2 = await ref2.get().then((doc) => {
        return doc.data();
      });


      return {
        simulationName: data.SimulationName,
        projectName: data2.ProjectName
      };
    } catch(error) {
      console.log(error);
    }
  }

  static async checkOldGitData(
    projectId,
    caseId
  ){
    try {
      const ref = fireStore
      .collection("PROJECT")
      .doc(projectId)
      .collection("Simulation")
      .doc(caseId);

      const data = await ref.get().then((doc) =>{
        return doc.data();
      });


      return {
        data: data
      };
    } catch(error) {
      console.log(error);
    }
  }

  static async getGitGraph(
    projectId,
    caseId,
    email
  ){
    try {
      const ref = fireStore
      .collection("PROJECT")
      .doc(projectId)
      .collection("Simulation")
      .doc(caseId)
      .collection("GitGraphTest");

      const ref2 = fireStore
      .collection("PROJECT")
      .doc(projectId)
      .collection("Simulation")
      .doc(caseId);

      const data = await ref.get().then(function(doc){
        var array = [];
        const dummyArray = doc.docs;
        dummyArray.forEach(async (doc) => {
          array.push(await doc.data());
        });
        return array;
      });

      const parent1 = await ref2.get().then(function(doc) {
        return doc.data().gitGraph;
      });
      const parent2 = parent1.filter(ele => ele.user === email)
      const parent = parent2[0];

      console.log("...parent get find", parent)

      return {
        gitGraph: data,
        parent: parent
      };
    } catch(error) {
      console.log(error);
    }
  }

  static async setGitGraph(
    projectId,
    caseId,
    gitid,
    name,
  ){
    try {
      const ref = fireStore
      .collection("PROJECT")
      .doc(projectId)
      .collection("Simulation")
      .doc(caseId)
      .collection("GitGraphTest")
      .doc(gitid);

      await ref.update({
        name: name
      })

      return {
        name
      };
    } catch(error) {
      console.log(error);
    }
  }

  static async updateTempConfigParameters(
    projectId,
    caseId,
    configurationId,
    parameters,
    runid,
    configName,
    email,
    simRateObj,
    configObj
  ) {
    try {
      const ref = fireStore
        .collection("PROJECT")
        .doc(projectId)
        .collection("Simulation")
        .doc(caseId)
        .collection("Configuration")
        .doc(configurationId);

      const ref2 = fireStore
        .collection("PROJECT")
        .doc(projectId)
        .collection("Simulation")
        .doc(caseId)
        .collection("GitGraphTest");

      const ref3 = fireStore
        .collection("PROJECT")
        .doc(projectId)
        .collection("Simulation")
        .doc(caseId);

      const projectData = await ref3.get().then((doc) =>{
        return doc.data();
      });

      const oldVersion = await ref.get().then((doc) => {
        return doc.data().version ? doc.data().version : 0;
      });

      const isParent = await ref2.get().then(function(doc) {
        return doc.docs;
      });

      console.log("parent parent", configName, configObj);

      let newData =
        configName === ""
          ? {
            LastModifiedOn: runid,
            LastModifiedBy: auth.currentUser.email,
            runid: runid,
            parameters,
            version: oldVersion + 1,
            simRate: simRateObj,
            // name:configName
          }
          : {
            LastModifiedOn: runid,
            LastModifiedBy: auth.currentUser.email,
            runid: runid,
            parameters,
            version: 0,
            name: configName,
            simRate: simRateObj,
          };

      await ref.update({ ...newData });

      //check for old data
      if(projectData.GitGraphVersion !== undefined){
        //condition for save/load
        if(configName === ""){
          if(isParent.length === 0) {
            ref2.add({
              id: "",
              name: "Save" + (oldVersion + 1),
              nodetype: "Save",
              branchinfog: {
                branchid: 0,
                branchname: "master",
                parent: null,
                child: []
              },
              LastModifiedOn: runid,
              LastModifiedBy: auth.currentUser.email,
              createdBy: auth.currentUser.email,
              runid: runid,
              parameters,
              version: oldVersion + 1,
              simRate: simRateObj
            })
            .then(async function(docRef) {
                var simulationNewData = {
                  gitGraph: [{
                    parent: docRef.id,
                    branchname: "master",
                    branchid: 0,
                    user: email
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
          } else if(isParent.length !== 0) {
            var data;
            const parent1 = await ref3.get().then(function(doc) {
              return doc.data().gitGraph;
            });
            const parent2 = parent1.filter(ele => ele.user === email)
            const parent = parent2[0];
            console.log("parent get", parent);
    
            ref2.add({
              id: "",
              name: "Save" + (oldVersion + 1),
              nodetype: "Save",
              branchinfog: {
                branchid: parent.branchid,
                branchname: parent.branchname,
                parent: parent.parent,
                child: []
              },
              LastModifiedOn: runid,
              LastModifiedBy: auth.currentUser.email,
              createdBy: auth.currentUser.email,
              runid: runid,
              parameters,
              version: oldVersion + 1,
              simRate: simRateObj
            })
            .then(async function(docRef) {
              await ref2.doc(docRef.id).update({
                id: docRef.id
              });
    
              const getParent = await (await ref2.doc(parent.parent).get()).data();
              console.log("parent getting", getParent);
    
              if(getParent.branchinfog.branchid === parent.branchid){
                data = {
                  branchinfog: {
                    branchid: getParent.branchinfog.branchid,
                    branchname: getParent.branchinfog.branchname,
                    parent: getParent.branchinfog.parent,
                    child: [...getParent.branchinfog.child, {
                      id: docRef.id,
                      time: getParent.branchinfog.child.length + 10,
                      nodetype: "save"
                    }]
                  }
                }
              } else {
                data = {
                  branchinfog: {
                    branchid: getParent.branchinfog.branchid,
                    branchname: getParent.branchinfog.branchname,
                    parent: getParent.branchinfog.parent,
                    child: [...getParent.branchinfog.child, {
                      id: docRef.id,
                      time: getParent.branchinfog.child.length + 10,
                      nodetype: "run"
                    }]
                  }
                }
              }

              var array = [];
              parent1.map((ele)=>{
                if(ele.user !== email){
                  array.push(ele);
                }
                else{
                  array.push({
                    parent: docRef.id,
                    branchname: parent.branchname,
                    branchid: parent.branchid,
                    user: email
                  });
                }
              });            
    
              // var simulationNewData = {
              //   gitGraph: {
              //     parent: docRef.id,
              //     branchname: parent.branchname,
              //     branchid: parent.branchid
              //   }
              // }

              var simulationNewData = {
                gitGraph: array
              }
    
              await ref2.doc(parent.parent).update({...data});
    
              await ref3.update({...simulationNewData});
            })
            .catch(function(error) {
                console.error("Error", error);
            });
          }
        } else {
          const parent1 = await ref3.get().then(function(doc) {
            return doc.data().gitGraph;
          });
          const parent2 = parent1.filter(ele => ele.user === email)
          const parent = parent2[0];
          if(configObj.id !== undefined){
            const id = configObj.id;
            const parentid = await (await ref2.where("id","==",id).get()).docs;
    
            if(parent !== undefined && parentid[0] !== undefined){
              console.log("parent get", parent, parentid[0].id);
    
              var array = [];
              parent1.map((ele)=>{
                if(ele.user !== email){
                  array.push(ele);
                }
                else{
                  array.push({
                    parent: parentid[0].id !== undefined ? parentid[0].id : parent.parent,
                    branchname: parent.branchname + (parent.branchid + 1),
                    branchid: parent.branchid + 1,
                    user: email
                  });
                }
              });  
    
              var updateParent = {
                gitGraph: array
              }
    
              await ref3.update({...updateParent});
            }
          }
        }
      }

      return {
        id: ref.id,
        ...newData,
      };
    } catch (err) {
      console.log(err);
      return false;
    }
  }

  static async saveParameters(
    projectId,
    caseId,
    tempConfigurtionId,
    parameters,
    runid,
    email,
    simRateObj
  ) {
    try {
      const tempConfigRef = await Project.doc(projectId)
        .collection("Simulation")
        .doc(caseId)
        .collection("Configuration")
        .doc(tempConfigurtionId);

      const simulationRef = await Project.doc(projectId)
        .collection("Simulation")
        .doc(caseId);

      const gitGraphRef = fireStore
        .collection("PROJECT")
        .doc(projectId)
        .collection("Simulation")
        .doc(caseId)
        .collection("GitGraphTest");
  
      const projectData = await simulationRef.get().then((doc) =>{
        return doc.data();
      });

      let runConfigData;

      const isParent = await gitGraphRef.get().then(function(doc) {
        return doc.docs;
      });

      const runVersion = await simulationRef.get().then(function(doc) {
        return doc.data().version ? doc.data().version : 0;
      });

      //check for old data
      if(projectData.GitGraphVersion !== undefined){
        if(isParent.length === 0) {
          gitGraphRef.add({
            id: "",
            name: "Run" + "_V_" + (runVersion + 1),
            nodetype: "Run",
            branchinfog: {
              branchid: 0,
              branchname: "master",
              parent: null,
              child: []
            },
            LastModifiedOn: runid,
            LastModifiedBy: auth.currentUser.email,
            createdAt: runid,
            createdBy: auth.currentUser.email,
            runid: runid,
            parameters,
            isDelete: true,
            version: runVersion + 1,
            simRate: simRateObj,
            UserDocumentID: auth.currentUser.uid
          })
          .then(async function(docRef) {
              var simulationNewData = {
                gitGraph: [{
                  parent: docRef.id,
                  branchname: "master",
                  branchid: 0,
                  user: email
                }]
              }
  
              await gitGraphRef.doc(docRef.id).update({
                id: docRef.id
              });
  
              await simulationRef.update({...simulationNewData});
          })
          .catch(function(error) {
              console.error("Error", error);
          });
        } else {
          var data;
          const parent1 = await simulationRef.get().then(function(doc) {
            return doc.data().gitGraph;
          });
          const parent2 = parent1.filter(ele => ele.user === email)
          const parent = parent2[0];
          console.log("parent get", parent);
  
          gitGraphRef.add({
            id: "",
            name: "Run" + "_V_" + (runVersion + 1),
            nodetype: "Run",
            branchinfog: {
              branchid: parent.branchid,
              branchname: parent.branchname,
              parent: parent.parent,
              child: []
            },
            LastModifiedOn: runid,
            LastModifiedBy: auth.currentUser.email,
            createdBy: auth.currentUser.email,
            createdAt: runid,
            runid: runid,
            parameters,
            isDelete: true,
            version: runVersion + 1,
            simRate: simRateObj,
            UserDocumentID: auth.currentUser.uid
          })
          .then(async function(docRef) {
            await gitGraphRef.doc(docRef.id).update({
              id: docRef.id
            });
  
            const getParent = await (await gitGraphRef.doc(parent.parent).get()).data();
            console.log("parent getting", getParent);
  
            if(getParent.branchinfog.branchid === parent.branchid){
              data = {
                branchinfog: {
                  branchid: getParent.branchinfog.branchid,
                  branchname: getParent.branchinfog.branchname,
                  parent: getParent.branchinfog.parent,
                  child: [...getParent.branchinfog.child, {
                    id: docRef.id,
                    time: getParent.branchinfog.child.length + 1,
                    nodetype: "save"
                  }]
                }
              }
            } else {
              data = {
                branchinfog: {
                  branchid: getParent.branchinfog.branchid,
                  branchname: getParent.branchinfog.branchname,
                  parent: getParent.branchinfog.parent,
                  child: [...getParent.branchinfog.child, {
                    id: docRef.id,
                    time: getParent.branchinfog.child.length + 1,
                    nodetype: "run"
                  }]
                }
              }
            }
  
            var array = [];
              parent1.map((ele)=>{
                if(ele.user !== email){
                  array.push(ele);
                }
                else{
                  array.push({
                    parent: docRef.id,
                    branchname: parent.branchname,
                    branchid: parent.branchid,
                    user: email
                  });
                }
              }); 
  
            // var simulationNewData = {
            //   gitGraph: {
            //     parent: docRef.id,
            //     branchname: parent.branchname,
            //     branchid: parent.branchid
            //   }
            // }
  
            var simulationNewData = {
              gitGraph: array
            }
  
            await gitGraphRef.doc(parent.parent).update({...data});
  
            await simulationRef.update({...simulationNewData});
          })
          .catch(function(error) {
              console.error("Error", error);
          });
        }
      }

      

      await fireStore.runTransaction(async (transaction) => {
        const simulationDoc = await transaction.get(simulationRef);

        let newVersion = simulationDoc.data().version
          ? simulationDoc.data().version
          : 0;

        const tempConfigDoc = await transaction.get(tempConfigRef);

        let newTempVersion = tempConfigDoc.data().version
          ? tempConfigDoc.data().version
          : 0;

        await transaction.update(simulationRef, {
          version: newVersion + 1,
          LastModifiedOn: new Date(),
        });

        let newRunConfigData = {
          createdAt: runid,
          runid: runid,
          parameters,
          version: newVersion + 1,
          name: "Run" + "_V_" + (newVersion + 1),
          isDelete: true,
          simRate: simRateObj,
          createdBy: auth.currentUser.email,
          UserDocumentID: auth.currentUser.uid,
        };

        const runConfigRef = await Project.doc(projectId)
          .collection("Simulation")
          .doc(caseId)
          .collection("RunConfiguration")
          .doc();

        await transaction.set(runConfigRef, newRunConfigData);

        await transaction.update(tempConfigRef, {
          LastModifiedOn: runid,
          LastModifiedBy: auth.currentUser.email,
          runid: runid,
          parameters,
          version: newTempVersion + 1,
          simRate: simRateObj,
        });

        runConfigData = {
          id: runConfigRef.id,
          ...newRunConfigData,
        };
      });

      return runConfigData;
    } catch (err) {
      console.log(err);
      // return false;
    }
  }

  static async saveParameters1(
    projectId,
    caseId,
    configurationId,
    parameters,
    runid
  ) {
    try {
      // let newData = {
      //   createdAt: Date.now(),
      //   runid: runid,
      //   ...parameters,
      // };
      // delete newData.CzmlPath;

      const version = await Project.doc(projectId)
        .collection("Simulation")
        .doc(caseId)
        .get()
        .then((doc) => {
          return doc.data().version ? doc.data().version : 0;
        });

      await Project.doc(projectId)
        .collection("Simulation")
        .doc(caseId)
        .update({ version: version + 1 });

      const newVersion = version + 1;

      // if (configurationId) {
      //   let newData = {
      //     createdAt: runid,
      //     runid: runid,
      //     parameters,
      //     version: version + 1,
      //     name: "Run" + "_V_" + newVersion,
      //   };

      //   const ref = Project.doc(projectId)
      //     .collection("Simulation")
      //     .doc(caseId)
      //     .collection("Configuration")
      //     .doc(configurationId);

      //   await ref.update({ ...newData });

      //   ref
      //     .update(
      //       "runhistrory",
      //       firebase.firestore.FieldValue.arrayUnion(runid)
      //     )
      //     .then(() => {})
      //     .then((doc) => {
      //       return;
      //     });

      //   return ref.id;
      // } else {

      let newData = {
        createdAt: runid,
        runid: runid,
        parameters,
        version: version + 1,
        name: "Run" + "_V_" + newVersion,
        isDelete: true,
      };

      const res = await Project.doc(projectId)
        .collection("Simulation")
        .doc(caseId)
        .collection("RunConfiguration")
        .add(newData);
      // console.log("ressssssss", res);
      return {
        id: res.id,
        ...newData,
      };
    } catch (err) {
      console.log(err);
      // return false;
    }
  }

  static async fetchLatestProjects(uid) {
    const snapshot = await Project.where("UserDocumentID", "==", uid).get();

    const fetchCases = [];
    snapshot.forEach((doc) => {
      const projectDoc = doc.data();
      fetchCases.push(
        new Promise((resolve, reject) => {
          Project.doc(doc.id)
            .collection("Simulation")
            .get()
            .then((caseSnapshot) => {
              const cases = [];
              caseSnapshot.forEach((caseDoc) => {
                cases.push({
                  projectDoc: {
                    ...projectDoc,
                    id: doc.id,
                  },
                  caseDoc: {
                    ...caseDoc.data(),
                    id: caseDoc.id,
                  },
                  ...projectDoc,
                  ...caseDoc.data(),
                });
              });
              resolve(cases);
            })
            .catch(reject);
        })
      );
    });

    const result = await Promise.all(fetchCases);
    let finalResult = [];
    result.forEach((cases) => (finalResult = finalResult.concat(cases)));

    const sortingFunction = (a, b) => {
      const aDate = a.CreatedDate;
      const aParsed = new Date(aDate.replace("at ", "").replace(" UTC+0", ""));
      const bDate = b.CreatedDate;
      const bParsed = new Date(bDate.replace("at ", "").replace(" UTC+0", ""));

      return aParsed < bParsed ? 1 : -1;
    };
    // finalResult.sort(sortingFunction);

    const topFive = [];
    finalResult.forEach((c, idx) => {
      if (idx < 5) {
        topFive.push(c);
      }
    });
    return topFive;
  }

  static async fetchLatestActions(uid) {
    const snapshot = await fireStore
      .collection("simulationLogs")
      .where("UserDocumentID", "==", uid)
      .orderBy("CreatedDate", "desc")
      .limit(5)
      .get();
    const actions = [];
    snapshot.forEach((doc) => {
      actions.push(doc.data());
    });
    return actions;
  }

  static async getAllProjects({ userId }) {
    try {
      let userData;

      // if (localStorage.getItem("userinfo") === null) {
      //   const userInfo = await fireStore
      //     .collection("users")
      //     .doc(auth.currentUser.uid)
      //     .get();
      //   userData = userInfo.data();
      //   localStorage.setItem("userinfo", JSON.stringify(userData));
      // } else {
      //   userData = JSON.parse(localStorage.getItem("userinfo"));
      // }

      // only allows to only if the user has created
      const projectRef = fireStore.collection("PROJECT");
      const snapshot = await projectRef
        .where("IsDelete", "==", false)
        .where(`StackholderList.${userId}`, "in", ["admin"])
        .get();

      // const snapshot = await Project.where(
      //   "CompanyName",
      //   "==",
      //   userData.CompanyName
      // ).get();

      let response = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      return sendResponse(response);
    } catch (error) {
      console.log("error: ", error);
    }
  }

  static async getAllSharedProjects({ userId }) {
    try {
      let userData;

      // if (localStorage.getItem("userinfo") === null) {
      //   const userInfo = await fireStore
      //     .collection("users")
      //     .doc(auth.currentUser.uid)
      //     .get();
      //   userData = userInfo.data();
      //   localStorage.setItem("userinfo", JSON.stringify(userData));
      // } else {
      //   userData = JSON.parse(localStorage.getItem("userinfo"));
      // }

      // only allows to only if the user has created
      const projectRef = fireStore.collection("PROJECT");
      const snapshot = await projectRef
        .where("IsDelete", "==", false)
        .where(`StackholderList.${userId}`, "in", ["edit"])
        .get();

      // const snapshot = await Project.where(
      //   "CompanyName",
      //   "==",
      //   userData.CompanyName
      // ).get();

      let response = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      return sendResponse(response);
    } catch (error) {
      console.log("error: ", error);
    }
  }




  static async isEligibleMissionPerOrganization(missionName, companyname) {
    try {
      const isMissionExistsdoc = await fireStore
        .collection("PROJECT")
        .where("ProjectName", "==", missionName)
        .where("CompanyName", "==", companyname)
        .where("IsDelete", "==", false)
        .get();

      console.log("testing", companyname, missionName);

      let result = true;

      isMissionExistsdoc.forEach((doc) => {
        console.log("is project exist============>", doc.id);
        result = false;
      });

      return sendResponse(result);
    } catch (error) {
      console.log("error: ", error);
    }
  }

  static async getAllCasesForProject(id) {
    try {
      const snapshot = await Project.doc(id)
        .collection("Simulation")
        .get();
      return snapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
    } catch (error) {
      console.log("error: ", error);
    }
  }

  static async fetchAllCases() {
    try {
      const snapshot = await Project.where(
        "UserDocumentID",
        "==",
        auth.currentUser.uid
      )
        .orderBy("LastModifiedOn", "desc")
        .get();

      const fetchCases = [];
      snapshot.forEach((doc) => {
        fetchCases.push(
          new Promise((resolve, reject) => {
            Project.doc(doc.id)
              .collection("Simulation")
              .where("IsDelete", "==", false)
              .orderBy("LastModifiedOn", "desc")
              .get()
              .then((snapshot) => {
                const tempCases = [];
                snapshot.forEach((subDoc) => {
                  tempCases.push({
                    missionId: doc.id,
                    missionName: doc.data().ProjectName,
                    missionCreatedOn: doc.data().CreatedOn,
                    missionDescription: doc.data().Description,
                    simulationId: subDoc.id,
                    simulationName: subDoc.data().SimulationName,
                    simulationCreatedOn: subDoc.data().CreatedOn,
                    simulationLastModifiedOn:
                      typeof subDoc.data().LastModifiedOn === "object"
                        ? subDoc.data().LastModifiedOn
                        : {
                          seconds: Math.ceil(
                            subDoc.data().LastModifiedOn / 1000
                          ),
                          nanoseconds:
                            (subDoc.data().LastModifiedOn % 1000) * 1000000,
                        },
                    simulationDescription: subDoc.data().SimulationDescription,
                    simulationStartDate: subDoc.data().StartDate,
                    simulationEndDate: subDoc.data().EndDate,
                  });
                });
                resolve(tempCases);
              })
              .catch(reject);
          })
        );
      });
      const cases = await Promise.all(fetchCases);

      console.log("cases");

      const result = cases.flat();
      // sorting it in descending order
      result.sort(function (a, b) {
        if (
          a.simulationLastModifiedOn.seconds ==
          b.simulationLastModifiedOn.seconds
        ) {
          return (
            b.simulationLastModifiedOn.nanoseconds -
            a.simulationLastModifiedOn.nanoseconds
          );
        } else {
          return (
            b.simulationLastModifiedOn.seconds -
            a.simulationLastModifiedOn.seconds
          );
        }
      });
      return result;
    } catch (err) {
      console.log(err);
    }
  }
  //  [data ,setData] = useState({runcollectop:[],isloading:false})
  static async fetchAllConfigurations() {
    try {
      let isLoading = true;
      console.log("loading", isLoading);

      const projectSnapshot = await Project.where(
        "UserDocumentID",
        "==",
        auth.currentUser.uid
      )
        .orderBy("LastModifiedOn", "desc")
        .get();

      let promisColl = [];

      const fetchCases = [];
      projectSnapshot.forEach((doc) => {
        fetchCases.push(
          new Promise((resolve, reject) => {
            Project.doc(doc.id)
              .collection("Simulation")
              .get()
              .then((snapshot) => {
                const tempCases = [];
                snapshot.forEach((subDoc) => {
                  tempCases.push({
                    ...doc.data(),
                    projectId: doc.id,
                    simulationId: subDoc.id,
                    simulationInfo: {
                      ...subDoc.data(),
                      id: subDoc.id,
                    },
                  });
                });
                resolve(tempCases);
              })
              .catch(reject);
          })
        );
      });

      const fetchConfig = [];
      let result = [];
      const cases = await Promise.all(fetchCases)
        .then((simData) => {
          console.log("cases", simData.flat());
          simData.flat().forEach((sim) => {
            // console.log("simmmm",sim)
            fetchConfig.push(
              new Promise((resolve, reject) => {
                Project.doc(sim.projectId)
                  .collection("Simulation")
                  .doc(sim.simulationId)
                  .collection("RunConfiguration")
                  .get()
                  .then((snapshot) => {
                    const tempCases = [];
                    snapshot.forEach((subDoc) => {
                      // console.log("conffff",subDoc.data())
                      tempCases.push({
                        missionId: sim.projectId,
                        missionName: sim.ProjectName,
                        missionCreatedOn: sim.CreatedOn,
                        missionDescription: sim.Description,
                        simulationId: sim.simulationId,
                        simulationName: sim.simulationInfo.SimulationName,
                        simulationCreatedOn: sim.simulationInfo.CreatedOn,
                        simulationDescription:
                          sim.simulationInfo.SimulationDescription,
                        configurationId: subDoc.id,
                        configurationName: subDoc.data().name,
                        configurationCreatedOn: subDoc.data().createdAt,
                        configurationDescription: subDoc.data().description,
                      });
                    });

                    if (tempCases.length == 0) {
                      tempCases.push({
                        projecId: sim.projectId,
                        projectName: sim.ProjectName,
                        missionCreatedOn: sim.CreatedOn,
                        missionDescription: sim.Description,
                        simulationId: sim.simulationId,
                        simulationName: sim.simulationInfo.SimulationName,
                        simulationCreatedOn: sim.simulationInfo.CreatedOn,
                        simulationDescription:
                          sim.simulationInfo.SimulationDescription,
                      });
                    }

                    resolve(tempCases);
                  })
                  .catch(reject);
              })
            );
          });

          return fetchConfig;
        })
        .then(async (fetchConfig) => {
          const cases = await Promise.all(fetchConfig)
            .then((config) => {
              console.log(config.flat());
              return config.flat();
            })
            .then((con) => {
              // console.log("flat config",con)
              result = con.map((obj) => ({ ...obj }));
            });
        });
      isLoading = false;
      // console.log("loading",isLoading)
      return result;
    } catch (err) {
      console.log(err);
    }
  }

  static async fetchAllConfigurations_old() {
    try {
      const projectSnapshot = await Project.where(
        "UserDocumentID",
        "==",
        auth.currentUser.uid
      )
        .orderBy("LastModifiedOn", "desc")
        .get();
      var configurationListData = [];
      let promisecoll = [];
      if (projectSnapshot) {
        projectSnapshot.forEach(async (projDoc) => {
          const simulationCollection = async () => {
            const simulationSnapshot = await Project.doc(projDoc.id)
              .collection("Simulation")
              .get();
            if (simulationSnapshot) {
              simulationSnapshot.forEach(async (simDoc) => {
                const runConfigCollection = async () => {
                  const runConfigSnapshot = await Project.doc(projDoc.id)
                    .collection("Simulation")
                    .doc(simDoc.id)
                    .collection("RunConfiguration")
                    .get();

                  return runConfigSnapshot;

                  // if (runConfigSnapshot) {
                  //   runConfigSnapshot.forEach((configDoc) => {
                  //     console.log("configurationListData length",configurationListData.length);
                  //     configurationListData.push({
                  //       ...projDoc.data(),
                  //       id: projDoc.id,
                  //       case: {
                  //         ...simDoc.data(),
                  //         id: simDoc.id,
                  //       },
                  //       runConfig: {
                  //         ...configDoc.data(),
                  //         id: configDoc.id,
                  //       },
                  //     });

                  //   });
                  // }
                };
                promisecoll.push(await runConfigCollection());
              });
            }
          };
          await simulationCollection();
        });
      }

      Promise.all([promisecoll]).then((data) => {
        console.log(data);
      });

      // console.log("results_all",results_all)

      const result = [];
      // //  const data= await Promise.all([configurationListData])
      //  await Promise.all(configurationListData.map(async (ele)=>{
      //     console.log("ellllllleeeee",ele)
      //    await result.push(ele)
      //   }))
      //   console.log("data",result);
      //   console.log("data", result.length);

      //   return result;
    } catch (err) {
      console.log(err);
    }
  }

  static async addSimulationInProject(id, simulation, simulationTime) {
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
      let sheetData = {
        sheetname: `SHEET${1}`,
        createdon: Date.now(),
        analysisstatus: -1,
      };
      // console.log("tempppppppppp", newConfigData);
      let simulationData;
      await fireStore.runTransaction(async (transaction) => {
        const simulationRef = CaseCollection.doc();
        await transaction.set(simulationRef, newSimulationData);
        const simulatio_id = simulationRef.id;

        // This field will connect stakeholder to PROJECT collection
        // stakeholder.ProjectDocumentID = simulationRef.id;

        // Add stakeholder
        const configRef = CaseCollection.doc(simulationRef.id)
          .collection("Configuration")
          .doc();

        await transaction.set(configRef, newConfigData);

        await transaction.update(simulationRef, { tempId: configRef.id });
        let sheetInfoRef = CaseCollection.doc(simulationRef.id)
          .collection("Analysis")
          .doc();

        await transaction.set(sheetInfoRef, {
          sheetname: `SHEET${1}`,
          createdon: Date.now(),
          analysisstatus: -1,
        });
        
        // const result = await CaseCollection.add(newSimulationData);
        // const simData = await simulationRef.get().then((doc) => {
        //   return doc.data();
        // });
        // console.log("simdata", simData);
        // NotificationManager.success("New Simulated Created !");
        // const res = await CaseCollection
        //   .doc(result.id)
        //   .collection("Configuration")
        //   .add(newConfigData);

        // const doc = await CaseCollection.doc(result.id).get();
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

  static async getAllSimulations() {
    try {
      const snapshot = await Project.where("UserDocId", "==", uid)
        .limit(50)
        .get();
      const response = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      return sendResponse(response);
    } catch (error) {
      console.log("error: ", error);
    }
  }

  static async addSimulationLog(data) {
    try {
      const {
        ProjectId,
        ProjectName,
        ProjectDescription,
        CaseName,
        CaseDescription,
        caseId,
        Type,
      } = data;

      SimultionsLog.add({
        ProjectId,
        ProjectName,
        ProjectDescription,
        CaseName,
        CaseDescription,
        caseId,
        Type,
        CreatedDate: new Date().toISOString(),
        UserDocumentID: auth.currentUser.uid,
      });
    } catch (error) {
      console.log("error: ", error);
    }
  }

  static async getConfigurations(projectId, caseId) {
    try {
      const configurations = await Project.doc(projectId)
        .collection("Simulation")
        .doc(caseId)
        .collection("Configuration")
        .orderBy("createdAt", "desc")
        .limit(25)
        .get();
      let response = configurations.docs.map((conf) => ({
        id: conf.id,
        ...conf.data(),
      }));
      return sendResponse(response);
    } catch (error) {
      console.log("error: ", error);
    }
  }

  static getConfigurationSnapshot(projectId, caseId, callback) {
    Project.doc(projectId)
      .collection("Simulation")
      .doc(caseId)
      .collection("Configuration")
      .orderBy("createdAt", "desc")
      .limit(20)
      .onSnapshot(function (snapshot) {
        callback(snapshot);
      });
  }

  static getRunConfigurationSnapshot(projectId, caseId, callback) {
    Project.doc(projectId)
      .collection("Simulation")
      .doc(caseId)
      .collection("RunConfiguration")
      .where("isDelete", "==", false)
      .orderBy("createdAt", "desc")
      .limit(20)
      .onSnapshot(function (snapshot) {
        callback(snapshot);
      });
  }

  static getCurrentConfigurationSnapshot(
    projectId,
    caseId,
    currenConfid,
    callback
  ) {
    Project.doc(projectId)
      .collection("Simulation")
      .doc(caseId)
      .collection("Configuration")
      .doc(currenConfid)
      .onSnapshot(function (snapshot) {
        callback(snapshot);
      });
  }

  static async getCurrentConfigurationGitGraph(
    projectId,
    caseId,
    currenConfid
  ) {
    try{
      const mission = await Project.doc(projectId)
      .collection("Simulation")
      .doc(caseId)
      .collection("GitGraphTest")
      .doc(currenConfid)
      .get()
      .then((doc)=> {
        return doc;
      });

      if(mission){
        let response = {
          id: mission.id,
          ...mission.data(),
        };
        return sendResponse(response);
      }
    }catch(err){
      console.log("Error", err);
      return;
    }
  }

  static async getProjectDetails(projectId){
    try {
      const mission = await Project.doc(projectId)
        .get()
        .then((doc) => {
          return doc;
        });

      let response = {
        id: mission.id,
        ...mission.data(),
      };
      return sendResponse(response);
    } catch (error) {
      console.log("error: ", error);
    }
  }

  static async getSimulationDetails(projectId, caseId) {
    try {
      const simulation = await Project.doc(projectId)
        .collection("Simulation")
        .doc(caseId)
        .get()
        .then((doc) => {
          return doc;
        });

      let response = {
        id: simulation.id,
        ...simulation.data(),
      };
      return sendResponse(response);
    } catch (error) {
      console.log("error: ", error);
    }
  }
  
  static async getConfigurationDetails(projectId, caseId, configurationId) {
    try {
      const configuration = await Project.doc(projectId)
        .collection("Simulation")
        .doc(caseId)
        .collection("Configuration")
        .doc(configurationId)
        .get()
        .then((doc) => {
          return doc;
        });

      let response = {
        id: configuration.id,
        ...configuration.data(),
      };
      return sendResponse(response);
    } catch (error) {
      console.log("error: ", error);
    }
  }

  static async getRunConfigurationDetails(projectId, caseId, configurationId) {
    try {
      const configuration = await Project.doc(projectId)
        .collection("Simulation")
        .doc(caseId)
        .collection("RunConfiguration")
        .doc(configurationId)
        .get()
        .then((doc) => {
          return doc;
        });

      let response = {
        id: configuration.id,
        ...configuration.data(),
      };
      return sendResponse(response);
    } catch (error) {
      console.log("error: ", error);
    }
  }

  static async updateSimulationRateValue(
    projectId,
    caseId,
    configurationId,
    simRateObj
  ) {
    try {
      let newData = {
        simRate: simRateObj,
        LastModifiedOn: moment(new Date()).valueOf(),
      };
      const ref = fireStore
        .collection("PROJECT")
        .doc(projectId)
        .collection("Simulation")
        .doc(caseId)
        .collection("Configuration")
        .doc(configurationId);

      await ref.update({ ...newData });
      return ref.id;
    } catch (err) {
      console.log(err);
      return false;
    }
  }
  static async updateSimulationDetails(
    projectId,
    caseId,
    simulationName,
    simulationDescription
  ) {
    try {
      let newData = {
        SimulationName: simulationName,
        SimulationDescription: simulationDescription,
        LastModifiedBy: auth.currentUser.email,
        LastModifiedOn: new Date(),
      };

      const ref = fireStore
        .collection("PROJECT")
        .doc(projectId)
        .collection("Simulation")
        .doc(caseId);
      await ref.update({ ...newData });
      return ref.id;
    } catch (err) {
      console.log(err);
      return false;
    }
  }
  static async deleteSimulation(projectId, caseId) {
    try {
      const ref = fireStore
        .collection("PROJECT")
        .doc(projectId)
        .collection("Simulation")
        .doc(caseId);
      let newData = {
        IsDelete: true,
      };
      await ref.update({ ...newData });
      return ref.id;
    } catch (err) {
      NotificationManager.error("coudn't delete the document");
      return false;
    }
  }

  static async updateRunConfigurationDetails(
    projectId,
    caseId,
    configurationId,
    configName,
    configDescription
  ) {
    try {
      let newData = {
        name: configName,
        description: configDescription,
      };
      //console.log("dddddddddddd", newData);
      const ref = fireStore
        .collection("PROJECT")
        .doc(projectId)
        .collection("Simulation")
        .doc(caseId)
        .collection("RunConfiguration")
        .doc(configurationId);

      await ref.update({ ...newData });
      return ref.id;
    } catch (err) {
      console.log(err);
      return false;
    }
  }

  static async deleteRunConfiguration(projectId, caseId, configurationId) {
    try {
      const ref = fireStore
        .collection("PROJECT")
        .doc(projectId)
        .collection("Simulation")
        .doc(caseId)
        .collection("RunConfiguration")
        .doc(configurationId);
      let newData = {
        isDelete: true,
      };
      await ref.update({ ...newData }).then(() => {
        NotificationManager.success("Document successfully deleted!");
      });
    } catch (err) {
      NotificationManager.error("coudn't delete the document");
    }
  }

  static async getComponents() {
    try {
      const conponents = await Components.get();
      let response = conponents.docs.map((conf) => ({
        id: conf.id,
        ...conf.data(),
      }));

      return sendResponse(response);
    } catch (error) {
      console.log("error: ", error);
    }
  }
  static async getUserComponents() {
    try {
      let response = [];
      const ownmodelComponent = await ownModel
        .where("UserDocumentID", "==", auth.currentUser.uid)
        .get();

      ownmodelComponent.forEach((doc) => {
        response.push({
          id: doc.id,
          ...doc.data(),
        });
      });

      return sendResponse(response);
    } catch (error) {
      console.log("error: ", error);
    }
  }
}