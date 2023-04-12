import firebase, { auth, fireStore } from "../firebase";
import { NotificationManager } from "react-notifications";
import moment from "moment";
import { MODELS, MAIN_BUCKETS } from "Util/constants";
import {
  GET_COMPONENT_UI_FORM,
  GET_COMPONENT,
  GET_STATUS_HISTORY,
  GET_COMPONENT_BY_DOC_ID,
  GET_COMPONENT_BY_DOC_VERSION_ID,
  GET_COMPANY_NAME,
  GET_COMPONENT_MODEL_VERSION_BY_DOC_ID,
  GET_COMPONENT_MODEL_VERSION_HISTORY,
  UPDATE_COMPONENT_VERSION_STATUS,
  SET_ACTION_WAIT,
  SET_CAD_URL
} from "./types";
import { uploadFileAndGetFullPath } from "Actions/FileActions";
import { updateVersionStatusfunction, updateStatusAtComponent } from "Api";
import $RefParser from "@apidevtools/json-schema-ref-parser";

export function getComponentForm(data) {
  return async (dispatch, getState) => {
    try {
      let { type, subtype } = data;
      const collectionRef = fireStore.collection("AddComponentUIForms");
      const response = await collectionRef.get();

      let dataArray = [];
      response.docs.forEach((value) => {
        const data = {
          ...value.data(),
        };

        console.log(
          "component data",
          data,
          data.type,
          type,
          data.subtype,
          subtype
        );
        if (data.type === type && data.subtype === subtype) {
          dataArray.push(data);
        }
      });

      dispatch({ type: GET_COMPONENT_UI_FORM, data: dataArray });
    } catch (error) {
      NotificationManager.error(
        "Error occurred while fetching Component Form."
      );
    }
  };
}
export function getComponents() {
  return async (dispatch, getState) => {
    const collectionRef = fireStore.collection("Component");
    const projectDetails = getState().projectDetails.details;
    let components = await collectionRef
      .where("IsDeleted", "==", false)
      .where("ProjectId", "==", projectDetails.uid)
      .get();

    let componentList = [];

    components.forEach(async (componentDoc) => {
      /*await fireStore
      .collection('Component')
      .doc(componentDoc.data().DocumentId)
      .update({
        IsAllowedToEdit: componentDoc.data().Source === 'AddComponent' ? true : false
      });*/
      if (componentDoc) {
        if (componentDoc.data().isActive) {
          console.log(componentDoc.data());
          let updatedAt = moment(componentDoc.data().updatedAt.seconds * 1000)
            .utc()
            .format("YYYY-MM-DD");
          let lastModified = `${
            componentDoc.data().LastModifiedBy
          }/${updatedAt}`;
          let Status = {
            status: componentDoc.data().Status,
            docId: componentDoc.data().DocumentId,
            Source: componentDoc.data().Source,
            SourceId: componentDoc.data().SourceId,
            IsAllowedToEdit: componentDoc.data().IsAllowedToEdit,
            recentVersion: {
              id: componentDoc.data().VersionId,
              status: componentDoc.data().versionStatus,
            },
          };
          componentList.push({
            ...componentDoc.data(),
            lastModified,
            status: Status,
            showVersions: {
              docId: Status.docId,
              IsAllowedToEdit: Status.IsAllowedToEdit,
              recentVersion: `${componentDoc.data().version} / ${
                componentDoc.data().versionStatus
              }`,
            },
          });
        }
      }
    });
    dispatch({ type: GET_COMPONENT, data: componentList });
  };
}
export function getComponentStatusHistory(documentId) {
  return async (dispatch, getState) => {
    const collectionRef = await fireStore
      .collection("Component")
      .doc(documentId)
      .collection("StatusHistory")
      .get();

    let statusHistory = [];
    collectionRef.forEach((doc) => {
      statusHistory.push({
        ...doc.data(),
      });
    });
    dispatch({ type: GET_STATUS_HISTORY, data: statusHistory });
  };
}
export function updateComponentStatus(data) {
  return async (dispatch, getState) => {
    try {
      const { versionId, docId, status, remarks, versionStatus } = data;
      await fireStore
        .collection("Component")
        .doc(docId)
        .update({
          Status: status,
          Remark: remarks,
          LastModifiedBy: auth.currentUser.email,
          updatedAt: new Date(),
        });
      await fireStore
        .collection("Component")
        .doc(docId)
        .collection("ComponentModelVersion")
        .doc(versionId)
        .update({
          componentStatus: status,
          updatedAt: new Date(),
        });
      const statusHistoryCollection = fireStore
        .collection("Component")
        .doc(docId)
        .collection("StatusHistory");
      let history = {
        componentModelVersionRef: versionId,
        componentStatus: status,
        versionStatus: versionStatus,
        recentVersion: "Updated",
        remarks: remarks,
        modifiedBy: auth.currentUser.email,
        modifiedAt: new Date(),
      };
      await statusHistoryCollection.add(history);
      NotificationManager.success("Status And Remark Updated successfully");
    } catch (error) {
      NotificationManager.error(error);
    }
  };
}

