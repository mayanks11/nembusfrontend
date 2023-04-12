/**
 * Firebase API's 
 * Nembus Projects
 * Nimalya Saha
 */ 

import { fireStore, auth } from "../firebase";
import * as firebase from "firebase";

export default class NembusProjectService {
  static async createProject(data) {
    try {
        const ref = fireStore
        .collection("NEMBUS PROJECT");

        var result = false;
        await ref.add({ ...data })
        .then(async function(docRef) {
            await ref.doc(docRef.id).update({
                id: docRef.id
            });

            const analysisRef = fireStore
            .collection("NEMBUS PROJECT")
            .doc(docRef.id)
            .collection("Sheet Info")

            await analysisRef.add({
              id: "",
              sheetName: "Summary",
              order: -1,
              analysisStatus: -1,
              showDropDown: false,
              createdOn: new Date()
            })
            .then(async function(docRef2) {
              await analysisRef.doc(docRef2.id).update({
                id: docRef2.id
              });
              result = true;
            })
            .catch(function(error) {
              result = false;
            });
        })
        .catch(function(error) {
            result = false;
        });
        return result;
    } catch(error) {
        return false;
    }     
  }

  static async getAllSatelliteInformation() {
    try {
      const ref = fireStore
      .collection("SatelliteInformation")
      .where("status", "!=", "Not Found")

      const data = await ref.get().then(function(doc){
        var array = [];
        const dummyArray = doc.docs;
        dummyArray.forEach(async (doc) => {
          array.push(await doc.data());
        });
        return array;
      });

      return data;
    } catch(error) {
      console.log(error);
    }
  }

  static async getAllProjects(userId){
    try {
      const ref = fireStore
      .collection("NEMBUS PROJECT")
      .where("userId", "==", userId);

      const data = await ref.get().then(function(doc){
        var array = [];
        const dummyArray = doc.docs;
        dummyArray.forEach(async (doc) => {
          array.push(await doc.data());
        });
        return array;
      });

      return {
        projects: data
      };
    } catch(error) {
      console.log(error);
    }
  }

  static async getProjectData(projectId){
    try {
      const ref = fireStore
      .collection("NEMBUS PROJECT")
      .doc(projectId);
      
      const projectData = await ref.get().then((doc) =>{
          return doc.data();
      });
      return projectData;
    } catch(error) {
        return false;
    }
  }

  static async getCurrentUser(){
    try {
      const user = firebase.auth().currentUser;
      return user;
    } catch(error) {
      return false;
    }
  }

  static async deleteProject(projectId) {
    try {
        const ref = fireStore
        .collection("NEMBUS PROJECT")
        .doc(projectId);

        var result = false;
            await ref.delete()
            .then(function() {
                result = true;
            })
            .catch(function (error) {
                result = false;
            });
        return result;
    } catch(error) {
        return false;
    }
  }

  static async addJsonForm() {
    try {
      const schema = {
        "type": "object",
        "properties": {
          "name": {
            "type": "string",
            "minLength": 3,
            "description": "Please enter your name"
          },
          "vegetarian": {
            "type": "boolean"
          },
          "birthDate": {
            "type": "string",
            "format": "date"
          },
          "nationality": {
            "type": "string",
            "enum": [
              "DE",
              "IT",
              "JP",
              "US",
              "RU",
              "Other"
            ]
          },
          "personalData": {
            "type": "object",
            "properties": {
              "age": {
                "type": "integer",
                "description": "Please enter your age."
              },
              "height": {
                "type": "number"
              },
              "drivingSkill": {
                "type": "number",
                "maximum": 10,
                "minimum": 1,
                "default": 7
              }
            },
            "required": [
              "age",
              "height"
            ]
          },
          "occupation": {
            "type": "string"
          },
          "postalCode": {
            "type": "string",
            "maxLength": 5
          }
        },
        "required": [
          "occupation",
          "nationality"
        ]
      };
      const uiSchema = {
        "type": "VerticalLayout",
        "elements": [
          {
            "type": "HorizontalLayout",
            "elements": [
              {
                "type": "Control",
                "scope": "#/properties/name"
              },
              {
                "type": "Control",
                "scope": "#/properties/personalData/properties/age"
              },
              {
                "type": "Control",
                "scope": "#/properties/birthDate"
              }
            ]
          },
          {
            "type": "Label",
            "text": "Additional Information"
          },
          {
            "type": "HorizontalLayout",
            "elements": [
              {
                "type": "Control",
                "scope": "#/properties/personalData/properties/height"
              },
              {
                "type": "Control",
                "scope": "#/properties/nationality"
              },
              {
                "type": "Control",
                "scope": "#/properties/occupation",
                "suggestion": [
                  "Accountant",
                  "Engineer",
                  "Freelancer",
                  "Journalism",
                  "Physician",
                  "Student",
                  "Teacher",
                  "Other"
                ]
              }
            ]
          }
        ]
      }

      const ref = fireStore
      .collection("NEMBUS_META_DATA_ANALYSIS");

      await ref.add({
        formTitle: "Find Satellite",
        schema: schema,
        uiSchema: uiSchema
      })
      .then(async function(docRef) {
      })
      .catch(function(error) {
        return false;
      });
      return true;
    } catch(error) {
      console.log(error);
      return false;
    }
  }

