import { fireStore, auth, storage } from 'Firebase';
import {
  addDocumentAtCollectionRef,
  setDocumentAtRef,
  updateDocumentAtRef
} from 'Firebase/firestore';
import { NotificationManager } from 'react-notifications';
import { MAIN_BUCKETS, DUPLICATED, MODELS, MODEL_SOURCE } from 'Util/constants';
import * as firebase from 'firebase';
import { get } from 'lodash';
import { uploadFileAndGetFullPath } from 'Actions/FileActions';
export const MODEL_COLLECTION_REF = fireStore.collection(MODELS);


class Models {
  static MARKET_PLACE = 'MarketPlace';
  static USER_DEFINED = 'UserDefined';

  static async MarketPlaceModelList() {
  
    try {
      const modelsQuerySnapshot = await MODEL_COLLECTION_REF
        .where('IsDeleted', '==', false)
        .get();
      let marketPlaceModels = [];

      modelsQuerySnapshot.forEach(modelQueryDocSnapshot => {
        const marketPlaceModel = modelQueryDocSnapshot.data();
        if((marketPlaceModel.UserDocumentID===auth.currentUser.uid &&
        marketPlaceModel.Source!=='OwnModel') || 
          (marketPlaceModel.UserDocumentID!==auth.currentUser.uid &&
          marketPlaceModel.Source==='OwnModel')){
            console.log("marketPlaceModel",marketPlaceModel)
            marketPlaceModels.push({
              modelDocRef: modelQueryDocSnapshot.ref,
              Model: { ...marketPlaceModel },
              ModelId: modelQueryDocSnapshot.id
            });
          }
      });
      return marketPlaceModels;
    } catch (err) {
      console.log('ModelList error: ', err);
    }
  }

  /**
   * get list of own Model in collections /Models
   * @returns {Promise<[]>}
   */
  static async getOwnModels() {
    try {
      const modelsQuerySnapshot = await MODEL_COLLECTION_REF.where(
        'UserDocumentID',
        '==',
        auth.currentUser.uid
      )
        .where('Source', '==', MODEL_SOURCE.OWN_MODEL)
        .where('IsDeleted', '==', false)
        .get();
      let ownModels = [];

      modelsQuerySnapshot.forEach(modelQueryDocSnapshot => {
        const marketPlaceModel = modelQueryDocSnapshot.data();
        ownModels.push({
          ownModelDocRef: modelQueryDocSnapshot.ref,
          ownModelDocId: modelQueryDocSnapshot.id,
          Model: { ...marketPlaceModel }
        });
      });
      return ownModels;
    } catch (err) {
      console.log('getOwnModels error: ', err);
    }
  }
  static async getOwnModelById(ownModelId) {
    console.log('getOwnModelById:', ownModelId);
    try {
      const ownModelDocSnap = await MODEL_COLLECTION_REF.doc(ownModelId).get();
      return ownModelDocSnap.data();
    } catch (err) {
      console.log('getOwnModelById error: ', err);
    }
  }
  static getModelRefById(modelID) {
    console.log('getModelRefById:', modelID);
    try {
      return MODEL_COLLECTION_REF.doc(modelID);
    } catch (err) {
      console.log('getModelRefById error: ', err);
    }
  }

  static async getOwnModelByRef(ownModelRef) {
    try {
      const ownModelDocSnap = await ownModelRef.get();
      return ownModelDocSnap.data();
    } catch (err) {
      console.log('getOwnModelById error: ', err);
    }
  }
  static async getModalByModalIdAndDocumentId(ownModelId, userEmail) {
    try {
      let modelCollection = {};
      let modelRef = await MODEL_COLLECTION_REF.where(
        'IsDeleted',
        '==',
        false
      ).get();

      modelRef.forEach(doc => {
        console.log('modelRef>>', doc.id);

        if (
          doc.data() &&
          doc.id === ownModelId &&
          doc.data().UserEmail === userEmail
        )
          modelCollection = { ...doc.data() };
      });

      return modelCollection;
    } catch (err) {
      console.log('getModelRefById error: ', err);
    }
  }