export function startActionWaiting() {
  return async (dispatch, getState) => {
    dispatch({ type: SET_ACTION_WAIT, data: true });
  };
}

export function isComponentDetailReLoaded(data) {
  return async (dispatch, getState) => {
    dispatch({ type: UPDATE_COMPONENT_VERSION_STATUS, data: data });
  };
}

export function updateVersionStatus(data) {
  return async (dispatch, getState) => {
    try {
      const {
        componentid,
        versionid,
        remark,
        versionstatus,
        lastmodifiedby,
      } = data;

      await fireStore
        .collection("Component")
        .doc(componentid)
        .collection("ComponentModelVersion")
        .doc(versionid)
        .update({
          versionStatus: versionstatus,
          recentAction: "Updated",
          versionRemark: remark,
          lastmodifiedby: lastmodifiedby,
          updatedAt: new Date(),
        });

      dispatch({ type: SET_ACTION_WAIT, data: false });
      await updateVersionStatusfunction(data);
      dispatch({ type: UPDATE_COMPONENT_VERSION_STATUS, data: true });
      NotificationManager.info(
        "Version Status And Remark Updated successfully"
      );
      await updateStatusAtComponent({ componentid: componentid });

      NotificationManager.success("Your request has successfully done");
    } catch (error) {
      NotificationManager.error(error);
    }
  };
}

export function updateVersionStatus2(data) {
  return async (dispatch, getState) => {
    try {
      const {
        componentid,
        versionid,
        remark,
        versionstatus,
        lastmodifiedby,
      } = data;

      console.log("updateVersionStatus", data);

      dispatch({ type: UPDATE_COMPONENT_VERSION_STATUS, data: true });
      await updateVersionStatusfunction(data);
      await updateStatusAtComponent({ componentid: componentid });

      dispatch({ type: UPDATE_COMPONENT_VERSION_STATUS, data: false });

      NotificationManager.success(
        "Version Status And Remark Updated successfully"
      );
    } catch (error) {
      NotificationManager.error(error);
    }
  };
}
export function updateVersionStatus_old(data) {
  return async (dispatch, getState) => {
    try {
      const {
        versionId,
        docId,
        status,
        remarks,
        version,
        componentStatus,
      } = data;

      console.log("updateVersionStatus", data);
      if (status === "Default" || status === "Accepted") {
        const componentModelVersionSnapshot = await fireStore
          .collection("Component")
          .doc(docId)
          .collection("ComponentModelVersion")
          .where("IsDeleted", "==", false)
          .get();

        componentModelVersionSnapshot.forEach((collectionQueryDocSnapshot) => {
          const componentModelVersionDoc = collectionQueryDocSnapshot.data();
          if (
            (componentModelVersionDoc.versionStatus == "Default" &&
              status === "Default") ||
            (componentModelVersionDoc.versionStatus == "New Updates" &&
              status === "New Updates")
          ) {
            fireStore
              .collection("Component")
              .doc(docId)
              .collection("ComponentModelVersion")
              .doc(componentModelVersionDoc.DocumentId)
              .update({
                versionStatus: "Accepted",
                recentAction: "Updated",
              });
          }
        });
      }
      await fireStore
        .collection("Component")
        .doc(docId)
        .collection("ComponentModelVersion")
        .doc(versionId)
        .update({
          versionStatus: status,
          recentAction: "Updated",
          versionRemark: remarks,
          updatedAt: new Date(),
        });

      const statusHistoryCollection = fireStore
        .collection("Component")
        .doc(docId)
        .collection("StatusHistory");
      let history = {
        componentModelVersionRef: versionId,
        componentStatus: componentStatus,
        versionStatus: status,
        remarks: remarks,
        recentVersion: "Updated",
        modifiedBy: auth.currentUser.email,
        modifiedAt: new Date(),
      };
      await statusHistoryCollection.add(history);

      await fireStore
        .collection("Component")
        .doc(docId)
        .update({
          VersionId: versionId,
          versionStatus: "Default",
          version: version,
          recentVersionAction: "Updated",
        });

      NotificationManager.success(
        "Version Status And Remark Updated successfully"
      );
    } catch (error) {
      NotificationManager.error(error);
    }
  };
}

async function getreferencedat(
  data,
  condition,
  datapointer,
  expectedValue,
  element
) {
  console.log("getreferencedat", data, condition);
  const plugin = {
    condition: {
      $ref: condition,
    },
    expectedValue: expectedValue,
    metadata: element,
    datapointer: {
      $ref: datapointer,
    },
    data: data,
    isexist: true,
  };

  try {
    let schema = await $RefParser.dereference(plugin);
    return schema;
  } catch (err) {
    //  console.error(err);
    return { isexist: false };
  }
}