  static async getAnalysisFormMetaData() {
    try {
      const ref = fireStore
      .collection("NEMBUS_META_DATA_ANALYSIS");

      const data = await ref.get().then(function(doc){
        var array = [];
        const dummyArray = doc.docs;
        dummyArray.forEach(async (doc) => {
          array.push(await doc.data());
        });
        return array;
      });

      return {
        data: data
      };
    } catch(error) {
      console.log(error);
    }
  }

  static async getCountryList() {
    try {
      const ref = fireStore
      .collection("GEO_DATA")

      const data = await ref.get().then(function (doc) {
        var array = [];
        doc.forEach(async function(docs) {
          array.push(docs.id);
        });
        return array;
      });

      return {
        data: data
      }
    } catch(error) {
      console.log(error);
    }
  }

  static async getCountrylevel1StateList(country) {
    try {
      const ref = fireStore
      .collection("GEO_DATA")
      .doc(country)

      const data = await (await ref.get()).data().level1_meta_data;

      return {
        data: data
      }
    } catch(error) {
      console.log(error);
    }
  }

  static async getGeoJsonCoordinatesInterestedLocation(country, level, levelId, featuresId) {
    try {
      if(level === 0) {
        const ref = fireStore
        .collection("GEO_DATA")
        .doc(country)
        .collection('Level-0')
        .doc(levelId)
        .collection('Features')
        .doc(featuresId)

        const data = await (await ref.get()).data();

        return {
          data: data
        }
      } else {
        const ref = fireStore
        .collection("GEO_DATA")
        .doc(country)
        .collection('Level-1')
        .doc(levelId)
        .collection('Features')
        .doc(featuresId)

        const data = await (await ref.get()).data();

        return {
          data: data
        }
      }
    } catch(error) {
      console.log(error);
    }
  }

  static async getProjectInterestedLocationSnapshots(
    projectId,
    callback
  ){
    try {
        await fireStore
        .collection("NEMBUS PROJECT")
        .doc(projectId)
        .collection("Data-InterestedLocation")
        .onSnapshot(function(snapshot) {
          callback(snapshot);
        });
    } catch (error) {
      console.log(error);
    }
  };

  static async getPorjectDataInterestedLocation(projectId) {
    try {
      const ref = fireStore
      .collection("NEMBUS PROJECT")
      .doc(projectId)
      .collection("Data-InterestedLocation");

      const data = await ref.get().then(function(doc){
        var array = [];
        const dummyArray = doc.docs;
        dummyArray.forEach(async (doc) => {
          array.push(await doc.data());
        });
        return array;
      });

      return {
        data: data
      };
    } catch(error) {
      console.log(error);
    }
  }

  static async addPorjectDataInterestedLocation(projectId, country, state) {
    try {
      const ref = fireStore
      .collection("NEMBUS PROJECT")
      .doc(projectId)
      .collection("Data-InterestedLocation");

      const ref2 = fireStore
      .collection("GEO_DATA")
      .doc(country)

      var metaDataCountry = await (await ref2.get()).data().level0_meta_data;
      var metaDataState = null;

      if(state !== '') {
        const metaData = await (await ref2.get()).data().level1_meta_data;
        metaDataState = metaData.filter((element, index) => {
          if(element.name === state) {
            return element;
          }
        });

        if(metaDataState === null || metaDataState.length === 0) {
          console.log("searching", state);
          metaDataState = metaData.filter((element, index) => {
            const searchText = `${element.name}, ${element.GID_0}`;
            if(searchText === state) {
              console.log("matched", searchText, state);
              console.log("found", element);
              return element;
            }
          });
        }
      }

      if(metaDataCountry.length > 0) {
        metaDataCountry = metaDataCountry;
      }

      if(metaDataState !== null && metaDataState.length > 0) {
        metaDataState = metaDataState[0];
      }

      const data = {
        id: '',
        label: state !== '' ? `${country}, ${state}` : country,
        country: country,
        level0_meta_data: metaDataCountry,
        level1_meta_data: metaDataState
      }

      var result = false;
      await ref.add({ ...data })
      .then(async function(docRef) {
          await ref.doc(docRef.id).update({
              id: docRef.id
          });
          result = true;
      })
      .catch(function(error) {
          result = false;
      });
      return result;
    } catch(error) {
        return false;
    }
  }