  /**
   *  add new Model at /Station/stationId/Marketplace/sourceId
   * @param userData
   * @param modelData
   * @param sourceId
   * @returns {Promise<void>}
   * @constructor
   */
  static async AddModelFromMarketPlace(
    userData,
    modelData,
    sourceId,
    sourceName
  ) {
    try {
      /**
       * 1.find previous station or create a new Station at /Station/ collections
       * 2.add a new Model at /Station/stationId/Marketplace/sourceId
       * @type {boolean}
       */

      const queryDocumentSnapshot = await MODEL_COLLECTION_REF.where(
        'UserDocumentID',
        '==',
        auth.currentUser.uid
      )
        .where('SourceId', '==', sourceId)
        .where('IsDeleted', '==', false)
        .get();

      if (queryDocumentSnapshot.empty) {
        // call from the same region to avoid CORS:
        // https://firebase.google.com/docs/functions/locations#http_and_client-callable_functions
        const copyFiles = firebase
          .app()
          .functions('asia-east2')
          .httpsCallable('copyFiles');
        const originalFolderName = modelData.ResourceURL;
        const originalFolderNameArr = originalFolderName.split('/');

        /**
         *
         * 1.clean empty character after split if / exist in first and last
         * 2.clean file name at the end of array
         */
        let cleanFolderNameArr = originalFolderNameArr.filter(
          word => word.length > 0
        );

        cleanFolderNameArr.splice(-1, 1);
        const subFolderName = cleanFolderNameArr[1]; // e.g YiZaYNYnMqwfeujemluG
        const srcFolderName = cleanFolderNameArr.join('/');
        /**
         * srcFolderName and destFolderName  e.g: MarketPlace_CAD/YiZaYNYnMqwfeujemluG/
         * slash at the end
         */
        await copyFiles({
          srcBucketName: MAIN_BUCKETS,
          srcFolderName: `${srcFolderName}/`,
          destBucketName: MAIN_BUCKETS,
          destFolderName: `${userData.uid}/Models/${subFolderName}/`
        });

        /**
         * change base path to uid/Model/modelId
         * in which: is marketplace Model id
         */
        const uid = auth.currentUser.uid;

        if (modelData.ImageURL && modelData.ImageURL.length > 0) {
          const arr = modelData.ImageURL.split('/');
          arr.splice(0, 1, uid, 'Models');
          modelData.ImageURL = arr.join('/');
        }
        if (modelData.ResourceURL && modelData.ResourceURL.length > 0) {
          const arr = modelData.ResourceURL.split('/');
          arr.splice(0, 1, uid, 'Models');
          modelData.ResourceURL = arr.join('/');
        }

        if (modelData.TDS) {
          (modelData.TDS ? Object.keys(modelData.TDS) : []).forEach(key => {
            const arr = modelData.TDS[key].split('/');
            arr.splice(0, 1, uid, 'Models');
            modelData.TDS[key] = arr.join('/');
          });
        }
        const station = {
          UserDocumentID: userData.uid,
          UserEmail: userData.email,
          Source: sourceName,
          SourceId: sourceId,
          IsDeleted: false,
          SatelliteList: [],
          SatelliteIDNameMap: [],
          ComponentList: [],
          IsAllowedToShare: true,
          ModelDetail: {
            ...modelData
          }
        };
        await addDocumentAtCollectionRef(MODEL_COLLECTION_REF, station);

        NotificationManager.success('Add to Station Successfully!');
      } else {
        NotificationManager.error('MarketPlace Model has already existed!');
        return Promise.reject({
          message: DUPLICATED
        });
      }
    } catch (err) {
      console.log('AddModel error:', err.message);
    }
  }

