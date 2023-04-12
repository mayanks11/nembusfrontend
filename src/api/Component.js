import { fireStore, auth } from '../firebase';
import { getTheDate, convertDateToTimeStamp } from '../helpers/helpers';
import { COMPONENT_COLLECTION } from 'Util/constants';
import { uploadFileAndGetFullPath } from 'Actions/FileActions';
import { NotificationManager } from 'react-notifications';
import {
  addDocumentAtCollectionRef,
  setDocumentAtRef,
  updateDocumentAtRef
} from '../firebase/firestore';

export const ComponentCollectionRef = fireStore.collection(
  COMPONENT_COLLECTION
);

class ComponentApi {
  static Collection = fireStore.collection('StackHolder');
  /**
   * return lists:
   * 1. list doc in COMPONENT_COLLECTION
   */
  static async getComponents(ModelId) {
    try {
      const ComponentQuerySnapshot = await ComponentCollectionRef.where(
        'IsDeleted',
        '==',
        false
      )
        .where('IsActive', '==', true)
        .where('SourceId', '==', ModelId) // sourceID of component is ModelID in /Models
        .get();
      let componentsWithId = new Array();
      ComponentQuerySnapshot.forEach(componentDoc => {
        componentsWithId.push({
          ComponentId: componentDoc.id,
          ...componentDoc.data()
        });
      });
      return componentsWithId;
    } catch (err) {
      console.log(err);
    }
  }

  static async isComponentExist(SatelliteId) {
    try {
      const ComponentQuerySnapshot = await ComponentCollectionRef.where(
        'IsDeleted',
        '==',
        false
      )
        .where('SatelliteId', '==', SatelliteId)
        .get();

      return ComponentQuerySnapshot.empty;
    } catch (err) {
      console.log(err);
    }
  }
  static async getCoponentBySatelliteId(SatelliteId) {
    try {
      const ComponentQuerySnapshot = await ComponentCollectionRef.where(
        'IsDeleted',
        '==',
        false
      )
        .where('SatelliteId', '==', SatelliteId)
        .get();

      return ComponentQuerySnapshot;
    } catch (err) {
      console.log(err);
    }
  }

  static async getCoponentBySatelliteIdAndModelId(SatelliteId, ModelId) {
    console.log('findComponent');
    try {
      const ComponentQuerySnapshot = await ComponentCollectionRef.where(
        'IsDeleted',
        '==',
        false
      )
        .where('SatelliteId', '==', SatelliteId)
        .where('SourceId', '==', ModelId)
        .get();

      return ComponentQuerySnapshot;
    } catch (err) {
      console.log(err);
    }
  }