  static async deleteProjectDataInterestedLocation(projectId, interestedLocationId) {
    try {
      const ref = fireStore
      .collection("NEMBUS PROJECT")
      .doc(projectId)
      .collection("Data-InterestedLocation")
      .doc(interestedLocationId);

      var result = false;
          await ref.delete()
          .then(function() {
              result = true;
          })
          .catch(function (error) {
              result = false;
          });
      return result;
    } catch(error) {
        return false;
    }
  }

  static async getProjectDataTLEOrbit(projectId) {
    try {
      const ref = fireStore
      .collection("NEMBUS PROJECT")
      .doc(projectId)
      .collection("Data-SateliteOrbitTLE");

      const data = await ref.get().then(function(doc){
        var array = [];
        const dummyArray = doc.docs;
        dummyArray.forEach(async (doc) => {
          array.push(await doc.data());
        });
        return array;
      });

      return {
        data: data
      };
    } catch(error) {
      console.log(error);
    }
  }

  static async addProjectDataTLEOrbit(projectId, data) {
    try {
      const ref = fireStore
      .collection("NEMBUS PROJECT")
      .doc(projectId)
      .collection("Data-SateliteOrbitTLE");

      var result = false;
      await ref.add({ ...data })
      .then(async function(docRef) {
          await ref.doc(docRef.id).update({
              docId: docRef.id
          });
          result = true;
      })
      .catch(function(error) {
          result = false;
      });
      return result;
    } catch(error) {
      return false;
    }
  }

  static async deleteProjectDataTLEOrbit(projectId, TLEOrbitId) {
    try {
      const ref = fireStore
      .collection("NEMBUS PROJECT")
      .doc(projectId)
      .collection("Data-SateliteOrbitTLE")
      .doc(TLEOrbitId);

      var result = false;
          await ref.delete()
          .then(function() {
              result = true;
          })
          .catch(function (error) {
              result = false;
          });
      return result;
    } catch(error) {
        return false;
    }
  }

  static async updateProjectDataTLEOrbit(projectId, id, data) {
    try {
      const ref = fireStore
      .collection("NEMBUS PROJECT")
      .doc(projectId)
      .collection("Data-SateliteOrbitTLE")
      .doc(id);

      console.log("NNNN", data)

      await ref.update({ ...data })

      return true;
    } catch(error) {
      console.log("error", error);
      return false;
    }
  }

  static async getAnalysisSheetInfo(
    projectId
  ){
    try {
      const ref = fireStore
      .collection("NEMBUS PROJECT")
      .doc(projectId)
      .collection("Sheet Info")
      .orderBy("order", "asc");

    const projectRef = fireStore
      .collection("NEMBUS PROJECT")
      .doc(projectId);
      
    const projectData = await projectRef.get().then((doc) =>{
      return doc.data();
    });

      var names = [];

      const dataArray = await ref.get().then(function(doc){
        var array = [];
        const dummyArray = doc.docs;
        dummyArray.forEach(async (doc) => {
          array.push(await doc.data());
          names.push(await doc.data().sheetName);
        });
        return array;
      });

      return {
        dataArray: dataArray,
        names: names,
        projectData: projectData
      };
    } catch(error) {
      console.log(error);
    }
  }

  static async addAnalysisSheetTabs(
    projectId,
    sheetNo,
  ){
    try {
      let ref = fireStore
      .collection("NEMBUS PROJECT")
      .doc(projectId)
      .collection("Sheet Info");

      const projectRef = fireStore
        .collection("NEMBUS PROJECT")
        .doc(projectId);

      ref.add({
        id: "",
        sheetName: `SHEET${sheetNo}`,
        order: sheetNo,
        analysisStatus: -1,
        showDropDown: true,
        createdon: Date.now()
      })
      .then(async function(docRef) {
        await ref.doc(docRef.id).update({ id: docRef.id });
        await projectRef.update({ sheetNo: sheetNo });
      });
      
      return true;
    } catch(error) {
      return false;
    }
  }

  static async removeAnalysisSheetTabs(
    projectId,
    id,
  ) {
    try {
      let ref = fireStore
        .collection("NEMBUS PROJECT")
        .doc(projectId)
        .collection("Sheet Info")
        .doc(id)
        .delete()
        .then( function() {

        });

      return {
        id
      };
    } catch(error) {
      return false;
    }
  }

  static async renameAnalysisSheetTabs(
    projectId,
    name,
    id,
  ) {
    try {
      let ref = fireStore
        .collection("NEMBUS PROJECT")
        .doc(projectId)
        .collection("Sheet Info")
        .doc(id);

      await ref.update({
        sheetName: name
      });

      return true;
    } catch(error) {
      return false;
    }
  }

  static async getAnalysisSheetSnapshots(
    projectId,
    callback
  ){
    try {
      await fireStore
        .collection("NEMBUS PROJECT")
        .doc(projectId)
        .collection("Sheet Info")
        .orderBy("order", "asc")
        .onSnapshot(function(snapshot) {
          callback(snapshot);
        });
    } catch (error) {
      console.log("error: Analysis", error);
    }
  };
}