  static async AddOwnModel(data) {
    const { type } = data;
    let tdsFiles = data.ModelDetails.TDS;
    let codes = data.datas.plugin.source.codelist;
    let cadFiles = data.datas.plugin.source.cad;

    const userId = auth.currentUser.uid;
    const ownModelDocRef = MODEL_COLLECTION_REF.doc();
    const ownModelId = ownModelDocRef.id;
    const basePath = `${userId}/Models/${ownModelId}`;
    try {
      /**
       *
       * 2.1 Store files to Storage
       // find folder path: userid/Models/ownModelId/filepath
       * modelId: https://stackoverflow.com/questions/46844907/firestore-is-it-possible-to-get-the-id-before-it-was-added
       *
       */
      if (type !== 'Chassis') {
        const TDSFilesPromise = tdsFiles.map(file => {
          const path = `${basePath}/${file.name}`;
          return uploadFileAndGetFullPath({
            path,
            file
          });
        });
        const CodeZipFilesPromise = codes.map(file => {
          const path = `${basePath}/${file.name}`;

          return uploadFileAndGetFullPath({
            path,
            file
          });
        });
        let CadFilesFullPath = [];
        if (cadFiles && cadFiles.length > 0) {
          let CadFilesPromise = cadFiles.map(file => {
            const path = `${basePath}/${file.name}`;
            return uploadFileAndGetFullPath({
              path,
              file
            });
          });
          CadFilesFullPath = await Promise.all(CadFilesPromise);
        }
        const TDSFilesFullPath = await Promise.all(TDSFilesPromise);
        const CodeZipFilesFullPath = await Promise.all(CodeZipFilesPromise);

        data.ModelDetails.TDS = [...TDSFilesFullPath];
        data.datas.plugin.source.codelist = [...CodeZipFilesFullPath];
        data.datas.plugin.source.cad = CadFilesFullPath;
      }
      else {
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
      }
      let schemaData = {
        plugin: data.datas.plugin,
        schema: data.datas.schema,
        uischema: data.datas.uischema,
        data: data.datas.data, 
        uischemaread:data.datas.uischemaread
      };
      let details = {
        name: data.name,
        type: data.type,
        subtype: data.subtype,
        description: data.description,
        inputArray: data.inputArray,
        outputArray: data.outputArray
      };

      delete data.datas;
      delete data.name;
      delete data.type;
      delete data.subtype;
      delete data.description;
      delete data.inputArray;
      delete data.outputArray;

      console.log('data>>', data);

      // 2.2 Add Model to  Firestore
      const ownModel = {
        UserDocumentID: auth.currentUser.uid,
        UserEmail: auth.currentUser.email,
        Source: MODEL_SOURCE.OWN_MODEL,
        SourceId: null,
        IsDeleted: false,
        SatelliteList: [],
        SatelliteIDNameMap: [],
        ComponentList: [],
        IsAllowedToShare: true,
        datas: { ...schemaData },
        ...details,
        ModelDetail: {
          ...data
        }
      };
      await setDocumentAtRef(ownModelDocRef, ownModel);
      NotificationManager.success('Add to Own Model Successfully!');
    } catch (err) {
      console.log('AddModel error:', err.message);
    }
  }