  static async addComponent(data, type = null) {
    try {
      let projectDetails = data.projectDetails ? data.projectDetails : {};
      let satellites = data.satellites;
      let satelliteName = '';
      let satelliteId = data.satelliteId;
      if (satellites && satellites.length > 0) {
        satellites.map(satellite => {
          if (satellite.uid === satelliteId) {
            satelliteName = satellite.SatelliteName;
          }
        });
      } else {
        satelliteName = data.SatelliteName;
      }

      const userId = auth.currentUser.uid;
      const COMPONENT_COLLECTION_REF = fireStore.collection('Component');
      const ownModelDocRef = COMPONENT_COLLECTION_REF.doc();
      const ownModelId = ownModelDocRef.id;
      const basePath = `${userId}/Components/${ownModelId}`;

      let filePromise = [];
      if (
        data.datas &&
        data.datas.data &&
        Object.values(data.datas.data).length > 0
      ) {
        let fileData = data.datas.data;
        Object.values(fileData).map(element => {
          if (element && Object.keys(element).length > 0) {
            Object.keys(element).map(key => {
              if (key.indexOf('fileuploader') > 0) {
                if (element[key] && Object.values(element[key].length > 0)) {
                  filePromise = Object.values(element[key]).map(async file => {
                    const path = `${basePath}/${file.data.name}`;
                    let fileData = file.data;

                    return uploadFileAndGetFullPath({
                      path,
                      file: fileData
                    });
                  });
                }
              }
            });
          }
        });
      }

      let fileFullPath = await Promise.all(filePromise);

      let resultData = data.datas.data;

      if (resultData && Object.keys(resultData).length > 0) {
        Object.values(resultData).map(element => {
          if (element && Object.keys(element).length > 0) {
            Object.keys(element).map(key => {
              if (key.indexOf('fileuploader') > 0) {
                if (element[key] && Object.values(element[key].length > 0)) {
                  Object.values(element[key]).map((file, index) => {
                    delete file.data;
                    file.Url = fileFullPath[index];
                  });
                }
              }
            });
          }
        });
      }
      let modelId = '';
      if (data.hasOwnProperty('ModelId')) {
        modelId = data.ModelId;
      }
      console.log('projectDetails', projectDetails);

      delete data.satelliteId;
      delete data.projectDetails;
      delete data.satellites;
      delete data.ModelId;
      let component = {
        DocumentId: ownModelId,
        ProjectId:
          projectDetails && projectDetails.uid ? projectDetails.uid : '',
        ProjectName:
          projectDetails && projectDetails.ProjectName
            ? projectDetails.ProjectName
            : '',
        SatelliteName: satelliteName,
        SatelliteId: satelliteId,
        Source: type === 'own-model' ? 'Station' : 'AddComponent',
        SourceId: type === 'own-model' ? modelId : projectDetails.uid,
        Status: type === 'own-model' ? 'suggested' : 'approved',
        Remark:
          type === 'own-model'
            ? `added by ${auth.currentUser.email}`
            : 'Added By Admin',
        IsDeleted: false,
        IsAllowedToEdit: type === 'own-model' ? false : true,
        version: '0.0.0',
        versionStatus: 'Default', 
        createdBy: auth.currentUser.email,
        LastModifiedBy: auth.currentUser.email,
        isActive: true,
        name: data.ModelDetail.name,
        type: data.ModelDetail.type,
        subtype: data.ModelDetail.subtype,
        recentVersionAction: 'Created',
        ...data
      };
      delete component.ModelDetail;
      delete component.datas;
      delete component.inputArray;
      delete component.outputArray;
      console.log('finalData', component);
      await setDocumentAtRef(ownModelDocRef, component);
      // adding model versions
      const componentModelVersionRef = fireStore
        .collection('Component')
        .doc(ownModelId)
        .collection('ComponentModelVersion').doc();
      
      const versionTypes = data.version.split('.');
      let componentVersion = {
        DocumentId: componentModelVersionRef.id,
        version: {
          major:versionTypes[0],
          minor:versionTypes[1],
          patch:versionTypes[2],
        },
        description: data.ModelDetail.description,
        inputArray: data.inputArray,
        outputArray: data.outputArray,
        datas: data.datas,
        cad: '',
        ProjectId: projectDetails && projectDetails.uid ? projectDetails.uid : '',
        ProjectName: projectDetails && projectDetails.ProjectName ? projectDetails.ProjectName : '',
        TDS: [],
        versionStatus: 'Default',
        SatelliteName: satelliteName,
        Supplier: data.Supplier,
        SatelliteId: satelliteId,
        componentStatus: type === 'own-model' ? 'suggested' : 'approved',
        IsDeleted: false,
        ModelDetail: data.ModelDetail,
        recentAction: 'Created',
        createdAt: new Date()
      };
      await setDocumentAtRef(componentModelVersionRef, componentVersion);
      await updateDocumentAtRef(ownModelDocRef, {VersionId:componentModelVersionRef.id});

      const statusHistoryCollection = fireStore
        .collection('Component')
        .doc(ownModelId)
        .collection('StatusHistory');
      let history = {
        componentModelVersionRef: componentModelVersionRef.id,
        componentStatus: type === 'own-model' ? 'suggested' : 'approved',
        remarks:
          type === 'own-model'
            ? `added by ${auth.currentUser.email}`
            : 'By Admin',
        versionStatus: 'Default',
        recentAction: 'Created',
        modifiedBy: auth.currentUser.email,
        modifiedAt: new Date()
      };
      await statusHistoryCollection.add(history);
      NotificationManager.success('New component added successfully');
    } catch (error) {
      NotificationManager.error(error);
    }
  }
  static async updateComponent(data, docId, recentVersion) {
    try {
      let satellites = data.satellites;
      let satelliteName = '';
      let satelliteId = data.satelliteId;
      if (satellites && satellites.length > 0) {
        satellites.map(satellite => {
          if (satellite.uid === satelliteId) {
            satelliteName = satellite.SatelliteName;
          }
        });
      }
      let projectDetails = data.projectDetails ? data.projectDetails : {};

      const componentModelVersionByIdRef = await fireStore
        .collection('Component')
        .doc(docId)
        .collection('ComponentModelVersion').doc(recentVersion.id);
      // updating model version
      const componentModelVersionRef = fireStore
        .collection('Component')
        .doc(docId)
        .collection('ComponentModelVersion').doc();
      
      const versionTypes = data.version.split('.');
      if (recentVersion.status === 'New Updates') {
        await updateDocumentAtRef(componentModelVersionByIdRef, {
          versionStatus: 'Update-Replaced'
        });
      } else if(recentVersion.status === 'Accepted') {
        await updateDocumentAtRef(componentModelVersionByIdRef, {
          versionStatus: 'Accept-Replaced'
        });
      }
      let componentVersion = {
        DocumentId: componentModelVersionRef.id,
        version: {
          major:versionTypes[0],
          minor:versionTypes[1],
          patch:versionTypes[2],
        },
        description: data.ModelDetail.description,
        ModelDetail: data.ModelDetail,
        inputArray: data.inputArray,
        outputArray: data.outputArray,
        datas: data.datas,
        SatelliteId: satelliteId,
        ProjectId: projectDetails && projectDetails.uid ? projectDetails.uid : '',
        ProjectName: projectDetails && projectDetails.ProjectName ? projectDetails.ProjectName : '',
        Supplier: data.Supplier,
        cad: '',
        TDS: [],
        versionStatus: recentVersion.status !== 'Default'?recentVersion.status:'New Updates',
        componentStatus: data.status,
        IsDeleted: false,
        createdAt: new Date(),
        recentAction: 'Updated',
        SatelliteName: satelliteName
      };
      await setDocumentAtRef(componentModelVersionRef, componentVersion);

      const userId = auth.currentUser.uid;
      const COMPONENT_COLLECTION_REF = fireStore.collection('Component');
      const ownModelDocRef = COMPONENT_COLLECTION_REF.doc(docId);
      const basePath = `${userId}/Components/${docId}`;

      let filePromise = [];
      if (
        data.datas &&
        data.datas.data &&
        Object.values(data.datas.data).length > 0
      ) {
        let fileData = data.datas.data;
        Object.values(fileData).map(element => {
          if (element && Object.keys(element).length > 0) {
            Object.keys(element).map(key => {
              if (key.indexOf('fileuploader') > 0) {
                if (element[key] && Object.values(element[key].length > 0)) {
                  filePromise = Object.values(element[key]).map(async file => {
                    if (!file.Url) {
                      const path = `${basePath}/${file.data.name}`;
                      let fileData = file.data;
                      return uploadFileAndGetFullPath({
                        path,
                        file: fileData
                      });
                    } else {
                      return file.Url;
                    }
                  });
                }
              }
            });
          }
        });
      }

      let fileFullPath = await Promise.all(filePromise);
      let resultData = data.datas.data;

      if (resultData && Object.keys(resultData).length > 0) {
        Object.values(resultData).map(element => {
          if (element && Object.keys(element).length > 0) {
            Object.keys(element).map(key => {
              if (key.indexOf('fileuploader') > 0) {
                if (element[key] && Object.values(element[key].length > 0)) {
                  Object.values(element[key]).map((file, index) => {
                    if (!file.Url) {
                      delete file.data;
                      file.Url = fileFullPath[index];
                    }
                  });
                }
              }
            });
          }
        });
      }

      delete data.satelliteId;
      delete data.projectDetails;
      delete data.satellites;
      delete data.datas;
      delete data.inputArray;
      delete data.outputArray;
      let component = {
        DocumentId: docId,
        ProjectId:
          projectDetails && projectDetails.uid ? projectDetails.uid : '',
        ProjectName:
          projectDetails && projectDetails.ProjectName
            ? projectDetails.ProjectName
            : '',
        SatelliteName: satelliteName,
        SatelliteId: satelliteId,
        Source: 'AddComponent',
        SourceId: projectDetails.uid,
        Status: 'approved',
        Remark: `Edited By ${auth.currentUser.email}`,
        IsDeleted: false,
        createdBy: auth.currentUser.email,
        LastModifiedBy: auth.currentUser.email,
        version: data.version,
        versionStatus: recentVersion.status !== 'Default'?recentVersion.status:'New Updates',
        isActive: true,
        VersionId:componentModelVersionRef.id,
        name: data.ModelDetail.name,
        type: data.ModelDetail.type,
        subtype: data.ModelDetail.subtype,
        recentVersionAction: 'Created',
        ...data
      };
      delete component.ModelDetail;
      await updateDocumentAtRef(ownModelDocRef, component);
      
      // let modelRef=await fireStore.collection('Models').
      //       where('SourceId','==',docId)
      //       .get();

      // let modelId=''
      // let modelData={}

      // modelRef.forEach(model=>{
      //   console.log("model>>",model.data())
      //   modelId=model.id
      //   modelData=model.data()
      // })
      // modelData.version=data.version
      // modelData.isUpdate=true

      // if(modelId){
      //   await fireStore.collection('Models').doc(modelId).
      //   update({
      //     ...modelData
      //   })
      // }

      if (data.status === 'approved') {
        const statusHistoryCollection = fireStore
          .collection('Component')
          .doc(docId)
          .collection('StatusHistory');
        let history = {
          componentModelVersionRef:componentModelVersionRef.id,
          componentStatus: 'suggested',
          remarks: `Edited By ${auth.currentUser.email} `,
          modifiedBy: auth.currentUser.email,
          recentAction: 'Updated',
          versionStatus: recentVersion.status !== 'Default'?recentVersion.status:'New Updates',
          modifiedAt: new Date()
        };
        await statusHistoryCollection.add(history);
      }

      NotificationManager.success('Component updated successfully');
    } catch (error) {
      NotificationManager.error(error);
    }
  }
  static async getComponentsBySatelliteId(satelliteId, projectDetails) {
    let componentCount = 0;
    let components = await ComponentCollectionRef.where(
      'IsDeleted',
      '==',
      false
    )
      .where('ProjectId', '==', projectDetails.uid)
      .get();

    components.forEach(componentDoc => {
      if (
        componentDoc &&
        componentDoc.data() &&
        componentDoc.data().SatelliteId === satelliteId &&
        (componentDoc.data().Status === 'approved' ||
          componentDoc.data().Status === 'suggested')
      ) {
        componentCount++;
      }
    });
    return componentCount;
  }

  static async getComponentVersionDetails(componentId, versionId) {
    try {
      const ComponentQuerySnapshot = 
          await ComponentCollectionRef
              .doc(componentId)
              .collection('ComponentModelVersion')
              .doc(versionId)
              .get();

     
      return ComponentQuerySnapshot.data();
    } catch (err) {
      console.log(err);
    }
  }
}

export default ComponentApi;