export function getCADUrl(cadplugin_data) {
  return async (dispatch, getState) => {
    try {

      const { cadmodle, json_data } = cadplugin_data;

      const promises = [];
      cadmodle.items.forEach((element) => {
        const datapointer = element.datapointer;
        const condition = element.rule.condition.scope;
        const expectedValue = element.rule.condition.expectedValue;
        console.log("condition--->", condition);

        const value = getreferencedat(
          json_data,
          condition,
          datapointer,
          expectedValue,
          element
        );
        promises.push(value);
      });

      Promise.all(promises).then((arrOfResults) => {
        console.log("Array result", arrOfResults);

        arrOfResults.forEach((element) => {
          if (element.isexist) {
            if (element.condition == element.expectedValue) {
              if (element.metadata.type === "fileuploader") {
                const url = "";
                dispatch({ type: SET_CAD_URL, data: url });
              } else if (element.metadata.type === "select") {
                const filename = element.datapointer
                var ext =filename.substr(filename.lastIndexOf('.') + 1);
                const url = `https://react-project-1555f.el.r.appspot.com/getCadMode/?path=${element.metadata.basepath}/&filename=${element.datapointer}`
                const modelInfo = {url:url ,
                  extension:'.'+ext}
                
                console.log("type: SET_CAD_URL",modelInfo)
                dispatch({ type: SET_CAD_URL, data: modelInfo });
              }
            }
          }
        });
      });
    } catch (error) {
      console.error(error)
    }
  };
}

export function updateComponenetDetailStatus(data) {
  return async (dispatch, getState) => {
    try {
      const { componentId, status, remarks } = data;

      console.log("data", data, { componentId, status, remarks });
      await fireStore
        .collection("Component")
        .doc(componentId)
        .update({
          status: status,
          remark: remarks,
          lastModifiedBy: auth.currentUser.email,
          updatedAt: new Date(),
        });

      dispatch({ type: SET_ACTION_WAIT, data: false });
      dispatch({ type: UPDATE_COMPONENT_VERSION_STATUS, data: true });
      NotificationManager.success(
        "Component Status And Remark Updated successfully"
      );
    } catch (error) {
      NotificationManager.error(error);
    }
  };
}
export function updateStatus2(data) {
  return async (dispatch, getState) => {
    try {
      const { docId, status, remarks } = data;
      await fireStore
        .collection("Component")
        .doc(docId)
        .update({
          Status: status,
          Remark: remarks,
          LastModifiedBy: auth.currentUser.email,
          updatedAt: new Date(),
        });
      const statusHistoryCollection = fireStore
        .collection("Component")
        .doc(docId)
        .collection("StatusHistory");
      let history = {
        componentStatus: status,
        remarks: remarks,
        recentVersion: "Updated",
        modifiedBy: auth.currentUser.email,
        modifiedAt: new Date(),
      };
      await statusHistoryCollection.add(history);
      NotificationManager.success(
        "Component Status And Remark Updated successfully"
      );
    } catch (error) {
      NotificationManager.error(error);
    }
  };
}
export function getComponentByDocId(docId) {
  return async (dispatch, getState) => {
    try {
      const collectionRef = await fireStore
        .collection("Component")
        .doc(docId)
        .get();
      let collection = {};
      const collectionUpdatedVersionRef = await fireStore
        .collection("Component")
        .doc(docId)
        .collection("ComponentModelVersion")
        .doc(collectionRef.data().VersionId)
        .get();
      collection = collectionUpdatedVersionRef.data();
      dispatch({ type: GET_COMPONENT_BY_DOC_ID, data: collection });
    } catch (error) {}
  };
}

export function getComponentByDocVersionId(docId, versionId) {
  return async (dispatch, getState) => {
    try {
      const collectionRef = await fireStore
        .collection("Component")
        .doc(docId)
        .collection("ComponentModelVersion")
        .doc(versionId)
        .get();

      const collectionRefGetStatus = await fireStore
        .collection("Component")
        .doc(docId)
        .get();

      const size = await fireStore
        .collection("Component")
        .doc(docId)
        .collection("ComponentToModelRelationship")
        .limit(1)
        .get()
        .then((query) => query.size);

      const componentdetails = collectionRefGetStatus.data();
      console.log("collectionRefGetStatus ==>", componentdetails);

      let collection = {};
      collection = {
        ...collectionRef.data(),
        size,
        componentdetails: {
          status: componentdetails.status,
          source: componentdetails.Source,
        },
      };
      console.log(
        "{ type: GET_COMPONENT_BY_DOC_VERSION_ID, data: collection }",
        { type: GET_COMPONENT_BY_DOC_VERSION_ID, data: collection }
      );
      dispatch({ type: GET_COMPONENT_BY_DOC_VERSION_ID, data: collection });
    } catch (error) {}
  };
}