  static async validateTypeSubType(userId, Type, SubType) {
    // console.log("validateTypeSubType",SubType)
    const queryDocumentSnapshot = await MODEL_COLLECTION_REF.where(
      'UserDocumentID',
      '==',
      userId
    )
      .where('Source', '==', MODEL_SOURCE.OWN_MODEL)
      .where('IsDeleted', '==', false)
      .where('ModelDetail.Type', '==', Type)
      .where('ModelDetail.SubType', '==', SubType.trim())
      .get();

    if (!queryDocumentSnapshot.empty) {
      throw new Error('Own Model has already existed!');
    }
  }
  static async validateTypeSubTypeWithModelId(userId, Type, SubType, modelId) {
    // console.log("validateTypeSubTypeWithModelId",SubType)
    const queryDocumentSnapshot = await MODEL_COLLECTION_REF.where(
      'UserDocumentID',
      '==',
      userId
    )
      .where('Source', '==', MODEL_SOURCE.OWN_MODEL)
      .where('IsDeleted', '==', false)
      .where('ModelDetail.Type', '==', Type)
      .where('ModelDetail.SubType', '==', SubType.trim())
      .get();
    if (!queryDocumentSnapshot.empty) {
      /**
       * it editing itself, then go through
       *

       */
      let isItSelf = false;
      queryDocumentSnapshot.forEach(docSnapshot => {
        if (docSnapshot.id === modelId) {
          isItSelf = true;
        }
      });
      // if it's not itself and duplicated with other doc
      if (!isItSelf) {
        throw new Error('Own Model has already existed!');
      }
    }
  }