export function getComponentModelVersionHistory(docId, versionId) {
  return async (dispatch, getState) => {
    try {
      let collectionQuerySnapshot;
      collectionQuerySnapshot = await fireStore
        .collection("Component")
        .doc(docId)
        .collection("StatusHistory")
        .get();
      let collection = [];
      collectionQuerySnapshot.forEach((collectionQueryDocSnapshot) => {
        const componentModelVersionDoc = collectionQueryDocSnapshot.data();
        collection.push({
          ...componentModelVersionDoc,
          modifiedAt: `${moment(
            componentModelVersionDoc.modifiedAt.seconds * 1000
          )
            .utc()
            .format("DD/MM/YYYY HH:mm:ss")}`,
        });
      });
      dispatch({ type: GET_COMPONENT_MODEL_VERSION_HISTORY, data: collection });
    } catch (error) {}
  };
}

export function getComponentModelVersionByDocId(docId, history = false) {
  return async (dispatch, getState) => {
    try {
      let collectionQuerySnapshot;
      if (history) {
        collectionQuerySnapshot = await fireStore
          .collection("Component")
          .doc(docId)
          .collection("ComponentModelVersion")
          .where("IsDeleted", "==", false)
          .get();
      } else {
        collectionQuerySnapshot = await fireStore
          .collection("Component")
          .doc(docId)
          .collection("ComponentModelVersion")
          .where("IsDeleted", "==", false)
          .where("versionStatus", "in", ["New Updates", "Accepted", "Default"])
          .get();
      }
      let collection = [];
      collectionQuerySnapshot.forEach((collectionQueryDocSnapshot) => {
        const componentModelVersionDoc = collectionQueryDocSnapshot.data();
        collection.push({
          ...componentModelVersionDoc,
          createdAt: `${moment(
            componentModelVersionDoc.createdAt.seconds * 1000
          )
            .utc()
            .format("DD/MM/YYYY HH:mm:ss")}`,
        });
      });
      dispatch({
        type: GET_COMPONENT_MODEL_VERSION_BY_DOC_ID,
        data: collection,
      });
    } catch (error) {}
  };
}
export function getUserCompanyName(email) {
  return async (dispatch, getState) => {
    try {
      let user = await fireStore
        .collection("users")
        .where("Email", "==", email)
        .get();

      let companyName = "";
      user.forEach((userDoc) => {
        console.log("userDoc", userDoc.data());
        companyName = userDoc.data().CompanyName;
      });
      console.log("companyName", companyName);
      dispatch({ type: GET_COMPANY_NAME, data: companyName });
    } catch (error) {}
  };
}
export const syncModalWithComponent = (docId, modelId) => {
  return async (dispatch, getState) => {
    try {
      const componentRef = await fireStore
        .collection("Component")
        .doc(docId)
        .get();

      const component = componentRef.data();
      let resultData = component.datas.data;
      let fileUrl = "";

      if (resultData && Object.keys(resultData).length > 0) {
        Object.values(resultData).map((element) => {
          if (element && Object.keys(element).length > 0) {
            Object.keys(element).map((key) => {
              if (key.indexOf("fileuploader") > 0) {
                if (element[key] && Object.values(element[key].length > 0)) {
                  Object.values(element[key]).map((file, index) => {
                    fileUrl = file.Url;
                    let fileName = fileUrl.split("/")[3]
                      ? fileUrl.split("/")[3]
                      : "";
                    file.Url = `${auth.currentUser.uid}/Models/${modelId}/${fileName}`;
                  });
                }
              }
            });
          }
        });
      }
      if (fileUrl) {
        let folderName = fileUrl.split("/");
        folderName.splice(3, 1);
        let srcFoldername = folderName.join("/");

        const copyFiles = firebase
          .app()
          .functions("asia-east2")
          .httpsCallable("copyFiles");

        await copyFiles({
          srcBucketName: MAIN_BUCKETS,
          srcFolderName: srcFoldername + "/",
          destBucketName: MAIN_BUCKETS,
          destFolderName: `${auth.currentUser.uid}/Models/${modelId}/`,
        });
      }

      let datas = {
        data: resultData,
        schema: component.datas.schema,
        uischema: component.datas.uischema,
        uischemaread: component.datas.uischemaread,
        simulationDetail: component.datas.simulationDetail,
      };
      setTimeout(async () => {
        await fireStore
          .collection(MODELS)
          .doc(modelId)
          .update({
            datas: { ...datas },
            isUpdate: false,
            version: component.version,
          });
        NotificationManager.success("Model Updated successfully!");
      }, 5000);
    } catch (error) {
      console.log("error", error);
      NotificationManager.error(error);
    }
  };
};