  static async editOwnModel(
    data,
    docId,
    newTDSFiles,
    newCodeZipFiles,
    oldTDSFiles,
    oldCodeZipFiles,
    deletedOldTDSFiles,
    deletedOldCodeZipFiles
  ) {
    const userId = auth.currentUser.uid;
    const { name, description, type, subtype } = data;

    const docRef = MODEL_COLLECTION_REF.doc(docId);
    const basePath = `${userId}/Models/${docId}`;

    // Edit Own Model
    try {
      /**
       *
       * 2.1 Store new files to Storage
       // find folder path: userid/Models/ownModelId/filepath
       * modelId: https://stackoverflow.com/questions/46844907/firestore-is-it-possible-to-get-the-id-before-it-was-added
       *
       */
      if (type !== 'Chassis') {
        // TDSFiles
        let TDSFilesPromise = [];
        let newTDSFilesFullPath = [];
        if (newTDSFiles.length > 0) {
          TDSFilesPromise = newTDSFiles.map(file => {
            const path = `${basePath}/${file.name}`;
            return uploadFileAndGetFullPath({
              path,
              file
            });
          });
          newTDSFilesFullPath = await Promise.all(TDSFilesPromise);
        }

        let CodeZipFilesPromise = [];
        let newCodeZipFilesFullPath = [];
        if (newCodeZipFiles.length > 0) {
          CodeZipFilesPromise = newCodeZipFiles.map(file => {
            const path = `${basePath}/${file.name}`;
            return uploadFileAndGetFullPath({
              path,
              file
            });
          });
          newCodeZipFilesFullPath = await Promise.all(CodeZipFilesPromise);
        }

        if (deletedOldCodeZipFiles.length > 0) {
          deletedOldCodeZipFiles.map(file => {
            return storage.ref(file.fullPath).delete();
          });
        }
        if (oldCodeZipFiles.length > 0) {
          deletedOldTDSFiles.map(file => {
            return storage.ref(file.fullPath).delete();
          });
        }
        /**
         * 2.3 save old file and news file path to Firestore
         */
        const TDSFilesFullPath = oldTDSFiles
          .map(el => el.fullPath)
          .concat(newTDSFilesFullPath);
        const CodeZipFilesFullPath = oldCodeZipFiles
          .map(el => el.fullPath)
          .concat(newCodeZipFilesFullPath);

        data.ModelDetails.TDS = [...TDSFilesFullPath];
        data.datas.plugin.source.codelist = [...CodeZipFilesFullPath];
      } else {
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
      }


      let schemaData = {
        plugin: data.datas.plugin,
        schema: data.datas.schema,
        uischema: data.datas.uischema,
        data: data.datas.data,
        uischemaread:data.datas.uischemaread
      };
      let details = {
        name: data.name,
        type: data.type,
        subtype: data.subtype,
        description: data.description,
        inputArray: data.inputArray,
        outputArray: data.outputArray
      };

      delete data.datas;
      delete data.name;
      delete data.type;
      delete data.subtype;
      delete data.description;
      delete data.inputArray;
      delete data.outputArray;
      // 2.2 Add Model to  Firestore
      const ownModel = {
        datas: { ...schemaData },
        ...details,
        ModelDetail: {
          ...data
        }
      };
      console.log('test7');

      await updateDocumentAtRef(docRef, ownModel);
      NotificationManager.success('Edit to Own Model Successfully!');
    } catch (err) {
      console.log('AddModel error:', err.message);
    } 
  }
  static getFilePath = (url, basePath) => {
    let path = '';
    if (url) {
      const array = url.split('/');
      const fileName = array[3] ? array[3] : '';
      path = `${basePath}/${fileName}`;
    }
    return path;
  };
  static async AddModelForNonOwner(doc, modelId) {
    let tds = [];
    let codeFiles = [];
    let cad = [];

    console.log('doc>>', doc);

    const userId = auth.currentUser.uid;

    const ownModelDocRef = MODEL_COLLECTION_REF.doc();
    const ownModelId = ownModelDocRef.id;
    const basePath = `${userId}/Models/${ownModelId}`;

    const copyFiles = firebase
      .app()
      .functions('asia-east2')
      .httpsCallable('copyFiles');

    try {
      const modelDetail = get(doc, 'ModelDetail', {});
      if (modelDetail) {
        tds = get(modelDetail.ModelDetails, 'TDS', []);
      }

      if (doc && doc.datas && doc.datas.plugin && doc.datas.plugin.source) {
        codeFiles = get(doc.datas.plugin.source, 'codelist', []);
        cad = get(doc.datas.plugin.source, 'cad', []);
      }

      let files = [...tds, ...codeFiles, ...cad];

      if (files && files.length > 0) {
        files.map(async file => {
          let fileArray = file.split('/');
          if (fileArray && fileArray[3]) {
            fileArray.splice(3, 1);
          }
          await copyFiles({
            srcBucketName: MAIN_BUCKETS,
            srcFolderName: fileArray.join('/'),
            destBucketName: MAIN_BUCKETS,
            destFolderName: basePath
          });
        });
      }
      let tdsUrl = [];

      if (tds && tds.length > 0) {
        tds.map(el => {
          const path = this.getFilePath(el, basePath);
          tdsUrl.push(path);
        });
      }
      let codeUrl = [];

      if (codeFiles && codeFiles.length > 0) {
        codeFiles.map(el => {
          const path = this.getFilePath(el, basePath);
          codeUrl.push(path);
        });
      }
      console.log('codeUrl', codeUrl);

      let cadUrl = [];

      if (cad && cad.length > 0) {
        cad.map(el => {
          const path = this.getFilePath(el, basePath);
          cadUrl.push(path);
        });
      }
      let data = { ...doc };
      data.ModelDetail.ModelDetails.TDS = tdsUrl;
      data.datas.plugin.source.codelist = codeUrl;
      data.datas.plugin.source.cad = cadUrl;
      data.UserEmail = auth.currentUser.email;
      data.Source = 'AddComponent';
      data.SourceId = modelId;
      data.UserDocumentID = auth.currentUser.uid;

      console.log('data>>', data);
      await setDocumentAtRef(ownModelDocRef, data);
      NotificationManager.success('Add to Own Model Successfully!');
    } catch (error) {
      console.log('error>>', error);
    }
  }
  static isModelExist = async userDocId => {
    console.log('userDocId', userDocId);
    console.log('auth.currentUser.email', auth.currentUser.email);

    try {
      const modelsQuerySnapshot = await MODEL_COLLECTION_REF.where(
        'Source',
        '==',
        'AddComponent'
      )
        .where('SourceId', '==', userDocId)
        .where('UserEmail', '==', auth.currentUser.email)
        .where('IsDeleted', '==', false)
        .get();
      console.log('modelsQuerySnapshot', modelsQuerySnapshot);
      let result = [];

      modelsQuerySnapshot.forEach(modelDoc => {
        result.push({
          ...modelDoc.data()
        });
      });
      console.log("result>>",result)
      return result;
    } catch (error) {
      NotificationManager.error(error.message);
    }
  };
  static addToModelFromComponent = async (componentDetail, docId) => {
    const userId = auth.currentUser.uid;
    const ownModelDocRef = MODEL_COLLECTION_REF.doc();
    const ownModelId = ownModelDocRef.id;
    const basePath = `${userId}/Models/${ownModelId}`;

    try {
      const copyFiles = firebase
        .app()
        .functions('asia-east2')
        .httpsCallable('copyFiles');

      let filePromise = [];
      if (
        componentDetail.datas &&
        componentDetail.datas.data &&
        Object.values(componentDetail.datas.data).length > 0
      ) {
        let fileData = componentDetail.datas.data;
        Object.values(fileData).map(element => {
          if (element && Object.keys(element).length > 0) {
            Object.keys(element).map(key => {
              if (key.indexOf('fileuploader') > 0) {
                if (element[key] && Object.values(element[key].length > 0)) {
                  filePromise = Object.values(element[key]).map(async file => {
                    let fileurl = file.Url;

                    let fileArray = fileurl.split('/');
                    if (fileArray && fileArray[3]) {
                      fileArray.splice(3, 1);
                    }
                    await copyFiles({
                      srcBucketName: MAIN_BUCKETS,
                      srcFolderName: fileArray.join('/'),
                      destBucketName: MAIN_BUCKETS,
                      destFolderName: basePath
                    });
                  });
                }
              }
            });
          }
        });
      }
      let resultData = componentDetail.datas.data;

      const SatelliteIDNameMap = [];

      SatelliteIDNameMap[0] = {
        [componentDetail.SatelliteId]: {
          ProjectId: componentDetail.ProjectId,
          ProjectName: componentDetail.ProjectName,
          SatelliteName: componentDetail.SatelliteName
        }
      };

      const downloadCollection = await fireStore
        .collection('Component')
        .doc(docId)
        .collection('DownloadComponent');
        
      const componentToModelRelationship = await fireStore
        .collection('Component')
        .doc(docId)
        .collection('ComponentToModelRelationship');
      
      await downloadCollection.add({
        userId: auth.currentUser.uid,
        modelId: ownModelId
      });
      await componentToModelRelationship.add({
        modelId: ownModelId,
        UserEmailId: auth.currentUser.email,
      });
      
      const data = {
        componentList: [],
        isAllowedToShare: false,
        IsDeleted: false,
        ModelDetail: {
          Supplier: componentDetail.Supplier,
          TDS: []
        },
        SatelliteIDNameMap: SatelliteIDNameMap,
        SatelliteList: [componentDetail.SatelliteId],
        Source: 'AddComponent',
        SourceId:docId ,
        UserDocumentID: auth.currentUser.uid,
        UserEmail: auth.currentUser.email,
        isUpdate: false,
        datas: { ...componentDetail.datas },
        inputArray: componentDetail.inputArray
          ? componentDetail.inputArray
          : [],
        outputArray: componentDetail.outputArray
          ? componentDetail.outputArray
          : [],
        name: get(componentDetail.ModelDetail, 'name', ''),
        type: get(componentDetail.ModelDetail, 'type', ''),
        subtype: get(componentDetail.ModelDetail, 'subtype', ''),
        description: get(componentDetail.ModelDetail, 'description', ''),
        version: componentDetail.version ? componentDetail.version : '1.0.0'
      };
      await setDocumentAtRef(ownModelDocRef, data);
     
      NotificationManager.success('Add to Own Model Successfully!');
    } catch (error) {
      console.log('error>>', error);
      NotificationManager.error(error.message);
    }
  };

}

export default Models;
